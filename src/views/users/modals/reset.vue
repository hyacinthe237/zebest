<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="resetUserModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey mr-10" @click="closeAllModals()" :disabled="isLoading">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>

                    <button class="btn-secondary btn" @click="edit()" v-show="!isProfileRoute" :disabled="isLoading">
                        <i class="feather icon-user"></i>
                        {{ t('Edit user') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div class="secondary fs-20" v-if="isProfileRoute">
                        {{ t('Reset password') }}
                    </div>

                    <div class="secondary fs-20" v-else>
                        {{ t('Reset password') }} "{{ person.username }}"
                    </div>

                    <form @submit.prevent class="_form mt-40" v-show="!isLoading">
                        <div class="row">
                            <div class="col-sm-6 mt-20">
                                <div class="form-group">
                                    <label for="password" v-translate>Password</label>
                                    <input type="password"
                                        name="password"
                                        v-model="resetHost.password"
                                        class="form-control form-control-lg"
                                        v-validate="'required|min:6'"
                                        ref="password"
                                        :data-vv-as="t('Password')"
                                        :placeholder="t('Password')"
                                    >
                                    <v-error :name="'password'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6 mt-20">
                                <div class="form-group">
                                    <label for="confirm_password" v-translate>Confirm Password</label>
                                    <input type="password"
                                        name="confirm_password"
                                        v-model="resetHost.confirm_password"
                                        class="form-control form-control-lg"
                                        v-validate="'required|confirmed:password'"
                                        :data-vv-as="t('Confirm Password')"
                                        :placeholder="t('Confirm Password')"
                                    >
                                    <v-error :name="'confirm_password'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                        </div>
                        <div class="mt-40 text-right">
                            <button class="btn-primary btn mr-20" @click="reset()">
                                <i class="feather icon-save mr-10"></i>
                                {{ t('Reset password') }}
                            </button>
                        </div>
                    </form>
                    <div v-show="isLoading" class="mt-40 pb-40 text-center">
                        <izy-hollow-loading loading />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import usersMixins from './mixins'

export default {
    mixins: [usersMixins],

    props: {
        person: {
            type: Object,
            default: () => {}
        }
    },

    computed: {
        isProfileRoute () {
            return this.$router.history.current.name === 'profile'
        }
    },

    watch: {
        person: {
            immediate: true,
            handler: function (val) {
                if (!_.isEmpty(val)) {
                    this.showErrors = false
                }
            }
        }
    },

    mounted () {
        window.eventBus.$on('reset', (result) => {
            if (result == 'password') {
                this.showErrors = false
            }
        })
    },

    methods: {

        async reset () {
            this.showErrors = true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            if (!this.isProfileRoute) {
                this.resetHost.user = this.person.uuid
            }
            this.startLoading()
            const response = await this.$api.post('api/accounts/reset/password', this.resetHost)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.showErrors = false
                    this.initHost()
                    this.closeAllModals()
                    this.$swal.success('Confirmation', this.$translate.text('Password successfully reset !'))
                }
        },

        initHost () {
            this.resetHost = {
                // user: this.person.uuid,
                password: '',
                confirm_password: ''
            }
        },

        edit () {
            window.$('#resetUserModal').modal('hide')
            this.$emit('edit', this.person)
            window.eventBus.$emit('editUserOnReset', this.person)
        }
    }
}
</script>
