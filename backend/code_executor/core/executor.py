# core/executor.py
import asyncio
import json
from typing import Dict, Any, List, Optional
from uuid import uuid4
import time

from .element_base import ElementBase
from utils.logger import logger
from services.streaming import WebSocketStreamManager

class FlowExecutor:
    """Main class for executing flows."""
    
    def __init__(self, elements: Dict[str, ElementBase], 
                 start_element_id: str, 
                 stream_manager: Optional[WebSocketStreamManager] = None,
                 config: Dict[str, Any] = None):
        self.elements = elements
        self.start_element_id = start_element_id
        self.output_cache = {}  # Cache for element outputs
        self.execution_order = []  # Tracks execution order
        self.stream_manager = stream_manager
        self.config = config or {}
        self.flow_id = str(uuid4())
        
    async def execute_flow(self, initial_inputs: Dict[str, Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute the entire flow starting from the start element."""
        start_time = time.time()
        
        # Set initial inputs to respective elements
        if initial_inputs:
            for element_id, inputs in initial_inputs.items():
                if element_id in self.elements:
                    element = self.elements[element_id]
                    for input_name, input_value in inputs.items():
                        element.set_input(input_name, input_value)
                else:
                    logger.warning(f"Element with ID '{element_id}' not found, skipping initial inputs")
        
        # Begin execution
        await self._stream_event("flow_started", {
            "flow_id": self.flow_id,
            "start_time": start_time
        })
        
        # Get the start element (after setting inputs)
        start_element = self.elements[self.start_element_id]
        
        # Execute the start element
        try:
            result = await self._execute_element(start_element)
            
            # Prepare final result
            final_result = {
                "flow_id": self.flow_id,
                "execution_order": self.execution_order,
                "element_outputs": self.output_cache,
                "final_output": result,
                "execution_time": time.time() - start_time
            }
            
            await self._stream_event("flow_completed", final_result)
            
            return final_result
            
        except Exception as e:
            error_data = {
                "flow_id": self.flow_id,
                "error": str(e),
                "partial_execution_order": self.execution_order,
                "partial_outputs": self.output_cache,
                "execution_time": time.time() - start_time
            }
            
            await self._stream_event("flow_error", error_data)
            logger.error(f"Flow execution error: {str(e)}")
            raise
            
        except Exception as e:
            error_data = {
                "flow_id": self.flow_id,
                "error": str(e),
                "partial_execution_order": self.execution_order,
                "partial_outputs": self.output_cache,
                "execution_time": time.time() - start_time
            }
            
            await self._stream_event("flow_error", error_data)
            logger.error(f"Flow execution error: {str(e)}")
            raise
    
    async def _execute_element(self, element: ElementBase, backtracking=False) -> Dict[str, Any]:
        """Execute a single element in the flow."""
        element_id = element.element_id
        
        # Check if already executed and cached
        if element.executed and element_id in self.output_cache:
            return self.output_cache[element_id]
            
        # Check if all dependencies have been executed
        for dep in element.dependencies:
            if not dep.executed:
                # Execute dependency in backtracking mode
                await self._execute_element(dep, backtracking=True)
        
        # Stream execution start event
        await self._stream_event("element_started", {
            "flow_id": self.flow_id,
            "element_id": element_id,
            "element_type": element.element_type,
            "element_name": element.name,
            "backtracking": backtracking
        })
        
        try:
            # Execute the element
            outputs = await element.execute(self, backtracking)
            
            # Mark as executed and cache outputs
            element.executed = True
            self.output_cache[element_id] = outputs
            self.execution_order.append(element_id)
            
            # Stream execution completed event
            await self._stream_event("element_completed", {
                "flow_id": self.flow_id,
                "element_id": element_id,
                "element_type": element.element_type,
                "element_name": element.name,
                "outputs": outputs,
                "backtracking": backtracking
            })
            
            # If not in backtracking mode and downwards execution is allowed,
            # continue with downstream elements
            if not backtracking and element.downwards_execute:
                for conn in element.connections:
                    # Map outputs to connected element inputs based on schema
                    for output_name, output_value in outputs.items():
                        if output_name in conn.input_schema:
                            conn.set_input(output_name, output_value)
                    
                    # Execute connected element
                    await self._execute_element(conn)
            
            return outputs
            
        except Exception as e:
            # Stream error event
            await self._stream_event("element_error", {
                "flow_id": self.flow_id,
                "element_id": element_id,
                "element_type": element.element_type,
                "element_name": element.name,
                "error": str(e),
                "backtracking": backtracking
            })
            logger.error(f"Error executing element {element_id}: {str(e)}")
            raise
    
    async def _stream_event(self, event_type: str, data: Dict[str, Any]):
        """Stream execution events to Backend 2."""
        if self.stream_manager:
            event = {
                "type": event_type,
                "timestamp": time.time(),
                "data": data
            }
            await self.stream_manager.send_message(json.dumps(event))
            logger.debug(f"Streamed event: {event_type}")
