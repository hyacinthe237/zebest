<template lang="html">
    <div class="bg-white">
      <section class="_header">
          <div class="logo pointer" @click="go('home')">zebest</div>

      </section>

      <section class="home">
        <div class="block">
          <div class="content-profile-photo">
              <img :src="logoPlaceholder">
              <span class="mt-10">Hyacinthe ABANDA</span>
          </div>
          <h2 class="mt-10">Bonjour, <span class="bold">Hyacinthe</span></h2>

          <div class="mt-20">
              <button class="btn btn-primary mr-10">
                  Faire un retrait
              </button>
              <button class="btn btn-outline">
                  Voir mes stats
              </button>
          </div>
        </div>
      </section>
    </div>
</template>

<script>
import logoPlaceholder from '@/assets/images/placeholder.png'

export default {
    data: () => ({
      logoPlaceholder
    }),

    components: { },

    mounted () {},

    watch: {},

    computed: {},

    methods: {
        async save () {
            this.showErrors =  true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()
            this.ghost.role = this.roles.filter(r => r.id == this.ghost.role)[0].id

            const URL = 'api/accounts/' + this.auth.account.id + '/update'
            const response = await this.$api.put(URL, this.ghost)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.showErrors =  false
                    this.$store.dispatch('users/getUser', this.auth.account.id)
                    this.$swal.success('Confirmation', this.$translate.text('Profile updated successfully !'))
                }
        },

        async getUser () {
            this.startLoading()

            const URL = 'api/accounts/' + this.auth.account.id + '/update'
            const response = await this.$api.get(URL)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.$store.commit('users/SET_USER', response.data)
                }
        },

        resetpassword () {
            window.eventBus.$emit('reset', 'password')
            window.$('#resetUserModal').modal('show')
        }

    }
}
</script>
