<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="addUserModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey" @click="closeAllModals()" :disabled="isLoading">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div class="secondary fs-20">
                        {{ t('Add user') }}
                    </div>

                    <form @submit.prevent class="_form mt-20" v-show="!isLoading">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="first_name" v-translate>First name</label>
                                    <input type="text"
                                        name="first_name"
                                        v-model="ghost_data.first_name"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('First name')"
                                        :placeholder="t('First name')"
                                    >
                                    <v-error :name="'first_name'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="last_name" v-translate>Last name</label>
                                    <input type="text"
                                        name="last_name"
                                        v-model="ghost_data.last_name"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('Last name')"
                                        :placeholder="t('Last name')"
                                    >
                                    <v-error :name="'last_name'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="username" v-translate>Username</label>
                                    <input type="text"
                                        name="username"
                                        v-model="ghost_data.username"
                                        class="form-control form-control-lg"
                                        v-validate="'required|min:6'"
                                        :data-vv-as="t('Username')"
                                        :placeholder="t('Username')"
                                    >
                                    <v-error :name="'username'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="email" v-translate>Email</label>
                                    <input type="email"
                                        name="email"
                                        v-model="ghost_data.email"
                                        class="form-control form-control-lg"
                                        v-validate="'required|email'"
                                        :data-vv-as="t('Email')"
                                        :placeholder="t('Email')"
                                    >
                                    <v-error :name="'email'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="role" v-translate>Role</label>
                                    <select
                                        name="role"
                                        id="role"
                                        v-model="ghost_data.role"
                                        class="form-control form-control-lg"
                                    >
                                        <option
                                            v-for="r in availableRoles"
                                            :key="r.id"
                                            :value="r.id"
                                        >
                                            {{ t(r.name) }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="password" v-translate>Password</label>
                                    <input type="password"
                                        name="password"
                                        v-model="ghost_data.password"
                                        class="form-control form-control-lg"
                                        v-validate="'required|min:6'"
                                        ref="password"
                                        :data-vv-as="t('Password')"
                                        :placeholder="t('Password')"
                                    >
                                    <v-error :name="'password'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="confirm_password" v-translate>Confirm Password</label>
                                    <input type="password"
                                        name="confirm_password"
                                        v-model="ghost_data.confirm_password"
                                        class="form-control form-control-lg"
                                        v-validate="'required|confirmed:password'"
                                        :data-vv-as="t('Confirm Password')"
                                        :placeholder="t('Confirm Password')"
                                    >
                                    <v-error :name="'confirm_password'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                        </div>

                        <h5 class="bold mt-20" v-show="showGroup" v-translate>Groups</h5>

                        <div class="row" v-show="showGroup">
                            <div class="col-sm-6">
                                <label class="css-input css-checkbox css-checkbox-primary css-input-block">
                                    <input type="checkbox" value="develoeprs">
                                    <span class="mr-10"></span> Developers
                                </label>
                            </div>

                            <div class="col-sm-6">
                                <label class="css-input css-checkbox css-checkbox-primary css-input-block">
                                    <input type="checkbox" value="managers">
                                    <span class="mr-10"></span> Managers
                                </label>
                            </div>

                            <div class="col-sm-6">
                                <label class="css-input css-checkbox css-checkbox-primary css-input-block">
                                    <input type="checkbox" value="gamers">
                                    <span class="mr-10"></span> Gamers
                                </label>
                            </div>

                            <div class="col-sm-6">
                                <label class="css-input css-checkbox css-checkbox-primary css-input-block">
                                    <input type="checkbox" value="executives">
                                    <span class="mr-10"></span> Executives
                                </label>
                            </div>
                        </div>
                    </form>

                    <div class="mt-20" v-show="!isLoading">
                        <button class="btn-secondary btn mr-20" @click.prevent="create()">
                            <i class="feather icon-save mr-10"></i>
                            {{ t('Save user') }}
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
import usersMixins from './mixins'

export default {
    mixins: [usersMixins],

    props: {
        ghost_data: {
            type: Object,
            default: () => {}
        },
    },

    watch: {
        ghost_data: {
            immediate: true,
            handler: function (val) {
                if (!_.isEmpty(val)) {
                    this.showErrors = false
                }
            }
        }
    },

    methods: {
        async create () {
            this.showErrors = true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()
            this.ghost_data.org = this.auth.organisation.uuid

            const res = await this.$api.post('api/accounts/store', this.ghost_data)
                .catch(error => {
                      this.stopLoading()
                    if (error.response.data.username) {
                        console.log(this.$translate.text('Error'), this.$translate.text(error.response.data.username[0]))
                        this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.username[0]))
                    }

                    if (error.response.data.email) {
                        console.log(this.$translate.text('Error'), this.$translate.text(error.response.data.email[0]))
                        this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.email[0]))
                    }
                })
                if (res) {
                    this.stopLoading()
                    this.showErrors = false
                    this.closeAllModals()
                    this.$store.dispatch('users/getUsers')
                    this.$swal.success(this.$translate.text('User created successfully !'))
                }
        }
    }
}
</script>
