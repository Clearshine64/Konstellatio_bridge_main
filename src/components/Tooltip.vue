<template>
    <div :class="`tooltip ${tooltip ? 'active' : ''}`" @click="deactivateTooltip()">
        <p class="tooltip__text">{{ $store.state.tooltipMessage }}</p>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from "vuex";

export default defineComponent({
    setup() {
        const { state, dispatch } = useStore();

        return {
            dispatch: dispatch,
            tooltip: computed(() => state.activeTooltip),
        };
    },
    methods: {
        deactivateTooltip() {
            this.dispatch('deactivateTooltip');
        },
    },
});
</script>

<style lang="scss" scoped>
.tooltip {
    padding: 10px 20px;
    background-color: $white;
    position: fixed;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    border-radius: 5px;
    transition: 0.3s ease-in;

    &__text {
        font-weight: bold;
    }
}
.active {
    top: 20px;
}
</style>
