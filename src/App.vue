<template>
    <div class="top">
        <lottie-player
            class="top__animation"
            src="https://assets5.lottiefiles.com/packages/lf20_Aerz0y.json"
            background="transparent"
            speed="1"
            style="width: 100%; height: 100%"
            loop
            autoplay
        ></lottie-player>
    </div>
    <div class="wrap">
        <Header />
        <RouterView />
        <Footer />
    </div>

    <ConnectPopup v-if="$store.state.connectPopup" />
    <BinanceChainWallet />
    <ConfirmSwap v-if="$store.state.confirmSwap" />
    <Tooltip />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import ConnectPopup from '@/components/ConnectPopup.vue';
import BinanceChainWallet from '@/components/BinanceChainWallet.vue';
import ConfirmSwap from '@/components/ConfirmSwap.vue';
import Tooltip from '@/components/Tooltip.vue';

export default defineComponent({
    components: {
        Header,
        Footer,
        ConnectPopup,
        BinanceChainWallet,
        ConfirmSwap,
        Tooltip,
    },
});
</script>

<style lang="scss">
@import '@/assets/styles/reset.scss';
@import '@/assets/styles/global.scss';

#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
}
* {
    font-family: 'Josefin Sans', sans-serif;
}

.wrap {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;

    div:nth-child(2) {
        /*flex: 1;*/
    }
}
.top {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(180deg, #010101 -19.75%, #21315c 64.06%);

    &:before {
        content: '';
        width: 80%;
        height: 100%;
        background: url('./assets/img/stars.png');
        position: absolute;
        top: 0;
        right: 0;
    }
    &__animation {
        right: 35%;
        top: 0;
        position: absolute;
    }
}
</style>
