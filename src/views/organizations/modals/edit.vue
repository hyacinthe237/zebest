<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="EditOrganizationModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button
                        class="btn btn-grey"
                        @click="closeAllModals()"
                        :disabled="isLoading"
                    >
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content" v-show="!isLoading">
                    <form @submit.prevent class="_form">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="language" v-translate>Language</label>
                                    <select
                                        name="language"
                                        id="language"
                                        v-model="ghost.language"
                                        class="form-control form-control-lg"
                                        required
                                    >
                                        <option value="fr" :selected="ghost.language == 'fr'">{{ t('French') }}</option>
                                        <option value="en" :selected="ghost.language == 'en'">{{ t('English') }}</option>
                                        <option value="de" :selected="ghost.language == 'de'">{{ t('Germany') }}</option>
                                        <option value="es" :selected="ghost.language == 'es'">{{ t('Spanish') }}</option>
                                        <option value="pt" :selected="ghost.language == 'pt'">{{ t('Portuguese') }}</option>
                                    </select>
                                    <v-error :name="'language'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="status" v-translate>Status</label>
                                    <select
                                        name="status"
                                        v-model="ghost.status"
                                        id="status"
                                        class="form-control form-control-lg"
                                    >
                                        <option value="Pending" :selected="organization.status == 'Pending'">{{ t('Pending') }}</option>
                                        <option value="Active" :selected="organization.status == 'Active'">{{ t('Active') }}</option>
                                        <option value="Inactive" :selected="organization.status == 'Inactive'">{{ t('Inactive') }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <!-- End of row  -->

                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="name" v-translate>Name</label>
                                    <input type="text"
                                        name="name"
                                        v-model="ghost.name"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('Name')"
                                        :placeholder="t('Name')"
                                        required
                                    >
                                    <v-error :name="'name'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="email" v-translate>Email</label>
                                    <input type="email"
                                        name="email"
                                        v-model="ghost.email"
                                        class="form-control form-control-lg"
                                        v-validate="'required|email'"
                                        :data-vv-as="t('Email')"
                                        :placeholder="t('Email')"
                                    >
                                    <v-error :name="'email'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="address" v-translate>Address</label>
                                    <textarea
                                        name="address"
                                        v-model="ghost.address"
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
                                    <label for="email" v-translate>Description</label>
                                    <textarea
                                        name="description"
                                        v-model="ghost.description"
                                        rows="4" cols="40"
                                        class="form-control form-control-lg"
                                        ref="description"
                                        :placeholder="t('Description')"
                                    >
                                    </textarea>
                                </div>
                            </div>
                        </div>

                    </form>

                    <div class="mt-20">
                        <button class="btn-teal btn mr-20" @click="annuler()">
                            {{ t('Annuler') }}
                        </button>

                        <button class="btn-secondary btn mr-20" @click.prevent="updateOrg()">
                            <i class="feather icon-save mr-10"></i>
                            {{ t('Save') }}
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
import _ from 'lodash'

export default {
    props: {
        organization: {
            type: Object,
            default: () => {}
        }
    },

    watch: {
        organization: {
            immediate: true,
            handler: function (val) {
                if (!_.isEmpty(val)) {
                    this.ghost = Object.assign({}, val)
                    this.showErrors = false
                }
            }
        }
    },

    computed: {
        orgID () {
            return localStorage.getItem('orgID')
        },

        orgUUID () {
            return localStorage.getItem('orgUUID')
        },
    },

    methods: {
        async updateOrg () {
            this.showErrors = true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()
            const response = await this.$api.put(`api/admin/organisations/${this.orgID}/update`, this.ghost)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })
                this.stopLoading()
                if (response) {
                    this.closeAllModals()
                    this.showErrors = false
                    localStorage.setItem('cur_org', JSON.stringify(response.data))
                    this.$store.commit('organizations/SET_ORGANIZATION', response.data)
                    this.$store.dispatch('organizations/updateOrganization', response.data)
                    this.n('organizations')
                    this.$swal.success('Confirmation', this.$translate.text('Organization successfully updated'))
                }
        },

        annuler () {
            this.ghost = Object.assign({}, this.organization)
            this.showErrors = false
        }
    }
}
</script>
