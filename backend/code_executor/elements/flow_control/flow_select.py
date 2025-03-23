# elements/flow_control/flow_select.py
from typing import Dict, Any, List, Optional

from ...core.element_base import ElementBase
from ...utils.logger import logger

class FlowSelect(ElementBase):
    """Flow Select element for choosing between multiple flow paths."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any],
                 flows_to_switch: List[str] = None):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="flow_select",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
        self.flows_to_switch = flows_to_switch or []
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the flow select element."""
        # Log execution
        logger.info(f"Executing flow select element: {self.name} ({self.element_id})")
        
        # If there are no flows to switch between, just pass through
        if not self.flows_to_switch or not self.connections:
            # Just forward the first input as output
            if self.inputs:
                first_input_key = next(iter(self.inputs))
                self.outputs = {first_input_key: self.inputs[first_input_key]}
            else:
                self.outputs = {}
            return self.outputs
        
        # Get the connections that correspond to the flows_to_switch
        flow_connections = {}
        for i, flow_id in enumerate(self.flows_to_switch):
            # Try to find a matching connection
            if i < len(self.connections):
                flow_connections[flow_id] = self.connections[i]
        
        # Default: disable all flows
        for conn in self.connections:
            conn.downwards_execute = False
        
        # Find the first flow that is executable (not marked as non-executable)
        chosen_flow = None
        for flow_id, conn in flow_connections.items():
            if not hasattr(conn, 'downwards_execute') or conn.downwards_execute:
                chosen_flow = flow_id
                # Enable only this flow
                conn.downwards_execute = True
                # Log the selected flow
                logger.info(f"Flow select element chose flow: {flow_id}")
                break
        
        # If no flow is chosen (all are disabled), choose the first one
        if not chosen_flow and self.flows_to_switch and flow_connections:
            first_flow = self.flows_to_switch[0]
            if first_flow in flow_connections:
                flow_connections[first_flow].downwards_execute = True
                chosen_flow = first_flow
                logger.info(f"Flow select element defaulted to first flow: {first_flow}")
        
        # Set output to input (flow select just selects which downstream path to execute)
        self.outputs = self.inputs.copy()
        
        # Add the chosen flow to outputs
        self.outputs["chosen_flow"] = chosen_flow
        
        return self.outputs
