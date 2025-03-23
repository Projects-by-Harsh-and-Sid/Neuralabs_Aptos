# elements/util/selector.py
from typing import Dict, Any, List, Optional, Union

from core.element_base import ElementBase
from utils.logger import logger
from utils.validators import validate_inputs

class Selector(ElementBase):
    """Selector element for selecting values from data based on a key."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any],
                 key: Union[str, List[str]] = None):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="selector",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
        self.key = key or ""
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the selector element."""
        # Log execution
        logger.info(f"Executing selector element: {self.name} ({self.element_id})")
        
        # Validate inputs
        validation_result = validate_inputs(self.inputs, self.input_schema)
        if not validation_result["valid"]:
            error_msg = f"Invalid inputs for selector element: {validation_result['error']}"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        # Get data from inputs
        data = self.inputs.get("data", {})
        
        # Set default value
        selected_value = None
        
        # Try to select value(s) based on key
        try:
            if isinstance(self.key, list):
                # Handle list of keys
                if isinstance(data, dict):
                    # For dictionaries, select multiple keys
                    selected_value = {k: data.get(k) for k in self.key if k in data}
                elif isinstance(data, list) and all(isinstance(item, dict) for item in data):
                    # For list of dictionaries, extract specified keys from each item
                    selected_value = []
                    for item in data:
                        selected_item = {k: item.get(k) for k in self.key if k in item}
                        if selected_item:  # Only add if at least one key was found
                            selected_value.append(selected_item)
                else:
                    logger.warning(f"Cannot select keys {self.key} from data type {type(data)}")
                    selected_value = {}
            else:
                # Handle single key
                if isinstance(data, dict):
                    # For dictionaries, select by key
                    selected_value = data.get(self.key)
                elif isinstance(data, list):
                    if all(isinstance(item, dict) for item in data):
                        # For list of dictionaries, extract the key from each item
                        selected_value = [item.get(self.key) for item in data if self.key in item]
                    else:
                        # For simple lists, try to use key as index if it's an integer
                        try:
                            idx = int(self.key)
                            if 0 <= idx < len(data):
                                selected_value = data[idx]
                        except (ValueError, TypeError):
                            logger.warning(f"Cannot use key {self.key} as index for list")
                            selected_value = None
        except Exception as e:
            logger.error(f"Error selecting value: {str(e)}")
            selected_value = None
        
        # Set output to the selected value
        self.outputs = {"value": selected_value}
        
        # Stream the selection info
        await executor._stream_event("selector", {
            "element_id": self.element_id,
            "key": self.key,
            "selected_value": selected_value
        })
        
        return self.outputs
