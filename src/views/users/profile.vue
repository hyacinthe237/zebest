<template lang="html">
    <div class="bg-white">
      <section class="_header">
          <div class="logo pointer" @click="go('home')">zebest</div>

      </section>

      <section class="home">
        <div class="block">
          <h1>compléter mon profil</h1>

          <form class="_form mt-20 dark" @submit.prevent="signin()">
              <div class="content-profile-photo">
                  <div class="photo"><i class="feather icon-camera"></i></div>
                  <span>Ajouter une photo</span>
              </div>
             <div class="form-group mt-20">
                <label for="name">Nom</label>
                <input type="text"
                    name="nom"
                    placeholder="Nom"
                    class="form-control form-control-lg input"
                    v-model="ghost.name"
                    v-validate="'required|min:6'"
                >
                  <span class="has-error">{{ errors.first('name') }}</span>
             </div>

            <div class="form-group mt-20">
                <label for="url">Ton lien personnalisé</label>
                <div class="content">
                    <div class="teal">zebest.com/</div>
                    <input type="url"
                        name="url"
                        placeholder="tonnomdecreateur"
                        class="form-control form-control-lg dark"
                        v-model="ghost.url"
                        v-validate="'required|min:6'"
                    >
                    <div class="check"><i class="feather icon-check primary"></i></div>
                </div>
                <span class="has-error">{{ errors.first('url') }}</span>
            </div>

             <div class="form-group mt-20">
                <label for="about">A propos</label>
                    <textarea
                    name="nom"
                    placeholder="Bonjour, j'ai créé cette page pour ceux qui veulent me soutenir."
                    class="form-control textarea form-control-lg"
                    v-model="ghost.about" rows="5" cols="33"></textarea>
                  <span class="has-error">{{ errors.first('about') }}</span>
             </div>

             <div class="form-group mt-20">
                <label for="link">Lien de ta page (Facebook, Tiktok, snapTchat, etc...)</label>
                <input type="text"
                    name="link"
                    placeholder="https://"
                    class="form-control form-control-lg input"
                    v-model="ghost.link"
                    v-validate="'required|min:6'"
                >
                  <span class="has-error">{{ errors.first('link') }}</span>
             </div>

             <div class="mt-20">
                 <button class="btn btn-block btn-primary" @click="go('choix-devise')">
                     Continuer
                 </button>
             </div>
           </form>
        </div>
      </section>
    </div>
</template>

<script>
// import _ from 'lodash'

export default {

    components: { },

    mounted () {},

    watch: {},

    computed: {},

    methods: {
        async save () {
            this.showErrors =  true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()
            this.ghost.role = this.roles.filter(r => r.id == this.ghost.role)[0].id

            const URL = 'api/accounts/' + this.auth.account.id + '/update'
            const response = await this.$api.put(URL, this.ghost)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.showErrors =  false
                    this.$store.dispatch('users/getUser', this.auth.account.id)
                    this.$swal.success('Confirmation', this.$translate.text('Profile updated successfully !'))
                }
        },

        async getUser () {
            this.startLoading()

            const URL = 'api/accounts/' + this.auth.account.id + '/update'
            const response = await this.$api.get(URL)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.$store.commit('users/SET_USER', response.data)
                }
        },

        resetpassword () {
            window.eventBus.$emit('reset', 'password')
            window.$('#resetUserModal').modal('show')
        }

    }
}
</script>
