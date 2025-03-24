import boto3
from typing import Any, AsyncGenerator, Dict, Optional

from .llm.anthropic import AnthropicModel
from .llm.deepseek import DeepSeekModel
from .llm.general import GeneralModel


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
            model_id: AWS Bedrock model ID (default is Claude 3 Haiku)
        """
        session = boto3.Session(
            region_name=region_name,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key
        )
        self.client = session.client('bedrock-runtime')
        self.model_id = model_id
        
        # Initialize the appropriate model based on the model ID
        if "anthropic" in self.model_id:
            self.model = AnthropicModel(self.client, self.model_id)
        elif "deepseek" in self.model_id:
            self.model = DeepSeekModel(self.client, self.model_id)
        else:
            self.model = GeneralModel(self.client, self.model_id)
    
    async def generate_text(self, 
                          prompt: str, 
                          temperature: float = 0.7,
                          max_tokens: int = 1000) -> str:
        """Generate text from the model (non-streaming)."""
        return await self.model.generate_text(prompt, temperature, max_tokens)
    
    async def generate_text_stream(self, 
                                 prompt: str, 
                                 temperature: float = 0.7,
                                 max_tokens: int = 1000) -> AsyncGenerator[str, None]:
        """Generate text from the model with streaming."""
        
        async for token in self.model.generate_text_stream(prompt, temperature, max_tokens):
            yield token
        
        # else :
        #     async for token in self.model.generate_text_stream_reasoning(prompt, temperature, max_tokens):
        #         yield token
                
                    
    async def generate_structured_output(self, 
                                       prompt: str, 
                                       output_schema: Dict[str, Any],
                                       temperature: float = 0.3,
                                       max_tokens: int = 1000) -> Dict[str, Any]:
        """Generate structured output according to a schema."""
        return await self.model.generate_structured_output(prompt, output_schema, temperature, max_tokens)