<template lang="html">
    <div class="bg-white">
      <section class="_header">
          <div class="logo pointer" @click="go('home')">zebest</div>

      </section>

      <section class="home">
        <div class="block">
          <h1>choix de la devise</h1>

          <form class="_form mt-20 dark" @submit.prevent="signin()">
             <div class="form-group mt-20">
                <label for="devise">En quelle devise souhaiterai-tu être payé(e) ?</label>
                <select
                    name="devise"
                    v-model="ghost.devise"
                    class="form-control form-control-lg input"
                >
                <option
                    v-for="r in devises"
                    :key="r.id"
                    :value="r.id"
                >{{ r.name }}</option>
                </select>
                  <span class="has-error">{{ errors.first('name') }}</span>
             </div>

             <div class="form-group mt-20">
                 <label for="url">Connecter votre numéro de portefeuille mobile</label>
                 <div class="content">
                     <select
                         name="devise"
                         v-model="ghost.devise"
                         class="form-control form-control-lg w-20"
                     >
                     <option
                         v-for="r in devises"
                         :key="r.id"
                         :value="r.id"
                     >{{ r.name }}</option>
                     </select>
                     <input type="url"
                         name="url"
                         placeholder="Numéro de téléphone"
                         class="form-control form-control-lg dark"
                         v-model="ghost.url"
                         v-validate="'required|min:6'"
                     >
                 </div>
                 <span class="has-error">{{ errors.first('url') }}</span>
             </div>

             <div class="mt-20">
                 <button class="btn btn-block btn-primary br-100" @click="openConfirm()">
                     Valider
                 </button>
             </div>
           </form>
        </div>
      </section>

      <ConfirmModal :nature="'page'"></ConfirmModal>
    </div>
</template>

<script>
import ConfirmModal from './modals/confirm'

export default {
    name: 'ChoixDevise',

    data: () => ({
      devises: []
    }),
    components: { ConfirmModal },

    mounted () {
      this.initDevises()
      this.ghost.devise = 1
    },

    watch: {},

    computed: {},

    methods: {
        initDevises() {
            this.devises = [
              { 'id': 1, 'name': 'USD - Dollar Américain'},
              { 'id': 2, 'name': 'EUR - Union Economique Européenne'},
              { 'id': 3, 'name': 'GBP - Royaume-Uni'},
              { 'id': 4, 'name': 'CAD - Dollar Canadien'},
            ]
        },
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

        openConfirm () {
            window.eventBus.$emit('open', 'confirm')
            window.$('#confirmModal').modal('show')
        }

    }
}
</script>
