# elements/flow_control/case.py
from typing import Dict, Any, List, Optional
import operator

from core.element_base import ElementBase
from utils.logger import logger
from utils.validators import validate_inputs

class Case(ElementBase):
    """Case element for conditional flow control."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any],
                 cases: List[Dict[str, Any]] = None):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="case",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
        self.cases = cases or []
        
        # Map comparison operators to functions
        self.compare_ops = {
            "==": operator.eq,
            "!=": operator.ne,
            ">": operator.gt,
            "<": operator.lt,
            ">=": operator.ge,
            "<=": operator.le,
            "in": lambda a, b: a in b
        }
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the case element."""
        # Log execution
        logger.info(f"Executing case element: {self.name} ({self.element_id})")
        
        # Validate inputs
        validation_result = validate_inputs(self.inputs, self.input_schema)
        if not validation_result["valid"]:
            error_msg = f"Invalid inputs for case element: {validation_result['error']}"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        # Get variables from inputs
        variables = self.inputs.get("variables", {})
        
        # Evaluate each case
        results = {}
        for case in self.cases:
            case_id = list(case.keys())[0]
            case_config = case[case_id]
            
            # Get comparison operator
            compare = case_config.get("compare", "==")
            if compare not in self.compare_ops:
                logger.warning(f"Unknown comparison operator '{compare}' in case '{case_id}', defaulting to '=='")
                compare = "=="
            
            # Get variable values
            var1_name = case_config.get("variable1")
            var2_name = case_config.get("variable2")
            
            if var1_name not in variables:
                logger.warning(f"Variable '{var1_name}' not found in inputs for case '{case_id}', setting result to False")
                results[case_id] = False
                continue
            
            var1_value = variables[var1_name]
            
            # If var2 is a direct variable reference, get its value
            if var2_name in variables:
                var2_value = variables[var2_name]
            else:
                # Otherwise use the literal value from var2_name
                var2_value = var2_name
            
            # Execute comparison
            try:
                compare_func = self.compare_ops[compare]
                result = compare_func(var1_value, var2_value)
                results[case_id] = result
                
                # Log result
                logger.debug(f"Case '{case_id}': {var1_value} {compare} {var2_value} = {result}")
            except Exception as e:
                logger.error(f"Error evaluating case '{case_id}': {str(e)}")
                results[case_id] = False
        
        # Set outputs
        self.outputs = {"result": results}
        
        # Set up flow branching based on case results
        for case_id, result in results.items():
            # If a case is False, mark corresponding downstream flow as not to be executed
            if not result:
                # Note: This assumes connections are ordered to match cases
                # For proper implementation, connections would need to be tagged with case IDs
                # Here we're using a simple approximation
                for i, conn in enumerate(self.connections):
                    case_match = False
                    for j, case in enumerate(self.cases):
                        if list(case.keys())[0] == case_id and i == j:
                            case_match = True
                            break
                    
                    if case_match:
                        conn.downwards_execute = result
        
        return self.outputs
