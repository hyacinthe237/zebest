<template lang="html">
    <div class="modal animated fadeIn modal-backdrop" tabindex="-1" role="dialog" id="confirmModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="text-right">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <i class="feather icon-x"></i>
                    </button>
                </div>
                <div class="modal-body">
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

                    <div class="mt-20 buttons mb-20">
                      <button class="btn btn-primary mr-20 br-100" @click="copy()">
                          <i class="feather icon-copy"></i>
                          Copier le lien
                      </button>
                      <button class="btn btn-dark br-100 mt-10" @click="tiktok()">
                          <img :src="logoTiktok">
                          Tiktok
                      </button>
                    </div>
                </div>
            </div>

            <!-- <div class="modal-content" v-if="nature == 'reussite'">
              <div class="text-right">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <i class="feather icon-x"></i>
                  </button>
              </div>
                <span class="_icon"><i class="feather icon-check"></i></span>
                <h2 class="mt-40">merci pour votre donation</h2>

                  <div class="mt-20">
                    <button class="btn btn-block btn-primary mr-20 br-100" @click="goHome()">
                        Revenir à l'accueil
                    </button>
                  </div>
            </div>

            <div class="modal-content" v-if="nature == 'donation'">
              <div class="text-right">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <i class="feather icon-x"></i>
                  </button>
              </div>
              <span class="_icon"><i class="feather icon-check"></i></span>
              <h2 class="mt-40">transaction réussie</h2>

                <div class="mt-20 buttons">
                  <button class="btn btn-block btn-primary mr-20 br-100" @click="goDonation()">
                      Faire une nouvelle donation
                  </button>
                </div>
            </div> -->
        </div>
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
            // this.go('liste-donateurs')
        },

        goHome () {
            this.closeAllModals()
            this.go('home')
        },

        tiktok () {
            this.closeAllModals()
            // this.go('liste-donateurs')
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
