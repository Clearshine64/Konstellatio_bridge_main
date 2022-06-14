<template>
    <div class="layover">
        <div v-if="!$store.state.processing" class="confirm-popup" @click.stop>
            <p class="confirm-popup__title">Confirm Popup</p>
            <p class="confirm-popup__amount">
                {{ $store.state.form.amount }} {{ $store.state.sourceNetwork.getTokenName() }}
            </p>
            <div class="confirm-popup__transfer">
                <div class="confirm-popup__transfer__network">
                    <p class="confirm-popup__transfer__network__label">From</p>
                    <div>
                        <img
                            class="confirm-popup__transfer__network__logo"
                            :src="require(`@/assets/${$store.state.sourceNetwork.getIcon()}`)"
                            alt="src-network"
                        />
                        <p class="confirm-popup__transfer__network__text">
                            {{ $store.state.sourceNetwork.getTitle() }}
                        </p>
                    </div>
                </div>
                <img src="@/assets/img/confirm-arrow.png" alt="" class="confirm-popup__transfer__arrow" />
                <div class="confirm-popup__transfer__network">
                    <p class="confirm-popup__transfer__network__label">To</p>
                    <div>
                        <img
                            class="confirm-popup__transfer__network__logo"
                            :src="require(`@/assets/${$store.state.destinationNetwork.getIcon()}`)"
                            alt="dest-network"
                        />
                        <p class="confirm-popup__transfer__network__text">
                            {{ $store.state.destinationNetwork.getTitle() }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="confirm-popup__info">
                <p class="confirm-popup__info__name">Asset</p>
                <div class="confirm-popup__info__value">
                    <img src="@/assets/img/darc-token.svg" alt="" class="confirm-popup__info__value__img" />
                    <p class="confirm-popup__info__value__text">
                        {{ $store.state.sourceNetwork.getTokenName() }}
                    </p>
                </div>
            </div>
            <div class="confirm-popup__info">
                <p class="confirm-popup__info__name">Source</p>
                <div class="confirm-popup__info__value">
                    <p class="confirm-popup__info__value__text">
                        {{ formatAddress($store.state.form.source) }}
                    </p>
                </div>
            </div>
            <div class="confirm-popup__info">
                <p class="confirm-popup__info__name">Destination</p>
                <div class="confirm-popup__info__value">
                    <p class="confirm-popup__info__value__text">
                        {{ formatAddress($store.state.form.destination) }}
                    </p>
                </div>
            </div>
            <div class="confirm-popup__info" v-if="source === 'knstl'">
                <p class="confirm-popup__info__name">Transaction Fee</p>
                <div class="confirm-popup__info__value--fee">
                    <p class="confirm-popup__info__value--fee__text">
                      <span v-if="source === 'knstl'">{{ flatFee }} </span>
                      <span v-else-if="fee">{{ fee }} BNB</span>
                      <span v-else>-</span>
                    </p>
                    <!--                    <span>$2.115</span>-->
                </div>
            </div>

            <button @click="transfer" class="confirm-popup__next">Next</button>
            <button @click="setConfirmSwap(false)" class="confirm-popup__cancel">Cancel</button>
        </div>

        <div v-else class="confirm-popup">
            <p class="confirm-popup__title">Confirm Popup</p>
            <div class="confirm-popup__waiting">
                <lottie-player
                    class="confirm-popup__waiting__img"
                    src="https://assets8.lottiefiles.com/packages/lf20_Z4BhGL.json"
                    background="transparent"
                    speed="1"
                    style="width: 40px; height: 40px"
                    loop
                    autoplay
                ></lottie-player>
                <p class="confirm-popup__waiting__text">Waiting for transaction</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { bscConnector } from '@/services/binance';
import networkManager from '@/services/network';
import { formatAddress } from '@/utils/address';
import { defineComponent, onMounted, ref } from 'vue';
import { mapActions, mapMutations, useStore } from 'vuex';

export default defineComponent({
    setup() {
        const { state, dispatch, getters } = useStore();
        const fee = ref(0);
        const flatFee = ref('2 DARC');

        const source = state.sourceNetwork.getNetwork();
        const destination = state.destinationNetwork.getNetwork();

        const transfer = async () => {
            console.log('🚀 ~ file: ConfirmSwap.vue ~ line 100 ~ transfer ~ source', source);
            if (source !== 'knstl') {
                const chainId = await bscConnector.getChainId();
                const network = networkManager.getNetworkByChainId(chainId);
                if (network.network !== source) {
                    dispatch('switchNetwork', networkManager.getNetwork(source, state.selectedNetwork.getType()));
                    dispatch('switchNetworkType', state.selectedNetwork.getType());
                    return;
                }
                const acc = await bscConnector.getAccount();
                if (acc !== getters.accountAddress) {
                    dispatch('activateTooltip', 'Wrong account selected');
                    return;
                }
            }
            dispatch('transfer', { source, destination });
        };

        onMounted(async () => {
            fee.value = await dispatch('estimateFee', { source, destination });
        });

        return {
            transfer,
            flatFee,
            source,
            fee,
        };
    },
    methods: {
        ...mapMutations(['setConfirmSwap']),
        ...mapActions(['transferFromBc2Bsc', 'transferFromBsc2Bc']),
        formatAddress(addr: string) {
            return formatAddress(addr);
        },
    },
});
</script>

<style lang="scss" scoped>
.layover {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

.confirm-popup {
    max-width: 430px;
    width: 100%;
    padding: 30px;
    background-color: $white;
    border-radius: 5px;
    color: $black;
    min-height: 380px;
    margin: 0 30px;

    &__title {
        font-weight: bold;
        margin-bottom: 20px;
        color: $black;
    }

    &__amount {
        padding: 24px;
        box-sizing: border-box;
        width: 100%;
        font-size: 22px;
        background-color: $bluewhite;
        color: $black;
        font-weight: bold;
        margin-bottom: 20px;
    }

    &__transfer {
        display: flex;
        align-items: center;
        margin-bottom: 30px;

        &__arrow {
            width: 28px;
            height: 28px;
        }

        &__network {
            &__logo {
                width: 39px;
                height: 39px;
                margin-bottom: 10px;
            }

            div {
                padding: 20px 0;
            }
        }
    }

    &__info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;

        &__value {
            display: flex;
            align-items: center;

            &--fee {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }

            img {
                margin-right: 6px;
            }
        }
    }

    &__next {
        padding: 15px;
        width: 100%;
        box-sizing: border-box;
        background-color: $blue;
        color: $white;
        cursor: pointer;
        border-radius: 5px;
    }

    &__cancel {
        margin-top: 15px;
        padding: 15px;
        width: 100%;
        box-sizing: border-box;
        background-color: $bluegrey;
        color: $black;
        cursor: pointer;
        border-radius: 5px;
    }

    &__waiting {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        &__img {
            margin: 0 auto 20px;
        }
    }
}
</style>
