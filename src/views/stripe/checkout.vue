<template>
    <div>
        <stripe-checkout
            ref="checkoutRef"
            mode="payment"
            :pk="stripe_key"
            :line-items="lineItems"
            :success-url="successURL"
            :cancel-url="cancelURL"
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
        lineItems: [ { price: 'some-price-id', quantity: 1 } ],
        successURL: 'your-success-url',
        cancelURL: 'your-cancel-url',
    }),

    computed: {
        stripe_key () {
            return config.get('stripe_key')
        }
    },

    methods: {
        submit () {
            // You will be redirected to Stripe's secure checkout page
            this.$refs.checkoutRef.redirectToCheckout();
        },
    },
}
</script>
