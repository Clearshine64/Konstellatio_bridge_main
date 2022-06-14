<template>
    <div class="status">
        <p class="status__title">Transaction Status</p>

        <div class="status__details">
            <div class="status__details__row">
                <p class="status__details__row__title">Amount</p>
                <p class="status__details__row__value--amount">
                    {{ amount }} {{ $store.state.sourceNetwork.getTokenName() }}
                </p>
            </div>

            <div class="status__details__row">
                <p class="status__details__row__title">From</p>
                <div class="status__details__row__value--label">
                    <div class="tx__source">
                        <div class="tx__source__network">
                            <span>{{ source.network.getTitle() }}</span>
                            <img :src="require(`@/assets/${source.network.getIcon()}`)" alt="src-network" />
                        </div>
                        <span v-if="source.network.getNetwork() !== 'knstl'" class="tx__from">
                            {{ fromAddress }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="status__details__row">
                <p class="status__details__row__title">To</p>
                <div class="status__details__row__value--label">
                    <div class="tx__destination">
                        <div class="tx__destination__network">
                            <span>{{ destination.network.getTitle() }}</span>
                            <img :src="require(`@/assets/${destination.network.getIcon()}`)" alt="dest-network" />
                        </div>
                        <span class="tx__to">
                            {{ toAddress }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="status__details__row">
                <p class="status__details__row__title">Asset</p>
                <p class="status__details__row__value--label tx__amount">
                    <img src="@/assets/img/darc-token.svg" alt="" />
                    <span>{{ source.network.getTokenName() }}</span>
                </p>
            </div>

            <div v-if="fee" class="status__details__row">
                <p class="status__details__row__title">Transaction Fee</p>
                <p class="status__details__row__value--fee">
                    <span>{{ fee }} BNB</span>
                    <!--                    <span>$2.115</span>-->
                </p>
            </div>

            <div class="status__details__row--hash">
                <p class="status__details__row--hash__title">Transaction Hash</p>
                <div class="status__details__row--hash__value">
                    <div class="status__details__row--hash__value__row">
                        <div @click="copySrcToClipboard" class="status__details__row--hash__value__row__network">
                            <img
                                class="status__details__row--hash__value__row__logo"
                                :src="require(`@/assets/${source.network.getIcon()}`)"
                                alt="source__logo"
                            />
                            <p class="status__details__row--hash__value__row__hash">
                                {{ source.hash || $store.state.sourceNetworkHash || '...' }}
                            </p>
                            <img
                                class="status__details__row--hash__value__row__copy"
                                src="@/assets/img/copy.svg"
                                alt=""
                            />
                        </div>
                        <div class="status__details__row--hash__value__row__status">
                            <p>{{ capitalizeFirstLetter($store.state.sourceTxStatus) }}</p>
                            <a
                                :href="`${source.network.getExplorerTxUrl()}${$store.state.sourceNetworkHash}`"
                                target="_blank"
                            >
                                <span>Explorer</span>
                                <img src="@/assets/img/arrow.png" alt="" />
                            </a>
                        </div>
                    </div>

                    <div
                        v-if="$store.state.destinationTxStatus !== 'not started'"
                        class="status__details__row--hash__value__row"
                    >
                        <div @click="copySrcToClipboard" class="status__details__row--hash__value__row__network">
                            <img
                                class="status__details__row--hash__value__row__logo"
                                :src="require(`@/assets/${destination.network.getIcon()}`)"
                                alt="source__logo"
                            />
                            <p class="status__details__row--hash__value__row__hash">
                                {{ destination.hash || $store.state.destinationNetworkHash || '...' }}
                            </p>
                            <img
                                class="status__details__row--hash__value__row__copy"
                                src="@/assets/img/copy.svg"
                                alt=""
                            />
                        </div>
                        <div class="status__details__row--hash__value__row__status">
                            <p>{{ capitalizeFirstLetter($store.state.destinationTxStatus) }}</p>
                            <a
                                :href="`${destination.network.getExplorerTxUrl()}${
                                    $store.state.destinationNetworkHash
                                }`"
                                target="_blank"
                            >
                            </a>
                        </div>
                    </div>
                </div>

                <!--                <div class="status__details__row&#45;&#45;hash__value">-->
                <!--                    <div class="status__details__row&#45;&#45;hash__value__row">-->
                <!--                        <div class="status__details__row&#45;&#45;hash__value__row__network">-->
                <!--                            <img class="status__details__row&#45;&#45;hash__value__row__logo"-->
                <!--                                 :src="require(`@/assets/${destination.network.getIcon()}`)"-->
                <!--                                 alt="destination__logo"/>-->
                <!--                            <p class="status__details__row&#45;&#45;hash__value__row__hash">-->
                <!--                                {{destination.hash || '...'}}-->
                <!--                            </p>-->
                <!--                            <img class="status__details__row&#45;&#45;hash__value__row__copy" src="@/assets/img/copy.svg"-->
                <!--                                 alt=""/>-->
                <!--                        </div>-->
                <!--                        <div class="status__details__row&#45;&#45;hash__value__row__status">-->
                <!--                            <p>{{ capitalizeFirstLetter(destination.status) }}</p>-->
                <!--                            <template v-if="destination.status === 'success'">-->
                <!--                                <a :href="`${destination.network.getExplorerTxUrl()}${destination.hash}`"-->
                <!--                                   target="_blank">-->
                <!--                                    <span>Explorer</span>-->
                <!--                                    <img src="@/assets/img/arrow.png" alt=""/>-->
                <!--                                </a>-->
                <!--                            </template>-->
                <!--                        </div>-->
                <!--                    </div>-->
                <!--                </div>-->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { capitalizeFirstLetter } from '@/utils/strings';
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
    props: {
        source: Object,
        destination: Object,
        fromAddress: String,
        toAddress: String,
        amount: Number,
    },
    methods: {
        ...mapActions(['activateTooltip']),
        capitalizeFirstLetter(s: string) {
            return capitalizeFirstLetter(s);
        },
        copySrcToClipboard() {
            this.activateTooltip('Copied!');
            navigator.clipboard.writeText(this.source?.hash);
        },
    },
});
</script>

<style lang="scss" scoped>
.status {
    max-width: 750px;
    margin: 50px auto 0;
    background-color: $white;
    box-shadow: 0 1px 15px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    padding: 60px 90px;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 40px 24px;
    }

    &__title {
        color: $black;
        margin-bottom: 30px;
    }

    &__details {
        &__row {
            padding: 15px 0;
            display: flex;
            border-bottom: 1px solid $grey;
            align-items: center;
            justify-content: space-between;
            color: $black;

            &__title {
                margin-right: 10px;
            }

            &__value {
                &--amount {
                    font-weight: 700;
                    font-size: 22px;
                }

                &--label {
                    display: flex;
                    align-items: center;
                }

                &--fee {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;

                    span:last-child {
                        color: $grey;
                    }
                }
            }

            &--hash {
                padding: 15px 0;
                display: flex;
                flex-direction: column;
                color: $black;
                align-items: flex-start;

                &__value {
                    width: 100%;

                    &__row {
                        display: flex;
                        align-items: center;
                        margin-top: 15px;
                        justify-content: space-between;

                        @media (max-width: 768px) {
                            flex-direction: column;
                            align-items: flex-start;
                        }

                        &__network {
                            display: flex;
                            align-items: center;
                            gap: 15px;
                        }

                        &__hash {
                            width: 330px;
                            word-break: break-all;
                            font-size: 14px;
                            padding: 12px;
                            background-color: $bluewhite;
                            color: $grey;

                            @media (max-width: 768px) {
                                width: auto;
                            }
                        }

                        &__logo {
                            width: 28px;
                            height: 28px;
                        }

                        &__copy {
                            width: 21px;
                            height: 21px;

                            @media (max-width: 768px) {
                                display: none;
                            }
                        }

                        &__status {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-end;
                            gap: 7px;

                            @media (max-width: 768px) {
                                margin-top: 5px;
                                width: 100%;
                                flex-direction: row;
                                align-items: center;
                                justify-content: flex-end;
                            }

                            p {
                                padding: 6px 14px;
                                color: $white;
                                background-color: $success;
                                border-radius: 5px;
                            }

                            span {
                                font-size: 12px;
                                text-decoration: underline;
                                color: $blue;
                                margin-right: 5px;
                            }

                            a {
                                display: flex;
                                align-items: center;
                            }
                        }
                    }
                }
            }
        }
    }
}

.tx {
    &__source,
    &__destination {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 5px;

        &__network {
            display: flex;
            align-items: center;
            text-align: right;

            img {
                margin-left: 10px;
            }
        }
    }

    &__from,
    &__to {
        font-size: 12px;
        padding: 4px;
        background-color: $bluewhite;
        color: $grey;
        word-break: break-all;

        @media (max-width: 768px) {
            max-width: 140px;
        }
    }

    &__amount {
        img {
            margin-right: 10px;
        }
    }
}
</style>
