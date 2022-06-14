<template>
    <div class="main">
        <p class="main__text">
            Send <b>{{ amount }}</b> DARC to <b>{{ swapAddr }}</b> in order to complete transaction.
        </p>
        <button v-if="$store.state.account" @click="nextStep" class="main__btn">Check transaction status</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { mapMutations, useStore } from 'vuex';

export default defineComponent({
    setup() {
        const { state } = useStore();

        return {
            amount: computed(() => state.form.amount),
            swapAddr: computed(() => state.sourceNetwork.getSwapAddress()),
        };
    },
    methods: {
        ...mapMutations(['setFormStep']),
        nextStep() {
            this.setFormStep(1);
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

    &__text {
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
