<template lang="html">
    <div
        class="modal animated modal-backdrop"
        tabindex="-1" role="dialog" id="confirmModal"
        aria-labelledby="confirmModalLabel" aria-hidden="true"
    >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="text-right">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeM()">
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
                        <img :src="logo">
                        <span class="mt-10">{{ name }}</span>
                    </div>

                    <div class="primary underline mt-10 pointer" @click="openLink()" target="_blank">{{ payment_link }}</div>

                    <div class="mt-20 buttons mb-20">
                      <input type="hidden" id="toCopy" :value="`${payment_link}`">
                      <button
                          class="btn btn-primary br-100 mr-10 mt-10"
                          @click.stop.prevent="copyLink()"
                      >
                          <i class="feather icon-copy mr-10"></i>
                          <span> Copier le lien</span>
                      </button>
                      <!-- <button class="btn btn-dark br-100 mt-10" @click="tiktok()">
                          <img :src="logoTiktok">
                          Tiktok
                      </button> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import logoTiktok from '@/assets/images/logo-tiktok.png'
import logoFete from '@/assets/images/fete.png'

export default {

    data: () => ({
      logoTiktok,
      logoFete,
      isNotCopied: true,
    }),

    props: {
        user: { type: Object, default: () => {} }
    },

    computed: {
        name () {
            return this.user ? this.user.first_name + ' ' + this.user.last_name : ''
        },

        payment_link () {
            return `${this.$config.get('front_url')}${this.user.username}`
        },

        logo () {
            return this.user.image
        },

        token () {
            return localStorage.getItem('zebest_token')
        },
    },

    methods: {
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

        closeM () {
            window.$('#confirmModal').modal('hide')
            this.$store.commit('SET_SHOW_MODAL', false)
        },

        tiktok () {
            this.closeAllModals()
        },

        openLink () {
            window.open(`${this.$config.get('front_url')}${this.user.username}`, '_blank')
        }
    }
}
</script>
