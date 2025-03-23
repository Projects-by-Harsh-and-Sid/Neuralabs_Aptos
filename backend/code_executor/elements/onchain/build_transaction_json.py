# elements/onchain/build_transaction_json.py
from typing import Dict, Any, List, Optional
import json

from ...core.element_base import ElementBase
from ...utils.logger import logger
from ...utils.validators import validate_inputs
from ...services.blockchain import AptosBlockchainService

class BuildTransactionJSON(ElementBase):
    """Build Transaction JSON element for creating blockchain transaction payloads."""
    
    def __init__(self, element_id: str, name: str, description: str,
                 input_schema: Dict[str, Any], output_schema: Dict[str, Any],
                 node_url: str = "", contract_address: str = "",
                 function_name: str = "", function_args: List[str] = None):
        super().__init__(
            element_id=element_id,
            name=name,
            element_type="build_transaction_json",
            description=description,
            input_schema=input_schema,
            output_schema=output_schema
        )
        self.node_url = node_url
        self.contract_address = contract_address
        self.function_name = function_name
        self.function_args = function_args or []
    
    async def execute(self, executor, backtracking=False) -> Dict[str, Any]:
        """Execute the build transaction JSON element."""
        # Log execution
        logger.info(f"Executing build transaction JSON element: {self.name} ({self.element_id})")
        
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
            error_msg = f"Invalid inputs for build transaction JSON element: {validation_result['error']}"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        # Get node URL from config if not specified
        if not self.node_url:
            self.node_url = executor.config.get("aptos_node_url", "https://testnet.aptoslabs.com")
        
        # Get sender address
        sender = executor.config.get("aptos_sender_address")
        if not sender:
            # Try to get from metadata input if available
            if "wallet_address" in self.inputs:
                sender = self.inputs["wallet_address"]
            
        if not sender:
            error_msg = "No sender address provided for transaction"
            logger.error(error_msg)
            await executor._stream_event("blockchain_error", {
                "element_id": self.element_id,
                "error": error_msg
            })
            raise ValueError(error_msg)
        
        # Stream transaction build request info
        await executor._stream_event("transaction_build_request", {
            "element_id": self.element_id,
            "node_url": self.node_url,
            "contract_address": self.contract_address,
            "function_name": self.function_name,
            "function_args": self.function_args,
            "sender": sender
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
            
            # Prepare function name
            # Check if we need to parse the function path
            module_name = "script"
            func_name = self.function_name
            
            if "::" in self.function_name:
                parts = self.function_name.split("::")
                if len(parts) >= 2:
                    module_name = parts[0]
                    func_name = parts[1]
            
            full_function = f"{self.contract_address}::{module_name}::{func_name}"
            
            # Build transaction
            transaction_json = await blockchain_service.build_transaction(
                sender=sender,
                function_name=full_function,
                arguments=args
            )
            
            # Close blockchain service
            await blockchain_service.close()
            
            # Set output to the transaction JSON
            self.outputs = {"transaction_json": transaction_json}
            
            # Stream transaction build response
            safe_tx = self._redact_sensitive_tx_data(transaction_json)
            await executor._stream_event("transaction_build_response", {
                "element_id": self.element_id,
                "transaction_json": safe_tx
            })
            
            return self.outputs
            
        except Exception as e:
            error_msg = f"Error building transaction JSON: {str(e)}"
            logger.error(error_msg)
            
            # Stream error info
            await executor._stream_event("blockchain_error", {
                "element_id": self.element_id,
                "error": error_msg
            })
            
            # Return error data
            self.outputs = {
                "transaction_json": {
                    "error": error_msg
                }
            }
            return self.outputs
    
    def _redact_sensitive_tx_data(self, tx_data: Dict[str, Any]) -> Dict[str, Any]:
        """Redact sensitive data from transaction JSON for logging."""
        if not isinstance(tx_data, dict):
            return tx_data
            
        # Create a copy to avoid modifying the original
        safe_tx = tx_data.copy()
        
        # Redact sensitive fields
        if "sender" in safe_tx and isinstance(safe_tx["sender"], str) and len(safe_tx["sender"]) > 8:
            safe_tx["sender"] = safe_tx["sender"][:4] + "..." + safe_tx["sender"][-4:]
        
        return safe_tx
