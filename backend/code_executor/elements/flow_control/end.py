# elements/flow_control/end.py
from typing import Dict, Any, Optional

from core.element_base import ElementBase
from utils.logger import logger
from utils.validators import validate_inputs

class End(ElementBase):
    """End element for flow execution."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any]):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="end",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the end element."""
        # Log execution
        logger.info(f"Executing end element: {self.name} ({self.element_id})")
        
        # Validate inputs
        validation_result = validate_inputs(self.inputs, self.input_schema)
        if not validation_result["valid"]:
            error_msg = f"Invalid inputs for end element: {validation_result['error']}"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        # Process inputs
        text_output = self.inputs.get("text_input")
        proposed_transaction = self.inputs.get("proposed_transaction")
        
        # Set outputs
        self.outputs = {
            "text_output": text_output,
            "proposed_transaction": proposed_transaction
        }
        
        # Stream final output to Backend 2
        await executor._stream_event("final_output", {
            "flow_id": executor.flow_id,
            "text_output": text_output,
            "proposed_transaction": proposed_transaction
        })
        
        # End element marks the end of flow execution
        # The flow executor will handle finishing the flow
        return self.outputs
