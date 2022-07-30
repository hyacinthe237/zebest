<template lang="html">
    <div class="">
      <section class="_header padding">
          <div class="block" @click="go('home')"><div class="logo pointer">zebest</div></div>
      </section>

      <section class="home">
        <div class="block mt-40">
          <h1>compléter mon profil</h1>

          <form class="_form mt-20 dark" @submit.prevent>
              <div class="center">
                  <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>

                  <span>Ajouter une photo</span>
              </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group mt-20">
                       <label for="name">Nom</label>
                       <input type="text"
                           name="last_name"
                           placeholder="Nom"
                           class="form-control form-control-lg input"
                           v-model="ghost.last_name"
                           v-validate="'required|min:6'"
                       >
                         <span class="has-error">{{ errors.first('last_name') }}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group mt-20">
                       <label for="name">Prénom</label>
                       <input type="text"
                           name="first_name"
                           placeholder="Prénom"
                           class="form-control form-control-lg input"
                           v-model="ghost.first_name"
                           v-validate="'required|min:6'"
                       >
                         <span class="has-error">{{ errors.first('first_name') }}</span>
                    </div>
                </div>
            </div>

            <div class="form-group mt-20">
                <label for="url">Ton lien personnalisé</label>
                <div class="content">
                    <div class="teal">zebest.com/</div>
                    <input type="text"
                        name="username"
                        placeholder="tonnomdecreateur"
                        class="form-control form-control-lg dark"
                        v-model="ghost.username"
                        v-validate="'required|min:6'"
                    >
                    <div class="check"><i class="feather icon-check primary"></i></div>
                </div>
                <span class="has-error">{{ errors.first('username') }}</span>
            </div>

             <div class="form-group mt-20">
                <label for="about">A propos</label>
                    <textarea
                    name="bio"
                    placeholder="Bonjour, j'ai créé cette page pour ceux qui veulent me soutenir."
                    class="form-control textarea form-control-lg"
                    v-model="ghost.bio" rows="5" cols="33"></textarea>
                  <span class="has-error">{{ errors.first('bio') }}</span>
             </div>

             <div class="form-group mt-20">
                <label for="link">Lien de ta page (Facebook, Tiktok, snapTchat, etc...)</label>
                <input type="text"
                    name="payment_link"
                    placeholder="https://"
                    class="form-control form-control-lg input"
                    v-model="ghost.payment_link"
                    v-validate="'required|min:6'"
                >
                  <span class="has-error">{{ errors.first('payment_link') }}</span>
             </div>

             <div class="mt-20 mb-20">
                 <button class="btn btn-block btn-primary br-100" @click="save()">
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
    name: 'Profile',

    data: () => ({
        dropzoneOptions: {
            url: 'https://httpbin.org/post',
            thumbnailWidth: 150,
            maxFilesize: 0.5,
            maxFiles:1,
            type: "image/png",
            headers: { "My-Awesome-Header": "header value" },
            dictDefaultMessage: "<i class='feather icon-camera'></i>"
        },
    }),

    mounted () {
        this.ghost = Object.assign({}, this.user)
    },
    computed: {
        user () {
            return JSON.parse(localStorage.getItem(this.$config.get('user')))
        }
    },

    methods: {
        async save () {
            this.showErrors =  true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()

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
    }
}
</script>
