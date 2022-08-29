<template>
    <div>
        <section class="_header padding" v-show="!isLoading">
            <div class="block-h" id="navbar">
                <div class="logo pointer" @click="go('home')">zebest</div>
            </div>
        </section>

        <section class="home mt-20" v-show="!isLoading">
            <div class="block">
                <div class="message text-justify bold">
                  Hello {{ nom_user }}, je viens de recevoir ta donation.
                  Merci pour ton soutien 🤜🏿😊</div>

                <div class="content-profile-photo mt-60">
                    <div class="photo">
                        <i class="feather icon-check"></i>
                    </div>
                </div>

                <div class="mt-60 text-center">
                    <button class="btn btn-primary br-100" @click="nouvelle()">
                        Faire une donation
                    </button>
                </div>
            </div>
        </section>
        <div v-show="isLoading" class="mt-60 loading">
            <izy-hollow-loading loading :colour="'#46D465'" />
        </div>
    </div>
</template>

<script>

export default {
    computed: {
        nom_user () {
            return JSON.parse(localStorage.getItem('nom_user'))
        }
    },
    mounted () {
        this.delQuery()
        this.chargeDonation()
    },

    methods: {
        delQuery () {
            this.$route.query.payment_intent == null
            this.$route.query.payment_intent_client_secret == null
        },
        async chargeDonation () {
            this.startLoading()
            let payload = {
                'status': this.$route.query.redirect_status,
                'donation_id': Number.parseInt(localStorage.getItem('donation'), 10)
            }
            const response = await this.$api.post(`/payment-api/charge-donation/`, payload)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error('Erreur recharge donation', error.response.data.message)
                })

                if (response) {
                    this.stopLoading()
                }
        },

        nouvelle () {
            let user = this.$route.query.user
            this.$router.push({ name: 'my-page', params: { id: user } })
            localStorage.clear()
            this.$store.commit('SET_SHOW_BANCAIRE_MODAL', false)
        }
    },
}
</script>
