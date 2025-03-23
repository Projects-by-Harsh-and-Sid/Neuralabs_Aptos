# elements/util/random_generator.py
from typing import Dict, Any, Optional
import random
import string

from ...core.element_base import ElementBase
from ...utils.logger import logger

class RandomGenerator(ElementBase):
    """Random Generator element for generating random values."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any],
                 type: str = "string", floating_point: bool = False,
                 min: int = 0, max: int = 100, decimal: int = 2,
                 length: int = 10):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="random_generator",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
        self.type = type
        self.floating_point = floating_point
        self.min = min
        self.max = max
        self.decimal = decimal
        self.length = length
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the random generator element."""
        # Log execution
        logger.info(f"Executing random generator element: {self.name} ({self.element_id})")
        
        # Generate random data based on type
        random_data = None
        
        try:
            if self.type == "string":
                random_data = self._generate_random_string()
            elif self.type == "int":
                random_data = self._generate_random_int()
            elif self.type == "float":
                random_data = self._generate_random_float()
            else:
                logger.warning(f"Unknown random data type '{self.type}', defaulting to string")
                random_data = self._generate_random_string()
        except Exception as e:
            logger.error(f"Error generating random data: {str(e)}")
            if self.type == "string":
                random_data = "random_error"
            elif self.type == "int":
                random_data = 0
            elif self.type == "float":
                random_data = 0.0
            else:
                random_data = None
        
        # Set output to the random data
        self.outputs = {"random_data": random_data}
        
        # Stream the random data
        await executor._stream_event("random_generator", {
            "element_id": self.element_id,
            "type": self.type,
            "random_data": random_data
        })
        
        return self.outputs
    
    def _generate_random_string(self) -> str:
        """Generate a random string of specified length."""
        # Use a mix of uppercase, lowercase, and digits
        chars = string.ascii_letters + string.digits
        return ''.join(random.choice(chars) for _ in range(self.length))
    
    def _generate_random_int(self) -> int:
        """Generate a random integer within the specified range."""
        return random.randint(self.min, self.max)
    
    def _generate_random_float(self) -> float:
        """Generate a random float within the specified range."""
        # Generate a random float
        value = random.uniform(self.min, self.max)
        
        # Round to specified decimal places
        return round(value, self.decimal)
