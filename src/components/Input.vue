<template>
    <div class="input-wrap">
        <img class="input-wrap__icon" :src="require(`@/assets/img/${iconUrl}`)" alt="" />
        <input type="text" class="input-wrap__input" :disabled="!!text" :value="text" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        iconUrl: String,
        text: String,
    },
});
</script>

<style lang="scss" scoped>
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
    }
    &__input {
        border: none;
        outline: none;
        background-color: transparent;
        color: $black;
    }
}
</style>
