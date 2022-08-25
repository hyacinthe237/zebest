<template lang="html">
<div class="">
  <section class="_header padding" v-show="!isLoading">
      <div class="block-h">
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
            <input type="text"
                name="username"
                placeholder="Ton nom de créateur"
                class="form-control form-control-lg input"
                v-model="ghost.username"
                v-validate="'required|min:6'"
            >
              <span class="has-error">{{ errors.first('username') }}</span>
         </div>

         <div class="form-group">
            <input type="password"
                name="password"
                placeholder="mot de passe"
                class="form-control form-control-lg input"
                v-model="ghost.password"
                v-validate="'required|min:8'"
            >
              <span class="has-error">{{ errors.first('password') }}</span>
         </div>

         <div class="text-right mt-10 primary pointer bold" @click="go('password-forgot')">Mot de passe oublié ?</div>

         <div class="mt-20">
             <button class="btn btn-block btn-primary br-100" @click="signin()">
                 Connexion
             </button>
         </div>
       </form>
    </div>
  </section>
  <div v-show="isLoading" class="mt-60 loading">
      <izy-hollow-loading loading :colour="'#46D465'" />
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
        ghost: { username: '', password: '' }
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

            const payload = { username: this.ghost.username, password: this.ghost.password }

            const response = await this.$api.post('/user-api/login', payload)
                .catch(error => {
                    this.isLoading = true
                    console.log('error => ', error.response.data.message)
                    this.$swal.error(this.$translate.text('Erreur de connexion'), this.$translate.text(error.response.data.message))
                })

            if (response) {
                let data = response.data
                AuthService.setUser(data)
                AuthService.setToken(data.token)
                ApiService.setToken(data.token)
                this.$router.push({ name: 'my-page', params: { id: data.username } })
                this.isLoading = false
            }


        },
    }
}
</script>
