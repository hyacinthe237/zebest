<template>
    <div>
        <section class="_header padding" v-show="!isLoading">
            <div class="block-h" id="navbar">
                <div class="logo pointer" @click="go('home')">zebest</div>
            </div>
        </section>

        <section class="home mt-20" v-show="!isLoading">
            <div class="block">
                <h2>merci pour votre donation</h2>

                <div class="content-profile-photo mt-20">
                    <div class="photo">
                        <i class="feather icon-check"></i>
                    </div>
                </div>

                <div class="mt-60 text-center">
                    <button class="btn btn-primary br-100" @click="nouvelle()">
                        Faire une nouvelle donation
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
import ApiService from '@/services/api'

export default {
    mounted () {
        ApiService.setToken(localStorage.getItem('zebest_token'))
        this.chargeDonation()
    },

    methods: {
        async chargeDonation () {
            this.startLoading()
            let payload = {
                'status': this.$route.query.redirect_status,
                'donation_id': Number.parseInt(localStorage.getItem('donation'), 10)
            }
            const response = await this.$api.post(`/payment-api/charge-donation/`, payload)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                }
        },

        nouvelle () {
            let user = localStorage.getItem('nm')
            let token = localStorage.getItem('zebest_token')
            let route = this.$router.resolve({ name: 'my-page', params: { id: user }, query: { ntk: token } })
            window.open(route.href, '_self')
            localStorage.clear()
            this.$store.commit('SET_SHOW_BANCAIRE_MODAL', false)
        }
    },
}
</script>
