<template lang="html">
    <div class="">
      <section class="_header padding" v-show="!isLoading">
          <div class="block-h">
              <div class="logo pointer" @click="go('home')">zebest</div>
              <div class="buttons">
                <button
                    @click="go('signin')"
                    class="btn btn-block btn-primary br-100"
                    :disabled="isLoading"
                >{{ t('Se connecter') }}</button>
              </div>
          </div>
      </section>
      <section class="home" v-show="!isLoading">
        <div class="block mt-60">
          <h1>créer mon compte</h1>

          <form class="_form mt-20" @submit.prevent>
             <div class="form-group">
                <input type="email"
                    name="email"
                    placeholder="Email"
                    class="form-control form-control-lg input"
                    v-model="ghost.email"
                    v-validate="'required|min:6'"
                >
                  <span class="has-error">{{ errors.first('email') }}</span>
             </div>

             <div class="form-group mt-20">
                <select
                    name="is_creator"
                    v-model="ghost.is_creator"
                    class="form-control form-control-lg input"
                >
                <option :value="true">Je suis un créateur de contenu</option>
                <option :value="false">Je ne suis pas un créateur de contenu</option>
                </select>
             </div>

             <div class="form-group">
                 <div class="content bs pl-100">
                     <div class="dark">getzebest.com/</div>
                     <input type="text"
                         name="username"
                         placeholder="tonnom"
                         class="form-control form-control-lg dark no-white"
                         v-model="ghost.username"
                         v-validate="'required'"
                     >
                 </div>
                 <span class="has-error">{{ errors.first('username') }}</span>
             </div>

             <div class="form-group">
                <input type="password"
                    name="password1"
                    placeholder="Mot de passe"
                    class="form-control form-control-lg input"
                    v-model="ghost.password1"
                    v-validate="'required|min:8'"
                >
                  <span class="has-error">{{ errors.first('password1') }}</span>
             </div>

             <div class="form-group">
                <input type="password"
                    name="password2"
                    placeholder="Confirmation mot de passe"
                    class="form-control form-control-lg input"
                    v-model="ghost.password2"
                    v-validate="'required|min:8'"
                >
                  <span class="has-error">{{ errors.first('password2') }}</span>
             </div>

             <div class="mt-20">
                 <button class="btn btn-block btn-primary br-100" @click="signup()">
                     Valider mon inscription
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
import AuthService from '@/services/auth'
// import ApiService from '@/services/api'
import _ from 'lodash'

export default {
    name: 'SignUp',

    data: () => ({
        message: 'Merci de vérifier votre email. Un code de vérification vous a été envoyé.',
        ghost: { email: '', username: '', password1: '', password2: '', is_creator: false }
    }),

    mounted () {
        this.resetGhost()
    },

    computed: {
        username () { return localStorage.getItem('username') }
    },

    methods: {
        resetGhost () {
            this.ghost = {
                email: '',
                username: !_.isEmpty(this.username) ? this.username : '',
                password1: '',
                password2: '',
                is_creator: true
            }
        },
        /**
         * User signs in
         * @return {void}
         */
        async signup () {
            const isValid = await this.$validator.validate()
            if (!isValid) return false
            this.startLoading()

            const response = await this.$api.post('/registration/', this.ghost)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error('Erreur de création de compte', error.response.data.message)
                })

            if (response) {
                this.stopLoading()
                let data = response.data
                this.$swal.success('Confirmation', this.message)
                AuthService.setUser(data)
                this.go('verify')
                localStorage.removeItem('username')
                localStorage.setItem('wallet', response.data.wallet)
            }
        },
    }
}
</script>
