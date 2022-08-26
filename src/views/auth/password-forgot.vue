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
          <h1>Mot de passe oublié</h1>

          <form class="_form mt-20" @submit.prevent>
             <div class="form-group">
                <input type="email"
                    name="email"
                    placeholder="Email"
                    class="form-control form-control-lg input"
                    v-model="ghost.email"
                    v-validate="'required'"
                >
                  <span class="has-error">{{ errors.first('email') }}</span>
             </div>

             <div class="mt-20">
                 <button class="btn btn-block btn-primary br-100" @click="send()">
                     Envoyer
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
export default {
    name: 'ForgotPassword',

    data: () => ({
        ghost: { email: '' },
        message: 'Merci de vérifier votre email. Un mot de passe vous a été envoyé.',
    }),

    methods: {
        /**
         * User forgot password
         * @return {void}
         */
        async send () {
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()

            const response = await this.$api.post('/user-api/custom-password-reset/', this.ghost)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error('Erreur de validation', error.response.data.message)
                })

            if (response) {
                this.stopLoading()
                this.$swal.success('Confirmation', this.message)
                this.go('signin')
            }
        },
    }
}
</script>
