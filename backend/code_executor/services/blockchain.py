# services/blockchain.py
import httpx
import json
import asyncio
from typing import Dict, Any, List, Optional, Union
import base64
import time

from utils.logger import logger

class AptosBlockchainService:
    """Service for interacting with the Aptos blockchain."""
    
    def __init__(self, node_url: str, private_key: Optional[str] = None):
        """
        Initialize the Aptos blockchain service.
        
        Args:
            node_url: URL of the Aptos node
            private_key: Optional private key for signing transactions
        """
        self.node_url = node_url
        self.private_key = private_key
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
    
    async def get_account_info(self, address: str) -> Dict[str, Any]:
        """
        Get information about an account.
        
        Args:
            address: The account address
            
        Returns:
            Account information
        """
        try:
            response = await self.client.get(f"{self.node_url}/v1/accounts/{address}")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to get account info for {address}: {str(e)}")
            raise
    
    async def get_resource(self, address: str, resource_type: str) -> Dict[str, Any]:
        """
        Get a resource from an account.
        
        Args:
            address: The account address
            resource_type: The resource type
            
        Returns:
            Resource data
        """
        try:
            resource_type_encoded = resource_type.replace("::", "/")
            url = f"{self.node_url}/v1/accounts/{address}/resource/{resource_type_encoded}"
            response = await self.client.get(url)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                logger.warning(f"Resource {resource_type} not found for {address}")
                return {}
            logger.error(f"Failed to get resource {resource_type} for {address}: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Failed to get resource {resource_type} for {address}: {str(e)}")
            raise
    
    async def call_view_function(self, 
                               address: str, 
                               function_name: str, 
                               type_arguments: List[str] = None,
                               arguments: List[Any] = None) -> Any:
        """
        Call a view function on a smart contract.
        
        Args:
            address: The contract address
            function_name: The function name
            type_arguments: Type arguments for generic functions
            arguments: Function arguments
            
        Returns:
            Function result
        """
        if type_arguments is None:
            type_arguments = []
        if arguments is None:
            arguments = []
        
        try:
            payload = {
                "function": f"{address}::{function_name}",
                "type_arguments": type_arguments,
                "arguments": arguments
            }
            
            response = await self.client.post(
                f"{self.node_url}/v1/view",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to call view function {function_name}: {str(e)}")
            raise
    
    async def build_transaction(self,
                              sender: str,
                              function_name: str,
                              arguments: List[Any] = None,
                              type_arguments: List[str] = None) -> Dict[str, Any]:
        """
        Build a transaction for execution.
        
        Args:
            sender: The sender address
            function_name: The function to call
            arguments: Function arguments
            type_arguments: Type arguments for generic functions
            
        Returns:
            Transaction payload
        """
        if type_arguments is None:
            type_arguments = []
        if arguments is None:
            arguments = []
        
        try:
            # Get account info for sequence number
            account_info = await self.get_account_info(sender)
            sequence_number = account_info.get("sequence_number", "0")
            
            # Build the payload
            payload = {
                "sender": sender,
                "sequence_number": sequence_number,
                "max_gas_amount": "2000", 
                "gas_unit_price": "100",
                "expiration_timestamp_secs": str(int(time.time()) + 600),  # 10 minutes
                "payload": {
                    "type": "entry_function_payload",
                    "function": function_name,
                    "type_arguments": type_arguments,
                    "arguments": arguments
                }
            }
            
            return payload
        except Exception as e:
            logger.error(f"Failed to build transaction: {str(e)}")
            raise
