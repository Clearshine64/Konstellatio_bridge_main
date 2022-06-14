<template>
    <select @change="onNetworkTypeChange" class="network-select__input">
        <option v-for="net in networks" :key="net" :selected="net === currentNetworkType">
            {{ net }}
        </option>
    </select>
</template>

<script lang="ts">
    import { useStore } from 'vuex';
    import { defineComponent, onMounted, ref } from 'vue';
    import networkManager from '@/services/network';
    import { bscConnector } from '@/services/binance';

    interface BinanceNetwork {
        name: string;
        value: string;
    }

    export default defineComponent({
        name: 'NetworkTypeChange',
        setup() {
            const { dispatch } = useStore();
            const currentNetwork = ref('');
            const currentNetworkType = ref('');
            const networks = ['testnet', 'mainnet'];
            const binanceNetworks: Record<string, BinanceNetwork> = {
                'Binance-Chain-Ganges': {
                    name: 'testnet',
                    value: 'bbc-testnet',
                },
                'Binance-Chain-Tigris': {
                    name: 'mainnet',
                    value: 'bbc-mainnet',
                },
                '0x61': {
                    name: 'testnet',
                    value: 'bsc-testnet',
                },
                '0x38': {
                    name: 'mainnet',
                    value: 'bsc-mainnet',
                },
            };

            onMounted(async () => {
                const cid = await bscConnector.getChainId();
                const net = networkManager.getNetworkByChainId(cid);

                // todo current get from localstorage
                currentNetwork.value = net.getName();
                currentNetworkType.value = net.getType();
            });

            const onNetworkTypeChange = (e: any) => {
                dispatch('switchNetworkType', e.target.value);
            };
            return { currentNetwork, currentNetworkType, binanceNetworks, networks, onNetworkTypeChange };
        },
    });
</script>

<style scoped>
    .network-select__input {
        background-color: transparent;
        border: none;
        outline: none;
        width: 100%;
        height: 100%;
        color: black;
        cursor: pointer;
        padding: 15px;
    }

</style>
