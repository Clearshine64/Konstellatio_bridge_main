<template>
    <div class="tx">
        <TxStatus
            :source="source"
            :destination="destination"
            :amount="$store.state.form.amount"
            :fromAddress="$store.getters.accountAddress"
            :toAddress="$store.state.form.destination"
            :fee="fee"
        />
    </div>
</template>

<script lang="ts">
import TxStatus from '@/components/TxStatus.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    components: {
        TxStatus,
    },
    setup() {
        const { state, dispatch } = useStore();
        const fee = ref(0);

        onMounted(async () => {
            fee.value = await dispatch('getFee', { source: state.sourceNetwork, hash: state.sourceNetworkHash });
        });

        return {
            source: {
                network: state.sourceNetwork,
                hash: state.sourceNetworkHash,
                status: state.sourceTxStatus,
            },
            destination: {
                network: state.destinationNetwork,
                hash: state.destinationNetworkHash,
                status: state.destinationTxStatus,
            },
            fee,
        };
    },
});
</script>

<style lang="scss" scoped></style>
