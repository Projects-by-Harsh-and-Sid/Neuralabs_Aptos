# utils/validators.py
from typing import Dict, Any, List, Union, Optional, Type
import json
from .logger import logger

def validate_type(value: Any, expected_type: str) -> bool:
    """Validate that a value matches the expected type."""
    if expected_type == "string":
        return isinstance(value, str)
    elif expected_type == "int":
        return isinstance(value, int) and not isinstance(value, bool)
    elif expected_type == "float":
        return isinstance(value, (int, float)) and not isinstance(value, bool)
    elif expected_type == "bool":
        return isinstance(value, bool)
    elif expected_type == "json":
        return isinstance(value, dict)
    elif expected_type == "list":
        return isinstance(value, list)
    else:
        # For any other types, just check if it's not None
        return value is not None

def validate_schema(value: Any, schema: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate that a value matches a schema.
    
    Args:
        value: The value to validate
        schema: The schema to validate against
        
    Returns:
        Dict with validation result and error message if any
    """
    # Check if the schema defines a type
    if "type" not in schema:
        return {"valid": True}
    
    expected_type = schema["type"]
    
    # Handle union types (e.g., "string|int")
    if "|" in expected_type:
        types = expected_type.split("|")
        valid = any(validate_type(value, t) for t in types)
    else:
        valid = validate_type(value, expected_type)
    
    if not valid:
        return {
            "valid": False,
            "error": f"Value '{value}' does not match expected type '{expected_type}'."
        }
    
    # If it's a JSON type, validate any nested schema
    if expected_type == "json" and isinstance(value, dict) and schema.get("schema"):
        nested_schema = schema["schema"]
        for key, key_schema in nested_schema.items():
            if key_schema.get("required", False) and key not in value:
                return {
                    "valid": False,
                    "error": f"Required field '{key}' is missing from JSON."
                }
            
            if key in value:
                result = validate_schema(value[key], key_schema)
                if not result["valid"]:
                    return {
                        "valid": False,
                        "error": f"Field '{key}': {result['error']}"
                    }
    
    return {"valid": True}

def validate_inputs(inputs: Dict[str, Any], input_schema: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate that input values match their schema.
    
    Args:
        inputs: Dictionary of input values
        input_schema: Schema for inputs
        
    Returns:
        Dict with validation result and error message if any
    """
    # Check for required inputs
    for name, schema in input_schema.items():
        if schema.get("required", False) and name not in inputs:
            return {
                "valid": False,
                "error": f"Required input '{name}' is missing."
            }
        
        if name in inputs:
            result = validate_schema(inputs[name], schema)
            if not result["valid"]:
                return {
                    "valid": False,
                    "error": f"Input '{name}': {result['error']}"
                }
    
    return {"valid": True}

def validate_outputs(outputs: Dict[str, Any], output_schema: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate that output values match their schema.
    
    Args:
        outputs: Dictionary of output values
        output_schema: Schema for outputs
        
    Returns:
        Dict with validation result and error message if any
    """
    # Check for required outputs
    for name, schema in output_schema.items():
        if schema.get("required", False) and name not in outputs:
            return {
                "valid": False,
                "error": f"Required output '{name}' is missing."
            }
        
        if name in outputs:
            result = validate_schema(outputs[name], schema)
            if not result["valid"]:
                return {
                    "valid": False,
                    "error": f"Output '{name}': {result['error']}"
                }
    
    return {"valid": True}

def coerce_value(value: Any, expected_type: str) -> Any:
    """
    Attempt to coerce a value to the expected type.
    
    Args:
        value: The value to coerce
        expected_type: The expected type
        
    Returns:
        The coerced value, or the original value if coercion failed
    """
    try:
        if expected_type == "string":
            return str(value)
        elif expected_type == "int":
            return int(value)
        elif expected_type == "float":
            return float(value)
        elif expected_type == "bool":
            if isinstance(value, str):
                return value.lower() in ("true", "yes", "1", "t", "y")
            return bool(value)
        elif expected_type == "json" and isinstance(value, str):
            return json.loads(value)
        elif expected_type == "list" and isinstance(value, str):
            return json.loads(value)
        else:
            return value
    except (ValueError, TypeError, json.JSONDecodeError) as e:
        logger.warning(f"Failed to coerce value '{value}' to type '{expected_type}': {str(e)}")
        return value
