<template lang="html">
    <div class="">
      <section class="_header padding" v-show="!isLoading">
          <div class="block" @click="go('home')"><div class="logo pointer">zebest</div></div>
      </section>

      <section class="home" v-show="!isLoading">
        <div class="block mt-40">
          <h1>compléter mon profil</h1>

          <form class="_form mt-20 dark" @submit.prevent>
              <div class="center">
                  <div class="file-upload">
                      <button class="file-upload-btn" type="button" @click="openUpload()">Add Image</button>

                      <div class="image-upload-wrap">
                          <input class="file-upload-input" type="file" @onchange="readURL(this)" accept="image/*" />
                          <div class="drag-text">
                              <h3>Drag and drop a file or select add Image</h3>
                          </div>
                      </div>
                      <div class="file-upload-content">
                          <img class="file-upload-image" src="#" alt="your image" />
                          <div class="image-title-wrap">
                              <button type="button" @click="removeUpload()" class="remove-image">Remove <span class="image-title">Uploaded Image</span></button>
                          </div>
                      </div>
                  </div>

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
                    name="social_link"
                    placeholder="https://"
                    class="form-control form-control-lg input"
                    v-model="ghost.social_link"
                    v-validate="'required|min:6'"
                >
                  <span class="has-error">{{ errors.first('social_link') }}</span>
             </div>

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
        dropzoneOptions: {
            thumbnailWidth: 150,
            maxFilesize: 2.0,
            maxFiles:1,
            multipleFiles:false,
            acceptedFiles: ".jpeg,.jpg,.png",
            headers: { "My-Awesome-Header": "header value" },
            dictDefaultMessage: "<i class='feather icon-camera'></i>",
        },
        ghost: {}
    }),

    mounted () {
        this.getProfile()
        this.dropzoneOptions.url = this.upload_url
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
            this.showErrors =  true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()

            let url = '/user-api/users/' + this.auth.id + '/'
            this.ghost.payment_link = `${this.$config.get('front_url')}${this.ghost.username}`
            const response = await this.$api.patch(url, this.ghost)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.showErrors =  false
                    AuthService.setUser(response.data)
                    this.$swal.success('Confirmation', 'Compte modifié avec succès !')
                }
        },

        async getProfile () {
            this.showErrors =  true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

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
                }
        },

        uploadFile (file) {
            console.log(file)
            this.ghost.image = file
        },

        readURL (input) {
            if (input.files && input.files[0]) {

            var reader = new FileReader();

            reader.onload = function(e) {
                $('.image-upload-wrap').hide();
                $('.file-upload-image').attr('src', e.target.result);
                $('.file-upload-content').show();
                $('.image-title').html(input.files[0].name);
            };

            reader.readAsDataURL(input.files[0]);

            } else {
                this.removeUpload()
            }
        },

        removeUpload () {
            $('.file-upload-input').replaceWith($('.file-upload-input').clone());
            $('.file-upload-content').hide();
            $('.image-upload-wrap').show();
        },

        openUpload () {
            $('.file-upload-input').trigger('click')
        }
    }
}
</script>
