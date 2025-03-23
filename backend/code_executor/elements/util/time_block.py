# elements/util/time_block.py
from typing import Dict, Any, Optional
import datetime
import time
import pytz

from ...core.element_base import ElementBase
from ...utils.logger import logger

class TimeBlock(ElementBase):
    """Time Block element for providing time and date information."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any],
                 type: str = "string", format: str = "YYYY-MM-DD HH:MM:SS",
                 timezone: str = "UTC+0"):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="time",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
        self.type = type
        self.format = format
        self.timezone = timezone
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the time block element."""
        # Log execution
        logger.info(f"Executing time block element: {self.name} ({self.element_id})")
        
        # Generate time data based on format and timezone
        try:
            time_data = self._generate_time_data()
        except Exception as e:
            logger.error(f"Error generating time data: {str(e)}")
            time_data = self._get_default_time_value()
        
        # Set output to the time data
        self.outputs = {"time_data": time_data}
        
        # Stream the time data
        await executor._stream_event("time_block", {
            "element_id": self.element_id,
            "type": self.type,
            "format": self.format,
            "timezone": self.timezone,
            "time_data": time_data
        })
        
        return self.outputs
    
    def _generate_time_data(self) -> Any:
        """Generate time data based on format and timezone."""
        # Parse timezone
        tz = None
        try:
            # Try to parse as standard timezone name
            tz = pytz.timezone(self.timezone)
        except pytz.exceptions.UnknownTimeZoneError:
            # Try to parse as UTC offset (e.g., "UTC+8")
            if self.timezone.startswith("UTC"):
                try:
                    offset_str = self.timezone[3:]
                    if offset_str:
                        offset_hours = int(offset_str)
                        # Create a fixed offset timezone
                        tz = datetime.timezone(datetime.timedelta(hours=offset_hours))
                    else:
                        tz = datetime.timezone.utc
                except ValueError:
                    logger.warning(f"Invalid timezone offset: {self.timezone}, using UTC")
                    tz = datetime.timezone.utc
            else:
                logger.warning(f"Unknown timezone: {self.timezone}, using UTC")
                tz = datetime.timezone.utc
        
        # Get current time in specified timezone
        now = datetime.datetime.now(tz)
        
        # Format based on type and format
        if self.type == "string":
            # Parse format string (convert from YYYY-MM-DD to Python's %Y-%m-%d)
            py_format = self.format
            py_format = py_format.replace("YYYY", "%Y")
            py_format = py_format.replace("MM", "%m")
            py_format = py_format.replace("DD", "%d")
            py_format = py_format.replace("HH", "%H")
            py_format = py_format.replace("mm", "%M")
            py_format = py_format.replace("SS", "%S")
            py_format = py_format.replace("ss", "%S")
            
            return now.strftime(py_format)
        
        elif self.type == "int":
            # Return Unix timestamp (seconds since epoch)
            return int(now.timestamp())
        
        elif self.type == "float":
            # Return Unix timestamp with milliseconds
            return now.timestamp()
        
        else:
            logger.warning(f"Unknown time data type '{self.type}', defaulting to string")
            return now.isoformat()
    
    def _get_default_time_value(self) -> Any:
        """Get a default time value based on the specified type."""
        now = datetime.datetime.now(datetime.timezone.utc)
        
        if self.type == "string":
            return now.isoformat()
        elif self.type == "int":
            return int(now.timestamp())
        elif self.type == "float":
            return now.timestamp()
        else:
            return now.isoformat()
