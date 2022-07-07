<template lang="html">
    <div class="modal animated fadeIn upload" id="confirmModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <!-- Uninstalling -->
                <div class="_modal-content text-center" v-if="nature == 'paie'">
                    <div class="_img">
                      <img :src="logoPlaceholder">
                    </div>

                    <h2 class="mt-20">faire un don à "nom de créateur"</h2>

                    <form class="_form mt-20" @submit.prevent>
                      <div class="form-group mt-20">
                         <input type="email"
                             name="email"
                             placeholder="Email"
                             class="form-control form-control-lg input"
                             v-model="ghost.email"
                             v-validate="'required|min:6'"
                         >
                           <span class="has-error">{{ errors.first('email') }}</span>
                      </div>

                      <div class="form-group mt-20">
                         <input type="number"
                             name="cardId"
                             placeholder="Numéro de carte bancaire"
                             class="form-control form-control-lg input"
                             v-model="ghost.cardId"
                         >
                           <span class="has-error">{{ errors.first('cardId') }}</span>
                      </div>

                      <div class="form-group mt-20">
                         <input type="text"
                             name="name"
                             placeholder="Nom du titulaire de la carte"
                             class="form-control form-control-lg input"
                             v-model="ghost.name"
                             v-validate="'required|min:6'"
                         >
                           <span class="has-error">{{ errors.first('name') }}</span>
                      </div>

                       <div class="mt-10">
                           <button class="btn btn-block btn-primary br-100" @click="payer()">
                               Payer
                           </button>
                       </div>
                     </form>
                </div>

                <div class="_modal-content text-center" v-if="nature == 'page'">
                    <div class="_head">
                      <h2 class="mr-10">félicitations</h2>
                      <img :src="logoFete" width="30px" height="30px">
                    </div>

                    <p>Ta page est prête. Tu peux à présent la partager avec ta communauté.</p>

                    <div class="content-profile-photo">
                        <img :src="logoPlaceholder">
                        <span class="mt-10">Hyacinthe ABANDA</span>
                    </div>

                    <div class="primary underline mt-60">zebest.com/tonnomcréateur</div>

                    <div class="mt-20 btns">
                      <button class="btn btn-primary mr-20 br-100 mt-10" @click="copy()">
                          <i class="feather icon-copy"></i>
                          Copier le lien
                      </button>
                      <button class="btn btn-dark br-100 mt-10" @click="tiktok()">
                          <img :src="logoTiktok">
                          Tiktok
                      </button>
                    </div>
                </div>

                <div class="_modal-content" v-if="nature == 'reussite'">
                  <span class="_icon"><i class="feather icon-check"></i></span>
                  <h2 class="mt-40">merci pour votre donation</h2>

                    <div class="mt-20">
                      <button class="btn btn-block btn-primary mr-20 br-100" @click="goHome()">
                          Revenir à l'accueil
                      </button>
                    </div>
                </div>

                <div class="_modal-content" v-if="nature == 'donation'">
                  <span class="_icon"><i class="feather icon-check"></i></span>
                  <h2 class="mt-40">transaction réussie</h2>

                    <div class="mt-20">
                      <button class="btn btn-block btn-primary mr-20 br-100" @click="goDonation()">
                          Faire une nouvelle donation
                      </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
        </div> -->
    </div>
</template>

<script>
import logoTiktok from '@/assets/images/logo-tiktok.png'
import logoFete from '@/assets/images/fete.png'
import logoPlaceholder from '@/assets/images/placeholder.png'

export default {

    data: () => ({
      logoTiktok,
      logoFete,
      logoPlaceholder
    }),

    props: {
        nature: { type: String, default: '' }
    },

    watch: {},

    methods: {
        copy () {
            this.closeAllModals()
            this.go('liste-donateurs')
        },

        goHome () {
            this.closeAllModals()
            this.go('home')
        },

        tiktok () {
            this.closeAllModals()
            this.go('liste-donateurs')
        },

        goDonation () {
            this.closeAllModals()
            // this.go('faire-un-don')
        },

        payer () {
            this.closeAllModals()
            // this.go('faire-un-don')
        },
    }
}
</script>
