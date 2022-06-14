import { Network } from '@/types/network';
import { DARCAbi, DRCAbi } from '@/utils/abi';

class NetworkManager {
    networks: Network[];

    constructor() {
        this.networks = [];
    }

    registerNetwork(network: Network) {
        this.networks.push(network);
    }

    getNetworkByChainId(chainID: string | number): Network {
        const n = this.networks.find((n) => n.chainId == chainID);
        if (!n) {
            throw new Error('invalid chainId');
        }
        return n;
    }

    getNetworkName(network: string, type: string): string {
        return this.getNetwork(network, type).getName();
    }

    getNetwork(network: string, type: string): Network {
        const n = this.networks.find((n) => n.network === network && n.type === type);

        if (!n) {
            throw new Error('invalid network or type');
        }
        return n;
    }

    getSupportedNetworks(): Network[] {
        return this.networks;
    }
}

// Binance-Chain-Ganges => tesnet bc => bbc-testnet
// Binance-Chain-Tigris => mainnet bc => bbc-mainnet
// 0x61 // 97 => testnet bsc => bsc-testnet
// 0x38 // 56 => mainnet bsc => bsc-mainnet

const networkManager = (): NetworkManager => {
    const nm = new NetworkManager();
    nm.registerNetwork(
        new Network({
            network: 'bc',
            name: 'bbc-testnet',
            type: 'testnet',
            addressType: 'bbc-testnet',
            chainId: 'Binance-Chain-Ganges',
            title: 'Binance Chain Network (BEP2)',
            icon: 'img/bc-logo.svg',
            explorerOpts: {
                url: 'https://testnet-explorer.binance.org',
                tx: '/tx/',
            },
            tokenOpts: {
                symbol: 'DRC-F35',
                type: 'BEP-2',
                name: 'DRC',
            },
            apiOpts: {
                url: 'https://testnet-api.binance.org/bc',
                tx: '/api/v1/txs/',
            },
        }),
    );

    nm.registerNetwork(
        new Network({
            network: 'bc',
            name: 'bbc-mainnet',
            type: 'mainnet',
            addressType: 'bbc-mainnet',
            chainId: 'Binance-Chain-Tigris',
            title: 'Binance Chain Network (BEP2)',
            icon: 'img/bc-logo.svg',
            explorerOpts: {
                url: 'https://explorer.binance.org',
                tx: '/tx/',
            },
            tokenOpts: {
                symbol: 'DARC-087',
                type: 'BEP-2',
                name: 'DARC',
            },
            apiOpts: {
                url: 'https://api.binance.org/bc',
                tx: '/api/v1/txs/',
            },
        }),
    );
    nm.registerNetwork(
        new Network({
            network: 'bsc',
            name: 'bsc-testnet',
            type: 'testnet',
            addressType: 'eth',
            chainId: '0x61',
            title: 'Binance Smart Chain Network (BEP20)',
            icon: 'img/bsc-logo.svg',
            explorerOpts: {
                url: 'https://testnet.bscscan.com',
                tx: '/tx/',
            },
            tokenOpts: {
                symbol: 'DRC',
                name: 'DRC',
                type: 'BEP-20',
                contractAddr: '0x3d0d109bd52b499048dc9f49e700192cf08a2cff',
                contractAbi: DRCAbi,
            },
            swapAddress: '0x825e69c7eb4041437e1f0951aa50717b25de8ac2',
        }),
    );

    nm.registerNetwork(
        new Network({
            network: 'bsc',
            name: 'bsc-mainnet',
            type: 'mainnet',
            addressType: 'eth',
            chainId: '0x38',
            title: 'Binance Smart Chain Network (BEP20)',
            icon: 'img/bsc-logo.svg',
            explorerOpts: {
                url: 'https://bscscan.com',
                tx: '/tx/',
            },
            tokenOpts: {
                symbol: 'DARC',
                name: 'DARC',
                type: 'BEP-20',
                contractAddr: '0x8ebC361536094fD5B4FFB8521E31900614C9F55D',
                contractAbi: DARCAbi,
            },
            swapAddress: '0xefDCF1dB83896D3358c2e4B8243C0e82fBA5310d',
        }),
    );

    nm.registerNetwork(
        new Network({
            network: 'knstl',
            name: 'knstl-testnet',
            type: 'testnet',
            addressType: 'knstl',
            chainId: '0x38',
            title: 'Konstellation Network Token',
            icon: 'img/knstl-logo.svg',
            explorerOpts: {
                url: 'https://bscscan.com',
                tx: '/tx/',
            },
            tokenOpts: {
                symbol: 'DARC',
                name: 'DARC',
                type: 'BEP-20',
                contractAddr: '0x8ebC361536094fD5B4FFB8521E31900614C9F55D',
                contractAbi: DARCAbi,
            },
            swapAddress: 'darc1rzdt9wrzwv3x7vv6f7xpyaqqgf3lt6phptqtsx',
        }),
    );

    nm.registerNetwork(
        new Network({
            network: 'knstl',
            name: 'knstl-mainnet',
            type: 'mainnet',
            addressType: 'knstl',
            chainId: '0x38',
            title: 'Konstellation Network Token',
            icon: 'img/knstl-logo.svg',
            explorerOpts: {
                url: 'https://bscscan.com',
                tx: '/tx/',
            },
            tokenOpts: {
                symbol: 'DARC',
                name: 'DARC',
                type: 'BEP-20',
                contractAddr: '0x8ebC361536094fD5B4FFB8521E31900614C9F55D',
                contractAbi: DARCAbi,
            },
            swapAddress: 'darc1uvtq6gc6ptdlkln9neaqe63sptfddx2yqnsfrz',
        }),
    );

    return nm;
};

export default networkManager();
