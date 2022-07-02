<template lang="html">
    <section class="signin-page">
        <div class="container">
            <div class="row">
                <div class="col-sm-4 m-auto">

                    <div class="login-form">
                        <div class="logo-name text-center">IzySearch</div>
                        <!-- <div class="title text-center" v-translate>Sign in</div> -->

                         <form class="_form mt-20" @submit.prevent="signin()" id="signinForm">
                            <div class="form-group">
                                <div class="inner-addon left-addon">
                                    <i class="glyphicon feather icon-user"></i>

                                    <input type="username"
                                        name="username"
                                        :placeholder="t('Username')"
                                        class="form-control form-control-lg input-white"
                                        v-model="ghost.username"
                                        v-validate="'required|min:6'"
                                    >
                                    <span class="has-error">{{ errors.first('username') }}</span>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="inner-addon left-addon">
                                    <i class="glyphicon feather icon-lock"></i>

                                    <input type="password"
                                        name="password"
                                        :placeholder="t('Password')"
                                        :data-vv-as="t('Password')"
                                        v-validate="'required|min:6'"
                                        v-model="ghost.password"
                                        class="form-control form-control-lg input-white"
                                    >
                                    <span class="has-error">{{ errors.first('password') }}</span>
                                </div>
                            </div>

                            <div class="mt-20">
                                <izy-btn :loading="isLoading" :size="'lg'" block>
                                    <i class="feather icon-arrow-right pull-right"></i>
                                    {{ t('Sign in') }}
                                </izy-btn>
                            </div>
                       </form>
                    </div>

                </div>
            </div>
        </div>
    </section>
</template>

<script>
// import ApiService from '@/services/api'
// import AuthService from '@/services/auth'
// import _ from 'lodash'

export default {
    name: 'Signin',

    data: () => ({
        ghost: {
            username: '',
            password: ''
        }
    }),

    computed: {},

    methods: {
        /**
         * User signs in
         * @return {void}
         */
        async signin () {
            // const isValid = await this.$validator.validate()
            // if (!isValid) return false
            // this.isLoading = true
            //
            // let formData = new FormData()
            // formData.append('username', this.ghost.username)
            // formData.append('password', this.ghost.password)
            //
            // const response = await this.$api.post('/login', formData)
            //     .catch(error => {
            //         this.isLoading = true
            //         console.log('error => ', error.response.data.error)
            //         this.$swal.error(this.$translate.text('Login error'), this.$translate.text(error.response.data.error))
            //     })
            //
            // if (response) {
            //     let data = response.data
            //     AuthService.setUser(data)
            //     AuthService.setToken(data.token)
            //     ApiService.setToken(data.token)
            //     this.$store.commit('SET_TOGGLE_ICON', true)
            //     localStorage.setItem(this.$config.get('token'), data.token)
            //     localStorage.setItem('roleId', data.account.role.id)
            //     localStorage.setItem('organisation', data.organisation.root_folder)
            //
            //     if (!_.isEmpty(this.last_action)) {
            //         window.open(this.last_action, '_self')
            //     } else {
            //         this.n('home')
            //         window.location.reload()
            //     }
            // }
            //
            // this.isLoading = false
        },
    }
}
</script>
