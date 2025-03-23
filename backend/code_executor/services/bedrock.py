# services/bedrock.py
import boto3
import json
from typing import Dict, Any, List, AsyncGenerator, Optional
import asyncio

class BedrockService:
    """Service for interacting with AWS Bedrock."""
    
    def __init__(self, region_name: str, 
                 aws_access_key_id: Optional[str] = None,
                 aws_secret_access_key: Optional[str] = None,
                 model_id: str = "anthropic.claude-3-haiku-20240307-v1:0"):
        """
        Initialize the Bedrock service.
        
        Args:
            region_name: AWS region name
            aws_access_key_id: AWS access key ID
            aws_secret_access_key: AWS secret access key
            model_id: AWS Bedrock model ID (default is DeepSeek R1)
        """
        session = boto3.Session(
            region_name=region_name,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key
        )
        self.client = session.client('bedrock-runtime')
        self.model_id = model_id
    
    async def generate_text(self, 
                         prompt: str, 
                         temperature: float = 0.7,
                         max_tokens: int = 1000) -> str:
        """Generate text from the model (non-streaming)."""
        # Use different request format based on model
        if "anthropic" in self.model_id:
            request_body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
        else:  # Default format for other models like DeepSeek
            request_body = {
                "prompt": prompt,
                "max_tokens": max_tokens,
                "temperature": temperature,
            }
        
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: self.client.invoke_model(
                modelId=self.model_id,
                body=json.dumps(request_body)
            )
        )
        
        response_body = json.loads(response['body'].read())
        
        # Extract text based on model response format
        if "anthropic" in self.model_id:
            return response_body.get('content', [{}])[0].get('text', '')
        else:
            return response_body.get('generation', '')
    
    async def generate_text_stream(self, 
                                prompt: str, 
                                temperature: float = 0.7,
                                max_tokens: int = 1000) -> AsyncGenerator[str, None]:
        """Generate text from the model with streaming."""
        # Use different request format based on model
        if "anthropic" in self.model_id:
            request_body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
        else:  # Default format for other models like DeepSeek
            request_body = {
                "prompt": prompt,
                "max_tokens": max_tokens,
                "temperature": temperature,
            }
        
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: self.client.invoke_model_with_response_stream(
                modelId=self.model_id,
                body=json.dumps(request_body)
            )
        )
        
        stream = response.get('body', None)
        if not stream:
            yield ""
            return
        
        for event in stream:
            if 'chunk' in event:
                chunk_bytes = event['chunk']['bytes']
                chunk_data = json.loads(chunk_bytes)
                
                # Extract text based on model response format
                if "anthropic" in self.model_id:
                    content_block = chunk_data.get('content', [{}])[0]
                    if content_block.get('type') == 'text':
                        yield content_block.get('text', '')
                else:
                    yield chunk_data.get('generation', '')
    
    async def generate_structured_output(self, 
                                      prompt: str, 
                                      output_schema: Dict[str, Any],
                                      temperature: float = 0.3,
                                      max_tokens: int = 1000) -> Dict[str, Any]:
        """Generate structured output according to a schema."""
        
        # Convert schema to a prompt format the model can understand
        schema_prompt = json.dumps(output_schema, indent=2)
        
        structured_prompt = f"""
        You are a helpful assistant that generates structured data.
        Please respond with JSON that follows this schema:
        
        {schema_prompt}
        
        Human request: {prompt}
        
        Your JSON response:
        """
        
        # Use a lower temperature for structured outputs for consistency
        response = await self.generate_text(
            prompt=structured_prompt,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        try:
            # Extract JSON from response
            json_str = response.strip()
            
            # Handle markdown code blocks if present
            if json_str.startswith("```json"):
                json_str = json_str[7:]
                if json_str.endswith("```"):
                    json_str = json_str[:-3]
            elif json_str.startswith("```"):
                json_str = json_str[3:]
                if json_str.endswith("```"):
                    json_str = json_str[:-3]
                    
            json_str = json_str.strip()
            
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            # Fallback handling for malformed JSON
            return {
                "error": f"Failed to parse structured output from model: {str(e)}",
                "raw_response": response
            }
