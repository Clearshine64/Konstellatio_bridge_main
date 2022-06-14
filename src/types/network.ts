export type NetworkType = 'testnet' | 'mainnet';
export type TokenType = 'BEP-2' | 'BEP-20';

export type ExplorerOpts = {
    url: string;
    tx: string;
};

export type TokenOpts = {
    symbol: string;
    type: TokenType;
    name: string;
    contractAddr?: string;
    contractAbi?: any;
};

export type ApiOpts = {
    url: string;
    tx: string;
};

export class Network {
    addressType: string; // eth, bbc-testnet
    title: string; // Binance Chain Network (BEP2)
    name: string; // bsc-testnet
    type: NetworkType; // testnet
    chainId: string | number; // Binance-Chain-Ganges
    network: string; // bc/bsc
    icon: string; // /assets/img/bsc-logo.png
    explorerOpts: ExplorerOpts; //https://testnet.bscscan.com/tx/
    tokenOpts: TokenOpts;
    apiOpts?: ApiOpts;
    swapAddress?: string;

    constructor({
        network,
        name,
        type,
        addressType,
        chainId,
        title,
        icon,
        explorerOpts,
        tokenOpts,
        apiOpts,
        swapAddress,
    }: {
        network: string;
        name: string;
        type: NetworkType;
        addressType: string;
        chainId: string | number;
        title: string;
        icon: string;
        explorerOpts: ExplorerOpts;
        tokenOpts: TokenOpts;
        apiOpts?: ApiOpts;
        swapAddress?: string;
    }) {
        this.network = network;
        this.addressType = addressType;
        this.name = name;
        this.type = type;
        this.chainId = chainId;
        this.title = title;
        this.icon = icon;
        this.explorerOpts = explorerOpts;
        this.tokenOpts = tokenOpts;
        this.apiOpts = apiOpts;
        this.swapAddress = swapAddress;
    }

    getNetwork() {
        return this.network;
    }

    getAddressType() {
        return this.addressType;
    }

    getType() {
        return this.type;
    }

    getName() {
        return this.name;
    }

    getTitle() {
        return this.title;
    }

    getChainId() {
        return this.chainId;
    }

    getIcon() {
        return this.icon;
    }

    getExplorerUrl() {
        return this.explorerOpts.url;
    }

    getExplorerTxUrl() {
        return `${this.explorerOpts.url}${this.explorerOpts.tx}`;
    }

    getTokenSymbol() {
        return this.tokenOpts.symbol;
    }

    getTokenName() {
        return this.tokenOpts.name;
    }

    getTokenContractAbi() {
        return this.tokenOpts.contractAbi;
    }

    getTokenContractAddr() {
        return this.tokenOpts.contractAddr;
    }

    getApiUrl() {
        if (!this.apiOpts) {
            throw new Error('undefined api url');
        }

        return this.apiOpts.url;
    }

    getApiTxUrl(hash: string) {
        if (!this.apiOpts) {
            throw new Error('undefined api url');
        }
        return `${this.apiOpts.url}${this.apiOpts.tx}${hash}`;
    }

    getSwapAddress() {
        return this.swapAddress;
    }
}
