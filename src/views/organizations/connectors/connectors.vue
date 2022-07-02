<template lang="html">
    <div class="">
        <section class="_header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="search-container">
                            <form @submit.prevent class="_form">
                                <div class="form-group form-group-lg">
                                    <div class="inner-addon left-addon">
                                        <i class="glyphicon feather icon-search"></i>

                                        <input type="text"
                                            name="keywords"
                                            :placeholder="t('Search connectors')"
                                            autocomplete="off"
                                            class="form-control form-control-lg"
                                            v-model="ghost.keywords"
                                        >
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="buttons text-right">
                            <button @click.prevent="goBack()" class="btn btn-dark mr-2" :disabled="isLoading">
                                <i class="feather icon-arrow-left"></i> {{ t('Back') }}
                            </button>

                            <button @click.prevent="create()" class="btn btn-secondary mr-5" v-show="canAdded" :disabled="isLoading">
                                <i class="feather icon-plus"></i> {{ t('Add') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard">
            <div class="container-fluid">
                <div class="cards" v-show="!isLoading">
                    <div class="row">
                        <div class="col-sm-12" v-if="connectors.length == 0">
                            <div class="_empty">
                                <i class="feather icon-info"></i>
                                <p v-translate>No connectors found</p>
                            </div>
                        </div>
                        <div class="col-sm-3" v-for="f in filtered" :key="f.id" v-else>
                            <div class="card _stats elevated">
                                <div class="_head-collapse" aria-expanded="true">
                                    <div class="icon">
                                        <img :src="gdrive" alt="">
                                    </div>
                                    <div class="_name">
                                        <span class="title">{{ f.name }}</span>
                                        <div class="">
                                            <span class="counter mr-2">{{ f.root_folder.nb_folders }} Folders</span>
                                            <span class="counter">{{ f.root_folder.nb_files }} Files</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="">
                                    <div class="flex-items">
                                         <div class="flex-item" v-translate>
                                              Created At <i class="primary">{{ f.created_at | datetime }}</i>
                                         </div>
                                         <div class="flex-item" v-translate v-if="f.last_synchro">
                                              Synchro At <i class="primary">{{ f.last_synchro | datetime }}</i>
                                         </div>
                                         <div class="flex-item" v-translate v-if="f.root_folder.nb_folders > 0">
                                              Folders Number <i class="primary">{{ f.root_folder.nb_folders }}</i>
                                         </div>
                                         <div class="flex-item" v-translate v-if="f.root_folder.nb_files > 0">
                                              Files Number <i class="primary">{{ f.root_folder.nb_files }}</i>
                                         </div>
                                    </div>

                                    <div class="card-footer" v-show="canAdded">
                                        <button @click.prevent="openConnector(f)" class="btn btn-secondary mr-2" v-translate>
                                            <i class="feather icon-edit"></i> Open
                                        </button>

                                        <button @click.prevent="confirmDelete(f)" class="btn btn-danger" v-translate>
                                            <i class="feather icon-trash-2"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="isLoading">
                    <izy-hollow-loading loading />
                </div>
            </div>
        </section>

        <AddConnector></AddConnector>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import gdrive from '@/assets/images/google-drive.png'
import AddConnector from './modals/add'

export default {
    data: () => ({
        gdrive,
        def: 'pas de description pour le moment',
        filtered: [],
        selected: {},
        isDelete: 0,
    }),

    components: { AddConnector },

    mounted () {
        this.getConnectors()
        this.resetFiltered()
    },

    watch: {
        'ghost.keywords' (val) {
            if (val.length) {
                this.filtered = this.connectors.filter(c => {
                    return c.name.toLowerCase().includes(val.toLowerCase())
                })
            } else {
                this.resetFiltered()
            }
        },

        connectors () {
            this.resetFiltered()
        }
    },

    computed: {
        connectors () {
            return this.$store.state.connectors.org_connectors
        },

        isConnectorsDash () {
            return this.$router.history.current.name === 'connectors-dash'
        },

        organization () {
            return this.isConnectorsDash
                ? JSON.parse(localStorage.getItem('user')).organisation
                : JSON.parse(localStorage.getItem('cur_org'))
        },

        user () {
            return JSON.parse(localStorage.getItem('user'))
        },

        canAdded () {
            return this.user.account.role.id == 1 || this.user.account.role.id == 2
        }
    },

    methods: {
        create () {
            window.eventBus.$emit('json-file', 'jsonfile')
            setTimeout(() => {
                window.$('#addConnectorModal').modal({
                    show: true
                })
            }, 10)
        },

        resetFiltered () {
            if (this.connectors) {
                this.filtered = this.connectors.slice()
            }
        },

        getConnectors () {
            let payload = {
                "organisation": this.organization.uuid
            }

            this.$store.dispatch('connectors/getConnectors')
            this.$store.dispatch('connectors/getOrgConnectors', payload)
        },

        confirmDelete (con) {
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
                    this.removeConnector(con)
                } else {
                    this.closeAllModals()
                }
            })
        },

        async removeConnector (con) {
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.isLoading = true

            const payload = {
                  headers: {
                    Authorization: 'Token ' + this.user.token
                  },
                  data: {
                      organisation: this.organization.uuid,
                      type: con.type.uuid
                  }
            }

            const response = await this.$api.delete(`api/organisation/connector/delete`, payload)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {

                    const data = {
                        "organisation": this.organization.uuid
                    }

                    this.$store.dispatch('connectors/getOrgConnectors', data)
                    this.$swal.success('Confirmation', this.$translate.text('Connector deleted'))
                }

            this.isLoading = false
        },

        openConnector (con) {
            localStorage.setItem('type_con', JSON.stringify(con.type))

            if (this.isConnectorsDash) {
                this.$router.push({ name: 'connector-dash', params: { id: con.uuid } })
            } else {
                this.$router.push({ name: 'connector', params: { id: con.uuid } })
            }
        }
    }
}
</script>
