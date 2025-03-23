# elements/inputs/context_history.py
from typing import Dict, Any, List, Optional

from ...core.element_base import ElementBase
from ...utils.logger import logger

class ContextHistory(ElementBase):
    """Context History element for providing conversation context."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any]):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="context_history",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the context history element."""
        # Log execution
        logger.info(f"Executing context history element: {self.name} ({self.element_id})")
        
        # Get context history from inputs
        context_history = self.inputs.get("context_history", [])
        
        # Ensure it's a list
        if not isinstance(context_history, list):
            logger.warning(f"Context history input is not a list in element {self.element_id}, converting to list")
            if context_history:
                context_history = [str(context_history)]
            else:
                context_history = []
        
        # Set output to the context history
        self.outputs = {"context_history": context_history}
        
        # Stream the context history to provide visibility
        await executor._stream_event("context_history", {
            "element_id": self.element_id,
            "context_history": context_history
        })
        
        return self.outputs
