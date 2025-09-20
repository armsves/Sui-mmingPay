# Token Setup Instructions

## 1. Create a new testnet environment and address

```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client new-address ed25519
sui client switch --address YOUR_ADDRESS
sui client faucet
sui client balance
```

## 2. Build and deploy your Move token contract

```bash
sui move build
sui client publish --gas-budget 10000000
```

## 3. Mint test tokens

Replace with your actual values:

```bash
sui client call \
  --package PACKAGE_ID \
  --module MODULE_NAME \
  --function mint \
  --args TREASURYCAP_ID AMOUNT_WITH_DECIMALS RECIPIENT_ADDRESS \
  --gas-budget 10000000
```