<template lang="html">
    <div class="modal animated fadeIn upload" id="confirmDonModal">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="text-right" v-show="!isLoading">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeM()">
                      <i class="feather icon-x"></i>
                  </button>
              </div>
              <div class="modal-body">
                  <div class="_img" v-show="!isLoading">
                    <img :src="logo">
                  </div>

                  <div class="text-center mt-10">
                      <h2>faire un don à</h2>
                      <h2><span>{{ user.username }}</span></h2>
                  </div>

                    <div class="form-group mt-10" v-show="!isLoading">
                        <stripe-element-payment
                            ref="paymentRef"
                            :pk="pk"
                            :elements-options="elementsOptions"
                            :confirm-params="confirmParams"
                        />
                    </div>

                     <div class="mt-10" v-show="!isLoading">
                         <button class="btn btn-block btn-primary br-100" @click="payer()">
                             Payer
                         </button>
                     </div>
                     <div v-show="isLoading" class="mt-40 pb-40 text-center">
                         <izy-hollow-loading loading :colour="'#46D465'" />
                     </div>
              </div>
          </div>
      </div>
    </div>
</template>

<script>
import { StripeElementPayment } from '@vue-stripe/vue-stripe'
import config from '@/services/config'

export default {

    data: () => ({
        elementsOptions: {},
        confirmParams: {
            return_url: '',
        },
    }),

    props: {
        user: { type: Object, default: () => {} },
        donation: { type: Object, default: () => {} },
    },

    components: { StripeElementPayment },

    watch: {
        donation: {
            immediate: true,
            handler: function (val) {
                if (val) {
                    this.elementsOptions.clientSecret = val.client_secret
                    this.confirmParams.return_url = `${this.$config.get('front_url')}checkout/success?user=${this.user.username}`
                }
            }
        }
    },

    computed: {
        name () {
            return this.user.first_name + ' ' + this.user.last_name
        },

        logo () {
            return this.user.image
        },

        pk () {
            return config.get('stripe_key')
        },
    },

    methods: {
        payer () {
            this.startLoading()
            this.$refs.paymentRef.submit();
        },

        closeM () {
            window.$('#confirmDonModal').modal('hide')
            this.$store.commit('SET_SHOW_BANCAIRE_MODAL', false)
        },
    }
}
</script>
