# elements/util/merger.py
from typing import Dict, Any, List, Optional, Union
import copy

from core.element_base import ElementBase
from utils.logger import logger
from utils.validators import validate_inputs

class Merger(ElementBase):
    """Merger element for combining multiple data inputs."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any]):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="merger",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the merger element."""
        # Log execution
        logger.info(f"Executing merger element: {self.name} ({self.element_id})")
        
        # Validate inputs
        validation_result = validate_inputs(self.inputs, self.input_schema)
        if not validation_result["valid"]:
            error_msg = f"Invalid inputs for merger element: {validation_result['error']}"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        # Get input data
        data1 = self.inputs.get("data1", {})
        data2 = self.inputs.get("data2", {})
        
        # Determine merge strategy based on data types
        merged_data = self._merge_data(data1, data2)
        
        # Set output to the merged data
        self.outputs = {"merged_data": merged_data}
        
        # Stream the merge info
        await executor._stream_event("merger", {
            "element_id": self.element_id,
            "merged_data_preview": str(merged_data)[:1000] + ("..." if len(str(merged_data)) > 1000 else "")
        })
        
        return self.outputs
    
    def _merge_data(self, data1: Any, data2: Any) -> Any:
        """Merge two data items based on their types."""
        # If either is None, return the other
        if data1 is None:
            return copy.deepcopy(data2)
        if data2 is None:
            return copy.deepcopy(data1)
        
        # Dictionaries: merge keys
        if isinstance(data1, dict) and isinstance(data2, dict):
            result = copy.deepcopy(data1)
            for key, value in data2.items():
                if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                    # Recursively merge nested dictionaries
                    result[key] = self._merge_data(result[key], value)
                else:
                    # Otherwise just overwrite
                    result[key] = copy.deepcopy(value)
            return result
        
        # Lists: concatenate
        elif isinstance(data1, list) and isinstance(data2, list):
            return copy.deepcopy(data1) + copy.deepcopy(data2)
        
        # Strings: concatenate
        elif isinstance(data1, str) and isinstance(data2, str):
            return data1 + data2
        
        # Numbers: add
        elif isinstance(data1, (int, float)) and isinstance(data2, (int, float)):
            return data1 + data2
        
        # Booleans: logical OR
        elif isinstance(data1, bool) and isinstance(data2, bool):
            return data1 or data2
        
        # Mixed types: convert to strings and concatenate
        elif isinstance(data1, (str, int, float, bool)) and isinstance(data2, (str, int, float, bool)):
            return str(data1) + str(data2)
        
        # Default: return data2 (overwrite data1)
        else:
            logger.warning(f"Cannot merge data types {type(data1)} and {type(data2)}, using data2")
            return copy.deepcopy(data2)
