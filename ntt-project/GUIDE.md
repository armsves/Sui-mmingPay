export SUI_PRIVATE_KEY=REPLACE_HERE

source .env && ntt add-chain Sui --latest --mode burning --token 0x25172c5f5f4ab0dab2da33d71013eafc44a37e171d18fec9c1598ca77859eda0::my_coin::MY_COIN --sui-treasury-cap 0xc5dfd5a792cd91062cbdff9895d191483e81c43b9c6ae802efcb58b06d9365c2
