#!/usr/bin/env python3

# Configuration settings for Aptos interactions
import os

# Network URLs
NODE_URL            = os.getenv("APTOS_NODE_URL", "https://fullnode.testnet.aptoslabs.com/v1")
FAUCET_URL          = os.getenv("APTOS_FAUCET_URL", "https://faucet.testnet.aptoslabs.com")
INDEXER_URL         = os.getenv("APTOS_INDEXER_URL", "https://indexer-testnet.aptoslabs.com/v1/graphql")

# Authentication token for faucet (if needed)
FAUCET_AUTH_TOKEN   = os.getenv("FAUCET_AUTH_TOKEN")

# Gas settings
MAX_GAS_AMOUNT      = 100000
GAS_UNIT_PRICE      = 100

# Contract name
CONTRACT_NAME       = "NeuralabsNFT"