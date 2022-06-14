<template>
    <div/>
</template>

<script lang="ts">
    import { BinanceAccount, BinanceAddress } from '@/types/binance';
    import { defineComponent, onMounted } from 'vue';
    import { useStore } from 'vuex';

    declare global {
        interface Window {
            BinanceChain: any;
        }
    }

    export default defineComponent({
        setup() {
            const { commit, dispatch } = useStore();
            onMounted(() => {
                if (window.BinanceChain) {
                    window.BinanceChain.on('chainChanged', (chainId: string) =>
                        dispatch('changeChainId', chainId));

                    window.BinanceChain.on('accountsChanged', async (accounts: string[]) => {
                        const accs = await window.BinanceChain.requestAccounts();
                        const acc = accs.find((acc: BinanceAccount) =>
                            acc.addresses.find((addr: BinanceAddress) => addr.address === accounts[0]),
                        );
                        commit('setAccount', acc);
                    });
                }
            });
            return {};
        },
        methods: {},
    });
</script>

<style lang="scss" scoped>
    .popup-wrap {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .popup {
        max-width: 430px;
        width: 100%;
        border-radius: 10px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: $white;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 38px 34px;
        box-sizing: border-box;

        &__title {
            text-align: left;
            font-weight: bold;
            margin-bottom: 30px;
        }

        &__connect-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 5px;
            background-color: $bluewhite;
            border: 1px solid $grey;
            padding: 16px;
            width: 100%;
            box-sizing: border-box;
            cursor: pointer;
        }

        &__accounts {
            padding: 30px;
            border: 1px solid $grey;
            background-color: $bluewhite;
            border-radius: 5px;
            width: 100%;
            box-sizing: border-box;

            &__head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            &__option {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }
        }
    }
</style>
