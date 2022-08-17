<template lang="html">
    <div class="">
      <section class="_header padding" v-show="!isLoading">
          <div class="block-h" @click="go('home')"><div class="logo pointer">zebest</div></div>
      </section>

      <section class="home" v-show="!isLoading">
        <div class="block mt-40">
          <h2>compléter mon profil</h2>

          <form class="_form mt-20 dark" @submit.prevent>
              <div class="content-profile-photo pointer">
                  <input type="file" name='image' id="fileElem" accept="image/*" style="display:none" @change="handleFile">
                  <div class="photo" id="fileSelect">
                      <i class="feather icon-camera" v-if="displayIcon"></i>
                      <img class="image" id="image" src="" v-else/>
                  </div>
                  <span v-show="displayIcon">Ajouter une photo</span>
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
                           v-validate="'required'"
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
                           v-validate="'required'"
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
                        v-validate="'required'"
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
                        v-model="ghost.bio" rows="5" cols="33" v-validate="'required'"
                    ></textarea>
                  <span class="has-error">{{ errors.first('bio') }}</span>
             </div>

             <!-- <div class="form-group mt-20">
                <label for="link">Lien de ta page (Facebook, Tiktok, snapTchat, etc...)</label>
                <input type="text"
                    name="social_link"
                    placeholder="https://"
                    class="form-control form-control-lg input"
                    v-model="ghost.social_link"
                    v-validate="'required'"
                >
                  <span class="has-error">{{ errors.first('social_link') }}</span>
             </div> -->

             <div class="mt-20 mb-20">
                 <button class="btn btn-block btn-primary br-100" @click="save()">
                     Continuer
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
// import _ from 'lodash'
import AuthService from '@/services/auth'

export default {
    name: 'Profile',

    data: () => ({
        ghost: {},
        displayIcon: true
    }),

    mounted () {
        this.getProfile()
        var fileSelect = document.getElementById("fileSelect"),
        fileElem = document.getElementById("fileElem");

        fileSelect.addEventListener("click", function (e) {
            if (fileElem) {
                fileElem.click();
            }
            e.preventDefault(); // empêche la navigation vers "#"
        }, false);
    },

    computed: {
        auth () {
            return JSON.parse(localStorage.getItem(this.$config.get('user')))
        },

        upload_url () {
            return `${this.$config.get('base_url')}/user-api/users/${this.auth.id}/logo`
        },
    },

    methods: {
        async save () {
            if (this.ghost.image == null) {
                this.$swal.error('Validation', 'Votre photo de profil est vide')
            } else {
                this.showErrors =  true
                const isValid = await this.$validator.validate()
                if (!isValid) return false

                this.startLoading()
                this.ghost.payment_link = `${this.$config.get('front_url')}${this.ghost.username}`

                let formData = new FormData()
                formData.append('bio', this.ghost.bio)
                formData.append('payment_link', this.ghost.payment_link)
                formData.append('image', this.ghost.image)
                formData.append('last_name', this.ghost.last_name)
                formData.append('first_name', this.ghost.first_name)

                let url = '/user-api/users/' + this.auth.id + '/'
                const response = await this.$api.patch(url, formData)
                    .catch(error => {
                        this.stopLoading()
                        this.$swal.error(this.$translate.text('Erreur'), this.$translate.text(error.response.data.message))
                    })

                    if (response) {
                        this.stopLoading()
                        this.showErrors =  false
                        AuthService.setUser(response.data)
                        this.go('choix-devise')
                        // this.$swal.success('Confirmation', 'Compte modifié avec succès !')
                    }
            }
        },

        async getProfile () {
            this.startLoading()

            let url = '/user-api/users/' + this.auth.id + '/'
            const response = await this.$api.get(url)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.message))
                })

                if (response) {
                    this.stopLoading()
                    this.showErrors =  false
                    AuthService.setUser(response.data)
                    this.ghost = Object.assign({}, response.data)
                    if(this.ghost.image !== null) {
                        this.displayIcon = false
                        $('#image').attr('src', this.ghost.image)
                    }
                }
        },

        handleFile (e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;

            var reader = new FileReader()

            reader.onloadend = function () {
                $('.image').attr('src', reader.result)
            }
            reader.readAsDataURL(files[0])
            this.ghost.image = files[0]
            this.displayIcon = false
        }
    }
}
</script>
