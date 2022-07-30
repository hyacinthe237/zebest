<template lang="html">
<div class="">
  <section class="_header padding" v-show="!isLoading">
      <div class="block">
          <div class="logo pointer" @click="go('home')">zebest</div>
          <div class="buttons">
            <button
                @click="go('signup')"
                class="btn btn-primary br-100"
                :disabled="isLoading"
            >{{ t('Inscription') }}</button>
          </div>
      </div>
  </section>
  <section class="home" v-show="!isLoading">
    <div class="block mt-60">
      <h2>Connectez-vous</h2>

      <form class="_form mt-20" @submit.prevent>
         <div class="form-group">
            <input type="email"
                name="email"
                placeholder="email"
                class="form-control form-control-lg input"
                v-model="ghost.email"
                v-validate="'required|min:6'"
            >
              <span class="has-error">{{ errors.first('email') }}</span>
         </div>

         <div class="form-group">
            <input type="password"
                name="password"
                placeholder="mot de passe"
                class="form-control form-control-lg input"
                v-model="ghost.password"
                v-validate="'required|min:6'"
            >
              <span class="has-error">{{ errors.first('password') }}</span>
         </div>

         <div class="mt-20">
             <button class="btn btn-block btn-primary br-100" @click="signin()">
                 Connexion
             </button>
         </div>
       </form>
    </div>
  </section>
  <div v-show="isLoading" class="mt-60 loading">
      <izy-hollow-loading loading />
  </div>
</div>
</template>

<script>
import ApiService from '@/services/api'
import AuthService from '@/services/auth'
// import _ from 'lodash'

export default {
    name: 'Signin',

    data: () => ({
        message: 'la façon la plus simple pour les créateurs de contenu en Afrique de recevoir des donations de leurs fans.',
        ghost: { email: '', password: '' }
    }),

    methods: {
        /**
         * User signs in
         * @return {void}
         */
        async signin () {
            const isValid = await this.$validator.validate()
            if (!isValid) return false
            this.isLoading = true

            let formData = new FormData()
            formData.append('email', this.ghost.email)
            formData.append('password', this.ghost.password)

            const response = await this.$api.post('/login', formData)
                .catch(error => {
                    this.isLoading = true
                    console.log('error => ', error.response.data.error)
                    this.$swal.error(this.$translate.text('Erreur de connexion'), this.$translate.text(error.response.data.error))
                })

            if (response) {
                let data = response.data
                AuthService.setUser(data)
                AuthService.setToken(data.user_token)
                ApiService.setToken(data.user_token)
                // localStorage.setItem(this.$config.get('token'), data.user_token)
                this.$swal.success('Bienvenue sur Zebest', this.message)
                this.go('home')
            }

            this.isLoading = false
        },
    }
}
</script>
