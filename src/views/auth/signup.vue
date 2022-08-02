<template lang="html">
    <div class="">
      <section class="_header padding" v-show="!isLoading">
          <div class="block">
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

             <div class="form-group">
                 <div class="content bs pl-100">
                     <div class="dark">zebest.com/</div>
                     <input type="text"
                         name="username"
                         placeholder="tonnomdecreateur"
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
          <izy-hollow-loading loading />
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
        ghost: { email: '', username: '', password1: '', password2: '' }
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
                password2: ''
            }
        },
        /**
         * User signs in
         * @return {void}
         */
        async signup () {
            const isValid = await this.$validator.validate()
            if (!isValid) return false
            this.isLoading = true

            let formData = new FormData()
            formData.append('email', this.ghost.email)
            formData.append('username', this.ghost.username)
            formData.append('password1', this.ghost.password1)
            formData.append('password2', this.ghost.password2)

            const response = await this.$api.post('/registration/', formData)
                .catch(error => {
                    this.isLoading = false
                    console.log('erreur => ', error.response.data)
                    let str = ''
                    str = error.response.data.email ? error.response.data.email[0] : ''
                    str = error.response.data.username ? error.response.data.username[0] : ''
                    str = error.response.data.password1 ? error.response.data.password1[0] : ''
                    str = error.response.data.password2 ? error.response.data.password2[0] : ''
                    this.$toastr.error('Erreur création compte', str)
                })

            if (response) {
                this.isLoading = false
                let data = response.data
                this.$swal.success('Confirmation', this.message)
                AuthService.setUser(data)
                // AuthService.setToken(data.key)
                // ApiService.setToken(data.key)
                this.go('verify')
                localStorage.removeItem('username')
            }
        },
    }
}
</script>
