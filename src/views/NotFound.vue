<template>
    <div class="not_found">
        <h1>Oops, it looks like the page you're looking for doesn't exist.</h1>
    </div>
</template>

<script>
export default {
    name: 'NotFound',
};
</script>

<style lang="scss">
@import '@/assets/styles/reset.scss';
@import '@/assets/styles/global.scss';

.not_found {
    color: white;
    flex-grow: 1;
}
</style>
