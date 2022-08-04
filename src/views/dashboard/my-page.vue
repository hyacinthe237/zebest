<template>
    <div class="">
      <VueScrollFixedNavbar>
          <section class="_header padding">
              <div class="block-h">
                  <div class="logo pointer" @click="go('home')">zebest</div>
                  <div class="buttons" v-if="isConnected">
                      <div class="dropdown">
                          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              Bienvenue, {{ auth.username }}
                          </button>
                          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                              <!-- <a class="dropdown-item" href="#">Action</a>
                              <a class="dropdown-item" href="#">Another action</a> -->
                              <a class="dropdown-item pointer" href="#" @click="logout()">Se déconnecter</a>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      </VueScrollFixedNavbar>

        <div class="mypage">
          <div v-show="isLoading" class="mt-60 loading">
              <izy-hollow-loading loading :colour="'#46D465'"/>
          </div>

          <div class="container" v-show="!isLoading">
              <div class="_tabs mt-20">
                  <div class="nav nav-tabs" id="nav-tab" role="tablist">
                      <a class="nav-item nav-link" id="nav-editer-tab"
                          data-toggle="tab" href="#nav-editer" role="tab"
                          aria-controls="nav-editer">Editer mon compte</a>

                      <a class="nav-item nav-link" id="nav-stats-tab"
                          data-toggle="tab" href="#nav-stats" role="tab"
                          aria-controls="nav-stats">Mes statistiques</a>

                      <a class="nav-item nav-link" id="nav-retrait-tab"
                          data-toggle="tab" href="#nav-retrait" role="tab"
                          aria-controls="nav-retrait">Faire un retrait</a>
                  </div>
              </div>

              <div class="tab-content" id="nav-tabContent">
                  <div class="tab-pane fade" id="nav-editer" role="tabpanel" aria-labelledby="nav-editer-tab">
                    <form class="_form mt-20 dark" @submit.prevent>
                        <div class="content-profile-photo pointer">
                            <input type="file" name='image' id="fileElem" accept="image/*" style="display:none" @change="handleFile">
                            <!-- <div class="photo" id="fileSelect">
                                <i class="feather icon-camera" v-if="displayIcon"></i>
                                <img class="image" id="image" src="" v-else/>
                            </div> -->

                            <div class="photo" id="fileSelect">
                                <img class="image" id="image" :src="ghost.image"/>
                            </div>
                            <span v-show="displayIcon">Ajouter une photo</span>
                        </div>
                      <div class="row">
                          <div class="col-sm-12">
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
                          <div class="col-sm-12">
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
                           <button class="btn btn-block btn-primary br-100" @click="saveProfile()">
                               Enregistrer
                           </button>
                       </div>
                     </form>
                  </div>

                  <div class="tab-pane fade" id="nav-stats" role="tabpanel" aria-labelledby="nav-stats-tab">
                      <div class="row">
                        <div class="col-sm-12">
                          Mes statistiques : Il pourra voir ses stats sous forme de graph représentant les
                          donations reçu d’une période à une autre.
                        </div>
                      </div>
                  </div>

                  <div class="tab-pane fade" id="nav-retrait" role="tabpanel" aria-labelledby="nav-retrait-tab">
                      <div class="row">
                        <div class="block">
                          <h2 class="mt-10">faire un retrait</h2>

                          <div class="btns-block mt-20">
                              <button class="btn btn-outline b-r br-10">
                                  200 &euro;
                              </button>
                              <button class="rond">
                                  <i class="feather icon-repeat"></i>
                              </button>
                              <button class="btn btn-outline b-l br-10">
                                  130817,39 FCFA
                              </button>
                          </div>

                          <p class="mt-20">1.00 &euro; = 657.17 FCFA <br/> *Le taux de change varie en fonction du mode d'envoi et de paiement.</p>
                          <div class="recaps">
                              <div class="recap-line">
                                  <div class="label">Frais de transfert</div>
                                  <div class="value">+ 1.90 EUR</div>
                              </div>
                              <div class="recap-line">
                                  <div class="label">Total du transfert</div>
                                  <div class="value">201.9 EUR</div>
                              </div>
                              <div class="recap-line">
                                  <div class="label">Montant à reçevoir</div>
                                  <div class="value">132681 FCFA</div>
                              </div>
                              <div class="divider"></div>
                              <div class="recap-line">
                                  <div class="label">Disponibilité</div>
                                  <div class="value">En quelques minutes</div>
                              </div>
                          </div>
                          <div class="mt-20">
                              <button class="btn btn-block btn-primary br-100">
                                  Valider
                              </button>
                          </div>
                        </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- <LoadingModal/> -->
        </div>
    </div>
</template>

<script>
import AuthService from '@/services/auth'
import { VueScrollFixedNavbar } from "vue-scroll-fixed-navbar"
// import LoadingModal from '@/components/commons/loaders/modal'

// import moment from 'moment'
// import _ from 'lodash'

export default {
    data: () => ({
        duration: '',
        endDate: '',
        interval: null,
        displayIcon: true
    }),

    components: { VueScrollFixedNavbar },

    computed: {
        auth () {
            return JSON.parse(localStorage.getItem(this.$config.get('user')))
        },

        upload_url () {
            return `${this.$config.get('base_url')}/user-api/users/${this.auth.id}/logo`
        },

        isConnected () { return !_.isEmpty(this.auth) },
    },

    mounted () {
        // this.listenToEvents()
        this.getProfile()
        this.activeEditerTab()
        var fileSelect = document.getElementById("fileSelect"),
        fileElem = document.getElementById("fileElem");

        fileSelect.addEventListener("click", function (e) {
            if (fileElem) {
                fileElem.click();
            }
            e.preventDefault(); // empêche la navigation vers "#"
        }, false);
    },

    methods: {
        activeEditerTab () {
            $('#nav-editer-tab').click()
            $('#nav-editer').addClass("active")
            $('#nav-editer-tab').focus()
        },
        /**
         * Events listeners
         *
         * @return {void}
         */
        listenToEvents () {
            window.eventBus.$on('loading:show', () => {
                $('#loadingModal').modal('show')
            })

            window.eventBus.$on('loading:hide', () => {
                $('#loadingModal').modal('hide')
            })
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
        },

        async saveProfile () {
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
                        this.$swal.success('Confirmation', 'Compte modifié avec succès !')
                    }
            }
        },

        logout () {
            AuthService.logout()
            this.go('home')
            window.setTimeout(location.reload(), 50000)
        }
    }
}
</script>
