# Aptos NFT Contract

This repository contains a Move implementation of an NFT contract for the Aptos blockchain, along with Python scripts for deployment and testing.

## Overview

This NFT contract implements:

- Creation and management of NFTs
- Granular access control with configurable permission levels
- Transfer and burning functionality
- Simple metadata including creation date and hash

## Project Structure

- **Move Contract**
  - `sources/NFTContract.move` - Main Move module for the NFT contract
  - `Move.toml` - Configuration file for the Aptos Move package

- **Python Scripts**
  - `common.py` - Common configuration and constants
  - `deploy.py` - Script to deploy the contract to Aptos testnet
  - `initialize_contract.py` - Script to initialize the deployed contract
  - `nft_client.py` - Python client for interacting with the NFT contract
  - `nft_operations.py` - Command-line interface for NFT operations
  - `run_tests.py` - Test suite for the NFT contract

## Access Levels

The NFT contract implements the following access levels:

- 0: None - No access
- 1: UseModel - Can use the model
- 2: Resale - Can resell the NFT
- 3: CreateReplica - Can create a replica of the NFT
- 4: ViewAndDownload - Can view and download the data and model
- 5: EditData - Can edit NFT metadata
- 6: AbsoluteOwnership - Full ownership with all privileges

## Prerequisites

1. **Aptos CLI**: Install the Aptos CLI following the [official documentation](https://aptos.dev/tools/aptos-cli/install/).

2. **Python 3.8+**: Install Python 3.8 or newer.

3. **Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Deployment Process

### 1. Deploy the Contract

```bash
python deploy.py
```

This script will:
- Create a new account if none exists
- Fund it from the testnet faucet
- Update the Move.toml file with your account address
- Compile and publish the Move package
- Save deployment info to `deployment_info.json`

### 2. Initialize the Contract

```bash
python initialize_contract.py
```

This script will:
- Initialize the NFT contract resources
- Verify initialization was successful
- Save initialization info to `initialization_info.json`

## NFT Operations

After deployment and initialization, you can use the `nft_operations.py` script to interact with your NFT contract:

### Create an NFT

```bash
python nft_operations.py create --name "My First NFT" --level 6
```

### List Your NFTs

```bash
python nft_operations.py list
```

### Get NFT Information

```bash
python nft_operations.py info --token 1
```

### Transfer an NFT

```bash
python nft_operations.py transfer --token 1 --to 0x123456789abcdef123456789abcdef
```

### Burn an NFT

```bash
python nft_operations.py burn --token 1
```

### Grant Access to an NFT

```bash
python nft_operations.py grant --token 1 --user 0x123456789abcdef123456789abcdef --level 4
```

### Revoke Access to an NFT

```bash
python nft_operations.py revoke --token 1 --user 0x123456789abcdef123456789abcdef
```

### Set Default Access Level

```bash
python nft_operations.py default --token 1 --level 2
```

## Running Tests

To verify that your NFT contract is working correctly, run the automated test suite:

```bash
python run_tests.py
```

This script will:
1. Create test accounts
2. Run through a series of operations (create, transfer, burn, etc.)
3. Verify that each operation succeeds
4. Save detailed test results to `test_results.json`

## Configuration

The scripts use environment variables for configuration:

- `APTOS_NODE_URL`: URL of the Aptos node (default: testnet)
- `APTOS_FAUCET_URL`: URL of the faucet service (default: testnet)
- `FAUCET_AUTH_TOKEN`: Authentication token for the faucet (if needed)

You can set these in your environment or modify them in `common.py`.

## Viewing on Aptos Explorer

After deploying and interacting with the contract, you can view your account and transactions on the Aptos Explorer:

[https://explorer.aptoslabs.com/?network=testnet](https://explorer.aptoslabs.com/?network=testnet)

## License

This project is licensed under the MIT License - see the LICENSE file for details.