<template>
    <div class="">
          <section class="_header" v-show="!isLoading">
              <div class="block-h">
                  <div class="logo pointer" @click="go('home')">zebest</div>
                  <div class="buttons" v-if="isConnected">
                      <input type="hidden" id="toCopy" :value="`${payment_link}`">
                      <div class="item mr-2" @click="loadDatas()"><i class="feather icon-repeat"></i></div>
                      <div class="item mr-2" @click.stop.prevent="copyLink()"><i class="feather icon-copy"></i></div>
                      <div class="item mr-2" @click="logout()"><i class="feather icon-log-out"></i></div>
                      <!-- <div class="dropdown">
                          <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <span>Bienvenue, {{ auth.username }}</span>
                          </button>
                          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                              <a class="dropdown-item" href="#">Action</a>
                              <a class="dropdown-item" href="#">Another action</a>
                              <a class="dropdown-item pointer" href="#">Se déconnecter</a>
                          </div>
                      </div> -->
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

                      <a class="nav-item nav-link" id="nav-password-tab"
                          data-toggle="tab" href="#nav-password" role="tab"
                          aria-controls="nav-password">
                          <i class="feather icon-lock"></i>
                          <span>Mot de passe</span>
                      </a>

                      <a class="nav-item nav-link" id="nav-stats-tab"
                          data-toggle="tab" href="#nav-stats" role="tab"
                          aria-controls="nav-stats">
                          <i class="feather icon-activity"></i>
                          <span>Mes statistiques</span>
                      </a>

                      <a class="nav-item nav-link" id="nav-retrait-tab"
                          data-toggle="tab" href="#nav-retrait" role="tab"
                          aria-controls="nav-retrait" v-show="is_creator">
                          <i class="feather icon-dollar-sign"></i>
                          <span>Faire un retrait</span>
                      </a>

                      <a class="nav-item nav-link" id="nav-don-tab"
                          data-toggle="tab" href="#nav-don" role="tab"
                          aria-controls="nav-don" v-show="!is_creator">
                          <i class="feather icon-dollar-sign"></i>
                          <span>Faire un don</span>
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
                        <div class="content-profile-photo photo">
                            <input type="file" name='image' id="fileElem" accept="image/*" style="display:none" @change="handleFile">
                            <!-- <div class="photo" id="fileSelect">
                                <i class="feather icon-camera" v-if="displayIcon"></i>
                                <img class="image" id="image" src="" v-else/>
                            </div> -->

                            <div class="photo pointer" id="fileSelect">
                                <img class="image" id="image" :src="ghost.image"/>
                            </div>
                            <!-- <span v-show="displayIcon">Ajouter une photo</span> -->
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

                  <div class="tab-pane fade" id="nav-password" role="tabpanel" aria-labelledby="nav-password-tab">
                      <h2>modification mot de passe</h2>

                      <form class="_form mt-20" @submit.prevent>
                         <div class="form-group">
                            <input type="password"
                                name="new_password1"
                                placeholder="Nouveau mot de passe"
                                class="form-control form-control-lg input"
                                v-model="phost.new_password1"
                                v-validate="'required|min:8'"
                            >
                              <span class="has-error">{{ errors.first('new_password1') }}</span>
                         </div>

                         <div class="form-group">
                            <input type="password"
                                name="new_password2"
                                placeholder="Confirmation nouveau mot de passe"
                                class="form-control form-control-lg input"
                                v-model="phost.new_password2"
                                v-validate="'required|min:8'"
                            >
                              <span class="has-error">{{ errors.first('new_password2') }}</span>
                         </div>

                         <div class="mt-20">
                             <button class="btn btn-block btn-primary br-100" @click="resetPassword()">
                                 Je modifie mon mot de passe
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

                          <div class="p mt-20">1.00 &euro; = {{ taux_xaf }} FCFA <br/> *Le taux de change varie en fonction du mode d'envoi et de paiement.</div>
                          <div class="recaps">
                              <div class="recap-line">
                                  <div class="label">Frais de transfert</div>
                                  <div class="value">+ {{ transfert_amount }} EUR</div>
                              </div>
                              <div class="recap-line">
                                  <div class="label">Total du transfert</div>
                                  <div class="value">{{ total_euro_amount }} EUR</div>
                              </div>
                              <!-- <div class="recap-line">
                                  <div class="label">Montant à débité</div>
                                  <div class="value">{{ xaf_total_euro_amount }} FCFA</div>
                              </div> -->

                              <div class="recap-line">
                                  <div class="label">Montant à reçevoir</div>
                                  <div class="value">{{ net_a_recevoir }} FCFA</div>
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

                  <div class="tab-pane fade" id="nav-don" role="tabpanel" aria-labelledby="nav-don-tab">
                    <div class="block">
                      <h2>faire un don</h2>

                      <div class="list-ronds mt-20">
                          <div :class="['rond-item', dhost.amount == 5 ? 'active' : '']" @click="selectMontant(5)">5 &euro;</div>
                          <div :class="['rond-item', dhost.amount == 10 ? 'active' : '']" @click="selectMontant(10)">10 &euro;</div>
                          <div :class="['rond-item', dhost.amount == 50 ? 'active' : '']" @click="selectMontant(50)">50 &euro;</div>
                          <div :class="['rond-item', dhost.amount == 100 ? 'active' : '']" @click="selectMontant(100)">100 &euro;</div>
                      </div>

                      <div class="diviseur">
                          <div class="divider"></div>
                          <div class="rond">Ou</div>
                          <div class="divider"></div>
                      </div>

                      <div class="recaps mt-20">
                          <div class="recap-line">
                              <div class="label">Frais de transfert</div>
                              <div class="value">+ {{ donation_transfert_amount }} EUR</div>
                          </div>
                          <div class="recap-line">
                              <div class="label">Total du transfert</div>
                              <div class="value">{{ donation_total_euro_amount }} EUR</div>
                          </div>
                          <div class="recap-line">
                              <div class="label">Montant à crédité</div>
                              <div class="value">{{ donation_xaf_total_euro_amount }} FCFA</div>
                          </div>
                      </div>

                      <form class="_form mt-20" @submit.prevent>
                        <div class="form-group">
                           <select
                               name="receiver"
                               v-model="dhost.receiver"
                               class="form-control form-control-lg input"
                           >
                           <option vlaue="">Sélectionner un créateur de contenu</option>
                           <option
                               v-for="c in creators"
                               :key="c.id"
                               :value="c.id"
                           >{{ c.first_name }} {{ c.last_name }}</option>
                           </select>
                        </div>

                        <div class="form-group mt-20">
                           <input type="number"
                               name="amount"
                               placeholder="Saisir le montant"
                               class="form-control form-control-lg input"
                               v-model="dhost.amount"
                           >
                        </div>

                         <div class="mt-10 mb-20">
                             <button class="btn btn-block btn-primary br-100" @click="faireundon()">
                                 Ovations de {{ dhost.amount }} &euro;
                             </button>
                         </div>
                       </form>
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
                  <div :class="['rond-item', dhost.amount == 5 ? 'active' : '']" @click="selectMontant(5)">5 &euro;</div>
                  <div :class="['rond-item', dhost.amount == 10 ? 'active' : '']" @click="selectMontant(10)">10 &euro;</div>
                  <div :class="['rond-item', dhost.amount == 50 ? 'active' : '']" @click="selectMontant(50)">50 &euro;</div>
                  <div :class="['rond-item', dhost.amount == 100 ? 'active' : '']" @click="selectMontant(100)">100 &euro;</div>
              </div>

              <div class="diviseur">
                  <div class="divider"></div>
                  <div class="rond">Ou</div>
                  <div class="divider"></div>
              </div>

              <div class="recaps mt-20">
                  <div class="recap-line">
                      <div class="label">Frais de transfert</div>
                      <div class="value">+ {{ donation_transfert_amount }} EUR</div>
                  </div>
                  <div class="recap-line">
                      <div class="label">Total du transfert</div>
                      <div class="value">{{ donation_total_euro_amount }} EUR</div>
                  </div>
                  <div class="recap-line">
                      <div class="label">Montant à crédité</div>
                      <div class="value">{{ donation_xaf_total_euro_amount }} FCFA</div>
                  </div>
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
                       placeholder="Votre prénom"
                       class="form-control form-control-lg input"
                       v-model="dhost.sender_first_name"
                   >
                </div>

                <div class="form-group mt-20">
                   <input type="text"
                       name="sender_last_name"
                       placeholder="Votre nom"
                       class="form-control form-control-lg input"
                       v-model="dhost.sender_last_name"
                   >
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
// import ApiService from '@/services/api'
import ConfirmModal from '../users/modals/confirm'
import BancaireModal from './modals/confirm'
import DashboardMixins from './mixins'

// import moment from 'moment'
import _ from 'lodash'

export default {
    mixins: [DashboardMixins],

    data: () => ({
        donation: {},
        creators: [],
        duration: '',
        endDate: '',
        interval: null,
        taux_retrait: 0.07,
        displayIcon: true,
        social_links: [],
        devises: [],
        shost: {  name: '', link: '' },
        dhost: {  amount: '', receiver: '', sender_first_name: '', sender_last_name: '' },
        rhost: {  amount: 0 },
        host: {  currency: '', phone: '', balance: '' },
        phost: {  new_password1: '', new_password2: '' },
        montant: 5,
        creator: {},
        chartData: { labels: [], datasets: [] },
    }),

    components: { ConfirmModal, BancaireModal },

    computed: {
        auth () {
            return JSON.parse(localStorage.getItem(this.$config.get('user')))
        },

        is_creator () { return this.auth.is_creator },

        payment_link () {
            return this.auth.payment_link
        },

        donations () {
            return this.$store.state.donations
        },

        rates () {
            return this.$store.state.donations.rates
        },

        taux_xaf () { return this.rates.XAF - 5 },
        taux_usd () { return this.rates.USD },
        taux_gbp () { return this.rates.GBP },

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
            let m = Number.parseInt(this.host_amount, 10) * this.taux_retrait
            return Number.parseFloat(m).toFixed(2)
        },

        donation_amount () {
          return !_.isEmpty(this.dhost.amount) ? this.dhost.amount : this.montant
        },

        donation_transfert_amount () {
            let m = Number.parseInt(this.dhost.amount, 10) * this.taux_retrait
            return Number.parseFloat(m).toFixed(2)
        },

        donation_total_euro_amount () {
            let m = Number.parseInt(this.dhost.amount, 10)
            return Number.parseFloat(m).toFixed(2)
        },

        total_euro_amount () {
            let m = Number.parseInt(this.host_amount, 10)
            return Number.parseFloat(m).toFixed(2)
        },

        net_a_recevoir () {
            let m = +Number.parseInt(this.host_amount, 10)  * this.taux_xaf
            return Number.parseFloat(m).toFixed(2)
        },

        donation_xaf_total_euro_amount () {
            let m = this.donation_total_euro_amount * this.taux_xaf
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
        this.dhost = {  amount: this.montant, receiver: '', sender_first_name: '', sender_last_name: '' }
        if (!this.isConnected) {
            this.getCreator()
            this.getTauxChange()
        }

        if (this.isConnected) {
            this.loadDatas()
        }
    },

    methods: {
        loadDatas () {
            this.host.currency = 'EUR'
            this.getProfile()
            this.getWallet()
            this.getSocialLinks()
            this.initDevises()
            this.resetShost()
            this.resetDhost()
            this.getDonations()
            this.getCreators()
            this.selectFile()
            this.getTauxChange()
            $('#nav-editer-tab').click()
            $('#nav-editer').addClass("active")
            $('#nav-editer-tab').focus()
        },

        copyLink () {
            let toCopy = document.querySelector('#toCopy')
            toCopy.setAttribute('type', 'text')
            toCopy.select()

            try {
              document.execCommand('copy')
              this.$swal.success(this.$translate.text('Lien copié'))
              this.isNotCopied = false
            } catch (err) {
              this.isNotCopied = true
              this.$swal.error(this.$translate.text('Lien non copié'))
            }

            /* unselect the range */
            toCopy.setAttribute('type', 'hidden')
            window.getSelection().removeAllRanges()
        },

        /**
         * User signs in
         * @return {void}
         */
        async resetPassword () {
            if (this.phost.new_password1 != '' && this.phost.new_password2 == '') {
                this.$swal.error('Validation', 'Votre confirmation de mot de passe est vide')
            }

            if (this.phost.new_password1 == '' && this.phost.new_password2 != '') {
                this.$swal.error('Validation', 'Votre mot de passe est vide')
            }

            if (this.phost.new_password1 == '' && this.phost.new_password2 == '') {
                this.$swal.error('Validation', 'Bien vouloir saisir le mot de passe et la confirmation')
            }

            if (this.phost.new_password1 != '' && this.phost.new_password2 != '') {
                this.startLoading()

                const response = await this.$api.post('/auth/password/change/', this.phost)
                    .catch(error => {
                        this.stopLoading()
                        console.log('erreur => ', error.response.data)
                        this.$swal.error('Erreur création compte', error.response.data)
                    })

                if (response) {
                    this.showErrors =  false
                    this.stopLoading()
                    this.phost = { new_password1: '', new_password2: '' }
                    this.$swal.success('Confirmation', 'Votre mot de passe a été mit à jour avec succès')
                    this.loadDatas()
                }
            }

        },

        selectFile () {
            var fileSelect = document.getElementById("fileSelect")
            var fileElem = document.getElementById("fileElem")

            fileSelect.addEventListener("click", function (e) {
                if (fileElem) {
                    fileElem.click()
                }
                e.preventDefault()
            }, false)
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

        async getTauxChange () {
            this.startLoading()
            const response = await this.$api.get('/payment-api/current-change/')
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error('Erreur liste taux de change', error.response.data.message)
                })

                if (response) {
                    this.stopLoading()
                    this.$store.commit('donations/SET_RATES', response.data.results)
                }
        },

        async saveWallet () {
            this.startLoading()
            const response = await this.$api.put(`/payment-api/wallets/${this.host.id}/`, this.host)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error('Erreur modification des paramètres', error.response.data.message)
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
                    this.$swal.error('Erreur liste des paramètres', error.response.data.message)
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
                    this.$swal.error('Erreur chargement de votre profil', error.response.data.message)
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
            let payload = { 'username': this.$route.params.id }
            const response = await this.$api.post('/payment-api/user-infos/', payload)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error('Erreur chargement des données du créateur de contenu', error.response.data.message)
                })

                if (response) {
                    this.stopLoading()
                    this.creator = Object.assign({}, response.data)
                }
        },

        async getCreators () {
            this.startLoading()
            const response = await this.$api.get('/user-api/users/')
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error('Erreur liste des créateurs des contenus', error.response.data.message)
                })

                if (response) {
                    this.stopLoading()
                    this.creators = response.data.results.filter(c => c.is_creator == true)
                }
        },

        async getDonations () {
            this.startLoading()

            const response = await this.$api.get('/payment-api/donations/')
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error('Erreur liste des donations', error.response.data.message)
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
                        this.$swal.error('Erreur modification du profil', error.response.data.message)
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
          let payload = { amount: '', receiver: '', sender_first_name: '', sender_last_name: '' }
          if (!this.isConnected && _.isEmpty(this.dhost.sender_last_name) && !_.isEmpty(this.dhost.sender_first_name)) {
              this.$swal.error('Validation', 'Bien vouloir saisir votre nom avant de valider')
          }

          if (!this.isConnected && !_.isEmpty(this.dhost.sender_last_name) && _.isEmpty(this.dhost.sender_first_name)) {
              this.$swal.error('Validation', 'Bien vouloir saisir votre prénom avant de valider')
          }

          if (!this.isConnected && _.isEmpty(this.dhost.sender_last_name) && _.isEmpty(this.dhost.sender_first_name)) {
              this.$swal.error('Validation', 'Bien vouloir saisir votre nom et prénom avant de valider')
          }

          if (!this.isConnected && this.dhost.sender_last_name!='' && this.dhost.sender_first_name!='') {
              this.startLoading()
              payload = {
                  receiver: this.creator.id,
                  amount: this.donation_total_euro_amount,
                  sender_last_name: this.dhost.sender_last_name,
                  sender_first_name: this.dhost.sender_first_name
              }

              const response = await this.$api.post('/payment-api/donations/', payload)
                  .catch(error => {
                      this.stopLoading()
                      this.$swal.error('Erreur paiement donation', error.response.data.message)
                  })

                  if (response) {
                      this.stopLoading()
                      localStorage.setItem('donation', response.data.donation_id)
                      this.donation = Object.assign({}, response.data)
                      this.$store.commit('SET_SHOW_BANCAIRE_MODAL', true)
                  }
          }

          if (this.isConnected) {
              this.startLoading()
              payload = Object.assign({}, this.dhost)
              const response = await this.$api.post('/payment-api/donations/', payload)
                  .catch(error => {
                      this.stopLoading()
                      this.$swal.error('Erreur paiement donation', error.response.data.message)
                  })

                  if (response) {
                      this.stopLoading()
                      localStorage.setItem('donation', response.data.donation_id)
                      this.donation = Object.assign({}, response.data)
                      this.$store.commit('SET_SHOW_BANCAIRE_MODAL', true)
                  }
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
                    this.$swal.error('Erreur ajout réseau social', error.response.data.message)
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
                    this.$swal.error('Erreur liste réseaux sociaux', error.response.data.message)
                })

                if (response) {
                    this.stopLoading()
                    this.social_links = response.data.results
                }
        },

        resetShost () {
              this.shost = {  name: '', link: '' }
        },

        resetDhost () {
              this.dhost = {  amount: this.montant, receiver: '' }
        },

        logout () {
            AuthService.logout()
            this.go('home')
            window.setTimeout(location.reload(), 50000)
        },

        async retrait () {
            let montant = Number.parseInt(this.rhost.amount, 10)
            if (montant != 0) {
              this.startLoading()

              const payload = { 'amount': montant }

              const response = await this.$api.post('/payment-api/money-requests/', payload)
                  .catch(error => {
                      this.stopLoading()
                      this.$swal.error('Erreur de retrait', error.response.data.message)
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
