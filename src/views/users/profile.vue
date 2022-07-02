<template lang="html">
    <div class="">
        <section class="_header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="title">
                            {{ t('Users') }}
                            <i class="feather icon-users"></i>
                        </div>

                        <Breadcrumb :routes="breadcrumb" :show="isAvailable"></Breadcrumb>
                    </div>

                    <div class="col-sm-6 text-right">
                        <div class="buttons">
                            <button @click.prevent="resetpassword()" class="btn btn-primary mr-10" :disabled="isLoading">
                                <i class="feather icon-save"></i> {{ t('Reset password') }}
                            </button>
                            <button
                                @click.prevent="openActions()"
                                class="btn btn-secondary"
                                :disabled="isLoading"
                                v-if="canSeeClean"
                            >
                                {{ t('Actions') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard">
            <div class="container-fluid">
                <form @submit.prevent class="_form" id="editprofile" v-show="!isLoading">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="first_name" v-translate>First name</label>
                                <input type="text"
                                    name="first_name"
                                    v-model="ghost.first_name"
                                    class="form-control form-control-lg"
                                    v-validate="'required'"
                                    :data-vv-as="t('First name')"
                                >
                                <v-error :name="'first_name'" :err="errors" :show="showErrors"></v-error>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="last_name" v-translate>Last name</label>
                                <input type="text"
                                    name="last_name"
                                    v-model="ghost.last_name"
                                    class="form-control form-control-lg"
                                    v-validate="'required'"
                                    :data-vv-as="t('Last name')"
                                >
                                <v-error :name="'last_name'" :err="errors" :show="showErrors"></v-error>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="firstname" v-translate>Email</label>
                                <input type="email"
                                    name="email"
                                    v-model="ghost.email"
                                    class="form-control form-control-lg"
                                    v-validate="'required|email'"
                                    :data-vv-as="t('Email')"
                                >
                                <v-error :name="'email'" :err="errors" :show="showErrors"></v-error>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="firstname" v-translate>Role</label>
                                <select
                                    name="role"
                                    id="role"
                                    v-validate="'required'"
                                    v-model="ghost.role"
                                    class="form-control form-control-lg"
                                    required
                                >
                                <option
                                    v-for="r in availableRoles"
                                    :key="r.id"
                                    :value="r.id"
                                    :selected="ghost.role === r.id"
                                >
                                    {{ t(r.name) }}
                                </option>
                                </select>
                                <v-error :name="'role'" :err="errors" :show="showErrors"></v-error>
                            </div>
                        </div>
                    </div>

                    <h5 class="bold mt-20" v-show="showGroup" v-translate>Groups</h5>

                    <div class="row" v-show="showGroup">
                        <div class="col-sm-6">
                            <label class="css-input css-checkbox css-checkbox-primary css-input-block">
                                <input type="checkbox" value="developers">
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

                    <div class="mt-40">
                        <button class="btn-secondary btn mr-20" @click="save()" :disabled="isLoading">
                            <i class="feather icon-save mr-10"></i>
                            {{ t('Save') }}
                        </button>
                    </div>
                </form>
            </div>
        </section>

        <ResetUserModal :person="user"></ResetUserModal>
        <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import usersMixins from './modals/mixins'
import ResetUserModal from './modals/reset'

export default {
    mixins: [usersMixins],

    components: { ResetUserModal },

    mounted () {
        this.getUser()
    },

    watch: {
        user: {
            immediate: true,
            handler: function (val) {
                if (!_.isEmpty(val)) {
                    this.ghost = Object.assign({}, val)
                    this.ghost.role = this.auth.account.role.id
                    this.showErrors =  false
                }
            }
        }
    },

    computed: {
       user () {
          return this.$store.state.users.user
       },
    },

    methods: {
        openActions () {
            this.user.id = this.auth.account.id
            this.user.uuid = this.auth.account.uuid
            window.eventBus.$emit('user', this.user)
            localStorage.setItem('user_uuid', this.user.uuid)
            this.navigate({ name: 'user-actions', params: { id: this.user.uuid }})
        },

        makeBreadcrumb () {
            this.breadcrumb = [
                { name: 'Home', route: 'home', active: false },
                { name: 'Users', route: 'users', active: false },
                { name: 'Profile', route: 'profile', active: true },
            ]
        },

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
