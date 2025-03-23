# elements/inputs/chat_input.py
from typing import Dict, Any, Optional

from ...core.element_base import ElementBase
from ...utils.logger import logger

class ChatInput(ElementBase):
    """Chat Input element for retrieving user input."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any]):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="chat_input",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the chat input element."""
        # Log execution
        logger.info(f"Executing chat input element: {self.name} ({self.element_id})")
        
        # Chat input should already be provided in the initial inputs
        chat_input = self.inputs.get("chat_input")
        
        if not chat_input:
            logger.warning(f"No chat input provided to element {self.element_id}")
            chat_input = ""  # Default to empty string
        
        # Set output to the same chat input
        self.outputs = {"chat_input": chat_input}
        
        # Stream the chat input to the flow
        await executor._stream_event("chat_input", {
            "element_id": self.element_id,
            "chat_input": chat_input
        })
        
        return self.outputs
