#!/usr/bin/env python3

import asyncio
import json
import time
from typing import Optional

from aptos_sdk.account import Account
from aptos_sdk.async_client import ClientConfig, RestClient
from aptos_sdk.transactions import EntryFunction, TransactionPayload

from common import MAX_GAS_AMOUNT, NODE_URL

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

async def initialize_contract(rest_client: RestClient, account: Account) -> Optional[str]:
    """Initialize the NFT contract."""
    print("Initializing NFT contract...")
    
    module_address = account.address()
    
    # Create the transaction payload for initialization
    payload = TransactionPayload(
        EntryFunction.natural(
            f"{module_address}::NFT",
            "initialize",
            [],  # Type arguments
            []   # Arguments
        )
    )
    
    try:
        # Submit the transaction
        signed_transaction = await rest_client.create_bcs_signed_transaction(account, payload)
        txn_hash = await rest_client.submit_bcs_transaction(signed_transaction)
        
        print(f"Transaction submitted: {txn_hash}")
        await rest_client.wait_for_transaction(txn_hash)
        
        # Check transaction status
        transaction = await rest_client.transaction(txn_hash)
        if transaction["success"]:
            print("Contract initialized successfully!")
            return txn_hash
        else:
            print(f"Contract initialization failed: {transaction.get('vm_status', 'Unknown error')}")
            return None
    except Exception as e:
        print(f"Error initializing contract: {e}")
        return None

async def verify_initialization(rest_client: RestClient, account: Account) -> bool:
    """Verify the contract was initialized by checking for resources."""
    print("Verifying contract initialization...")
    
    try:
        account_resources = await rest_client.account_resources(account.address())
        
        # Look for the NFTOwnership and NFTAccess resources
        nft_ownership = next((
            r for r in account_resources 
            if r["type"].endswith("::NFT::NFTOwnership")
        ), None)
        
        nft_access = next((
            r for r in account_resources 
            if r["type"].endswith("::NFT::NFTAccess")
        ), None)
        
        if nft_ownership and nft_access:
            print("Contract initialization verified!")
            print("Found NFTOwnership and NFTAccess resources")
            return True
        else:
            print("Contract initialization could not be verified")
            print("Resources not found on the account")
            return False
    except Exception as e:
        print(f"Error verifying initialization: {e}")
        return False

async def main():
    """Main function to initialize the contract."""
    print("Starting NFT contract initialization...")
    
    # Load account from deployment
    account = await load_account()
    
    # Initialize REST client with higher gas limit
    client_config = ClientConfig()
    client_config.max_gas_amount = MAX_GAS_AMOUNT
    rest_client = RestClient(NODE_URL, client_config)
    
    # Initialize the contract
    txn_hash = await initialize_contract(rest_client, account)
    if txn_hash:
        # Verify initialization
        time.sleep(2)  # Wait a moment for the blockchain to process
        success = await verify_initialization(rest_client, account)
        
        # Save initialization info
        with open("initialization_info.json", "w") as f:
            json.dump({
                "address": str(account.address()),
                "transaction_hash": txn_hash,
                "initialization_time": time.strftime("%Y-%m-%d %H:%M:%S"),
                "success": success
            }, f, indent=2)
    
    print(f"Initialization process complete!")
    print(f"You can view your account at: https://explorer.aptoslabs.com/account/{account.address()}?network=testnet")
    
    # Close the client connection
    await rest_client.close()

if __name__ == "__main__":
    asyncio.run(main())