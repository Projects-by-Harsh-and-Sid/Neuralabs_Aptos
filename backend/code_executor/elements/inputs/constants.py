# elements/inputs/constants.py
from typing import Dict, Any, Optional
import json

from core.element_base import ElementBase
from utils.logger import logger
from utils.validators import coerce_value

class Constants(ElementBase):
    """Constants element for providing fixed values."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any],
                 data_type: str = "string", data: Any = None):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="constants",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
        self.data_type = data_type
        self.data = data
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the constants element."""
        # Log execution
        logger.info(f"Executing constants element: {self.name} ({self.element_id})")
        
        try:
            # Process data based on type
            processed_data = self._process_data()
            
            # Set output to the processed data
            self.outputs = {"data": processed_data}
            
            # Stream the constant information
            data_preview = str(processed_data)
            if len(data_preview) > 1000:
                data_preview = data_preview[:997] + "..."
                
            await executor._stream_event("constant", {
                "element_id": self.element_id,
                "data_type": self.data_type,
                "data_preview": data_preview
            })
            
            return self.outputs
            
        except Exception as e:
            logger.error(f"Error processing constant in element {self.element_id}: {str(e)}")
            # Return default value for the type
            default_value = self._get_default_for_type()
            self.outputs = {"data": default_value}
            
            await executor._stream_event("constant_error", {
                "element_id": self.element_id,
                "error": str(e)
            })
            
            return self.outputs
    
    def _process_data(self) -> Any:
        """Process the data based on the specified type."""
        # If data is None, return default value for the type
        if self.data is None:
            return self._get_default_for_type()
        
        # Try to coerce the data to the specified type
        return coerce_value(self.data, self.data_type)
    
    def _get_default_for_type(self) -> Any:
        """Get the default value for the specified type."""
        if self.data_type == "string":
            return ""
        elif self.data_type == "int":
            return 0
        elif self.data_type == "float":
            return 0.0
        elif self.data_type == "bool":
            return False
        elif self.data_type == "json":
            return {}
        elif self.data_type == "list":
            return []
        else:
            return None
