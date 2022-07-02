<template lang="html">
    <section class="signin-page">
        <div class="container">
            <div class="row">
                <div class="col-sm-4 m-auto">

                    <div class="login-form">
                        <div class="logo-name text-center" v-translate>Forgot password</div>

                         <form class="_form mt-20" @submit.prevent="send()">
                            <div class="form-group">
                                <div class="inner-addon left-addon">
                                    <i class="glyphicon feather icon-user"></i>

                                    <input type="email"
                                        name="email"
                                        placeholder="Email"
                                        class="form-control form-control-lg input-white"
                                        v-model="ghost.email"
                                        v-validate="'required|email'"
                                    >
                                    <span class="has-error">{{ errors.first('email') }}</span>
                                </div>
                            </div>

                            <div class="mt-20">
                                <izy-btn :loading="isLoading" :size="'lg'" block>
                                    <i class="feather icon-arrow-right pull-right"></i>
                                    {{ t('Send email') }}
                                </izy-btn>
                            </div>

                            <div class="links">
                                <router-link :to="{ name: 'signin', params: {} }">{{ t('Sign in') }}</router-link>
                            </div>
                       </form>
                    </div>

                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'ForgotPassword',

    methods: {
        /**
         * User forgot password
         * @return {void}
         */
        async send () {
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.isLoading = true

            const response = await this.$api.post('/login', this.ghost)
                .catch(error => {
                    console.log('error => ', error)
                    this.$swal.error(this.$translate.text(error.response.data))
                })

            if (response) {
                console.log(response)
                this.$swal.success(this.$translate.text('Please check your email box.'))
            }

            this.isLoading = false
        },
    }
}
</script>
