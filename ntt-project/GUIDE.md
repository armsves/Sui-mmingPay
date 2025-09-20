# NTT Deployment Guide

## EVM Token Deployment

### Deploy Peer Token on Sepolia

```bash
# Navigate to token-evm directory
cd token-evm

# Deploy the token
source .env && forge create --broadcast --rpc-url https://1rpc.io/sepolia --private-key ${PRIVATE_KEY} src/PeerToken.sol:PeerToken --constructor-args "TestBurnToken" "TBT" ${DEPLOYER_ADDRESS} ${DEPLOYER_ADDRESS}
```

### Add Sepolia Chain Token to NTT

```bash
# Navigate to ntt-project directory
cd ntt-project

# Add Sepolia chain with burning mode
source .env && ntt add-chain Sepolia --latest --mode burning --token 0x74A786d6d0397B44d49F9feA1bcD9FC8286D9046
```

## Sui Token Deployment

### List Sui Keys

```bash
sui keytool list
```

```bash
sui client addresses
```

```bash
sui client remove-address 0x123
```

### new address

```bash
sui client new-address ed25519
```

### Switch Sui Address
```bash
sui client switch --address 0x6e0103f11615a9f3c7452ba1b341b083c56a0ac1bdc898798fb8ce424c4de9b8
```

fund it

### Deploy Token

```bash
sui client publish --gas-budget 20000000
```

### Mint Token

#### Generic Command
```bash
sui client call \
  --package YOUR_DEPLOYED_PACKAGE_ID_STEP4 \
  --module MODULE_NAME_STEP1 \
  --function mint \
  --args TREASURYCAP_ID_STEP4 AMOUNT_WITH_DECIMALS RECIPIENT_ADDRESS \
  --gas-budget 10000000
```

#### Specific Example
```bash
sui client call \
  --package 0xa6b1ccc3420deb74565a67da7a2d50c1c73d69332e71fd4fb9a168470504fd6d \
  --module my_coin \
  --function mint \
  --args 0xb1e4d3db43a003db80379bf99f633cfba516de33e9b12c373911a192014d67c7 135000000000 0x6e0103f11615a9f3c7452ba1b341b083c56a0ac1bdc898798fb8ce424c4de9b8 \
  --gas-budget 10000000
```

### Add Sui Chain to NTT

```bash
source .env && ntt add-chain Sui --latest --mode locking --token 0xa6b1ccc3420deb74565a67da7a2d50c1c73d69332e71fd4fb9a168470504fd6d::my_coin::MY_COIN
```

### Update deployment.json changes

ntt push

### Export Sui Private Key

```bash
# List addresses
sui client addresses

# Export private key
sui keytool export --key-identity 0xaf86f996ba905e168ab2c6ab15627a4d0f9bcf91a8ec915cdee3f506590fa59c

# Set environment variable
export SUI_PRIVATE_KEY=PASTE_HERE
```

## Additional Chain Configurations

### After Deploying EVM Token

```bash
# Add Base Sepolia
ntt add-chain BaseSepolia --latest --mode burning --token 0xB92D051039A6745916b32D9841f3A52D8AebAed8

# Add Sepolia
ntt add-chain Sepolia --latest --mode burning --token 0x528007Fab32134522c44757E31a6d22ba433b5a8
```


## split and merge coins

```bash
sui client objects
```

```bash
sui client split-coin --coin-id 0x1efb610a857107265ad41c461b236f87592bec3802b98fad401adff289b6747a --amounts 200000000 --gas-budget 5000000
```

```bash
sui client merge-coin --primary-coin <PRIMARY_COIN> --coin-to-merge <COIN_TO_MERGE>
```