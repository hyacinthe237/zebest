<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="addOrganizationModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button
                        class="btn btn-grey"
                        @click="closeModal()"
                        :disabled="isLoading"
                    >
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content" v-show="!isLoading">
                    <div class="secondary fs-20">
                        {{ t('Add organization') }}
                    </div>

                    <form @submit.prevent class="_form mt-20">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="language" v-translate>Language</label>
                                    <select
                                        name="language"
                                        id="language"
                                        v-model="ghost_data.language"
                                        class="form-control form-control-lg"
                                        required
                                    >
                                        <option
                                            v-for="lang in languages"
                                            :value="lang.value"
                                            :key="lang.value"
                                        >{{ t(lang.label) }}</option>

                                    </select>
                                    <v-error :name="'language'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                            <div class="col-sm-6"></div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="name" v-translate>Name</label>
                                    <input type="text"
                                        name="name"
                                        v-model="ghost_data.name"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('Name')"
                                        :placeholder="t('Name')"
                                    >
                                    <v-error :name="'name'" :err="errors" :show="showErrors"></v-error>
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
                                    <label for="address" v-translate>Address</label>
                                    <textarea
                                        name="address"
                                        v-model="ghost_data.address"
                                        rows="4" cols="40"
                                        class="form-control form-control-lg"
                                        ref="address"
                                        :placeholder="t('Address')"
                                    >
                                    </textarea>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="description" v-translate>Description</label>
                                    <textarea
                                        name="description"
                                        v-model="ghost_data.description"
                                        rows="4" cols="40"
                                        class="form-control form-control-lg"
                                        ref="description"
                                        :placeholder="t('Description')"
                                    >
                                    </textarea>
                                </div>
                            </div>

                            <div class="col-sm-12">
                                <div class="secondary fs-20 mt-20">
                                    {{ t('Add user') }}
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="first_name" v-translate>First name</label>
                                    <input type="text"
                                        name="first_name"
                                        v-model="admin_ghost.first_name"
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
                                        v-model="admin_ghost.last_name"
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
                                        v-model="admin_ghost.username"
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
                                        name="email_user"
                                        v-model="admin_ghost.email_user"
                                        class="form-control form-control-lg"
                                        v-validate="'required|email'"
                                        :data-vv-as="t('Email')"
                                        :placeholder="t('Email')"
                                    >
                                    <v-error :name="'email_user'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="role" v-translate>Role</label>
                                    <select
                                        name="role"
                                        id="role"
                                        v-model="admin_ghost.role"
                                        class="form-control form-control-lg"
                                        required
                                    >
                                        <option value="2">{{ t('Admin') }}</option>
                                        <option value="3">{{ t('User') }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-6"></div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="password" v-translate>Password</label>
                                    <input type="password"
                                        name="password"
                                        v-model="admin_ghost.password"
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
                                        v-model="admin_ghost.confirm_password"
                                        class="form-control form-control-lg"
                                        v-validate="'required|confirmed:password'"
                                        :data-vv-as="t('Confirm Password')"
                                        :placeholder="t('Confirm Password')"
                                    >
                                    <v-error :name="'confirm_password'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                        </div>

                    </form>


                    <div class="mt-20">
                        <button
                            class="btn-secondary btn mr-20"
                            @click.prevent="create()"
                        >
                            <i class="feather icon-save mr-10"></i>
                            {{ t('Save organization') }}
                        </button>
                    </div>
                </div>
                <div v-show="isLoading" class="mt-40 pb-40 text-center">
                    <izy-hollow-loading loading />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from '@/services/auth'

export default {

    data: () => ({
        languages: []
    }),

    props: {
        ghost_data: {
            type: Object,
            default: () => {}
        },

        admin_ghost: {
            type: Object,
            default: () => {}
        },
    },

    computed: {
        auth () {
            return AuthService.getUser()
        },
    },

    mounted () {
        window.eventBus.$on('addOrg', (result) => {
            if (result == 'add-org') {
                this.initLanguages()
                this.ghost_data.language = this.languages[0].value
                this.showErrors = false
            }
        })
    },

    methods: {
        initLanguages () {
            this.languages = [
              { value: "fr", label: 'French' },
              { value: "en", label: 'English' },
              { value: "de", label: 'Germany' },
              { value: "es", label: 'Spanish' },
              { value: "pt", label: 'Portuguese' }
            ]
        },

        async create () {
            this.showErrors = true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()
            const res = await this.$api.post('api/admin/organisations/store', this.ghost_data)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })
                if (res) {
                    this.admin_ghost.org = res.data.uuid
                    this.createUser()
                }
        },

        async createUser () {
            this.admin_ghost.email = this.admin_ghost.email_user
            const res = await this.$api.post('api/accounts/store', this.admin_ghost)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })
                if (res) {
                    this.closeModal()
                    this.$swal.success(this.$translate.text('Organization and User created successfully !'))
                    this.showErrors = false
                    this.$store.dispatch('users/getUsers')
                    this.$store.dispatch('organizations/getRoot')
                    this.$store.dispatch('organizations/getOrganizations')
                    this.stopLoading()
                }
        },

        closeModal () {
            window.eventBus.$off('addOrg')
            window.$('#addOrganizationModal').modal('hide')
        }
    }
}
</script>
