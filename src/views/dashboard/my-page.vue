<template>
    <div class="">
          <section class="_header">
              <div class="block-h">
                  <div class="logo pointer" @click="go('home')">zebest</div>
                  <div class="buttons" v-if="isConnected">
                      <div class="dropdown">
                          <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <span>Bienvenue, {{ auth.username }}</span>
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

        <div class="mypage">
          <div v-show="isLoading" class="mt-60 loading">
              <izy-hollow-loading loading :colour="'#46D465'" />
          </div>

          <div class="container" v-if="isConnected && !isLoading">
              <div class="_tabs mt-20">
                  <div class="nav nav-tabs" id="nav-tab" role="tablist">
                      <a class="nav-item nav-link" id="nav-editer-tab"
                          data-toggle="tab" href="#nav-editer" role="tab"
                          aria-controls="nav-editer">
                          <i class="feather icon-user"></i>
                          <span>Editer mon compte</span>
                      </a>

                      <a class="nav-item nav-link" id="nav-stats-tab"
                          data-toggle="tab" href="#nav-stats" role="tab"
                          aria-controls="nav-stats">
                          <i class="feather icon-activity"></i>
                          <span>Mes statistiques</span>
                      </a>

                      <a class="nav-item nav-link" id="nav-retrait-tab"
                          data-toggle="tab" href="#nav-retrait" role="tab"
                          aria-controls="nav-retrait">
                          <i class="feather icon-dollar-sign"></i>
                          <span>Faire un retrait</span>
                      </a>

                      <a class="nav-item nav-link" id="nav-social-tab"
                          data-toggle="tab" href="#nav-social" role="tab"
                          aria-controls="nav-social">
                          <i class="feather icon-globe"></i>
                          <span>Réseaux sociaux</span>
                      </a>

                      <a class="nav-item nav-link" id="nav-settings-tab"
                          data-toggle="tab" href="#nav-settings" role="tab"
                          aria-controls="nav-settings">
                          <i class="feather icon-settings"></i>
                          <span>Paramètres</span>
                      </a>
                  </div>
              </div>

              <div class="tab-content mb-20" id="nav-tabContent" v-if="isConnected">
                  <div class="tab-pane fade" id="nav-editer" role="tabpanel" aria-labelledby="nav-editer-tab">
                    <form class="_form mt-20 dark" @submit.prevent>
                        <div class="content-profile-photo">
                            <input type="file" name='image' id="fileElem" accept="image/*" style="display:none" @change="handleFile">
                            <!-- <div class="photo" id="fileSelect">
                                <i class="feather icon-camera" v-if="displayIcon"></i>
                                <img class="image" id="image" src="" v-else/>
                            </div> -->

                            <div class="photo pointer" id="fileSelect">
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
                       <div class="mt-20 mb-20">
                           <button class="btn btn-block btn-primary br-100" @click="saveProfile()">
                               Enregistrer
                           </button>
                       </div>
                     </form>
                  </div>

                  <div class="tab-pane fade" id="nav-stats" role="tabpanel" aria-labelledby="nav-stats-tab">
                      <IzyChart :chartData="chartData"></IzyChart>
                  </div>

                  <div class="tab-pane fade" id="nav-retrait" role="tabpanel" aria-labelledby="nav-retrait-tab">
                      <div class="row">
                        <div class="block">
                          <h2 class="mt-10">faire un retrait</h2>

                          <div class="btns-block mt-20">
                              <!-- <button class="btn btn-outline b-r br-10">
                                  200 &euro;
                              </button> -->

                              <input
                                  class="b-r br-10"
                                  :placeholder="200"
                                  name="amount"
                                  v-model="rhost.amount"
                                  type="number"
                              >
                              <button class="rond">
                                  <i class="feather icon-repeat"></i>
                              </button>
                              <button class="btn btn-outline b-l br-10">
                                  {{ xaf_amount }} FCFA
                              </button>
                          </div>

                          <div class="p mt-20">1.00 &euro; = 657.17 FCFA <br/> *Le taux de change varie en fonction du mode d'envoi et de paiement.</div>
                          <div class="recaps">
                              <div class="recap-line">
                                  <div class="label">Frais de transfert</div>
                                  <div class="value">+ {{ transfert_amount }} EUR</div>
                              </div>
                              <div class="recap-line">
                                  <div class="label">Total du transfert</div>
                                  <div class="value">{{ total_euro_amount }} EUR</div>
                              </div>
                              <div class="recap-line">
                                  <div class="label">Montant à reçevoir</div>
                                  <div class="value">{{ xaf_total_euro_amount }} FCFA</div>
                              </div>
                              <div class="divider"></div>
                              <div class="recap-line">
                                  <div class="label">Disponibilité</div>
                                  <div class="value">En quelques minutes</div>
                              </div>
                          </div>
                          <div class="mt-20">
                              <button class="btn btn-block btn-primary br-100" @click="retrait()">
                                  Valider
                              </button>
                          </div>
                        </div>
                      </div>
                  </div>

                  <div class="tab-pane fade" id="nav-social" role="tabpanel" aria-labelledby="nav-social-tab">
                      <form class="_form mt-20 dark" @submit.prevent>
                            <div class="form-group mt-20">
                                <label for="name">Nom du réseau social</label>
                                <input type="text"
                                    name="name"
                                    placeholder="Nom du réseau social"
                                    class="form-control form-control-lg input"
                                    v-model="shost.name"
                                    v-validate="'required'"
                                >
                                <span class="has-error">{{ errors.first('name') }}</span>
                            </div>
                            <div class="form-group mt-20">
                                <label for="link">Lien du réseau social</label>
                                <input type="text"
                                    name="link"
                                    placeholder="Lien du réseau social"
                                    class="form-control form-control-lg input"
                                    v-model="shost.link"
                                    v-validate="'required'"
                                >
                                <span class="has-error">{{ errors.first('link') }}</span>
                            </div>

                           <div class="mt-20 mb-20">
                               <button class="btn btn-block btn-primary br-100" @click="saveSocialLink()">
                                   Enregistrer
                               </button>
                           </div>
                      </form>
                      <div class="row">
                         <div class="col-sm-12">
                           <div class="social-box mt-20">
                              <div class="tle bold">Liens de vos réseaux sociaux</div>
                              <div
                                  class="social-item pointer"
                                  v-for="s in social_links"
                                  :key="s.id"
                              >
                                <a :href="s.link" target="_blank">{{ s.link }}</a>
                              </div>
                           </div>
                         </div>
                      </div>
                  </div>

                  <div class="tab-pane fade" id="nav-settings" role="tabpanel" aria-labelledby="nav-settings-tab">
                      <div class="block">
                        <h2>Choix de la devise</h2>

                        <form class="_form mt-20 dark" @submit.prevent>
                           <div class="form-group">
                              <label for="devise">En quelle devise souhaiterais-tu être payé(e) ?</label>
                              <select
                                  name="currency"
                                  v-model="host.currency"
                                  class="form-control form-control-lg input"
                              >
                              <option
                                  v-for="r in devises"
                                  :key="r.id"
                                  :value="r.id"
                              >{{ r.name }}</option>
                              </select>
                           </div>

                           <div class="form-group mt-20">
                               <label for="phone">Connecter votre numéro de portefeuille mobile</label>
                               <input type="text"
                                   name="phone"
                                   placeholder="+237651545258"
                                   class="form-control form-control-lg input"
                                   v-model="host.phone"
                               >
                           </div>

                           <div class="mt-20 text-center">
                               <button class="btn btn-primary br-100" @click="saveWallet()">
                                   Valider
                               </button>
                           </div>
                         </form>
                      </div>
                  </div>
              </div>
          </div>
          <div class="home" v-if="!isConnected && !isLoading">
            <div class="block">
              <h2>faire un don à <span>{{ title_name }}</span></h2>

              <div class="list-ronds mt-20">
                  <div :class="['rond-item', dhost.amount == 50 ? 'active' : '']" @click="selectMontant(50)">50 &euro;</div>
                  <div :class="['rond-item', dhost.amount == 100 ? 'active' : '']" @click="selectMontant(100)">100 &euro;</div>
                  <div :class="['rond-item', dhost.amount == 250 ? 'active' : '']" @click="selectMontant(250)">250 &euro;</div>
                  <div :class="['rond-item', dhost.amount == 500 ? 'active' : '']" @click="selectMontant(500)">500 &euro;</div>
              </div>

              <div class="diviseur">
                  <div class="divider"></div>
                  <div class="rond">Ou</div>
                  <div class="divider"></div>
              </div>

              <form class="_form mt-20" @submit.prevent>
                <div class="form-group mt-20">
                   <input type="number"
                       name="amount"
                       placeholder="Saisir le montant"
                       class="form-control form-control-lg input"
                       v-model="dhost.amount"
                   >
                </div>

                <div class="form-group mt-20">
                   <input type="text"
                       name="sender_first_name"
                       placeholder="Votre prénom (optionnel)"
                       class="form-control form-control-lg input"
                       v-model="dhost.sender_first_name"
                   >
                </div>

                <div class="form-group mt-20">
                   <input type="text"
                       name="sender_last_name"
                       placeholder="Votre nom (optionnel)"
                       class="form-control form-control-lg input"
                       v-model="dhost.sender_last_name"
                   >
                </div>

                <div class="form-group mt-20">
                   <select
                       name="sender_country"
                       v-model="dhost.sender_country"
                       class="form-control form-control-lg input"
                   >
                   <option value="">Sélectionnez votre pays</option>
                   <option
                       v-for="(c, index) in countries"
                       :key="index+1"
                       :value="c.value"
                   >{{ c.name }}</option>
                   </select>
                </div>

                 <div class="mt-10 mb-20">
                     <button class="btn btn-block btn-primary br-100" @click="faireundon()">
                         Ovations de {{ dhost.amount }} &euro;
                     </button>
                 </div>
               </form>
            </div>
          </div>
          <!-- <LoadingModal/> -->
        </div>

        <ConfirmModal v-if="showModal" :user="auth"></ConfirmModal>

        <BancaireModal v-if="showBancaireModal" :user="creator" :donation="donation"></BancaireModal>
    </div>
</template>

<script>
import AuthService from '@/services/auth'
import ApiService from '@/services/api'
import ConfirmModal from '../users/modals/confirm'
import BancaireModal from './modals/confirm'
import DashboardMixins from './mixins'

// import moment from 'moment'
import _ from 'lodash'

export default {
    mixins: [DashboardMixins],

    data: () => ({
        donation: {},
        duration: '',
        endDate: '',
        interval: null,
        taux: 0.07,
        taux_xaf: 657.17,
        displayIcon: true,
        social_links: [],
        devises: [],
        shost: {  name: '', link: '' },
        dhost: {  amount: '', sender_first_name: '', sender_last_name: '', sender_country: ''  },
        rhost: {  amount: 0 },
        host: {  currency: '', phone: '', balance: '' },
        montant: 100,
        creator: {},
        chartData: { labels: [], datasets: [] },
    }),

    components: { ConfirmModal, BancaireModal },

    computed: {
        auth () {
            return JSON.parse(localStorage.getItem(this.$config.get('user')))
        },

        donations () {
            return this.$store.state.donations
        },

        showModal () {
            return this.$store.state.showModal
        },

        showBancaireModal () {
            return this.$store.state.showBancaireModal
        },

        title_name () {
            return this.$route.params.id
        },

        upload_url () {
            return `${this.$config.get('base_url')}/user-api/users/${this.auth.id}/logo`
        },

        isConnected () { return !_.isEmpty(this.auth) },

        host_amount () {
          return !_.isEmpty(this.rhost.amount) ? this.rhost.amount : 0
        },

        xaf_amount () {
          let m = Number.parseInt(this.host_amount, 10) * this.taux_xaf
          return Number.parseFloat(m).toFixed(2)
        },

        transfert_amount () {
            let m = Number.parseInt(this.host_amount, 10) * this.taux
            return Number.parseFloat(m).toFixed(2)
        },

        total_euro_amount () {
            let m = +Number.parseInt(this.host_amount, 10) + +this.transfert_amount
            return Number.parseFloat(m).toFixed(2)
        },

        xaf_total_euro_amount () {
            let m = this.total_euro_amount * this.taux_xaf
            return Number.parseFloat(m).toFixed(2)
        },

        total_amount () {
            let m = +Number.parseInt(this.rhost.amount, 10) + +this.transfert_amount
            return Number.parseFloat(m).toFixed(2)
        },
    },

    mounted () {
        if (!this.isConnected) {
            ApiService.setToken(this.$route.query.ntk)
            AuthService.setToken(this.$route.query.ntk)
            this.getCreator()
            this.dhost.amount = this.montant
        }

        if (this.isConnected) {
            this.getProfile()
            this.getWallet()
            this.getSocialLinks()
            this.host.currency = 'EUR'
            this.activeEditerTab()
            this.initDevises()
            this.resetShost()
            this.getDonations()
            var fileSelect = document.getElementById("fileSelect")
            var fileElem = document.getElementById("fileElem")

            fileSelect.addEventListener("click", function (e) {
                if (fileElem) {
                    fileElem.click();
                }
                e.preventDefault(); // empêche la navigation vers "#"
            }, false);
        }

    },

    methods: {
        activeEditerTab () {
            window.$('#nav-editer-tab').click()
            window.$('#nav-editer').addClass("active")
            window.$('#nav-editer-tab').focus()
        },

        selectMontant (montant) {
            this.dhost.amount = montant
        },

        initDevises() {
            this.devises = [
              { 'id': 'USD', 'name': 'USD - Dollar Américain'},
              { 'id': 'EUR', 'name': 'EUR - Union Economique Européenne'},
              { 'id': 'XAF', 'name': 'XAF - Franc CFA'},
            ]
        },

        async saveWallet () {
            this.startLoading()
            const response = await this.$api.put(`/payment-api/wallets/${this.host.id}/`, this.host)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.getWallet()
                    this.$swal.success('Confirmation', 'Modification des paramètres !')
                }
        },

        async getWallet () {
            this.startLoading()
            const response = await this.$api.get('/payment-api/wallets/')
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.host = Object.assign({}, response.data.results[0])
                }
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

        async getCreator () {
            this.startLoading()

            const response = await this.$api.get('/auth/user/')
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error('Error', error.response.data.message)
                })

                if (response) {
                    this.stopLoading()
                    this.creator = Object.assign({}, response.data)
                    localStorage.setItem('nm', response.data.username)
                }
        },

        async getDonations () {
            this.startLoading()

            const response = await this.$api.get('/payment-api/donations/')
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error('Error', error.response.data.message)
                })

                if (response) {
                    this.stopLoading()
                    this.$store.commit('donations/SET_DONATIONS', response.data.results)
                    this.chartData.labels = response.data.results.map(r => r.created_at)
                    this.chartData.datasets = [{ data: response.data.results.map(r => Number.parseInt(r.amount, 10)) }]
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

        async faireundon () {
            this.startLoading()

            this.dhost.receiver = this.creator.id
            const response = await this.$api.post('/payment-api/donations/', this.dhost)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error('Erreur', error.response.data.message)
                })

                if (response) {
                    this.stopLoading()
                    localStorage.setItem('donation', response.data.donation_id)
                    this.donation = Object.assign({}, response.data)
                    this.$store.commit('SET_SHOW_BANCAIRE_MODAL', true)
                }
        },

        async saveSocialLink () {
            this.showErrors =  true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()

            const payload = {  name: this.shost.name, link: this.shost.link }

            const response = await this.$api.post('/user-api/social-links/', payload)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Erreur'), this.$translate.text(error.response.data.message))
                })

                if (response) {
                    this.stopLoading()
                    this.showErrors =  false
                    this.getSocialLinks()
                    this.resetShost()
                    this.$swal.success('Confirmation', 'Réseau socail ajouté avec succès !')
                }
        },

        async getSocialLinks () {
            this.startLoading()

            const response = await this.$api.get('/user-api/social-links/')
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Erreur'), this.$translate.text(error.response.data.message))
                })

                if (response) {
                    this.stopLoading()
                    this.social_links = response.data.results
                }
        },

        resetShost () {
              this.shost = {  name: '', link: '' }
        },

        logout () {
            AuthService.logout()
            this.go('home')
            window.setTimeout(location.reload(), 50000)
        },

        async retrait () {
            if (!_.isEmpty(this.xaf_total_euro_amount)) {
              this.startLoading()

              const payload = { 'amount': this.xaf_total_euro_amount }

              const response = await this.$api.post('/payment-api/money-requests/', payload)
                  .catch(error => {
                      this.stopLoading()
                      this.$swal.error(this.$translate.text('Erreur'), this.$translate.text(error.response.data.message))
                  })

                  if (response) {
                      this.stopLoading()
                      this.$swal.success('Confirmation', 'Retrait éffectué avec succès !')
                      this.rhost.amount = 0
                  }
            } else {
              this.$swal.error('Validation', 'Bien vouloir saisir le montant à retirer !')
            }
        },
    }
}
</script>
