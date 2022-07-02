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
                                            :placeholder="t('Search users')"
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
                            <button
                                @click.prevent="confirmeRemoveActions()"
                                class="btn btn-primary mr-10"
                                v-if="isSuperAdmin"
                                :disabled="isLoading"
                            >
                                <i class="feather icon-trash"></i> {{ t('Clean up all actions') }}
                            </button>

                            <button
                                @click.prevent="addUser()"
                                class="btn btn-secondary"
                                :disabled="isLoading"
                            >
                                <i class="feather icon-plus"></i> {{ t('New') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard">
            <div class="container-fluid" v-show="!isLoading">
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
                            <th v-translate>Email</th>
                            <th v-translate>Role</th>
                            <th v-translate v-if="isSuperAdmin">Organisation</th>
                            <th v-translate>Status</th>
                            <th v-translate v-show="canSeeClean"></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="i in displayedUsers" :key="i.id"
                        >
                            <td @click="openUser(i)">{{ name(i) }}</td>
                            <td @click="openUser(i)">{{ i.email }}</td>
                            <td @click="openUser(i)">{{ t(i.role.name) }}</td>
                            <td v-if="isSuperAdmin" @click="openUser(i)">{{ t(organisation(i.org)) }}</td>
                            <td @click="openUser(i)">{{ t('Active') }}</td>
                            <td v-show="canSeeClean">
                                <button
                                    @click.prevent="openActions(i)"
                                    class="btn btn-secondary"
                                    :disabled="isLoading"
                                >
                                    {{ t('Actions') }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-show="isLoading" class="mt-40 pb-40 text-center">
                <izy-hollow-loading loading />
            </div>
        </section>

        <AddUserModal :ghost_data="ghost"></AddUserModal>
        <UserPreviewModal :user="user"></UserPreviewModal>
        <EditUserModal :person="ghost" @reset="openReset"></EditUserModal>
        <ResetUserModal :person="user" @edit="openEdit"></ResetUserModal>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import { mapGetters } from 'vuex'
import UserPreviewModal from './modals/preview'
import AddUserModal from './modals/add'
import EditUserModal from './modals/edit'
import ResetUserModal from './modals/reset'

export default {
    components: { UserPreviewModal, AddUserModal, EditUserModal, ResetUserModal },

    data: () => ({
        filteredUsers: [],
        user: {},
        ghost: {},

        page: 1,
    		perPage: 20,
    		pages: [],
    		from: null,
    		to: null,
    		paginateFreezeRight: false,
    		paginateFreezeLeft: false,
    }),

    computed: {
        ...mapGetters('organizations', {
            orgs: 'getOrganizations'
        }),

        ...mapGetters('users', {
            users: 'getUsers'
        }),

        auth () {
            return JSON.parse(localStorage.getItem('user')).account
        },

        isSuperAdmin () {
            return this.auth.role.id === 1
        },

        isAdmin () {
            return this.auth.role.id === 2
        },

        isUser () {
            return this.auth.role.id === 3
        },

        canSeeClean () {
            return this.isSuperAdmin
        },

        totalPages () {
            return Math.ceil(this.filteredUsers.length/this.perPage)
        },

        displayedUsers () {
			return this.filteredUsers.length ? this.paginate(this.filteredUsers) : []
		}
    },

    watch: {
        users: {
            immediate: false,
            handler: function () {
                this.resetFilteredUsers()
            }
        },

        'ghost.keywords' (val) {
            if (val.length) {
                this.filteredUsers = this.users.filter(f => {
                    return f.first_name.toLowerCase().includes(val.toLowerCase())
                })
            } else {
                this.resetFilteredUsers()
            }
        },

        filteredUsers () {
            this.pages = []
            this.page = 1
			      this.setPages()
	      },
    },

    mounted () {
        this.getUsers()
        this.getOrganisations()
        this.resetFilteredUsers()
        this.setPages()
    },

    methods: {
        makeBreadcrumb () {
            this.breadcrumb = [
                { name: 'Home', route: 'home', active: false },
                { name: 'Users', route: 'users', active: true },
            ]
        },

        async getUsers () {
            this.$store.dispatch('users/getUsers')
        },

        async getOrganisations () {
            if (this.isSuperAdmin) {
                this.$store.dispatch('organizations/getOrganizations')
            }
        },

        resetGhost () {
            this.$validator.reset()
            this.ghost = {
                role: 3,
            }
        },

        name (u) {
            return u.first_name + ' ' + u.last_name
        },

        openUser (user) {
            this.user = user
            if (this.isSuperAdmin) {
                this.user.organisation = this.orgs.filter(c => c.uuid === user.org)[0].name
            }

            this.ghost = {
                id: user.id,
                uuid: user.uuid,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                role: user.role.id
            }

            this.openModal({ id: 'userPreviewModal' })
        },

        openActions (user) {
            window.eventBus.$emit('user', user)
            localStorage.setItem('user_uuid', user.uuid)
            this.navigate({ name: 'user-actions', params: { id: user.uuid }})
        },

        addUser () {
            this.resetGhost()
            this.openModal({ id: 'addUserModal' })
        },

        openReset (user) {
            this.user = user
            this.openModal({ id: 'resetUserModal' })
        },

        openEdit (user) {
            this.ghost = user
            this.openModal({ id: 'editUserModal' })
        },

        organisation (org) {
            let filteredOrg = this.orgs.filter(c => c.uuid === org)[0]
            return filteredOrg ? filteredOrg.name : ''
        },

        resetFilteredUsers () {
            if (this.users) {
                this.filteredUsers = this.users.filter(u => u.id !== this.auth.id)
            }
        },

        // groups () {
        //     console.log('...groups code here...')
        // },

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

        paginate (data) {
    			let page = this.page
    			let perPage = this.perPage
    			let from = ((page * perPage) - perPage)
    			let to = (page * perPage)
                this.from = from
                this.to = to
    			return  data.slice(from, to)
    		},

        confirmeRemoveActions () {
            Swal.fire({
                title: this.$translate.text('Clean up all actions'),
                text: this.$translate.text("Are you sure you want to clean up all actions?"),
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: this.$translate.text('Cancel'),
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: this.$translate.text('Yes, clean up!')
            }).then((result) => {
                if (result.value) {
                    this.removeAllActions()
                }
            })
        },

        async removeAllActions () {
            this.startLoading()
            const res = await this.$api.post(`api/users/actions/cleanup`)
                .catch(error => {
                    console.log('error =>', error)
                    this.stopLoading()
                    this.$swal.error(this.$translate.text(error.response.data))
                })
                if (res) {
                    this.$store.dispatch('users/getUsers')
                    this.$swal.success(this.$translate.text(res.data))
                    this.stopLoading()
                }
        },
    }
}
</script>
