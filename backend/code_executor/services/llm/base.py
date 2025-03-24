import abc
import json
import boto3
from typing import Any, AsyncGenerator, Dict

class BaseModel(abc.ABC):
    """Base class for all Bedrock models."""
    
    def __init__(self, client: 'boto3.Session.client', model_id: str):
        """
        Initialize the model.
        
        Args:
            client: AWS Bedrock client
            model_id: AWS Bedrock model ID
        """
        self.client = client
        self.model_id = model_id
    
    @abc.abstractmethod
    async def generate_text(self, 
                          prompt: str, 
                          temperature: float = 0.7,
                          max_tokens: int = 1000) -> str:
        """Generate text from the model (non-streaming)."""
        pass
    
    @abc.abstractmethod
    async def generate_text_stream(self, 
                                 prompt: str, 
                                 temperature: float = 0.7,
                                 max_tokens: int = 1000) -> AsyncGenerator[str, None]:
        """Generate text from the model with streaming."""
        pass
    
    @abc.abstractmethod
    async def generate_structured_output(self, 
                                       prompt: str, 
                                       output_schema: Dict[str, Any],
                                       temperature: float = 0.3,
                                       max_tokens: int = 1000) -> Dict[str, Any]:
        """Generate structured output according to a schema."""
        pass
    
    # @abc.abstractmethod
    # async def generate_text_stream_reasoning(self,
    #                               prompt: str, 
    #                               temperature: float = 0.7,
    #                               max_tokens: int = 1000) -> AsyncGenerator[str, None]:
    #     """Generate text from the model with reasoning."""
    #     pass
    
    def _parse_json_response(self, response: str) -> Dict[str, Any]:
        """Parse JSON from model response."""
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