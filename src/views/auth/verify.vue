<template lang="html">
    <div class="">
      <section class="_header padding" v-show="!isLoading">
          <div class="block-h">
              <div class="logo pointer">zebest</div>
          </div>
      </section>

      <section class="home" v-show="!isLoading">
        <div class="block mt-60">
          <h1>vérifier mon compte</h1>

          <form class="_form mt-20" @submit.prevent>
             <div class="form-group">
                 <div class="content">
                     <input type="number"
                         name="otp"
                         placeholder="coller votre code de vérification"
                         class="form-control form-control-lg no-white"
                         v-model="ghost.otp"
                         v-validate="'required|min:6'"
                     >
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
      <div v-show="isLoading" class="loading mt-60">
          <izy-hollow-loading loading :colour="'#46D465'" />
      </div>
    </div>
</template>

<script>
// import _ from 'lodash'
import AuthService from '@/services/auth'
import ApiService from '@/services/api'
// import { mapGetters } from 'vuex'

export default {
    name: 'Verify',

    data: () => ({
        message: 'Votre compte a été activé avec succès.',
        ghost: { otp: '' }
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
            this.startLoading()

            const response = await this.$api.post('/user-api/verify-otp', { "otp": this.ghost.otp })
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error('Erreur vérification code', error.response.data.message)
                })

            if (response) {
                this.stopLoading()
                let data = response.data
                this.$swal.success('Confirmation', data.message)
                AuthService.setUser(data)
                AuthService.setToken(data.token)
                ApiService.setToken(data.token)
                this.go('profile')
            }
        },
    }
}
</script>
