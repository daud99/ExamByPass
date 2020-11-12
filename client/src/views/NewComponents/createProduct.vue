<template>
<core-content :loading="loading">
<div class="py-5" id="aboutSection" :style="{marginTop:'100px'}">
    <div class="container-fluid">
        <div class="row">
            <div class="col offset-lg-2 offset-md-2 col-lg-7 col-md-7 col-xs-12">
                <h4>Create Product</h4><br><br>
                <v-form lazy-validation>
                    <v-text-field v-model="name" :error-messages="nameErrors" :counter="20" label="Name" outlined shaped @input="$v.name.$touch()" @blur="$v.name.$touch()" required></v-text-field>
                    <v-text-field :error-messages="unit_amountErrors" type="number" v-model="unit_amount" :counter="20" label="Unit Amount" outlined shaped @input="$v.unit_amount.$touch()" @blur="$v.unit_amount.$touch()" required></v-text-field>

                    <v-text-field :error-messages="interval_countErrors" type="number" v-model="interval_count" label="Interval Count" outlined shaped @input="$v.interval_count.$touch()" @blur="$v.interval_count.$touch()" required></v-text-field>

                    <v-select
                        :error-messages="intervalErrors"
                        @input="$v.interval.$touch()"
                        @blur="$v.interval.$touch()"
                        v-model="interval"
                        :items="items"
                        label="Interval"
                        outlined
                    ></v-select>

                    <v-btn class="mr-4" :disabled="$v.$invalid" @click="submitProduct">
                        Submit
                    </v-btn>

                </v-form>
            </div>
        </div>
    </div>
</div>
</core-content>
</template>

<script>
import card from '../../components/Card'
import Swal from "sweetalert2";
import { quickRequest } from "../../../common/misc.js";
import {
    mapActions,
    mapGetters
} from 'vuex';
import {
    validationMixin
} from 'vuelidate'
import {
    required,
    maxLength,
    minLength,
} from 'vuelidate/lib/validators'

export default {
    mixins: [validationMixin],
    validations: {
        name: {
            required,
            maxLength: maxLength(20),
            minLength: minLength(1)
        },
        unit_amount: {
            required,
            maxLength: maxLength(20),
            minLength: minLength(1)
        },
        interval_count: {
            required,
            maxLength: maxLength(20),
            minLength: minLength(1)
        },
        interval: {
            required,
            maxLength: maxLength(2000),
            minLength: minLength(1)
        }
    },
    data: () => ({
        items: ['month', 'year'],
        loading:false,
        name: '',
        unit_amount: '',
        interval_count: '',
        interval: '',
    }),
    components: {
        card
    },
    created () {
        if(!this["auth/isAuthenticated"] && this["auth/getUser"].roles!='admin'){
            this.$router.push('/')
        }
    },
    computed: {
        ...mapGetters(["auth/getUser"]),
        ...mapGetters(["auth/isAuthenticated"]),
         nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('Name must be at most 20 characters long')
        !this.$v.name.minLength && errors.push('Name must be at least 1 characters long')
        !this.$v.name.required && errors.push('Name is required.')
        return errors
    },
    unit_amountErrors () {
        const errors = []
        if (!this.$v.unit_amount.$dirty) return errors
        !this.$v.unit_amount.maxLength && errors.push('unit_amount must be at most 20 characters long')
        !this.$v.unit_amount.minLength && errors.push('unit_amount must be at least 1 characters long')
        !this.$v.unit_amount.required && errors.push('unit_amount is required.')
        return errors
    },
    interval_countErrors () {
        const errors = []
        if (!this.$v.interval_count.$dirty) return errors
        !this.$v.interval_count.maxLength && errors.push('interval_count must be at most 20 characters long')
        !this.$v.interval_count.minLength && errors.push('interval_count must be at least 1 characters long')
        !this.$v.interval_count.required && errors.push('interval_count is required.')
        return errors
    },
    intervalErrors () {
        const errors = []
        if (!this.$v.interval.$dirty) return errors
        !this.$v.interval.maxLength && errors.push('interval must be at most 2000 characters long')
        !this.$v.interval.minLength && errors.push('interval must be at least 1 characters long')
        !this.$v.interval.required && errors.push('interval is required.')
        return errors
    }

    },
    beforeDestroy: function(){
        document.getElementById("preloader-block").style.display = "none";
    },
    methods: {
        async submitProduct() {
            console.log(this.name)
            console.log(this.interval_count)
            console.log(this.unit_amount)
            console.log(this.interval)
            try {
                const data = {
                name: this.name,
                interval_count: this.interval_count,
                unit_amount: this.unit_amount,
                interval: this.interval,
                };
                this.loading = true;
                let response = await quickRequest("/create-product", "POST", data);
                console.log(response)
                if ("error" in response) {
                Swal.fire({
                    type: "error",
                    icon: "error",
                    title: "Error",
                    text: response.error,
                });
                } else if (response.msg) {
                Swal.fire({
                    type: "success",
                    icon: "success",
                    title: "Message",
                    text: response.msg,
                });
                if(response.record){
                    console.log(response.record)
                }
                this.loading = false;
                this.$router.push("products")
                }
            } catch (e) {
                console.log(e)
                Swal.fire({
                type: "error",
                title: "Error Fetching Information",
                text: "Could not update through the server.",
                });
            } finally {
                this.loading = false;
            }
        }

    },
}
</script>

<style scoped>
.bg-primary {
    color: white;
}
</style>
