<template lang="html">
    <div class="modal animated fadeIn upload" id="confirmModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <!-- Uninstalling -->
                <div class="_modal-content text-center">
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
                      <button class="btn btn-primary mr-20" @click="copy()">
                          <i class="feather icon-copy"></i>
                          Copier le lien
                      </button>
                      <button class="btn btn-dark" @click="tiktok()">
                          <img :src="logoTiktok">
                          Tiktok
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
      logoTiktok,logoFete,logoPlaceholder

    }),
    props: {},

    watch: {},

    methods: {
        copy () {
            this.closeAllModals()
        },
        tiktok () {
            this.closeAllModals()
        },
    }
}
</script>
