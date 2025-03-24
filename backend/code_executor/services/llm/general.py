import json
import asyncio
from typing import Any, AsyncGenerator, Dict

from .base import BaseModel

class GeneralModel(BaseModel):
    """General model for interacting with other models on AWS Bedrock."""
    
    def _build_request_body(self, 
                           prompt: str, 
                           temperature: float, 
                           max_tokens: int) -> Dict[str, Any]:
        """Build request body for general models."""
        return {
            "prompt": prompt,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
    
    async def generate_text(self, 
                          prompt: str, 
                          temperature: float = 0.7,
                          max_tokens: int = 1000) -> str:
        """Generate text from general models (non-streaming)."""
        request_body = self._build_request_body(prompt, temperature, max_tokens)
        
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: self.client.invoke_model(
                modelId=self.model_id,
                body=json.dumps(request_body)
            )
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['choices'][0]['text']
    
    async def generate_text_stream(self, 
                                 prompt: str, 
                                 temperature: float = 0.7,
                                 max_tokens: int = 1000) -> AsyncGenerator[str, None]:
        """Generate text from general models with streaming."""
        request_body = self._build_request_body(prompt, temperature, max_tokens)
        
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
                
                choices = chunk_data.get('choices', [])
                if choices:
                    yield choices[0].get('text', '')
                else:
                    yield ""
    
    async def generate_structured_output(self, 
                                       prompt: str, 
                                       output_schema: Dict[str, Any],
                                       temperature: float = 0.3,
                                       max_tokens: int = 1000) -> Dict[str, Any]:
        """Generate structured output according to a schema using general models."""
        schema_prompt = json.dumps(output_schema, indent=2)
        
        structured_prompt = f"""
        You are a helpful assistant that generates structured data.
        Please respond with JSON that follows this schema:
        
        {schema_prompt}
        
        Human request: {prompt}
        
        Your JSON response:
        """
        
        response = await self.generate_text(
            prompt=structured_prompt,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        return self._parse_json_response(response)