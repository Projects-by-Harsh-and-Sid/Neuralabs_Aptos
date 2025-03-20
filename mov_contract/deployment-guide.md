# Aptos NFT Contract Deployment Guide

This guide will walk you through deploying the NFT contract to Aptos testnet.

## Prerequisites

1. Install the Aptos CLI
   ```bash
   curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
   ```

2. Verify installation
   ```bash
   aptos --version
   ```

3. Set up an Aptos account and fund it with testnet tokens
   ```bash
   aptos init --network testnet
   ```
   This will create a `.aptos` folder in your home directory with your account configuration.

4. Request testnet tokens from the Aptos Faucet:
   - Visit [https://aptoslabs.com/testnet-faucet](https://aptoslabs.com/testnet-faucet)
   - Enter your wallet address (you can find it in `~/.aptos/config.yaml`)
   - Request tokens

## Project Setup

1. Create a new directory for your project
   ```bash
   mkdir aptos-nft-project
   cd aptos-nft-project
   ```

2. Create the Move module structure
   ```bash
   mkdir -p sources
   ```

3. Create the Move.toml file in the root directory
   ```bash
   # Copy the Move.toml content from the artifact
   ```

4. Create the NFTContract.move file in the sources directory
   ```bash
   # Copy the NFTContract.move content from the artifact to sources/NFTContract.move
   ```

## Compiling and Publishing

1. Update the Move.toml file with your account address
   ```bash
   # Find your account address
   aptos config show-profiles --profile default

   # Replace "_" in Move.toml with your account address
   # For example: NFTContract = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
   ```

2. Compile the module
   ```bash
   aptos move compile
   ```

3. Publish the module to testnet
   ```bash
   aptos move publish --named-addresses NFTContract=$(aptos config show-profiles --profile default | grep 'account:' | awk '{print $2}')
   ```

4. Verify the module was published successfully
   ```bash
   aptos account list --query modules
   ```

## Interacting with the Contract

1. Initialize the module
   ```bash
   aptos move run \
     --function-id $(aptos config show-profiles --profile default | grep 'account:' | awk '{print $2}')::NFT::initialize
   ```

2. Create an NFT
   ```bash
   aptos move run \
     --function-id $(aptos config show-profiles --profile default | grep 'account:' | awk '{print $2}')::NFT::create_nft \
     --args string:"My First NFT" u8:6
   ```

3. Transfer an NFT (replace with recipient address and token ID)
   ```bash
   aptos move run \
     --function-id $(aptos config show-profiles --profile default | grep 'account:' | awk '{print $2}')::NFT::transfer_nft \
     --args address:0x123456789... u64:1
   ```

4. Burn an NFT (replace with token ID)
   ```bash
   aptos move run \
     --function-id $(aptos config show-profiles --profile default | grep 'account:' | awk '{print $2}')::NFT::burn_nft \
     --args u64:1
   ```

5. Grant access to an NFT (replace with token ID, user address, and access level)
   ```bash
   aptos move run \
     --function-id $(aptos config show-profiles --profile default | grep 'account:' | awk '{print $2}')::NFT::grant_access \
     --args u64:1 address:0x123456789... u8:4
   ```

6. Set default access level for an NFT (replace with token ID and access level)
   ```bash
   aptos move run \
     --function-id $(aptos config show-profiles --profile default | grep 'account:' | awk '{print $2}')::NFT::set_default_access_level \
     --args u64:1 u8:1
   ```

## Viewing NFT Information

You can view NFT information using the Aptos Explorer:

1. Visit [https://explorer.aptoslabs.com/?network=testnet](https://explorer.aptoslabs.com/?network=testnet)
2. Search for your account address
3. Navigate to the Resources tab to see your NFT data

## Access Levels

The NFT contract uses the following access levels:

- 0: None - No access
- 1: UseModel - Can use the model
- 2: Resale - Can resell the NFT
- 3: CreateReplica - Can create a replica of the NFT
- 4: ViewAndDownload - Can view and download the data and model
- 5: EditData - Can edit NFT metadata
- 6: AbsoluteOwnership - Full ownership with all privileges

## Troubleshooting

- If you encounter issues with gas fees, try adding `--max-gas 10000` to your commands
- If a transaction fails, check the error message for details about what went wrong
- You can verify your account has sufficient funds with `aptos account list`
- To view transaction details: `aptos transaction show --txn-hash <TRANSACTION_HASH>`

## Additional Resources

- [Aptos Documentation](https://aptos.dev/)
- [Move Language Book](https://move-language.github.io/move/)
- [Aptos CLI Reference](https://aptos.dev/cli-tools/aptos-cli-tool/use-aptos-cli/)
- [Aptos Explorer](https://explorer.aptoslabs.com/?network=testnet)
- [Aptos Discord Community](https://discord.gg/aptoslabs)