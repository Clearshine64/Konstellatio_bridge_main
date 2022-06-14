<template>
    <div class="tx">
        <TxStatus :sourceNetwork="source"
                  :destinationNetwork="destination"
                  fromAddress="tbnb10ukz2hq0hc69tmaswl7s33sd8ucex6zpg9rucf"
                  toAddress="0xd5B86f455b54387361379e2e28f854aA2F23ac4B"
                  amount="34"
        />

<!--        $store.state.form.destination-->
    </div>
</template>

<script lang="ts">
    import TxStatus from '@/components/TxStatus.vue';
    import { defineComponent, toRefs } from 'vue';
    import { useRoute } from 'vue-router';
    import networkManager from '@/services/network';

    export default defineComponent({
        name: 'Tx',
        components: {
            TxStatus,
        },
        setup() {
            const route = useRoute();
            console.log(route.params.hash);
            const srcNet = networkManager.getNetwork('bc', 'testnet');
            const destNet = networkManager.getNetwork('bsc', 'testnet');

            const source = toRefs(srcNet);
            const destination = toRefs(destNet);

            console.log(srcNet);
            console.log(destNet);

            return { source: srcNet, destination: destNet };
        },
    });
</script>
