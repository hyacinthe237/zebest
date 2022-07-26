<template lang="html">
<div class="">
  <section class="_header padding">
      <div class="block">
          <div class="logo pointer">zebest</div>
          <div class="buttons">
            <button
                @click="go('signup')"
                class="btn btn-primary br-100"
                :disabled="isLoading"
            >{{ t('Inscription') }}</button>
          </div>
      </div>
  </section>
  <section class="home">
    <div class="block mt-60">
      <h2>Connectez-vous</h2>

      <form class="_form mt-20" @submit.prevent="signin()">
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
             <button class="btn btn-block btn-primary br-100" @click="go('home')">
                 Connexion
             </button>
         </div>
       </form>
    </div>
  </section>
</div>
</template>

<script>
import ApiService from '@/services/api'
import AuthService from '@/services/auth'
// import _ from 'lodash'

export default {
    name: 'Signin',

    data: () => ({
        ghost: { email: '', password: '' }
    }),

    computed: {},

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
                    this.$swal.error(this.$translate.text('Login error'), this.$translate.text(error.response.data.error))
                })

            if (response) {
                let data = response.data
                AuthService.setUser(data)
                AuthService.setToken(data.token)
                ApiService.setToken(data.token)
                localStorage.setItem(this.$config.get('token'), data.token)

                this.n('home')
                window.location.reload()
            }

            this.isLoading = false
        },
    }
}
</script>
