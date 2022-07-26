<template lang="html">
    <div class="">
      <section class="_header padding">
          <div class="block">
              <div class="logo pointer">zebest</div>
          </div>
      </section>

      <section class="home">
        <div class="block mt-60">
          <h1>vérifier mon compte</h1>

          <form class="_form mt-20" @submit.prevent>
             <div class="form-group">
                 <div class="content">
                     <input type="text"
                         name="key"
                         placeholder="coller votre code de vérification"
                         class="form-control form-control-lg no-white"
                         v-model="ghost.key"
                         v-validate="'required|min:6'"
                     >
                     <!-- <a class="dark pointer bold">Renvoyer</a> -->
                 </div>
             </div>
             <div class="mt-20">
                 <button class="btn btn-block btn-primary br-100" @click="send()">
                     Valider
                 </button>
             </div>
           </form>
        </div>
      </section>
    </div>
</template>

<script>
// import _ from 'lodash'
import AuthService from '@/services/auth'
// import { mapGetters } from 'vuex'

export default {
    name: 'Verify',

    data: () => ({
        message: 'Merci de vérifier votre email. Un code de vérification vous a été envoyé.',
        ghost: { key: '' }
    }),

    computed: {
    },

    watch: {},

    mounted () {},

    methods: {
        /**
         * User signs in
         * @return {void}
         */
        async send () {
            const isValid = await this.$validator.validate()
            if (!isValid) return false
            this.isLoading = true

            let formData = new FormData()
            formData.append('key', this.ghost.key)

            const response = await this.$api.post('/auth/registration/verify-email/', formData)
                .catch(error => {
                    this.isLoading = true
                    console.log('erreur => ', error.response.data.error)
                    this.$swal.error(this.$translate.text('Création de compte'), this.$translate.text(error.response.data.error))
                })

            if (response) {
                // let data = response.data
                // AuthService.setUser(data)
                // AuthService.setToken(data.token)
                // ApiService.setToken(data.token)
                // localStorage.setItem(this.$config.get('token'), data.token)

                this.n('profile')
                // window.location.reload()
            }

            this.isLoading = false
        },
    }
}
</script>
