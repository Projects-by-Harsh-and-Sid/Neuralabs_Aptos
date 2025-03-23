# core/schema.py
from typing import Dict, Any, List, Optional, Type, Union
from pydantic import BaseModel, Field, validator, create_model
import json

from ..utils.logger import logger

class ElementSchemaItem(BaseModel):
    """Schema for a single element input or output field."""
    type: str
    description: Optional[str] = ""
    default: Optional[Any] = None
    required: bool = False
    example: Optional[Any] = None
    schema: Optional[Dict[str, Any]] = None
    option: Optional[List[str]] = None

class ElementSchema(BaseModel):
    """Schema for element inputs or outputs."""
    __root__: Dict[str, ElementSchemaItem]

def validate_schema(schema_dict: Dict[str, Any]) -> bool:
    """
    Validate that a schema dictionary is valid.
    
    Args:
        schema_dict: Schema dictionary to validate
        
    Returns:
        True if valid, False otherwise
    """
    try:
        ElementSchema.parse_obj(schema_dict)
        return True
    except Exception as e:
        logger.error(f"Invalid schema: {str(e)}")
        return False

def create_pydantic_model_from_schema(schema_dict: Dict[str, Any], model_name: str = "DynamicModel") -> Type[BaseModel]:
    """
    Create a Pydantic model from a schema dictionary.
    
    Args:
        schema_dict: Schema dictionary to convert
        model_name: Name for the generated model
        
    Returns:
        Pydantic model class
    """
    field_definitions = {}
    
    for field_name, field_schema in schema_dict.items():
        # Determine field type
        python_type: Type = Any
        if field_schema.get("type") == "string":
            python_type = str
        elif field_schema.get("type") == "int":
            python_type = int
        elif field_schema.get("type") == "float":
            python_type = float
        elif field_schema.get("type") == "bool":
            python_type = bool
        elif field_schema.get("type") == "json":
            python_type = Dict[str, Any]
        elif field_schema.get("type") == "list":
            python_type = List[Any]
        elif "|" in field_schema.get("type", ""):
            # Union type
            python_type = Union[str, int, float, bool, Dict[str, Any], List[Any]]
        
        # Set up default value
        default_value = field_schema.get("default")
        
        # Set up field definition
        if field_schema.get("required", False):
            # Required field
            field_def = (python_type, Field(..., description=field_schema.get("description", "")))
        else:
            # Optional field with default
            field_def = (Optional[python_type], Field(default=default_value, description=field_schema.get("description", "")))
        
        field_definitions[field_name] = field_def
    
    # Create the model
    model = create_model(model_name, **field_definitions)
    
    return model

def validate_data_against_schema(data: Dict[str, Any], schema_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate data against a schema dictionary.
    
    Args:
        data: Data to validate
        schema_dict: Schema dictionary to validate against
        
    Returns:
        Dict with validation result and error message if any
    """
    try:
        # Create a model from the schema
        model = create_pydantic_model_from_schema(schema_dict)
        
        # Validate the data
        model(**data)
        
        return {"valid": True}
    except Exception as e:
        return {
            "valid": False,
            "error": str(e)
        }
