<template>
    <div class="main">
        <div class="main__input-group">
            <label for="asset" class="main__input-group__label">Asset</label>
            <div class="input-wrap">
                <img class="input-wrap__icon" src="@/assets/img/darc-token.svg" alt="" />
                <input type="text" id="asset" class="input-wrap__input" disabled value="DARC" />
            </div>
        </div>

        <div class="main__input-group">
            <label for="from" class="main__input-group__label">Network</label>
            <div class="main__input-group__wrap">
                <div class="input-wrap">
                    <img class="input-wrap__icon" :src="require(`@/assets/img/${fromNetwork}-logo.svg`)" alt="" />
                    <select class="input-wrap__input" id="from" @change="onFromChange" v-model="fromNetwork">
                        <option
                            v-for="net in networks"
                            :key="net.key"
                            :value="net.key"
                            :selected="fromNetwork === net.key"
                        >
                            {{ net.name }}
                        </option>
                    </select>
                </div>
                <img src="@/assets/img/arrow-down.svg" alt="" class="main__input-group__arrow" />
                <div class="input-wrap">
                    <img class="input-wrap__icon" :src="require(`@/assets/img/${toNetwork}-logo.svg`)" alt="" />
                    <select class="input-wrap__input" @change="onToChange" v-model="toNetwork">
                        <option
                            v-for="net in networks"
                            :key="net.key"
                            :value="net.key"
                            :selected="toNetwork === net.key"
                        >
                            {{ net.name }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <div class="main__input-group">
            <label for="amount" class="main__input-group__label">Amount</label>
            <div :class="addClass('amount', 'input-wrap')">
                <input @input="onAmountChange" id="amount" type="number" class="input-wrap__input" placeholder="100" />
            </div>
        </div>
        <p class="main__tip">
            Amount must <span v-if="fromNetwork === 'knstl'">be at least 3 DARC and</span> contain less than 6 decimals.
        </p>

        <div class="main__input-group" v-if="fromNetwork === 'knstl'">
            <label for="source" class="main__input-group__label">Source</label>
            <div :class="addClass('source', 'input-wrap')">
                <img class="input-wrap__icon" :src="require(`@/assets/img/${fromNetwork}-logo.svg`)" alt="" />
                <input
                    @change="onSourceChange"
                    id="source"
                    type="text"
                    class="input-wrap__input"
                    placeholder="address"
                />
            </div>
        </div>
        <div class="main__input-group">
            <label for="destination" class="main__input-group__label">Destination</label>
            <div :class="addClass('destination', 'input-wrap')">
                <img class="input-wrap__icon" :src="require(`@/assets/img/${toNetwork}-logo.svg`)" alt="" />
                <input
                    @change="onDestinationChange"
                    id="destination"
                    type="text"
                    class="input-wrap__input"
                    placeholder="address"
                />
            </div>
        </div>
        <p class="main__tip">This is the destination address to the network.</p>
        <button v-if="fromNetwork === 'knstl' || $store.state.account" @click="nextStep" class="main__btn">
            Next
        </button>
        <button v-else @click="connectWallet" class="main__btn">Connect Wallet</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { mapMutations, useStore } from 'vuex';
import Web3 from 'web3';
import { Network } from "@/types/network";

export default defineComponent({
    setup() {
        const { dispatch, state } = useStore();

        const errors = ref<string[]>([]);
        const fromNetwork = ref('bsc');
        const toNetwork = ref('knstl');
        const networks = ref([
            {
                name: 'Binance Smart Chain Network',
                key: 'bsc',
            },
            {
                name: 'Binance Chain Network',
                key: 'bc',
            },
            {
                name: 'Konstellation Network',
                key: 'knstl',
            },
        ]);

        const changeSourceNetwork = (net: string) => {
            dispatch('changeSourceNetwork', net);
        };

        const changeDestinationNetwork = (net: string) => {
            dispatch('changeDestinationNetwork', net);
        };

        return {
            amount: computed(() => state.form.amount),
            source: computed(() => state.form.source),
            destination: computed(() => state.form.destination),
            state: computed(() => state),
            errors,
            fromNetwork,
            toNetwork,
            networks,
            changeSourceNetwork,
            changeDestinationNetwork,
        };
    },
    methods: {
        ...mapMutations(['setFormStep', 'setConnectPopup', 'setConfirmSwap', 'setForm']),
        nextStep() {
            if (!this.amount || (this.fromNetwork === 'knstl' && this.amount < 3)) {
                this.errors.push('amount');
                return;
            }
            if (this.fromNetwork === 'knstl') {
                if (!this.source) {
                    this.errors.push('source');
                    return;
                }
            } else {
                const source = this.state.account?.addresses.find(
                    (address: Network) => address.type === this.state.selectedNetwork.getAddressType(),
                )?.address;
                this.setForm({ source });
            }
            if (!this.destination || (this.toNetwork === 'bsc' && !Web3.utils.isAddress(this.destination))) {
                this.errors.push('destination');
                return;
            }
            let amount = Number(this.amount).valueOf();
            this.setForm({ amount });
            this.setConfirmSwap(true);
        },
        connectWallet() {
            this.setConnectPopup(true);
        },
        onAmountChange(e: any) {
            const amountStr = e.target.value.toString();
            if (amountStr.length > 0) {
                let splitted = amountStr.includes('.') ? amountStr.split('.') : [amountStr, ''];
                splitted[1] = splitted[1].length > 5 ? splitted[1].substr(0, 5) : splitted[1];
                e.target.value = amountStr.includes('.') ? splitted[0] + '.' + splitted[1] : amountStr;
            }
            let amount = e.target.value;
            this.setForm({ amount });
            const min = (this.fromNetwork === 'knstl') ? 3 : 0;
            this.errors =
                this.amount > 0 && this.amount >= min
                    ? this.errors.filter((e) => e !== 'amount')
                    : [...this.errors, 'amount'];
        },
        onSourceChange(e: any) {
            const source = e.target.value;
            this.errors = source ? this.errors.filter((e) => e !== 'source') : [...this.errors, 'source'];
            this.setForm({ source });
        },
        onDestinationChange(e: any) {
            const destination = e.target.value;
            this.errors = destination
                ? this.errors.filter((e) => e !== 'destination')
                : [...this.errors, 'destination'];
            this.setForm({ destination });
        },
        onFromChange(e: any) {
            const net = e.target.value;

            if (net === this.toNetwork) {
                this.toNetwork = this.filterNetworks(net)[0].key;
            }
            if ((net === 'bc' && this.toNetwork === 'knstl') || (net === 'knstl' && this.toNetwork === 'bc')) {
                this.toNetwork = 'bsc';
            }
            this.changeSourceNetwork(net);
            this.changeDestinationNetwork(this.toNetwork);
        },
        onToChange(e: any) {
            const net = e.target.value;

            if (net === this.fromNetwork) {
                this.fromNetwork = this.filterNetworks(net)[0].key;
            }
            if ((net === 'bc' && this.fromNetwork === 'knstl') || (net === 'knstl' && this.fromNetwork === 'bc')) {
                this.fromNetwork = 'bsc';
            }
            this.changeDestinationNetwork(net);
            this.changeSourceNetwork(this.fromNetwork);
        },
        filterNetworks(network: string) {
            return this.networks.filter((net) => net.key !== network);
        },
        addClass(inputType: string, className: string) {
            return `${className} ${this.errors.includes(inputType) ? 'error' : ''}`;
        },
    },
});
</script>

<style lang="scss" scoped>
.main {
    max-width: 750px;
    margin: 50px auto 0;
    background-color: $white;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    padding: 60px 90px;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 60px 40px;
    }
    @media (max-width: 480px) {
        padding: 40px 24px;
    }

    input {
        width: 100%;
    }
    &__input-group {
        text-align: left;
        font-size: 14px;
        margin-bottom: 25px;

        &__wrap {
            position: relative;
        }
        &__label {
            color: $black;
            font-weight: 700;
            font-family: 'Open Sans', sans-serif;
        }
        &__arrow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: $white;
        }
    }
    &__tip {
        color: $grey;
        font-size: 12px;
        margin: -18px 0 15px 0;
        text-align: left;
    }

    &__btn {
        background-color: $blue;
        width: 100%;
        padding: 14px 0;
        color: $white;
        border-radius: 5px;
        margin: 26px 0 0;
        cursor: pointer;
    }
}
.input-wrap {
    display: flex;
    align-items: center;
    border: 1px solid $bluegrey;
    background-color: $bluewhite;
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;

    &__icon {
        margin-right: 10px;
        width: 25px;
        height: 25px;
    }
    &__input {
        border: none;
        outline: none;
        background-color: transparent;
        color: $black;
        width: 100%;
    }
}
.error {
    border: 1px solid red;
}
</style>
