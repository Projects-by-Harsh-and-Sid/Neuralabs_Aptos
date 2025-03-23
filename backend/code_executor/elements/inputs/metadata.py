# elements/inputs/metadata.py
from typing import Dict, Any, Optional, List

from core.element_base import ElementBase
from utils.logger import logger

class Metadata(ElementBase):
    """Metadata element for providing user and environment metadata."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any],
                 data: Optional[Dict[str, Any]] = None):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="metadata",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
        self.data = data or {}
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the metadata element."""
        # Log execution
        logger.info(f"Executing metadata element: {self.name} ({self.element_id})")
        
        # Get the configured metadata
        metadata = self.data.copy()
        
        # Extract command if specified in output schema
        command = None
        if "command" in self.output_schema:
            schema = self.output_schema["command"]
            if "option" in schema and isinstance(schema["option"], list) and len(schema["option"]) > 0:
                command = schema["option"][0]  # Default to first option
        
        # Override with explicit inputs if any
        if self.inputs:
            metadata.update(self.inputs)
        
        # Add default values for required fields if not present
        for key, schema in self.output_schema.items():
            if key not in metadata and schema.get("required", False) and "default" in schema and schema["default"] is not None:
                metadata[key] = schema["default"]
        
        # Set command if specified and not already set
        if command is not None and "command" not in metadata:
            metadata["command"] = command
        
        # Set output
        self.outputs = metadata
        
        # Stream metadata information
        safe_metadata = self._redact_sensitive_data(metadata)
        await executor._stream_event("metadata", {
            "element_id": self.element_id,
            "metadata": safe_metadata
        })
        
        return self.outputs
    
    def _redact_sensitive_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Redact sensitive data like wallet addresses and tokens."""
        if not isinstance(data, dict):
            return data
            
        sensitive_keys = ["wallet", "address", "private", "secret", "key", "token", "password"]
        redacted = {}
        
        for k, v in data.items():
            if any(sensitive in k.lower() for sensitive in sensitive_keys):
                # Hide part of the string for identifiers
                if isinstance(v, str) and len(v) > 8:
                    redacted[k] = v[:4] + "..." + v[-4:]
                else:
                    redacted[k] = "********"
            else:
                redacted[k] = v
                
        return redacted
