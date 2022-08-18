<template>
    <div>
        <stripe-checkout
            ref="checkoutRef"
            mode="payment"
            :pk="stripe_key"
            :line-items="lineItems"
            @loading="v => loading = v"
        />
        <button @click="submit">Payer</button>
    </div>
</template>

<script>
import { StripeCheckout } from '@vue-stripe/vue-stripe';
import config from '@/services/config'

export default {
    components: { StripeCheckout },

    data: () => ({
        loading: false,
        lineItems: []
    }),

    computed: {
        stripe_key () {
            return config.get('stripe_key')
        },

        amount () {
            return Number.parseInt(localStorage.getItem('amount'))
        },

        sucessUrl () {
            let route = this.$router.resolve({ name: 'success' })
            return route.href
        },

        cancelUrl () {
            let route = this.$router.resolve({ name: 'cancel' })
            return route.href
        },
    },

    mounted () {
        this.initLineItems()
    },

    methods: {
        initLineItems () {
            this.lineItems = [ { price: this.amount, quantity: 1 } ]
        },

        submit () {
            // You will be redirected to Stripe's secure checkout page
            this.$refs.checkoutRef.redirectToCheckout();
        },
    },
}
</script>
