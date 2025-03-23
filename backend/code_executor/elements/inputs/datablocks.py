# elements/inputs/datablocks.py
from typing import Dict, Any, Optional
import json
import pandas as pd
import io

from ...core.element_base import ElementBase
from ...utils.logger import logger

class Datablocks(ElementBase):
    """Datablocks element for providing constant data (JSON or CSV)."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any],
                 data_type: str = "json", data: Any = None):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="datablock",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
        self.data_type = data_type
        self.data = data
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the datablocks element."""
        # Log execution
        logger.info(f"Executing datablocks element: {self.name} ({self.element_id})")
        
        try:
            # Process data based on type
            if self.data_type == "json":
                # If data is a string, parse it as JSON
                if isinstance(self.data, str):
                    try:
                        processed_data = json.loads(self.data)
                    except json.JSONDecodeError as e:
                        logger.error(f"Error parsing JSON data in element {self.element_id}: {str(e)}")
                        processed_data = {}
                else:
                    # Use data as-is
                    processed_data = self.data
            elif self.data_type == "csv":
                # If data is a string, parse it as CSV
                if isinstance(self.data, str):
                    try:
                        # Convert CSV string to DataFrame then to dict
                        df = pd.read_csv(io.StringIO(self.data))
                        processed_data = df.to_dict(orient="records")
                    except Exception as e:
                        logger.error(f"Error parsing CSV data in element {self.element_id}: {str(e)}")
                        processed_data = []
                else:
                    # Use data as-is
                    processed_data = self.data
            else:
                logger.warning(f"Unknown data type '{self.data_type}' in element {self.element_id}, using raw data")
                processed_data = self.data
            
            # Set output to the processed data
            self.outputs = {"data": processed_data}
            
            # Stream the datablock information
            data_preview = str(processed_data)
            if len(data_preview) > 1000:
                data_preview = data_preview[:997] + "..."
                
            await executor._stream_event("datablock", {
                "element_id": self.element_id,
                "data_type": self.data_type,
                "data_preview": data_preview
            })
            
            return self.outputs
            
        except Exception as e:
            logger.error(f"Error processing datablock in element {self.element_id}: {str(e)}")
            # Return empty data on error
            self.outputs = {"data": {} if self.data_type == "json" else []}
            return self.outputs
