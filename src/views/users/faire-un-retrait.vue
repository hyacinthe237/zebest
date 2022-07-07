<template lang="html">
    <div class="bg-white">
      <section class="_header">
          <div class="logo pointer" @click="go('home')">zebest</div>

      </section>

      <section class="home">
        <div class="block">
          <h2 class="mt-10">faire un retrait</h2>

          <div class="btns-block mt-20">
              <button class="btn btn-outline b-r br-10">
                  200 &euro;
              </button>
              <button class="rond">
                  <i class="feather icon-repeat"></i>
              </button>
              <button class="btn btn-outline b-l br-10">
                  130817,39 FCFA
              </button>
          </div>

          <p class="mt-20">1.00 &euro; = 657.17 FCFA <br/> *Le taux de change varie en fonction du mode d'envoi et de paiement.</p>
          <div class="recaps">
              <div class="recap-line">
                  <div class="label">Frais de transfert</div>
                  <div class="value">+ 1.90 EUR</div>
              </div>
              <div class="recap-line">
                  <div class="label">Total du transfert</div>
                  <div class="value">201.9 EUR</div>
              </div>
              <div class="recap-line">
                  <div class="label">Total dle bénéficiaire reçoit</div>
                  <div class="value">132681 FCFA</div>
              </div>
              <div class="divider"></div>
              <div class="recap-line">
                  <div class="label">Disponibilité</div>
                  <div class="value">En quelques minutes</div>
              </div>
          </div>
          <div class="mt-20">
              <button class="btn btn-block btn-primary br-100" @click="reussite()">
                  Valider
              </button>
          </div>
        </div>
      </section>

      <!-- <ConfirmModal :nature="'reussite'"></ConfirmModal> -->
    </div>
</template>

<script>
import logoPlaceholder from '@/assets/images/placeholder.png'
// import ConfirmModal from './modals/confirm'

export default {
    data: () => ({
      logoPlaceholder
    }),

    // components: { ConfirmModal },

    mounted () {},

    watch: {},

    computed: {},

    methods: {
        async save () {
            this.showErrors =  true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()
            this.ghost.role = this.roles.filter(r => r.id == this.ghost.role)[0].id

            const URL = 'api/accounts/' + this.auth.account.id + '/update'
            const response = await this.$api.put(URL, this.ghost)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.showErrors =  false
                    this.$store.dispatch('users/getUser', this.auth.account.id)
                    this.$swal.success('Confirmation', this.$translate.text('Profile updated successfully !'))
                }
        },

        async getUser () {
            this.startLoading()

            const URL = 'api/accounts/' + this.auth.account.id + '/update'
            const response = await this.$api.get(URL)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.$store.commit('users/SET_USER', response.data)
                }
        },

        reussite () {
            window.eventBus.$emit('open', 'confirm')
            window.$('#confirmModal').modal('show')
        }

    }
}
</script>
