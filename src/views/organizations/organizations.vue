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
                                            :placeholder="t('Search organizations')"
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
                            <button @click.prevent="addOrg()" class="btn btn-secondary">
                                <i class="feather icon-plus"></i> {{ t('Add') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard">
            <div class="container-fluid">
                <nav aria-label="Page navigation example" class="btn-paginate">
                    <ul class="pagination">
                        <li :class="[{ noClick: paginateFreezeLeft }, 'page-item']">
                            <button type="button" class="page-link" @click="previousPage()">
                               <i class="feather icon-chevron-left"></i>
                           </button>
                        </li>

                        <li class="page-item">
                            <button type="button" class="page-link pages-btns"
                                    v-for="pageNumber in pages.slice(page-1, page+5)"
                                    :key="pageNumber" @click="pageClicked(pageNumber)">
                                    {{ pageNumber }}
                            </button>
                        </li>

                        <li :class="[{ noClick: paginateFreezeRight }, 'page-item']">
                            <button type="button" @click="nextPage()" class="page-link">
                                <i class="feather icon-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>

                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th v-translate>Name</th>
                            <th v-translate>Address</th>
                            <th v-translate>Email</th>
                            <th v-translate>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="org in displayedOrgs" :key="org.id"
                            @click="openOrg(org)"
                        >
                            <td>{{ org.name }}</td>
                            <td>{{ org.address }}</td>
                            <td>{{ org.email }}</td>
                            <td>{{ t(org.status) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <AddOrganizationModal
            :ghost_data="ghost_data"
            :admin_ghost="admin_ghost">
        </AddOrganizationModal>
        <OrganizationPreviewModal :organization="organization"></OrganizationPreviewModal>
        <EditOrganizationModal :organization="ghost"></EditOrganizationModal>
        <DeleteOrganizationModal :organization="ghost"></DeleteOrganizationModal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OrganizationPreviewModal from './modals/preview'
import AddOrganizationModal from './modals/add'
import EditOrganizationModal from './modals/edit'
import DeleteOrganizationModal from './modals/delete'

export default {
    components: {
        OrganizationPreviewModal,
        AddOrganizationModal,
        EditOrganizationModal,
        DeleteOrganizationModal,
    },

    data: () => ({
        organization: {},
        ghost: {},
        ghost_data: {},
        admin_ghost: {},
        filteredOrganizations: [],

        page: 1,
    		perPage: 20,
    		pages: [],
    		from: null,
    		to: null,
    		paginateFreezeRight: false,
    		paginateFreezeLeft: false,
    }),

    mounted () {
        this.getOrganizations()
        this.resetFilteredOrganizations()
        this.setPages()
    },

    computed: {
        ...mapGetters('organizations', {
            organizations: 'getOrganizations'
        }),

        totalPages () {
            return Math.ceil(this.filteredOrganizations.length/this.perPage)
        },

        displayedOrgs () {
			return this.filteredOrganizations.length ? this.paginate(this.filteredOrganizations) : []
		}
    },

    watch: {
        organizations () {
            this.resetFilteredOrganizations()
        },

        'ghost.keywords' (val) {
            if (val.length) {
                this.filteredOrganizations = this.organizations.filter(org => {
                    return org.name.toLowerCase().includes(val.toLowerCase())
                })
            } else {
                this.resetFilteredOrganizations()
            }
        },

        filteredOrganizations () {
            this.pages = []
            this.page = 1
			this.setPages()
		},
    },

    methods: {
        initGhostData () {
            this.ghost_data = {
                language: 'fr',
            }
        },

        initAdminGhost () {
            this.admin_ghost = {
                role: 2,
                status: 'active'
            }
        },

        resetFilteredOrganizations () {
            if (this.organizations) {
                this.filteredOrganizations = this.organizations.slice()
            }
        },

        async getOrganizations () {
            this.$store.dispatch('organizations/getOrganizations')
        },

        openOrg (org) {
            this.$store.commit('organizations/SET_ORGANIZATION', org)
            localStorage.setItem('orgUUID', org.uuid)
            localStorage.setItem('orgID', org.id)
            localStorage.setItem('cur_org', JSON.stringify(org))
            localStorage.setItem('root_folder', org.root_folder)
            this.navigate({ name: 'organization', params: { id: org.uuid }})
        },

        addOrg () {
            this.initGhostData()
            this.initAdminGhost()
            window.eventBus.$emit('addOrg', 'add-org')
            this.openModal({ id: 'addOrganizationModal' })
        },

        nextPage () {
            this.page = this.page+1
            this.checkPage()
        },

        pageClicked (p) {
            this.page = p
            this.checkPage()
        },

        previousPage () {
            this.page = this.page-1
            this.checkPage()
        },

		setPages () {
			for (let index = 1; index <= this.totalPages; index++) {
				this.pages.push(index)
			}
            this.checkPage()
		},

        checkPage () {
            const index = this.pages.indexOf(this.page)
            this.paginateFreezeRight = (index + 1) == this.pages.length ? true : false
            this.paginateFreezeLeft = index == 0 ? true : false
        },

        paginate (orgs) {
			let page = this.page
			let perPage = this.perPage
			let from = ((page * perPage) - perPage)
			let to = (page * perPage)
            this.from = from
            this.to = to
			return  orgs.slice(from, to)
		}
    }
}
</script>
