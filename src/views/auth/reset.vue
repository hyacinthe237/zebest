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
          <h1>modification mot de passe</h1>

          <form class="_form mt-20" @submit.prevent>
             <div class="form-group">
                <input type="password"
                    name="new_password1"
                    placeholder="Mot de passe"
                    class="form-control form-control-lg input"
                    v-model="ghost.new_password1"
                    v-validate="'required|min:8'"
                >
                  <span class="has-error">{{ errors.first('new_password1') }}</span>
             </div>

             <div class="form-group">
                <input type="password"
                    name="new_password2"
                    placeholder="Confirmation mot de passe"
                    class="form-control form-control-lg input"
                    v-model="ghost.new_password2"
                    v-validate="'required|min:8'"
                >
                  <span class="has-error">{{ errors.first('new_password2') }}</span>
             </div>

             <div class="mt-20">
                 <button class="btn btn-block btn-primary br-100" @click="reset()">
                     Je modifie mon mot de passe
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
    name: 'Reset',

    data: () => ({
        ghost: { new_password1: '', new_password2: '' }
    }),

    mounted () {
        this.resetGhost()
    },

    computed: {
    },

    methods: {
        resetGhost () {
            this.ghost = { new_password1: '', new_password2: '' }
        },
        /**
         * User signs in
         * @return {void}
         */
        async reset () {
            const isValid = await this.$validator.validate()
            if (!isValid) return false
            this.isLoading = true

            const response = await this.$api.post('/auth/password/change/', this.ghost)
                .catch(error => {
                    this.isLoading = false
                    console.log('erreur => ', error.response.data)
                    this.$toastr.error('Erreur création compte', error.response.data)
                })

            if (response) {
                this.isLoading = false
                let data = response.data
                console.log(data)
                // this.go('signin')
            }
        },
    }
}
</script>
