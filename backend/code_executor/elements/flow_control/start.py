# elements/flow_control/start.py
from typing import Dict, Any, Optional

from ...core.element_base import ElementBase
from ...utils.logger import logger

class Start(ElementBase):
    """Start element for flow execution."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any]):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="start",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the start element."""
        # Log execution
        logger.info(f"Executing start element: {self.name} ({self.element_id})")
        
        # Start doesn't do much, just passes its inputs as outputs
        self.outputs = self.inputs.copy()
        
        # Return the outputs
        return self.outputs
