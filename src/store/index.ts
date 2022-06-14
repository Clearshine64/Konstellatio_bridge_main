import { TokenHubAddr } from '@/const/bsc';
import { BC, BSC, KNSTL } from '@/const/networks';
import { binanceClient, bscConnector } from '@/services/binance';
import networkManager from '@/services/network';
import { BinanceAccount, BinanceAddress, FeeType, TransferFromResponse } from '@/types/binance';
import { Network, NetworkType } from '@/types/network';
import { TxStatus } from '@/types/tx';
import { TokenHubAbi } from '@/utils/abi';
import { delay } from '@/utils/delay';
import post from '@/utils/request/post';
import get from '@/utils/request/get';
import axios from 'axios';
import { bech32 } from 'bech32';
import { ethers, BigNumber } from 'ethers';

import { createStore } from 'vuex';

// const apiUrl = 'http://goz.konstellation.tech:1489';
const apiUrl = 'https://portal.konstellation.tech:1489';

const DECIMALS = 18;

declare global {
    interface Window {
        BinanceChain: any;
    }
}

type SwapForm = {
    amount: number;
    source: string;
    destination: string;
};

type StoreState = {
    account?: BinanceAccount;
    account_id: string;
    accounts: [];
    formStep: number;
    connectPopup: boolean;
    confirmSwap: boolean;
    networkType: NetworkType;
    form: SwapForm;
    processing: boolean;
    selectedNetwork: Network;
    sourceNetwork: Network;
    destinationNetwork: Network;
    sourceProcessing: boolean;
    destinationProcessing: boolean;
    sourceTxStatus: TxStatus;
    destinationTxStatus: TxStatus;
    sourceNetworkHash: string;
    destinationNetworkHash: string;
    activeTooltip: boolean;
    tooltipMessage: string;
    txId: string;
};

export default createStore<StoreState>({
    state: {
        account: undefined,
        account_id: '',
        accounts: [],
        formStep: 0,
        connectPopup: false,
        confirmSwap: false,
        networkType: 'mainnet',
        form: {
            amount: 0,
            source: '',
            destination: '',
        },
        processing: false,
        sourceNetwork: networkManager.getNetwork(BSC, 'mainnet'),
        selectedNetwork: networkManager.getNetwork(BSC, 'mainnet'),
        destinationNetwork: networkManager.getNetwork(KNSTL, 'mainnet'),
        sourceProcessing: false,
        destinationProcessing: false,
        sourceTxStatus: 'pending',
        destinationTxStatus: 'not started',
        sourceNetworkHash: '',
        destinationNetworkHash: '',
        activeTooltip: false,
        tooltipMessage: '',
        txId: '',
    },
    getters: {
        accountAddress: (state) => {
            if (!state.account) {
                return '';
            }

            const address = state.account.addresses.find(
                (addr) => addr.type === state.selectedNetwork.getAddressType(),
            );
            if (!address) {
                return '';
            }

            return address.address;
        },
    },
    mutations: {
        setAccount: (state, account) => {
            state.account = account;
            state.account_id = account.id;
        },
        setTxId: (state, id) => {
            state.txId = id;
        },
        setFormStep: (state, step) => {
            state.formStep = step;
        },
        setAccounts: (state, accounts) => {
            state.accounts = accounts;
        },
        setConnectPopup: (state, value) => {
            state.connectPopup = value;
        },
        setConfirmSwap: (state, value) => {
            state.confirmSwap = value;
        },
        setForm: (state, payload) => {
            state.form = { ...state.form, ...payload };
        },
        setNetworkType: (state, type: NetworkType) => {
            state.networkType = type;
        },
        setNetwork: (state, network: Network) => {
            state.selectedNetwork = network;
        },
        setSourceNetwork: (state, network: Network) => {
            state.sourceNetwork = network;
        },
        setDestinationNetwork: (state, network: Network) => {
            state.destinationNetwork = network;
        },
        setProcessing: (state, value) => {
            state.processing = value;
        },
        setSourceProcessing: (state, value) => {
            state.sourceProcessing = value;
        },
        setDestinationProcessing: (state, value) => {
            state.destinationProcessing = value;
        },
        setSourceTxStatus: (state, status: TxStatus) => {
            state.sourceTxStatus = status;
        },
        setDestinationTxStatus: (state, status: TxStatus) => {
            state.destinationTxStatus = status;
        },
        setSourceNetworkHash: (state, hash) => {
            state.sourceNetworkHash = hash;
        },
        setDestinationNetworkHash: (state, hash) => {
            state.destinationNetworkHash = hash;
        },
        setActiveTooltip: (state, value) => {
            state.activeTooltip = value;
        },
        setTooltipMessage: (state, msg) => {
            state.tooltipMessage = msg;
        },
    },
    actions: {
        activateTooltip: ({ state, commit, dispatch }, msg: string) => {
            commit('setTooltipMessage', msg);
            commit('setActiveTooltip', true);
            setTimeout(() => {
                dispatch('deactivateTooltip');
            }, 10000);
        },
        deactivateTooltip: ({ state, commit }) => {
            commit('setActiveTooltip', false);
            setTimeout(() => {
                commit('setTooltipMessage', '');
            }, 3000);
        },
        switchNetwork: async ({ state, commit }, network: Network) => {
            commit('setNetworkType', network.getType());
            commit('setNetwork', network);
        },
        changeChainId: async ({ dispatch }, chainId) => {
            const net = networkManager.getNetworkByChainId(chainId);
            dispatch('switchNetwork', net);
        },
        switchNetworkType: async ({ state, dispatch }, type: string) => {
            const net = state.selectedNetwork.getNetwork();
            const newNetwork = networkManager.getNetwork(net, type);

            await window.BinanceChain.switchNetwork(newNetwork.getName());
        },
        changeSourceNetwork: async ({ dispatch, state, commit }, net: string) => {
            const type = state.selectedNetwork.getType();
            const newNetwork = networkManager.getNetwork(net, type);
            if (net !== 'knstl') await window.BinanceChain.switchNetwork(newNetwork.getName());
            commit('setSourceNetwork', newNetwork);
        },
        changeDestinationNetwork: async ({ dispatch, state, commit }, net: string) => {
            const type = state.selectedNetwork.getType();
            const newNetwork = networkManager.getNetwork(net, type);

            commit('setDestinationNetwork', newNetwork);
        },
        connectBinance: async ({ commit }) => {
            const selectedAccount = await bscConnector.getAccount();
            const bcw = await bscConnector.getProvider();
            const accs = await bcw.requestAccounts();
            const acc = accs.find((acc: BinanceAccount) =>
                acc.addresses.find((addr: BinanceAddress) => addr.address === selectedAccount),
            );
            commit('setAccount', acc);
        },
        getFee: async ({ dispatch }, { source, hash }) => {
            if (source === 'bc') {
                // return dispatch('estimateFeeBc');
                // } else if (source === 'bsc' && destination === 'bc') {
                //     return dispatch('estimateFeeBsc');
            }
            // const tx = await axios.get(source.getApiTxUrl(hash)).then(({ data }) => data);
            // console.log(tx);

            return 0.020075;
        },
        estimateFee: async ({ dispatch }, { source, destination }) => {
            if (source === 'bc' && destination === 'bsc') {
                return dispatch('estimateFeeBc');
            } else if (source === 'bsc') {
                return dispatch('estimateFeeBsc');
            }
        },
        estimateFeeBc: async ({ state }) => {
            let feeUrl = 'https://dex.binance.org/api/v1/fees';
            if (state.selectedNetwork.getType() === 'testnet') {
                feeUrl = 'https://testnet-dex.binance.org/api/v1/fees';
            }
            const fees = await axios.get(feeUrl).then(({ data }) => data);
            const crossTfOutRelayFee = fees.find((fee: FeeType) => fee.msg_type === 'crossTransferOutRelayFee')?.fee;
            const crossTfOut = fees.find((fee: FeeType) => fee.msg_type === 'crossTransferOut')?.fee;
            return ((crossTfOut || 0) + (crossTfOutRelayFee || 0)) / 10 ** 8;
        },
        estimateFeeBsc: async () => {
            return 0.01;
        },
        transfer: ({ dispatch }, { source, destination }) => {
            if (source === 'bc' && destination === 'bsc') {
                dispatch('transferFromBc2Bsc');
            } else if (source === 'bsc' && destination === 'bc') {
                dispatch('transferFromBsc2Bc');
            } else if (source === 'bsc' && destination === 'knstl') {
                dispatch('transferFromBsc2Kn');
            } else if (source === 'knstl' && destination === 'bsc') {
                dispatch('transferFromKn2Bsc');
            }
        },
        transferFromBc2Bsc: async ({ commit, state, dispatch }) => {
            try {
                if (!state.account) {
                    return;
                }
                commit('setProcessing', true);
                commit('setSourceProcessing', true);
                commit('setSourceTxStatus', 'processing');
                commit('setDestinationTxStatus', 'not started');

                const fromAddress = state.account.addresses.find(
                    (address) => address.type === state.selectedNetwork.getAddressType(),
                )?.address;

                if (!fromAddress) {
                    commit('setProcessing', false);
                    commit('setSourceProcessing', false);
                    commit('setSourceTxStatus', 'failed');
                    // commit('setDestinationTxStatus', 'not started');
                    return;
                }

                const client = await binanceClient;
                const expireTime = Number((Date.now() / 1000).toFixed()) + 1000;

                const res: TransferFromResponse = await client.bridge.transferFromBcToBsc({
                    toAddress: state.form.destination, //0xd5B86f455b54387361379e2e28f854aA2F23ac4B
                    symbol: state.selectedNetwork.getTokenSymbol(),
                    fromAddress,
                    amount: state.form.amount,
                    expireTime,
                });
                console.log('🚀 ~ file: index.ts ~ line 277 ~ transferFromBc2Bsc: ~ transferFromBcToBsc', {
                    toAddress: state.form.destination, //0xd5B86f455b54387361379e2e28f854aA2F23ac4B
                    symbol: state.selectedNetwork.getTokenSymbol(),
                    fromAddress,
                    amount: state.form.amount,
                    expireTime,
                });

                if (!res.result[0].hash) {
                    commit('setProcessing', false);
                    commit('setSourceProcessing', false);
                    commit('setSourceTxStatus', 'failed');
                    // commit('setDestinationTxStatus', 'not started');
                    return;
                }

                commit('setSourceNetworkHash', res.result[0].hash);
                // commit('setSourceNetworkHash', 'FFC16486149843655300F41E2061D67E0EA6E8D747CFE406A75AD7B639488BBF');

                // const r = await get('https://testnet-explorer.binance.org/api/v1/cross-chain/tx/63E91ECE57F2A4A4D978D03959790ED0095D7F65A3069E851D258385AF94A386undefined');
                //
                // console.log(r);

                commit('setFormStep', 1);
                commit('setConfirmSwap', false);
                commit('setProcessing', false);
                commit('setSourceTxStatus', 'success');
                // commit('setDestinationProcessing', true);
                // commit('setDestinationTxStatus', 'processing');
                // await delay(2000);
                // https://testnet-explorer.binance.org/api/v1/cross-chain/tx/63E91ECE57F2A4A4D978D03959790ED0095D7F65A3069E851D258385AF94A386
                // commit('setDestinationNetworkHash', 'FFC16486149843655300F41E2061D67E0EA6E8D747CFE406A75AD7B639488BBF');
                // commit('setDestinationTxStatus', 'success');
            } catch (err) {
                console.error(err);
                let errMsg = 'Failed to initiate BC->BSC swap';
                if (err.message !== undefined && err.message.length > 0) {
                    errMsg += ': ' + err.message;
                }
                dispatch('activateTooltip', errMsg);
                commit('setConfirmSwap', false);
                commit('setProcessing', false);
            }
        },
        transferFromBsc2Bc: async ({ commit, state, dispatch }) => {
            try {
                if (!state.account) {
                    return;
                }

                commit('setProcessing', true);
                commit('setSourceProcessing', true);
                commit('setSourceTxStatus', 'processing');
                commit('setDestinationTxStatus', 'not started');

                const fromAddress = state.account.addresses.find(
                    (address) => address.type === state.selectedNetwork.getAddressType(),
                )?.address;

                if (!fromAddress) {
                    commit('setProcessing', false);
                    commit('setSourceProcessing', false);
                    commit('setSourceTxStatus', 'failed');
                    // commit('setDestinationTxStatus', 'not started');
                }

                // tbnb10ukz2hq0hc69tmaswl7s33sd8ucex6zpg9rucf

                const expireTime = Number((Date.now() / 1000).toFixed()) + 1000;
                const to = bech32.decode(state.form.destination);
                const toAddr = Buffer.from(bech32.fromWords(to.words)).toString('hex');

                // const tokenHubDecoder = new InputDataDecoder(abi);
                // const bep20Decoder = new InputDataDecoder(abi2);
                const bep20token = new ethers.utils.Interface(state.selectedNetwork.getTokenContractAbi());
                const tokenHub = new ethers.utils.Interface(TokenHubAbi);

                const encodedApproveData = bep20token.encodeFunctionData('approve', [
                    TokenHubAddr,
                    String(state.form.amount).includes('.')
                        ? BigNumber.from(String(state.form.amount * 10 ** DECIMALS))
                        : BigNumber.from(
                              String(state.form.amount).padEnd(String(state.form.amount).length + DECIMALS, '0'),
                          ),
                ]);

                await window.BinanceChain.request({
                    jsonrpc: '2.0',
                    method: 'eth_sendTransaction',
                    params: [
                        {
                            to: state.selectedNetwork.getTokenContractAddr(),
                            data: encodedApproveData,
                            value: '0x0',
                            from: fromAddress,
                            // from: state.account?.addresses[2].address,
                        },
                    ],
                    id: 2,
                });

                await delay(4000);

                const encodedAllowanceData = bep20token.encodeFunctionData('allowance', [fromAddress, TokenHubAddr]);
                const checkAllowanceResult = await window.BinanceChain.request({
                    jsonrpc: '2.0',
                    method: 'eth_call',
                    params: [
                        {
                            to: state.selectedNetwork.getTokenContractAddr(),
                            data: encodedAllowanceData,
                            from: fromAddress,
                        },
                        'latest',
                    ],
                    id: 2,
                });
                const encodedTransferOutData = tokenHub.encodeFunctionData('transferOut', [
                    state.selectedNetwork.getTokenContractAddr(),
                    `0x${toAddr}`,
                    String(state.form.amount).includes('.')
                        ? BigNumber.from(String(state.form.amount * 10 ** DECIMALS))
                        : BigNumber.from(
                              String(state.form.amount).padEnd(String(state.form.amount).length + DECIMALS, '0'),
                          ),
                    expireTime,
                ]);
                const transferOutResult = await window.BinanceChain.request({
                    jsonrpc: '2.0',
                    method: 'eth_sendTransaction',
                    params: [
                        {
                            to: TokenHubAddr,
                            data: encodedTransferOutData,
                            value: '0x2386f26fc10000', // 0.01 BNB
                            from: fromAddress,
                        },
                    ],
                    id: 2,
                });

                commit('setFormStep', 1);
                commit('setConfirmSwap', false);
                commit('setProcessing', false);
                commit('setSourceTxStatus', 'success');
                commit('setSourceNetworkHash', transferOutResult);
            } catch (err) {
                console.error(err);
                let errMsg = 'Failed to initiate BSC->BC swap';
                if (err.message !== undefined && err.message.length > 0) {
                    errMsg += ': ' + err.message;
                }
                dispatch('activateTooltip', errMsg);
                commit('setConfirmSwap', false);
                commit('setProcessing', false);
            }
        },

        transferFromKn2Bsc: async ({ commit, state, dispatch }) => {
            commit('setProcessing', true);
            commit('setSourceProcessing', true);
            commit('setSourceTxStatus', 'processing');
            commit('setDestinationTxStatus', 'pending');

            const data = {
                from_address: state.form.source,
                to_address: state.form.destination,
                from_network: 'knstl',
                to_network: 'bsc',
                amount: state.form.amount,
            };
            const res = await post(`${apiUrl}/tx`, { data });

            if (!res.success) {
                console.error(res);
                let errMsg = 'Failed to initiate KNSTL->BSC swap';
                if (res.result !== undefined && res.result.length > 0) {
                    errMsg += ': ' + res.result;
                }
                dispatch('activateTooltip', errMsg);
                commit('setConfirmSwap', false);
                commit('setProcessing', false);
                commit('setDestinationTxStatus', 'not started');
                throw new Error(errMsg);
            }

            commit('setTxId', res.result.ID);

            commit('setFormStep', 0.5);
            commit('setConfirmSwap', false);
            commit('setProcessing', false);

            dispatch('checkBscKnHash');
        },

        transferFromBsc2Kn: async ({ commit, state, dispatch }) => {
            commit('setProcessing', true);
            commit('setSourceProcessing', true);
            commit('setSourceTxStatus', 'processing');
            commit('setDestinationTxStatus', 'pending');

            const fromAddress = state.account?.addresses.find(
                (address) => address.type === state.selectedNetwork.getAddressType(),
            )?.address;

            const data = {
                from_address: fromAddress,
                to_address: state.form.destination,
                from_network: 'bsc',
                to_network: 'knstl',
                amount: state.form.amount,
            };
            const res = await post(`${apiUrl}/tx`, { data });

            if (!res.success) {
                console.error(res);
                let errMsg = 'Failed to initiate BSC->KNSTL swap';
                if (res.result !== undefined && res.result.length > 0) {
                    errMsg += ': ' + res.result;
                }
                dispatch('activateTooltip', errMsg);
                commit('setConfirmSwap', false);
                commit('setProcessing', false);
                commit('setDestinationTxStatus', 'not started');
                throw new Error(errMsg);
            }

            commit('setTxId', res.result.ID);

            const darcContract = new ethers.utils.Interface(state.sourceNetwork.getTokenContractAbi());
            const encodedData = darcContract.encodeFunctionData('transfer', [
                state.sourceNetwork.getSwapAddress(),
                String(state.form.amount).includes('.')
                    ? BigNumber.from(String(state.form.amount * 10 ** DECIMALS))
                    : BigNumber.from(
                          String(state.form.amount).padEnd(String(state.form.amount).length + DECIMALS, '0'),
                      ),
            ]);
            await window.BinanceChain.request({
                jsonrpc: '2.0',
                method: 'eth_sendTransaction',
                params: [
                    {
                        to: state.sourceNetwork.getTokenContractAddr(),
                        data: encodedData,
                        from: fromAddress,
                    },
                ],
                id: 2,
            });

            commit('setFormStep', 1);
            commit('setConfirmSwap', false);
            commit('setProcessing', false);

            dispatch('checkBscKnHash');
        },

        checkBscKnHash: ({ state, commit, dispatch }) => {
            let checkCount = 0;
            const interval = setInterval(async () => {
                const { result, success } = await get(`${apiUrl}/tx/${state.txId}`);
                if (!success) {
                    checkCount++;
                } else {
                    if (result?.source_network_completed && result?.destination_network_completed) {
                        clearInterval(interval);
                        commit('setSourceTxStatus', 'success');
                        commit('setDestinationTxStatus', 'success');
                        commit('setSourceNetworkHash', result.source_network_hash);
                        commit('setDestinationNetworkHash', result.destination_network_hash);
                    }
                }

                if (checkCount === 30) {
                    clearInterval(interval);
                    commit('setFormStep', 0);
                    console.log(result);
                    dispatch('activateTooltip', 'Swap status: ' + result.result);
                    commit('setDestinationTxStatus', 'not started');
                    console.log('checkBscKnHash failed');
                }
            }, 10000);
        },
    },
});
