<template lang="html">
    <div class="">
      <section class="_header padding" v-show="!isLoading">
          <div class="block"><div class="logo pointer" @click="go('home')">zebest</div></div>
      </section>

      <section class="home" v-show="!isLoading">
        <div class="block">
          <h1>Choix de la devise</h1>

          <form class="_form mt-20 dark" @submit.prevent>
             <div class="form-group mt-20">
                <label for="devise">En quelle devise souhaiterais-tu être payé(e) ?</label>
                <select
                    name="currency"
                    v-model="ghost.currency"
                    class="form-control form-control-lg input"
                >
                <option
                    v-for="r in devises"
                    :key="r.id"
                    :value="r.id"
                >{{ r.name }}</option>
                </select>
             </div>

             <div class="form-group mt-20">
                 <label for="phone">Connecter votre numéro de portefeuille mobile</label>
                 <input type="text"
                     name="phone"
                     placeholder="+237651545258"
                     class="form-control form-control-lg input"
                     v-model="ghost.phone"
                 >
             </div>

             <div class="mt-20">
                 <button class="btn btn-block btn-primary br-100" @click="save()">
                     Valider
                 </button>
             </div>
           </form>
        </div>
      </section>
      <div v-show="isLoading" class="mt-60 loading">
          <izy-hollow-loading loading />
      </div>

      <ConfirmModal v-if="showModal" :user="auth"></ConfirmModal>
    </div>
</template>

<script>
import ConfirmModal from './modals/confirm'

export default {
    name: 'ChoixDevise',

    data: () => ({
        devises: [],
        showModal: false,
    }),

    components: { ConfirmModal },

    mounted () {
        this.initDevises()
        this.ghost.currency = 'EUR'
    },

    computed: {
        auth () {
            return JSON.parse(localStorage.getItem(this.$config.get('user')))
        },
    },

    methods: {
        initDevises() {
            this.devises = [
              { 'id': 'USD', 'name': 'USD - Dollar Américain'},
              { 'id': 'EUR', 'name': 'EUR - Union Economique Européenne'},
              { 'id': 'XAF', 'name': 'XAF - Franc CFA'},
            ]
        },
        async save () {
            this.showErrors =  true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()

            const response = await this.$api.post('/payment-api/wallets/', this.ghost)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.showErrors =  false
                    this.showModal =  true
                    let params = {'id': 'confirmModal'}
                    this.openModal(params)
                    this.openPaymentLink()
                }
        },

        openPaymentLink () {
            let user = this.auth
            let route = this.$router.resolve({ name: 'my-page', params: { id: user.username } })
            window.open(route.href, '_self')
        }

    }
}
</script>
