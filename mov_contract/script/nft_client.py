#!/usr/bin/env python3

import asyncio
import json
from typing import Dict, List, Optional, Tuple

from aptos_sdk.account import Account
from aptos_sdk.account_address import AccountAddress
from aptos_sdk.async_client import RestClient
from aptos_sdk.bcs import Serializer
from aptos_sdk.transactions import (
    EntryFunction,
    TransactionArgument,
    TransactionPayload,
)

from common import MAX_GAS_AMOUNT

class NFTClient(RestClient):
    """Client for interacting with our NFT contract."""
    
    def __init__(self, node_url: str, contract_address: AccountAddress):
        """Initialize the NFT client with the contract address."""
        super().__init__(node_url)
        self.contract_address = contract_address
    
    # --- NFT Creation ---
    
    async def create_nft(
        self, 
        account: Account, 
        name: str, 
        level_of_ownership: int
    ) -> str:
        """Create a new NFT with the given properties."""
        payload = TransactionPayload(
            EntryFunction.natural(
                f"{self.contract_address}::NFT",
                "create_nft",
                [],  # Type arguments
                [
                    TransactionArgument(name, Serializer.str),
                    TransactionArgument(level_of_ownership, Serializer.u8),
                ]
            )
        )
        
        signed_transaction = await self.create_bcs_signed_transaction(account, payload)
        txn_hash = await self.submit_bcs_transaction(signed_transaction)
        return txn_hash
    
    # --- NFT Transfer ---
    
    async def transfer_nft(
        self, 
        account: Account, 
        recipient: AccountAddress, 
        token_id: int
    ) -> str:
        """Transfer an NFT to another address."""
        payload = TransactionPayload(
            EntryFunction.natural(
                f"{self.contract_address}::NFT",
                "transfer_nft",
                [],  # Type arguments
                [
                    TransactionArgument(recipient, Serializer.struct),
                    TransactionArgument(token_id, Serializer.u64),
                ]
            )
        )
        
        signed_transaction = await self.create_bcs_signed_transaction(account, payload)
        txn_hash = await self.submit_bcs_transaction(signed_transaction)
        return txn_hash
    
    # --- NFT Burning ---
    
    async def burn_nft(
        self, 
        account: Account, 
        token_id: int
    ) -> str:
        """Burn (delete) an NFT."""
        payload = TransactionPayload(
            EntryFunction.natural(
                f"{self.contract_address}::NFT",
                "burn_nft",
                [],  # Type arguments
                [
                    TransactionArgument(token_id, Serializer.u64),
                ]
            )
        )
        
        signed_transaction = await self.create_bcs_signed_transaction(account, payload)
        txn_hash = await self.submit_bcs_transaction(signed_transaction)
        return txn_hash
    
    # --- Access Control ---
    
    async def grant_access(
        self, 
        account: Account, 
        token_id: int, 
        user: AccountAddress, 
        access_level: int
    ) -> str:
        """Grant access to an NFT for a user."""
        payload = TransactionPayload(
            EntryFunction.natural(
                f"{self.contract_address}::NFT",
                "grant_access",
                [],  # Type arguments
                [
                    TransactionArgument(token_id, Serializer.u64),
                    TransactionArgument(user, Serializer.struct),
                    TransactionArgument(access_level, Serializer.u8),
                ]
            )
        )
        
        signed_transaction = await self.create_bcs_signed_transaction(account, payload)
        txn_hash = await self.submit_bcs_transaction(signed_transaction)
        return txn_hash
    
    async def revoke_access(
        self, 
        account: Account, 
        token_id: int, 
        user: AccountAddress
    ) -> str:
        """Revoke access to an NFT for a user."""
        payload = TransactionPayload(
            EntryFunction.natural(
                f"{self.contract_address}::NFT",
                "revoke_access",
                [],  # Type arguments
                [
                    TransactionArgument(token_id, Serializer.u64),
                    TransactionArgument(user, Serializer.struct),
                ]
            )
        )
        
        signed_transaction = await self.create_bcs_signed_transaction(account, payload)
        txn_hash = await self.submit_bcs_transaction(signed_transaction)
        return txn_hash
    
    async def set_default_access_level(
        self, 
        account: Account, 
        token_id: int, 
        access_level: int
    ) -> str:
        """Set the default access level for an NFT."""
        payload = TransactionPayload(
            EntryFunction.natural(
                f"{self.contract_address}::NFT",
                "set_default_access_level",
                [],  # Type arguments
                [
                    TransactionArgument(token_id, Serializer.u64),
                    TransactionArgument(access_level, Serializer.u8),
                ]
            )
        )
        
        signed_transaction = await self.create_bcs_signed_transaction(account, payload)
        txn_hash = await self.submit_bcs_transaction(signed_transaction)
        return txn_hash
    
    # --- NFT Information ---
    
    async def get_nft_info(
        self, 
        owner_address: AccountAddress, 
        token_id: int
    ) -> Optional[Dict]:
        """Get information about an NFT."""
        try:
            # Call the get_nft_info function
            result = await self.view_function(
                self.contract_address,
                "NFT",
                "get_nft_info",
                [owner_address, token_id]
            )
            
            # Parse the result
            if result and len(result) == 6:
                return {
                    "name": result[0],
                    "level_of_ownership": result[1],
                    "creator": result[2],
                    "creation_date": result[3],
                    "owner": result[4],
                    "hash_value": result[5].hex() if result[5] else None,
                }
            return None
        except Exception as e:
            print(f"Error getting NFT info: {e}")
            return None
    
    async def get_nft_events(self, owner_address: AccountAddress) -> List[Dict]:
        """Get NFT creation events for an address."""
        try:
            # Look for CreateEvent events
            events_path = f"{owner_address}/events/{self.contract_address}::NFT::NFTOwnership/create_events"
            events = await self.get_account_events(owner_address, events_path)
            
            return events
        except Exception as e:
            print(f"Error getting NFT events: {e}")
            return []
    
    async def get_owned_nfts(self, owner_address: AccountAddress) -> List[Dict]:
        """Get all NFTs owned by an address."""
        try:
            # This is a simplified implementation that only works if the NFTs were created by the owner
            # A more complete implementation would query events and filter by current owner
            events = await self.get_nft_events(owner_address)
            
            nfts = []
            for event in events:
                token_id = event["data"]["token_id"]
                nft_info = await self.get_nft_info(owner_address, token_id)
                if nft_info and nft_info["owner"] == str(owner_address):
                    nfts.append({
                        "token_id": token_id,
                        **nft_info
                    })
            
            return nfts
        except Exception as e:
            print(f"Error getting owned NFTs: {e}")
            return []
    
    # --- Check Access ---
    
    async def check_access(
        self, 
        owner_address: AccountAddress, 
        token_id: int, 
        user_address: AccountAddress, 
        required_access: int
    ) -> bool:
        """Check if a user has the required access level for an NFT."""
        try:
            result = await self.view_function(
                self.contract_address,
                "NFT",
                "check_minimum_access",
                [owner_address, token_id, user_address, required_access]
            )
            
            return bool(result[0]) if result else False
        except Exception as e:
            print(f"Error checking access: {e}")
            return False