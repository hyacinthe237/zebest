<template lang="html">
    <div class="">
        <section class="_header" v-show="!isLoading">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="title" v-if="isRouteDash">
                            {{ t('Dashboard') }}
                            <i class="feather icon-layers"></i>
                        </div>

                        <div class="title" v-else>
                            {{ t('Organization') }}
                            <i class="feather icon-briefcase"></i>
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="buttons text-right">
                            <button @click.prevent="goBack()" class="btn btn-dark mr-2">
                                <i class="feather icon-arrow-left"></i> {{ t('Back') }}
                            </button>

                            <button @click.prevent="openOrg()" class="btn btn-secondary mr-2" v-show="isSuperAdmin && !isRouteDash">
                                <i class="feather icon-edit"></i>
                            </button>

                            <button @click.prevent="preview('settings')" class="btn btn-warning mr-2" v-show="isSuperAdmin && !isRouteDash">
                                <i class="feather icon-settings"></i>
                            </button>

                            <button @click.prevent="confirm()" class="btn btn-danger" v-show="isSuperAdmin && !isRouteDash">
                                <i class="feather icon-trash-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard" v-show="!isLoading">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-7">
                        <h4>{{ organization.name }}</h4>
                        <h5 class="teal mt-10">{{ organization.address }}</h5>
                    </div>

                    <div class="col-sm-5 text-right">
                        <div :class="['status-pill', organization.status]">
                            {{ t(organization.status) }}
                        </div>

                        <h5 class="teal mt-10">{{ organization.email }}</h5>
                    </div>

                    <div class="col-sm-12 mt-20">
                        <div :class="['sub-contain', subClass]" @click="preview('subscription')">
                            <h4>{{ t('Subscription') }} {{ t(formula_name) }}</h4>
                            <div class="details mt-10">
                                <div class="item"><i class="feather icon-inbox"></i>
                                    {{ t('Max size') }}: {{ org_subscription.max_size }}</div>

                                <div class="item"><i class="feather icon-activity"></i>
                                    {{ t('Max queries') }}: {{ org_subscription.max_queries }}</div>

                                <div class="item"><i class="feather icon-users"></i>
                                    {{ t('Max users') }}: {{ org_subscription.max_users }}</div>

                                <div class="item"><i class="feather icon-calendar"></i>
                                    {{ t('Expiration') }}: {{ org_subscription.end_date | datetime }} </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cards row mt-40">
                    <div class="col-sm-4" v-if="language">
                        <div class="card-counter card-secondary">
                            <i class="feather icon-flag"></i>
                            <span class="count-numbers" v-translate>{{ language }}</span>
                            <span class="count-name">{{ t('Language') }}</span>
                        </div>
                    </div>

                    <div class="col-sm-4" @click="openfiles()">
                        <div class="card-counter card-primary pointer">
                            <i class="feather icon-folder"></i>
                            <span class="count-numbers">{{ nb_folders }}</span>
                            <span class="count-name" v-translate>Folders</span>
                        </div>
                    </div>

                    <div class="col-sm-4" @click="openfiles()">
                        <div class="card-counter card-secondary pointer">
                            <i class="feather icon-paperclip"></i>
                            <span class="count-numbers">{{ nb_files }}</span>
                            <span class="count-name" v-translate>Files</span>
                        </div>
                    </div>

                    <div class="col-sm-4">
                        <div class="card-counter card-success pointer" @click="showLogs()">
                            <i class="feather icon-activity"></i>
                            <span class="count-numbers">{{ nb_queries }}</span>
                            <span class="count-name" v-translate>Queries</span>
                        </div>
                    </div>

                    <div class="col-sm-4" @click="preview('users')">
                        <div class="card-counter card-danger pointer">
                            <i class="feather icon-users"></i>
                            <span class="count-numbers">{{ nb_users }}</span>
                            <span class="count-name" v-translate>Users</span>
                        </div>
                    </div>

                    <div class="col-sm-4">
                        <div class="card-counter card-teal pointer">
                            <i class="feather icon-inbox"></i>
                            <span class="count-numbers">{{ nb_size }}</span>
                            <span class="count-name" v-translate>Disk space</span>
                        </div>
                    </div>

                    <div class="col-sm-4">
                        <div class="card-counter card-danger pointer" @click="showMetadata()">
                            <i class="feather icon-database"></i>
                            <span class="count-numbers">{{ nb_metadata }}</span>
                            <span class="count-name" v-translate>Metadata</span>
                        </div>
                    </div>

                    <div class="col-sm-4" v-show="isAvailable">
                        <div class="card-counter pointer" @click="openConnectors()">
                            <i class="feather icon-share-2"></i>
                            <span class="count-numbers">{{ nb_connectors }}</span>
                            <span class="count-name" v-translate>Connectors</span>
                        </div>
                    </div>

                    <div class="col-sm-4">
                        <div class="card-counter card-success pointer">
                            <i class="feather icon-activity"></i>
                            <span class="count-numbers">{{ nb_pages }}</span>
                            <span class="count-name" v-translate>Pages</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
        </div>

        <EditOrganizationModal :organization="ghost"></EditOrganizationModal>
        <DeleteOrganizationModal :organization="ghost"></DeleteOrganizationModal>
        <editFormulaModal :formula="subscription" :organisation="organization"></editFormulaModal>
        <changeFormulaModal :formules="subscriptions"></changeFormulaModal>

        <previewModal
            :type="type_preview"
            :tableau="tableau"
            :historiques="historiques"
            :subscription="subscription"
            :organisation="organization"
            :isConnected="isConnected"
            @modifier="openEditSub"
            @renouveller="confirmRenewSub"
            @changer="openChangeSub"
        ></previewModal>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import EditOrganizationModal from './modals/edit'
import DeleteOrganizationModal from './modals/delete'
import previewModal from './modals/preview'
import editFormulaModal from './modals/edit-subscription'
import changeFormulaModal from './modals/change-subscription'
import _ from 'lodash'

export default {
    components: {
        EditOrganizationModal,
        editFormulaModal,
        changeFormulaModal,
        DeleteOrganizationModal,
        previewModal,
    },

    data: () => ({
        ghost: {},
        filteredOrganizations: [],
        languages: [],
        language: '',
        tableau: [],
        type_preview: '',
        subscription: {},
        setting: {},
    }),

    watch: {
        organization: {
            immediate: true,
            handler: function (val) {
                if (!_.isEmpty(val)) {
                  return val
                }
            }
        },

        org_subscription: {
            immediate: true,
            handler: function (val) {
                if (!_.isEmpty(val)) {
                  return val
                }
            }
        },

        statistics: {
            immediate: true,
            handler: function (val) {
                if (!_.isEmpty(val)) {
                  return val
                }
            }
        }
    },

    computed: {
        isRouteDash () { return this.$router.history.current.name === 'dashboard' },

        organization () {
            return this.isRouteDash
                ? JSON.parse(localStorage.getItem('user')).organisation
                : this.$store.state.organizations.organization
        },

        root_folder_uuid () {
            return this.isRouteDash
                ? JSON.parse(localStorage.getItem('user')).organisation.root_folder
                : localStorage.getItem('root_folder')
        },

        org_id () {
            return this.isRouteDash
                ? JSON.parse(localStorage.getItem('user')).organisation.id
                : localStorage.getItem('orgID')
        },

        isAvailable () {
            let user = JSON.parse(localStorage.getItem('user'))
            return user.account.role.id == 1 || user.account.role.id == 2
        },

        isConnected () {
            let user = JSON.parse(localStorage.getItem('user'))
            return user.account.role.id === 1
        },

        users () {
            let users = this.$store.state.users.users.filter(u => this.regexp(u.org) == this.organization.uuid)
            return users
        },

        root () { return this.$store.state.folders.arborescence_folder.root },

        folders () {
            let folders = this.$store.state.folders.arborescence_folder.folders
            if (!folders){
                return []
            }

            return folders.concat(this.root)
        },

        files () {
            let files = this.$store.state.folders.arborescence_folder.files
            if (!files){
                return []
            }

            return files
        },

        isSuperAdmin () {
            return JSON.parse(localStorage.getItem('user')).account.role.id === 1
        },

        connectors () {
            return this.$store.state.connectors.connectors.length
        },

        org_setting () {
            return this.$store.state.settings.org_setting
        },

        subscriptions () {
            return this.$store.state.subscriptions.subscriptions || []
        },

        historiques () {
            return this.$store.state.subscriptions.historiques || []
        },

        org_subscription () {
            return this.$store.state.subscriptions.org_subscription || {}
        },

        formula () {
            return this.org_subscription ? this.org_subscription.formula : {}
        },

        formula_name () {
            return this.formula ? this.formula.name : ''
        },

        subClass () {
            let formula = this.org_subscription.formula

            if (formula) {
                if (formula.validity == 'Month') {
                    return 'bg-month'
                }

                if (formula.validity == 'Quarter') {
                    return 'bg-quarter'
                }

                if (formula.validity == 'Semester') {
                    return 'bg-semester'
                }

                if (formula.validity == 'Annual') {
                    return 'bg-annual'
                }

                if (formula.validity == 'Unlimited') {
                    return 'bg-unlimited'
                }
            }
        },

        statistics () {
            return this.$store.state.organizations.dashboard
        },

        nb_files () {
            return this.statistics ? this.statistics.files : 0
        },

        nb_folders () {
            return this.statistics ? this.statistics.folders : 0
        },

        nb_pages () {
            return this.statistics ? this.statistics.pages : 0
        },

        nb_queries () {
            return this.statistics ? this.statistics.queries : 0
        },

        nb_users () {
            return this.statistics ? this.statistics.users : 0
        },

        nb_metadata () {
            return this.statistics ? this.statistics.metadata : 0
        },

        nb_connectors () {
            return this.statistics ? this.statistics.connectors : 0
        },

        nb_size () {
            return this.statistics ? this.precise(this.statistics.size) : 0
        },

        routeParams () {
            let uuid = JSON.parse(localStorage.getItem('user')).organisation.uuid
            const routeParams = this.$router.history.current.params
            return routeParams.id ? routeParams.id : uuid
        }
    },

    mounted () {
        this.$nextTick(() => { this.getInfos() })
        this.makeLanguages()
    },

    methods: {
        makeLanguages () {
            this.languages = [
                { name: 'French', value: 'fr' },
                { name: 'English', value: 'en' },
                { name: 'Germany', value: 'de' },
                { name: 'Spanish', value: 'es' },
                { name: 'Portuguese', value: 'pt' },
            ]
        },

        openOrg () {
            const org = Object.assign({}, this.organization)

            this.ghost = {
                id: localStorage.getItem('orgID'),
                name: org.name,
                address: org.address,
                email: org.email,
                description: org.description,
                status: org.status,
                language: org.language,
                created_at: org.created_at,
                updated_at: org.updated_at,
            }

            this.openModal({ id: 'EditOrganizationModal' })
        },

        openConnectors () {
            if (this.isRouteDash) {
                this.$router.push({ name: 'connectors-dash' })
            } else {
                this.$router.push({ name: 'connectors' })
            }
        },

        showLogs () {
            this.$store.commit('SET_TOTAL_LOGS', this.nb_queries)

            if (this.isRouteDash) {
                this.$router.push({ name: 'logs-dash' })
            } else {
                this.$router.push({ name: 'logs' })
            }
        },

        openfiles () {
            localStorage.setItem('parent', JSON.stringify(this.root))
            localStorage.setItem('currentDirectory', JSON.stringify(this.root_folder_uuid))
            this.navigate({ name: 'file', params: { id: this.root_folder_uuid }})
        },

        preview (type) {
            this.type_preview = type

            if (type == 'users') {
                this.tableau = this.users
            }

            if (type == 'folders') {
                this.tableau = this.folders
            }

            if (type == 'files') {
                this.tableau = this.files
            }

            if (type == 'subscription') {
                this.subscription = this.org_subscription
            }

            if (type == 'settings') {
                // this.setting = this.org_setting
                this.$store.commit('settings/SET_ORG_SETTING', this.org_setting)
                this.tableau = this.languages
                window.eventBus.$emit('preview-type', 'settings')
            }

            this.openModal({ id: 'previewModal' })
        },

        openEditSub (sub) {
            this.subscription = sub
            window.eventBus.$emit('editFormula', 'edit-formula')
            this.openModal({ id: 'editFormulaModal' })
        },

        openChangeSub (sub) {
            window.eventBus.$emit('changeFormula', sub)
            this.openModal({ id: 'changeFormulaModal' })
        },

        getInfos () {
            if (this.isConnected) {
                this.getSubscriptions()
                this.getOrganization()
            }

            this.getUsers()
            this.getConnectors()
            this.getOrgConnectors()
            this.getDashboard()
            this.getOrgSetting()
            this.getOrgSubscription()
            this.getHistoriques()
            this.getArborescence()
        },

        async getSubscriptions () {
            this.startLoading()
            const response = await this.$api.get(`api/admin/formula/list`)
                .catch(error => console.log(error))
            this.stopLoading()

            if (response) {
                this.$store.commit('subscriptions/SET_SUBSCRIPTIONS', response.data)
            }
        },

        async getHistoriques () {
            this.startLoading()
            let uuid = this.routeParams
            const response = await this.$api.get(`api/organisation/subscriptions/${uuid}/history`)
                .catch(error => console.log(error))
            this.stopLoading()

            if (response) {
                this.$store.commit('subscriptions/SET_HISTORIQUES', response.data)
            }
        },

        async getOrgSubscription () {
            this.startLoading()
            let uuid = this.routeParams
            const response = await this.$api.get(`api/organisation/subscriptions/${uuid}/current`)
                .catch(error => console.log(error))
            this.stopLoading()

            if (response) {
                this.$store.commit('subscriptions/SET_ORG_SUBSCRIPTION', response.data)
            }
        },

        async getOrgSetting () {
            this.startLoading()
            let payload = {
                "organisation": this.routeParams
            }
            const response = await this.$api.get(`api/organisation/setting`, { params: payload })
                .catch(error => console.log(error))
            this.stopLoading()

            if (response) {
                this.$store.commit('settings/SET_ORG_SETTING', response.data)
            }
        },

        async getOrganization () {
            this.startLoading()
            const response = await this.$api.get(`api/admin/organisations/${this.org_id}/update`)
                .catch(error => console.log(error))
            this.stopLoading()

            if (response) {
                this.$store.commit('organizations/SET_ORGANIZATION', response.data)
            }
        },

        selectedLanguage (lang) {
            let str = ''
            if (lang === "fr") str = 'French'
            if (lang === "en") str = 'English'
            if (lang === "ge" || lang === 'de') str = 'Germany'
            if (lang === "sp" || lang === 'es') str = 'Spanish'
            if (lang === "pt") str = 'Portuguese'

            if (str != '') {
                this.language = str
            }
        },

        async getDashboard () {
            this.startLoading()
            let payload = {
                "organisation": this.routeParams
            }
            const response = await this.$api.get(`api/organisation/statistics`, { params: payload })
                .catch(error => console.log(error))
            this.stopLoading()

            if (response) {
                this.$store.commit('organizations/SET_DASHBOARD', response.data)
                this.selectedLanguage(response.data.language)
            }
        },

        async getOrgConnectors () {
            this.startLoading()
            let payload = {
                "organisation": this.routeParams
            }
            const response = await this.$api.get(`api/organisation/connector/list`, { params: payload })
                .catch(error => console.log(error))
            this.stopLoading()

            if (response) this.$store.commit('connectors/SET_ORG_CONNECTORS', response.data)
        },

        async getConnectors () {
            this.startLoading()
            const response = await this.$api.get(`api/organisation/connector/types`)
                .catch(error => console.log(error))
            this.stopLoading()

            if (response) this.$store.commit('connectors/SET_CONNECTORS', response.data)
        },

        async getUsers () {
            this.startLoading()
            const response = await this.$api.get(`/api/accounts/list`)
                .catch(error => console.log(error))
            this.stopLoading()

            if (response) this.$store.commit('users/SET_USERS', response.data)
        },

        async getArborescence () {
            let url  = `api/organisation/folder/${this.root_folder_uuid}/directory`
            let payload = {
                "page": 1,
                "size": 30
            }
            if (!_.isEmpty(this.root_folder_uuid)) {
              this.startLoading()
              const response = await this.$api.get(url, { params: payload })
                  .catch(error => console.log(error))
              this.stopLoading()

              if (response) {
                  this.$store.commit('folders/SET_ARBORESCENCE_FOLDER', response.data)
              }
            }
        },

        showMetadata () {
            if (this.isRouteDash) {
                this.$router.push({ name: 'metadata-dash' })
            } else {
                this.navigate({ name: 'metadata', params: { id: this.organization.uuid }})
            }
        },

        confirm () {
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
                    this.deleteOrg()
                } else {
                    this.closeAllModals()
                }
            })
        },

        confirmRenewSub (sub) {
            Swal.fire({
                title: this.$translate.text('Are you sure ?'),
                text: this.$translate.text("You won't be able to revert this!"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: this.$translate.text('Yes')
            }).then((result) => {
                if (result.value) {
                    this.renewSub(sub)
                } else {
                    this.closeAllModals()
                }
            })
        },

        async deleteOrg () {
            this.startLoading()
            let orgID = localStorage.getItem('orgID')
            let url = `api/admin/organisations/${orgID}/delete`
            const response = await this.$api.delete(url)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.$store.dispatch('organizations/getOrganizations')
                    this.$swal.success(this.$translate.text('Organization deleted successfully !'))

                    this.n('organizations')
                }

            this.stopLoading()
        },

        async renewSub (sub) {
            this.startLoading()

            const response = await this.$api.post(`api/organisation/subscriptions/${sub.organisation.uuid}/renew`)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.getInfos()
                    this.$swal.success(this.$translate.text('Organization subscription renew !'))
                }

            this.stopLoading()
        },
    }
}
</script>
