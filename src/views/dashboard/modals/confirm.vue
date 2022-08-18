<template lang="html">
    <div class="modal animated fadeIn upload" id="confirmDonModal">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="text-right">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeM()">
                      <i class="feather icon-x"></i>
                  </button>
              </div>
              <div class="modal-body">
                  <div class="_img">
                    <img :src="logo">
                  </div>

                  <h2 class="mt-20">faire un don à <span>{{ user.username }}</span></h2>

                  <form class="_form mt-20" @submit.prevent>
                    <div class="form-group">
                       <input type="email"
                           name="email"
                           placeholder="Email"
                           class="form-control form-control-lg input"
                           v-model="ghost.email"
                           v-validate="'required'"
                       >
                         <span class="has-error">{{ errors.first('email') }}</span>
                    </div>

                    <div class="form-group mt-10">
                       <input type="number"
                           name="cardId"
                           placeholder="Numéro de carte bancaire"
                           class="form-control form-control-lg input"
                           v-model="ghost.card_id"
                       >
                         <span class="has-error">{{ errors.first('cardId') }}</span>
                    </div>

                    <div class="form-group mt-10">
                       <input type="text"
                           name="name"
                           placeholder="Nom du titulaire de la carte"
                           class="form-control form-control-lg input"
                           v-model="ghost.name"
                           v-validate="'required'"
                       >
                         <span class="has-error">{{ errors.first('name') }}</span>
                    </div>

                    <div class="row">
                      <div class="col-6">
                        <div class="form-group mt-10">
                           <input type="text"
                               name="mmaa"
                               placeholder="MM/AA"
                               class="form-control form-control-lg input"
                               v-model="ghost.mmaa"
                               v-validate="'required'"
                           >
                             <span class="has-error">{{ errors.first('mmaa') }}</span>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="form-group mt-10">
                           <input type="text"
                               name="cvc"
                               placeholder="CVC"
                               class="form-control form-control-lg input"
                               v-model="ghost.cvc"
                               v-validate="'required'"
                           >
                             <span class="has-error">{{ errors.first('cv') }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- <div class="form-group">
                        <stripe-element-payment
                            ref="paymentRef"
                            :pk="pk"
                            :elements-options="elementsOptions"
                        />
                    </div> -->

                     <div class="mt-10">
                         <button class="btn btn-block btn-primary br-100" @click="payer()">
                             Payer
                         </button>
                     </div>
                   </form>
              </div>
          </div>
      </div>
        <!-- <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
        </div> -->
    </div>
</template>

<script>
import { StripeElementPayment } from '@vue-stripe/vue-stripe'
import config from '@/services/config'

export default {

    data: () => ({
      elementsOptions: {}
    }),

    props: {
        user: { type: Object, default: () => {} },
        donation: { type: Object, default: () => {} },
    },

    components: { StripeElementPayment },

    watch: {
        donation: {
            immediate: true,
            handler: function () {
                if (val) {
                    this.elementsOptions.clientSecret = val.client_secret
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
            window.$('#confirmDonModal').modal('hide')
            this.$store.commit('SET_SHOW_BANCAIRE_MODAL', false)
            this.$emit('infosBancaire', this.ghost)
        },

        closeM () {
            window.$('#confirmDonModal').modal('hide')
            this.$store.commit('SET_SHOW_BANCAIRE_MODAL', false)
        },
    }
}
</script>
