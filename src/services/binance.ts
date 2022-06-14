import { BinanceChainWallet } from '@/types/binance';
import { BscConnector } from '@binance-chain/bsc-connector';
import { BncClient } from '@binance-chain/javascript-sdk';
import * as crypto from '@binance-chain/javascript-sdk/lib/crypto';

const SigningDelegate = (binanceChainWallet: any) =>
    async function (tx: any, signMsg: any) {
        // const sign = await binanceChainWallet.bnbSign(fromAddress, tx);
        // console.log(sign);

        const res = await binanceChainWallet.bbcSignTx({ tx: tx, signMsg: signMsg });
        const p = crypto.getPublicKey(res.pubKey);
        tx.addSignature(p, Buffer.from(res.signature, 'hex'));

        return tx;
    };

export const binanceClient = (async (binanceChainWallet: BinanceChainWallet): Promise<BncClient> => {
    console.log(binanceChainWallet);
    const client = new BncClient('https://dex.binance.org');
    client.chooseNetwork('mainnet');
    await client.initChain();
    client.useDefaultBroadcastDelegate();
    client.setSigningDelegate(SigningDelegate(binanceChainWallet));
    return client;
})(window.BinanceChain);

export const bscConnector = new BscConnector({
    supportedChainIds: [56, 97], // later on 1 ethereum mainnet and 3 ethereum ropsten will be supported
});
