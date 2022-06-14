<template>
    <div class="popup-wrap" @click="setConnectPopup(false)">
        <div class="popup" @click.stop>
            <p class="popup__title">Connect Wallet</p>

            <div v-if="!Object.keys($store.state.accounts).length" @click="connect" class="popup__connect-option">
                <p class="popup__connect-option__wallet">Binance Chain</p>
                <img src="@/assets/img/bsc-logo.svg" alt="" class="popup__connect-option__logo" />
            </div>

            <div v-else class="popup__accounts">
                <div class="popup__accounts__head">
                    <p class="popup__accounts__head__title">Binance Chain Wallet</p>
                    <img src="@/assets/img/bsc-logo.svg" alt="" class="popup__accounts__head__logo" />
                </div>

                <div v-for="(acc, addr) in $store.state.accounts" :key="addr" class="popup__accounts__option">
                    <input
                        @change="onAddrSelect(acc)"
                        type="radio"
                        :id="addr"
                        name="account"
                        :value="addr"
                        :checked="acc.id === $store.state.account_id"
                    />
                    <label :for="addr">{{ formatAddr(addr) }}</label>
                </div>
            </div>
            <!--            <div class="popup__network-select">-->
            <!--                <NetworkTypeChange/>-->
            <!--            </div>-->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapMutations } from 'vuex';

export default defineComponent({
    methods: {
        ...mapMutations(['setAccount', 'setConnectPopup']),
        ...mapActions(['connectBinance']),
        async connect() {
            await this.connectBinance();
            this.setConnectPopup(false);
        },
        formatAddr(addr: string) {
            const start = addr.slice(0, 10);
            const end = addr.slice(addr.length - 10);

            return `${start}........${end}`;
        },
        onAddrSelect(acc: any) {
            this.setAccount(acc);
            this.setConnectPopup(false);
        },
    },
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
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    box-sizing: border-box;
}
.popup {
    max-width: 430px;
    width: 100%;
    border-radius: 10px;
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

    &__network-select {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
