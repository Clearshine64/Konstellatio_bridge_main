<template>
    <header class="header">
        <router-link to="/">
            <div @click="reload" class="header__logo">
                <img class="header__logo__img" src="@/assets/img/logo.png" alt="" />
                <div class="header__logo__text">
                    <span>konstellation</span>
                    <span>bridge</span>
                </div>
            </div>
        </router-link>

        <button v-if="!$store.state.account" @click="connectWallet" class="header__connect">connect wallet</button>
        <div v-else class="header__wallet-wrap">
            <div class="header__wallet" @click="connectWallet">
                <img src="@/assets/img/bsc-logo.svg" alt="" class="header__wallet__logo" />
                <span class="header__wallet__address">{{ formatAddress($store.getters.accountAddress) }}</span>
                <button class="header__wallet__change">Change Wallet</button>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import { formatAddress } from '@/utils/address';
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';

export default defineComponent({
    methods: {
        ...mapMutations(['setConnectPopup', 'resetState']),
        connectWallet() {
            this.setConnectPopup(true);
        },
        formatAddress(address: string) {
            return formatAddress(address);
        },
        reload() {
            window.location.reload();
        },
    },
});
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    align-items: center;

    &__logo {
        display: flex;

        &__text {
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            color: $white;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 14px;

            @media (max-width: 480px) {
                display: none;
            }
            span:last-child {
                font-weight: 300;
                margin-top: 5px;
            }
        }
    }

    &__connect {
        text-transform: capitalize;
        color: $white;
        background-color: $lightblue;
        width: 145px;
        cursor: pointer;
        height: 38px;
        font-size: 14px;
        border-radius: 5px;
    }

    &__wallet-wrap {
        display: flex;

        @media (max-width: 768px) {
            flex-direction: column-reverse;
        }
    }

    &__wallet {
        border-radius: 5px;
        border: 1px solid $lightblue;
        padding: 5px 10px;
        display: flex;
        align-items: center;

        &__address {
            margin: 0 15px;
            color: $white;
            font-size: 14px;
        }

        &__change {
            background-color: $lightblue;
            padding: 10px 20px;
            color: $white;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;

            @media (max-width: 768px) {
                display: none;
            }
        }
    }
}
</style>
