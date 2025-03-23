# core/element_base.py
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List

class ElementBase(ABC):
    """Base class for all flow elements."""
    
    def __init__(self, element_id: str, name: str, element_type: str, 
                 description: str, input_schema: Dict[str, Any], 
                 output_schema: Dict[str, Any]):
        self.element_id = element_id
        self.name = name
        self.element_type = element_type
        self.description = description
        self.input_schema = input_schema
        self.output_schema = output_schema
        self.inputs = {}
        self.outputs = {}
        self.executed = False
        self.downwards_execute = True  # Controls forward flow
        self.connections = []  # Downstream elements
        self.dependencies = []  # Upstream elements
        
    def connect(self, element: 'ElementBase'):
        """Connect this element to another element downstream."""
        self.connections.append(element)
        element.dependencies.append(self)
    
    def set_input(self, input_name: str, value: Any):
        """Set an input value."""
        self.inputs[input_name] = value
    
    def get_output(self, output_name: str) -> Any:
        """Get an output value."""
        return self.outputs.get(output_name)
    
    @abstractmethod
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the element logic."""
        pass
    
    def validate_inputs(self) -> bool:
        """Validate that all required inputs are provided."""
        for name, schema in self.input_schema.items():
            if schema.get('required', False) and name not in self.inputs:
                return False
        return True
    
    def validate_outputs(self) -> bool:
        """Validate that all required outputs are produced."""
        for name, schema in self.output_schema.items():
            if schema.get('required', False) and name not in self.outputs:
                return False
        return True
