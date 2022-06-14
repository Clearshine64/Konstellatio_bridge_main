<template>
    <main class="main">
        <h1 class="main__title">The DARC Bridge</h1>
        <p class="main__description">Fast, decentralized, affordable and secure way to swap cross-chain DARC tokens.</p>

        <Swap v-if="$store.state.formStep === 0" />
        <SwapNotification v-if="$store.state.formStep === 0.5" />
        <TxStatusWrapper v-else-if="$store.state.formStep === 1" />
    </main>
</template>

<script lang="ts">
import Swap from '@/components/Swap.vue';
import SwapNotification from '@/components/SwapNotification.vue';
import TxStatusWrapper from '@/components/TxStatusWrapper.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Main',
    components: {
        TxStatusWrapper,
        Swap,
        SwapNotification,
    },
});
</script>

<style lang="scss">
@import '@/assets/styles/reset.scss';
@import '@/assets/styles/global.scss';

.main {
    flex-grow: 1;

    &__title {
        margin-top: 60px;
        color: $white;
        font-size: 24px;
        margin-bottom: 20px;

        @media (max-width: 768px) {
            margin-top: 40px;
        }
    }

    &__description {
        color: $white;
        font-size: 16px;
    }
}
</style>
