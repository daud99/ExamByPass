<template>
<core-content :loading="loading">
    <v-row justify="center">
        <v-dialog v-model="show" persistent max-width="800">
            <v-card>
                <v-card-title class="headline">
                    Enter Card Details.
                </v-card-title>
                <v-card-title class="headline">
                    Your Subscription will start now.
                </v-card-title>
                <v-card-text>
                    <v-list shaped>
                        <v-list-item-group color="primary">
                            <v-list-item class="v-item--active v-list-item v-item--active v-list-item--active v-list-item--link theme--light m-2">
                                <v-list-item-icon>
                                    <v-icon v-text="'fa fa-arrow-right'"></v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Total due now ${{amount}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item class="v-item--active v-list-item v-item--active v-list-item--active v-list-item--link theme--light m-2">
                                <v-list-item-icon>
                                    <v-icon v-text="'fa fa-arrow-right'"></v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Subscribing to <strong>{{name}}</strong></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                    <form @submit="subscribe">
                        <stripe-elements ref="elementsRef" :pk="publickey" :amount="1000" locale="en" @token="tokenCreated" @loading="loading = $event">
                        </stripe-elements>
                        <v-text-field v-model="promoCode" label="Promo Code(Optional)"></v-text-field>
                        <div class="text-center">
                            <v-btn rounded color="primary" dark type="submit">
                                Subscribe
                            </v-btn>
                        </div>
                    </form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click.stop="show=false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</core-content>
</template>

<script>
import {
    StripeElements
} from 'vue-stripe-checkout';
import {
    quickRequest
} from "../../../../../common/misc";
import Swal from "sweetalert2";
import PageMixin from "../../../page-mixin";

export default {
    mixins: [PageMixin],
    props: ['visible', 'name', 'id', 'amount', 'publickey'],
    components: {
        StripeElements
    },
    computed: {
        show: {
            get() {
                return this.visible
            },
            set(value) {
                if (!value) {
                    this.$emit('close')
                }
            }
        }
    },
    data: () => ({
        dialog: false,
        loading: false,
        publishableKey: '',
        promoCode: ''
    }),

    methods: {
        async subscribe(event) {
            event.preventDefault();
            try {
                console.log("submitted");
                this.$refs.elementsRef.submit();
            } catch (e) {
                Swal.fire({
                    type: "error",
                    title: "Subscription failed!",
                    text: "Could not subscribe through the server.",
                });
            }
        },
        async tokenCreated(token) {
            try {
                this.loading = true;

                let data = {
                    token: token,
                    id: this.id,
                    name: this.name
                };
                if (this.promoCode) data["promoCode"] = this.promoCode;
                let response = await quickRequest("/create-subscription", "POST", data);
                console.log(response, data)
                if (response.subscription) {
                    Swal.fire({
                        type: "success",
                        title: "Successfully Subscribed!",
                    });
                    this.$router.push("account");
                } else if (response.error) {
                    Swal.fire({
                        type: "error",
                        title: "Subscription failed!",
                        text: response.error,
                    });
                } else {
                    Swal.fire({
                        type: "error",
                        title: "Subscription failed!",
                        text: "Could not subscribe through the server.",
                    });
                }
            } catch (e) {
                Swal.fire({
                    type: "error",
                    title: "Subscription failed!",
                    text: "Could not subscribe through the server.",
                });
            } finally {
                this.loading = false;
            }
        },
        sendTokenToServer(charge) {
            // Send to charge to your backend server to be processed
            // Documentation here: https://stripe.com/docs/api/charges/create

        }
    }
};
</script>
