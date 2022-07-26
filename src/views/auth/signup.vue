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
                <input type="text"
                    name="username"
                    placeholder="Username"
                    class="form-control form-control-lg input"
                    v-model="ghost.username"
                    v-validate="'required|min:6'"
                >
                  <span class="has-error">{{ errors.first('username') }}</span>
             </div>

             <div class="form-group">
                <input type="password"
                    name="password"
                    placeholder="Mot de passe"
                    class="form-control form-control-lg input"
                    v-model="ghost.password1"
                    v-validate="'required|min:8'"
                >
                  <span class="has-error">{{ errors.first('password1') }}</span>
             </div>

             <div class="form-group">
                <input type="password"
                    name="password"
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
      <div v-show="isLoading" class="mt-40 pb-40 text-center">
          <izy-hollow-loading loading />
      </div>
    </div>
</template>

<script>
export default {
    name: 'SignUp',

    data: () => ({
        message: 'Merci de vérifier votre email. Un code de vérification vous a été envoyé.',
        ghost: { email: '', username: '', password1: '', password2: '' }
    }),

    computed: {
    },

    watch: {},

    mounted () {
        this.resetGhost()
    },

    methods: {
        resetGhost () {
            this.ghost = { email: '', username: '', password1: '', password2: '' }
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
                    this.$toastr.error(error.response.data[0])
                })

            if (response) {
                this.isLoading = false
                this.go('verify')
                this.$toastr.success(this.message)
                this.resetGhost()
            }

        },
    }
}
</script>
