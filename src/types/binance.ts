export type BinanceAddress = {
    type: string;
    address: string;
}

export type BinanceAccount = {
    id: string;
    name: string;
    type: string;
    icon: string;
    addresses: BinanceAddress[]
}

export type TransferFromResult = {
    code: number;
    hash: string;
    log: string;
    ok: boolean;
}

export type TransferFromResponse = {
    result: TransferFromResult[],
    status: number;
}

export type BinanceChainWallet = {
    bbcSignTx: (e: any) => {};
    bnbSign: (n: any, i: any) => {};
    chainId: string;
    delegate: (e: any) => {}
    enable: () => {}
    isConnected: () => {}
    on: (e: any, n: any) => {}
    redelegate: (n: any) => {}
    request: (e: any) => {}
    requestAccounts: () => {}
    requestAddresses: () => {}
    send: (e: any, n: any) => {}
    sendAsync: (e: any, n: any) => {}
    switchNetwork: (e: any) => {}
    transfer: (n: any) => {}
    undelegate: (n: any) => {}
}

export type FeeType = {
    msg_type: string;
    fee: number;
}
