#!/usr/bin/env python3

import argparse
import asyncio
import json
import time
from typing import Dict, List, Optional

from aptos_sdk.account import Account
from aptos_sdk.account_address import AccountAddress
from aptos_sdk.async_client import ClientConfig, FaucetClient, RestClient

from common import FAUCET_AUTH_TOKEN, FAUCET_URL, MAX_GAS_AMOUNT, NODE_URL
from nft_client import NFTClient

async def load_account() -> Account:
    """Load the account used for deployment."""
    try:
        with open("account.json", "r") as f:
            account_data = json.load(f)
        
        private_key = bytes.fromhex(account_data["private_key"])
        account = Account.load_key(private_key)
        print(f"Loaded account: {account.address()}")
        return account
    except Exception as e:
        print(f"Error loading account: {e}")
        print("Make sure to run deploy.py first to create an account")
        exit(1)

class NFTOperations:
    """Class for performing NFT operations."""
    
    def __init__(self):
        """Initialize the NFT operations class."""
        self.account = None
        self.rest_client = None
        self.nft_client = None
        self.faucet_client = None
    
    async def initialize(self):
        """Initialize clients and load account."""
        # Load the deployment account
        self.account = await load_account()
        
        # Initialize REST client with higher gas limit
        client_config = ClientConfig()
        client_config.max_gas_amount = MAX_GAS_AMOUNT
        self.rest_client = RestClient(NODE_URL, client_config)
        
        # Initialize NFT client
        self.nft_client = NFTClient(NODE_URL, self.account.address())
        
        # Initialize faucet client
        self.faucet_client = FaucetClient(
            FAUCET_URL, self.rest_client, FAUCET_AUTH_TOKEN
        )
    
    async def create_test_account(self) -> Account:
        """Create and fund a test account."""
        test_account = Account.generate()
        print(f"Created test account: {test_account.address()}")
        
        await self.faucet_client.fund_account(test_account.address(), 10_000_000)
        print(f"Funded test account with 10 APT")
        
        return test_account
    
    async def create_nft(self, name: str, level: int) -> Optional[int]:
        """Create a new NFT."""
        print(f"Creating NFT: {name} with ownership level {level}...")
        
        try:
            txn_hash = await self.nft_client.create_nft(self.account, name, level)
            print(f"Transaction submitted: {txn_hash}")
            
            await self.rest_client.wait_for_transaction(txn_hash)
            print("NFT created successfully!")
            
            # Try to extract token ID from events
            token_id = await self.get_token_id_from_tx(txn_hash)
            if token_id is not None:
                print(f"Created NFT with token ID: {token_id}")
                return token_id
            else:
                # If we couldn't get the token ID directly, get the most recent NFT
                nfts = await self.list_nfts()
                if nfts:
                    latest_nft = max(nfts, key=lambda n: n["token_id"])
                    print(f"Latest NFT has token ID: {latest_nft['token_id']}")
                    return latest_nft["token_id"]
                    
            return None
        except Exception as e:
            print(f"Error creating NFT: {e}")
            return None
    
    async def transfer_nft(self, token_id: int, recipient_address: str) -> bool:
        """Transfer an NFT to another address."""
        print(f"Transferring NFT with ID {token_id} to {recipient_address}...")
        
        try:
            recipient = AccountAddress.from_str(recipient_address)
            txn_hash = await self.nft_client.transfer_nft(self.account, recipient, token_id)
            print(f"Transaction submitted: {txn_hash}")
            
            await self.rest_client.wait_for_transaction(txn_hash)
            print("NFT transferred successfully!")
            return True
        except Exception as e:
            print(f"Error transferring NFT: {e}")
            return False
    
    async def burn_nft(self, token_id: int) -> bool:
        """Burn (delete) an NFT."""
        print(f"Burning NFT with ID {token_id}...")
        
        try:
            txn_hash = await self.nft_client.burn_nft(self.account, token_id)
            print(f"Transaction submitted: {txn_hash}")
            
            await self.rest_client.wait_for_transaction(txn_hash)
            print("NFT burned successfully!")
            return True
        except Exception as e:
            print(f"Error burning NFT: {e}")
            return False
    
    async def grant_access(self, token_id: int, user_address: str, access_level: int) -> bool:
        """Grant access to an NFT for a user."""
        print(f"Granting access level {access_level} for NFT {token_id} to {user_address}...")
        
        try:
            user = AccountAddress.from_str(user_address)
            txn_hash = await self.nft_client.grant_access(self.account, token_id, user, access_level)
            print(f"Transaction submitted: {txn_hash}")
            
            await self.rest_client.wait_for_transaction(txn_hash)
            print("Access granted successfully!")
            return True
        except Exception as e:
            print(f"Error granting access: {e}")
            return False
    
    async def revoke_access(self, token_id: int, user_address: str) -> bool:
        """Revoke access to an NFT for a user."""
        print(f"Revoking access for NFT {token_id} from {user_address}...")
        
        try:
            user = AccountAddress.from_str(user_address)
            txn_hash = await self.nft_client.revoke_access(self.account, token_id, user)
            print(f"Transaction submitted: {txn_hash}")
            
            await self.rest_client.wait_for_transaction(txn_hash)
            print("Access revoked successfully!")
            return True
        except Exception as e:
            print(f"Error revoking access: {e}")
            return False
    
    async def set_default_access_level(self, token_id: int, access_level: int) -> bool:
        """Set the default access level for an NFT."""
        print(f"Setting default access level {access_level} for NFT {token_id}...")
        
        try:
            txn_hash = await self.nft_client.set_default_access_level(self.account, token_id, access_level)
            print(f"Transaction submitted: {txn_hash}")
            
            await self.rest_client.wait_for_transaction(txn_hash)
            print("Default access level set successfully!")
            return True
        except Exception as e:
            print(f"Error setting default access level: {e}")
            return False
    
    async def get_token_id_from_tx(self, txn_hash: str) -> Optional[int]:
        """Try to extract the token ID from a create NFT transaction."""
        try:
            transaction = await self.rest_client.transaction(txn_hash)
            for event in transaction.get("events", []):
                if event["type"].endswith("::NFT::CreateEvent"):
                    return int(event["data"]["token_id"])
            
            print("Could not find token ID in transaction events")
            return None
        except Exception as e:
            print(f"Error extracting token ID: {e}")
            return None
    
    async def list_nfts(self) -> List[Dict]:
        """List all NFTs owned by the account."""
        print("Listing NFTs owned by this account...")
        
        try:
            nfts = await self.nft_client.get_owned_nfts(self.account.address())
            
            if nfts:
                print(f"Found {len(nfts)} NFTs:")
                for nft in nfts:
                    print(f"  Token ID: {nft['token_id']}, Name: {nft['name']}")
            else:
                print("No NFTs found")
            
            return nfts
        except Exception as e:
            print(f"Error listing NFTs: {e}")
            return []
    
    async def get_nft_info(self, token_id: int) -> Optional[Dict]:
        """Get information about an NFT."""
        try:
            nft_info = await self.nft_client.get_nft_info(self.account.address(), token_id)
            
            if nft_info:
                print(f"NFT {token_id} info:")
                for key, value in nft_info.items():
                    print(f"  {key}: {value}")
                return nft_info
            else:
                print(f"NFT with ID {token_id} not found")
                return None
        except Exception as e:
            print(f"Error getting NFT info: {e}")
            return None
    
    async def close(self):
        """Close client connections."""
        if self.rest_client:
            await self.rest_client.close()

async def main():
    """Main function to handle NFT operations."""
    parser = argparse.ArgumentParser(description="NFT Operations")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # Create NFT
    create_parser = subparsers.add_parser("create", help="Create a new NFT")
    create_parser.add_argument("--name", required=True, help="Name of the NFT")
    create_parser.add_argument("--level", type=int, default=6, help="Level of ownership (1-6)")
    
    # Transfer NFT
    transfer_parser = subparsers.add_parser("transfer", help="Transfer an NFT")
    transfer_parser.add_argument("--token", type=int, required=True, help="Token ID")
    transfer_parser.add_argument("--to", required=True, help="Recipient address")
    
    # Burn NFT
    burn_parser = subparsers.add_parser("burn", help="Burn an NFT")
    burn_parser.add_argument("--token", type=int, required=True, help="Token ID")
    
    # Grant access
    grant_parser = subparsers.add_parser("grant", help="Grant access to an NFT")
    grant_parser.add_argument("--token", type=int, required=True, help="Token ID")
    grant_parser.add_argument("--user", required=True, help="User address")
    grant_parser.add_argument("--level", type=int, required=True, help="Access level (1-6)")
    
    # Revoke access
    revoke_parser = subparsers.add_parser("revoke", help="Revoke access to an NFT")
    revoke_parser.add_argument("--token", type=int, required=True, help="Token ID")
    revoke_parser.add_argument("--user", required=True, help="User address")
    
    # Set default access
    default_parser = subparsers.add_parser("default", help="Set default access level")
    default_parser.add_argument("--token", type=int, required=True, help="Token ID")
    default_parser.add_argument("--level", type=int, required=True, help="Access level (1-6)")
    
    # List NFTs
    subparsers.add_parser("list", help="List NFTs owned by this account")
    
    # Get NFT info
    info_parser = subparsers.add_parser("info", help="Get information about an NFT")
    info_parser.add_argument("--token", type=int, required=True, help="Token ID")
    
    args = parser.parse_args()
    
    # Initialize NFT operations
    nft_ops = NFTOperations()
    await nft_ops.initialize()
    
    try:
        # Execute command
        if args.command == "create":
            await nft_ops.create_nft(args.name, args.level)
        elif args.command == "transfer":
            await nft_ops.transfer_nft(args.token, args.to)
        elif args.command == "burn":
            await nft_ops.burn_nft(args.token)
        elif args.command == "grant":
            await nft_ops.grant_access(args.token, args.user, args.level)
        elif args.command == "revoke":
            await nft_ops.revoke_access(args.token, args.user)
        elif args.command == "default":
            await nft_ops.set_default_access_level(args.token, args.level)
        elif args.command == "list":
            await nft_ops.list_nfts()
        elif args.command == "info":
            await nft_ops.get_nft_info(args.token)
        else:
            parser.print_help()
    finally:
        # Clean up resources
        await nft_ops.close()

if __name__ == "__main__":
    asyncio.run(main())