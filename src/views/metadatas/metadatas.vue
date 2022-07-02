<template lang="html">
    <div class="">
        <section class="_header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="search-container">
                            <form @submit.prevent class="_form">
                                <div class="form-group form-group-lg">
                                    <div class="inner-addon left-addon">
                                        <i class="glyphicon feather icon-search"></i>

                                        <input type="text"
                                            name="keywords"
                                            :placeholder="t('Search metadata')"
                                            autocomplete="off"
                                            class="form-control form-control-lg"
                                            v-model="ghost.keywords"
                                        >
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="col-sm-4 _form">
                        <div class="form-group">
                            <select
                                name="type"
                                id="type"
                                v-model="ghost.type"
                                class="form-control form-control-lg"
                            >
                                <option value="">{{ t('Metadata Type') }}</option>
                                <option  v-for="type in metadataTypes"
                                    :key="type.id"
                                    :value="type.name">
                                    {{ type.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="col-sm-4">
                        <div class="buttons text-right">
                            <button @click.prevent="goBack()" class="btn btn-dark mr-2">
                                <i class="feather icon-arrow-left"></i> {{ t('Back') }}
                            </button>

                            <button @click.prevent="addMetadata()" class="btn btn-secondary" v-show="isAvailable">
                                <i class="feather icon-plus"></i> {{ t('Add') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard">
            <div class="container-fluid" v-show="!isLoading">
                <div v-if="filteredMetadatas.length == 0">
                    <div class="_empty">
                        <i class="feather icon-info"></i>
                        <p v-translate>No metadatas found</p>
                    </div>
                </div>

                <table class="table table-hover" v-else>
                    <thead>
                        <tr>
                            <th v-translate>Name</th>
                            <th v-translate>Type</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="data in filteredMetadatas" :key="data.id"
                            @click="openData(data)"
                        >
                            <td>{{ data.name }}</td>
                            <td>{{ data.type }}</td>
                            <td>
                                <i @click="isEdit=1" class="feather icon-edit _blue" v-show="isAvailable"> {{ t('Edit') }}</i>
                                <i @click="isDelete=1" class="feather icon-delete _red ml-10" v-show="isAvailable"> {{ t('Delete') }}</i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-show="isLoading" class="mt-40 pb-40 text-center">
                <izy-hollow-loading loading />
            </div>
        </section>

        <AddMetadataModal
            :isSuperAdmin="isSuperAdmin"
            :ghost_data="ghost_data"
            :metadataTypes="metadataTypes"
            :organizations="organizations"
            @createMetadata="create">
        </AddMetadataModal>
        <MetadataPreviewModal :metadata="metadata"></MetadataPreviewModal>
        <EditMetadataModal
            :metadata="edit_info"
            @updateMetadata="update">
        </EditMetadataModal>
    </div>
    </template>

<script>
import AddMetadataModal from './modals/add'
import EditMetadataModal from './modals/edit'
import MetadataPreviewModal from './modals/preview'
import ApiService from '@/services/api'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
    components: {
        AddMetadataModal, EditMetadataModal, MetadataPreviewModal
     },

    data: () => ({
        metadata: {},
        filteredMetadatas: [],
        ghost: {},
        ghost_data: {},
        isDelete: 0,
        isEdit: 0,
        edit_info: {},
    }),

    mounted () {
        this.getMetadatas()
        this.getMetadataTypes()
        this.getOrganizations()
    },

    watch: {
        'ghost.type' (val) {
            if (val) {
                this.filter(val)
            } else {
                this.resetFilteredMetadatas()
            }
        },
    },

    computed: {
        org_metadata () {
            return this.$store.state.metadatas.org_metadata || []
        },

        metadatas () {
            return this.$store.state.metadatas.metadatas || []
        },

        isDashRoute () {
            return this.$router.history.current.name == 'metadata-dash'
        },

        isAdmin () {
            return JSON.parse(localStorage.getItem('user')).account.role.id == 2
        },

        isSuperAdmin () {
            return JSON.parse(localStorage.getItem('user')).account.role.id == 1
        },

        isAvailable () {
            let user = JSON.parse(localStorage.getItem('user'))
            return user.account.role.id == 1 || user.account.role.id == 2
        },

        organization () {
            return this.isDashRoute
                ? JSON.parse(localStorage.getItem('user')).organisation
                : JSON.parse(localStorage.getItem('cur_org'))
        },

        ...mapGetters('metadatas', {
            metadataTypes: 'getMetadataTypes'
        }),

        ...mapGetters('organizations', {
            organizations: 'getOrganizations'
        })
    },

    methods: {
        resetFilteredMetadatas () {
            this.ghost = {
                type: ''
            }

            if (!this.isDashRoute) {
                this.filteredMetadatas = this.org_metadata.slice()
            } else {
                this.filteredMetadatas = this.metadatas.slice()
            }
        },

        filter (val) {
            if (!this.isDashRoute) {
                this.filteredMetadatas = this.org_metadata.filter(f => f.type == val)
            } else {
                this.filteredMetadatas = this.metadatas.filter(f => f.type == val)
            }
        },

        async getMetadatas () {
            if (this.isDashRoute) {
                this.startLoading()
                const response = await ApiService.get(`api/organisation/metadata/list`)
                    .catch(error => {
                        this.stopLoading()
                        console.log(error.response.data.errors)
                        this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                    })

                if (response) {
                    this.stopLoading()
                    this.$store.commit('metadatas/SET_METADATAS', response.data)
                    this.resetFilteredMetadatas()
                }
            }
            else {
                this.startLoading()
                const routeParams = this.$router.history.current.params.id

                let payload = {
                    "organisation": routeParams
                }

                const response = await ApiService.get(`api/organisation/metadata/list`, { params: payload })
                    .catch(error => {
                        this.stopLoading()
                        console.log(error.response.data.errors)
                        this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                    })

                    if (response) {
                        this.stopLoading()
                        this.$store.commit('metadatas/SET_ORG_METADATAS', response.data)
                        this.resetFilteredMetadatas()
                    }
            }
        },

        async getMetadataTypes () {
            this.$store.dispatch('metadatas/getMetadataTypes')
        },

        async getOrganizations () {
            if (this.isSuperAdmin) {
                this.$store.dispatch('organizations/getOrganizations')
            }
        },

        openData (data) {
            if (this.isEdit) {
                this.editData(data)
            }
            else if (this.isDelete) {
                this.confirmDelete(data)
            }
            else {
                this.metadata = data
                this.openModal({ id: 'metadataPreviewModal' })
            }
        },

        initGhostData () {
            if (this.isAdmin) {
                this.ghost_data = {
                    name: '',
                    type: this.metadataTypes[0].uuid,
                    organisation: this.organization.uuid
                }
            }
            else {
                this.ghost_data = {
                    name: '',
                    type: this.metadataTypes[0].uuid,
                    organisation: this.organization.uuid
                }
            }
        },

        addMetadata () {
            this.initGhostData()
            window.eventBus.$emit('add', 'metadata')
            this.openModal({ id: 'addMetadataModal' })
        },

        editData (data) {
            this.edit_info = {
                name: data.name,
                uuid: data.uuid
            }
            this.openModal({ id: 'editMetadataModal' })
            this.isEdit = 0
        },

        confirmDelete (data) {
            Swal.fire({
                title: this.$translate.text('Are you sure ?'),
                text: this.$translate.text("You won't be able to revert this!"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: this.$translate.text('Yes, delete it!')
            }).then((result) => {
                if (result.value) {
                    this.deleteData(data)
                } else {
                    this.isDelete = 0
                }
            })
        },

        async create (payload) {
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            const response = await this.$api.post('api/organisation/metadata/store', payload)
                .catch(error => {
                    console.log('error =>', error)
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })
                if (response) {
                    this.closeAllModals()
                    this.getMetadatas()
                    this.initGhostData()
                    this.$swal.success(this.$translate.text('Metadata created successfully !'))
                }
        },

        async update (payload) {
            const response = await this.$api.put(`api/organisation/metadata/${payload.uuid}/update`, payload)
                .catch(error => {
                    console.log('error =>', error)
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data))
                })
                if (response) {
                    this.closeAllModals()
                    this.getMetadatas()
                    this.$swal.success('Confirmation', this.$translate.text('Metadata successfully updated'))
                }
        },

        async deleteData (data) {
            const response = await this.$api.delete(`api/organisation/metadata/${data.uuid}/delete`)
                .catch(error => {
                    console.log('error =>', error.response.data)
                    this.$swal.error(this.$translate.text(error.response.data))
                })
                if (response) {
                    this.closeAllModals()
                    this.getMetadatas()
                    this.$swal.success(this.$translate.text('Metadata deleted successfully !'))
                }
            this.isDelete = 0
        }
      }
}
</script>
