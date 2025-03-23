# elements/inputs/rest_api.py
from typing import Dict, Any, Optional
import json
import httpx
import asyncio

from core.element_base import ElementBase
from utils.logger import logger
from utils.validators import validate_inputs

class RestAPI(ElementBase):
    """REST API element for making HTTP requests to external APIs."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any],
                 url: str = "", method: str = "GET", headers: Dict[str, str] = None,
                 api_key: Optional[str] = None):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="rest_api",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
        self.url = url
        self.method = method.upper()
        self.headers = headers or {}
        self.api_key = api_key
        
        # Add API key to headers if provided
        if self.api_key:
            self.headers["Authorization"] = f"Bearer {self.api_key}"
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the REST API element."""
        # Log execution
        logger.info(f"Executing REST API element: {self.name} ({self.element_id})")
        
        # Validate inputs
        validation_result = validate_inputs(self.inputs, self.input_schema)
        if not validation_result["valid"]:
            error_msg = f"Invalid inputs for REST API element: {validation_result['error']}"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        # Get params from input
        params = self.inputs.get("params", {})
        
        # Stream API request info
        safe_params = self._redact_sensitive_data(params)
        safe_headers = self._redact_sensitive_data(self.headers)
        
        await executor._stream_event("api_request", {
            "element_id": self.element_id,
            "url": self.url,
            "method": self.method,
            "headers": safe_headers,
            "params": safe_params
        })
        
        try:
            # Make the request
            async with httpx.AsyncClient(timeout=30.0) as client:
                if self.method == "GET":
                    response = await client.get(self.url, headers=self.headers, params=params)
                elif self.method == "POST":
                    response = await client.post(self.url, headers=self.headers, json=params)
                elif self.method == "PUT":
                    response = await client.put(self.url, headers=self.headers, json=params)
                elif self.method == "DELETE":
                    response = await client.delete(self.url, headers=self.headers, params=params)
                else:
                    raise ValueError(f"Unsupported HTTP method: {self.method}")
                
                # Check for errors
                response.raise_for_status()
                
                # Try to parse response as JSON
                try:
                    data = response.json()
                except json.JSONDecodeError:
                    # If not JSON, use text
                    data = {"text": response.text}
                
                # Set output to the response data
                self.outputs = {"data": data}
                
                # Stream response info
                await executor._stream_event("api_response", {
                    "element_id": self.element_id,
                    "status_code": response.status_code,
                    "response_preview": str(data)[:1000] + ("..." if len(str(data)) > 1000 else "")
                })
                
                return self.outputs
                
        except httpx.HTTPStatusError as e:
            error_msg = f"HTTP error {e.response.status_code} from API: {e.response.text}"
            logger.error(error_msg)
            
            # Stream error info
            await executor._stream_event("api_error", {
                "element_id": self.element_id,
                "status_code": e.response.status_code,
                "error": error_msg
            })
            
            # Return error data
            self.outputs = {
                "data": {
                    "error": error_msg,
                    "status_code": e.response.status_code
                }
            }
            return self.outputs
            
        except Exception as e:
            error_msg = f"Error making API request: {str(e)}"
            logger.error(error_msg)
            
            # Stream error info
            await executor._stream_event("api_error", {
                "element_id": self.element_id,
                "error": error_msg
            })
            
            # Return error data
            self.outputs = {
                "data": {
                    "error": error_msg
                }
            }
            return self.outputs
    
    def _redact_sensitive_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Redact sensitive data like API keys and tokens."""
        if not isinstance(data, dict):
            return data
            
        sensitive_keys = ["api_key", "apikey", "key", "token", "secret", "password", "auth", "authorization"]
        redacted = {}
        
        for k, v in data.items():
            if any(sensitive in k.lower() for sensitive in sensitive_keys):
                redacted[k] = "********"
            else:
                redacted[k] = v
                
        return redacted
