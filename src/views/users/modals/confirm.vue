<template lang="html">
    <div class="modal animated fadeIn upload" id="confirmModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <!-- Uninstalling -->
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

                    <div class="mt-20">
                      <button class="btn btn-primary mr-20 br-100" @click="copy()">
                          <i class="feather icon-copy"></i>
                          Copier le lien
                      </button>
                      <button class="btn btn-dark br-100" @click="tiktok()">
                          <img :src="logoTiktok">
                          Tiktok
                      </button>
                    </div>
                </div>

                <div class="_modal-content text-center" v-if="nature == 'reussite'">
                  <span class="_icon"><i class="feather icon-check"></i></span>
                  <h2 class="mt-40">transaction réussie</h2>

                    <p>Tu peux voir les détails dans <a @click="go('liste-donateurs')">Transactions</a></p>

                    <div class="mt-20">
                      <button class="btn btn-block btn-primary mr-20 br-100" @click="goHome()">
                          Revenir à l'accueil
                      </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
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
    }
}
</script>
