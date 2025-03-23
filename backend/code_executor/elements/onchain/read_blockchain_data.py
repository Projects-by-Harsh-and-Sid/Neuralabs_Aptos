# elements/onchain/read_blockchain_data.py
from typing import Dict, Any, List, Optional
import json

from ...core.element_base import ElementBase
from ...utils.logger import logger
from ...utils.validators import validate_inputs
from ...services.blockchain import AptosBlockchainService

class ReadBlockchainData(ElementBase):
    """Read Blockchain Data element for reading data from the Aptos blockchain."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any],
                 node_url: str = "", contract_address: str = "",
                 function_name: str = "", function_args: List[str] = None):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="read_blockchain_data",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
        self.node_url = node_url
        self.contract_address = contract_address
        self.function_name = function_name
        self.function_args = function_args or []
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the read blockchain data element."""
        # Log execution
        logger.info(f"Executing read blockchain data element: {self.name} ({self.element_id})")
        
        # Check if blockchain is enabled
        if not executor.config.get("enable_blockchain", True):
            error_msg = "Blockchain functionality is disabled in configuration"
            logger.error(error_msg)
            await executor._stream_event("blockchain_error", {
                "element_id": self.element_id,
                "error": error_msg
            })
            raise ValueError(error_msg)
        
        # Validate inputs
        validation_result = validate_inputs(self.inputs, self.input_schema)
        if not validation_result["valid"]:
            error_msg = f"Invalid inputs for read blockchain data element: {validation_result['error']}"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        # Get node URL from config if not specified
        if not self.node_url:
            self.node_url = executor.config.get("aptos_node_url", "https://testnet.aptoslabs.com")
        
        # Stream blockchain request info
        await executor._stream_event("blockchain_request", {
            "element_id": self.element_id,
            "node_url": self.node_url,
            "contract_address": self.contract_address,
            "function_name": self.function_name,
            "function_args": self.function_args
        })
        
        try:
            # Initialize blockchain service
            blockchain_service = AptosBlockchainService(
                node_url=self.node_url,
                private_key=executor.config.get("aptos_private_key")
            )
            
            # Prepare arguments
            args = []
            for arg_name in self.function_args:
                # Get arg value from inputs if available
                if arg_name in self.inputs:
                    args.append(self.inputs[arg_name])
                else:
                    logger.warning(f"Argument '{arg_name}' not found in inputs for element {self.element_id}")
                    # Use empty value for missing arguments
                    args.append(None)
            
            # Call view function
            function_path = f"{self.contract_address}::{self.function_name}"
            
            # Check if we need to parse the function path
            module_name = "script"
            func_name = self.function_name
            
            if "::" in self.function_name:
                parts = self.function_name.split("::")
                if len(parts) >= 2:
                    module_name = parts[0]
                    func_name = parts[1]
            
            full_function = f"{self.contract_address}::{module_name}::{func_name}"
            
            # Call view function
            result = await blockchain_service.call_view_function(
                address=self.contract_address,
                function_name=full_function,
                arguments=args
            )
            
            # Close blockchain service
            await blockchain_service.close()
            
            # Set output to the result
            self.outputs = {"data": result}
            
            # Stream blockchain response
            await executor._stream_event("blockchain_response", {
                "element_id": self.element_id,
                "response": result
            })
            
            return self.outputs
            
        except Exception as e:
            error_msg = f"Error reading blockchain data: {str(e)}"
            logger.error(error_msg)
            
            # Stream error info
            await executor._stream_event("blockchain_error", {
                "element_id": self.element_id,
                "error": error_msg
            })
            
            # Return error data
            self.outputs = {
                "data": {
                    "error": error_msg
                }
            }
            return self.outputs
