import { mapGetters } from 'vuex'
import AuthService from '@/services/auth'
import ApiService from '@/services/api'
import ItemCheckbox from '@/components/metadata/item-checkbox'
import Swal from 'sweetalert2'
import _ from 'lodash'

export default {

    data: () => ({
        filtered: [],
        types: [],
        ghost: {},
        size: 20,

        page: 1,
		perPage: 20,
		pages: [],
		paginateFreezeRight: false,
		paginateFreezeLeft: false,
        selected: [],
        selectedCopy: [],
        isClicked: false,
    }),

    components: { ItemCheckbox },

    mounted () {
        this.getQueries()
        this.getDatas()
        this.resetAll()
        this.initTypes()
        this.resetFiltered()
        this.setPages()
    },

    watch: {
        'ghost.keywords': function (val) {
            if (val.length) {
                this.filtered = this.queries.filter(f => {
                    return f.query.toLowerCase().includes(val.toLowerCase())
                })
            } else {
                this.resetFiltered()
            }
        },

        'ghost.user': function (val) {
            if (val) {
                this.filtered = this.queries.filter(f => f.user.uuid == val)
            } else {
                this.resetFiltered()
            }
        },

        'ghost.folder': function (val) {
            if (val) {
                this.filtered = this.queries.filter(f => f.folder.id == val)
            } else {
                this.resetFiltered()
            }
        },

        'ghost.org': function (val) {
            if (val) {
                this.filtered = this.queries.filter(f => f.organisation.uuid == val)
            } else {
                this.resetFiltered()
            }
        },

        'ghost.type': function (val) {
            if (val) {
                this.filtered = this.queries.filter(f => f.type == val)
            } else {
                this.resetFiltered()
            }
        },

        'ghost.start_date': function (val) {
            this.selected = []
            this.selectedCopy = []
            this.isClicked = false
            this.ghost.start = moment(val).format('YYYY-MM-DD')
        },

        'ghost.end_date': function (val) {
            this.selected = []
            this.selectedCopy = []
            this.isClicked = false
            this.ghost.end = moment(val).format('YYYY-MM-DD')
        },

        queries () {
            this.resetFiltered()
        },
    },

    computed: {
        auth () {
            return AuthService.getUser()
        },

        ...mapGetters('filters', {
            queries: 'getQueries'
        }),

        users () {
            let users = this.$store.state.users.users
            if (this.user.role.id == 2 || this.user.role.id == 3) {
                return users.filter(u => this.regexp(u.org) == this.organization.uuid)
            }
            return users
        },

        folders () {
            let root = this.$store.state.organizations.root
            if (!root.folders){
                return []
            }

            let conct_tab = root.folders.concat(root.root)
            return conct_tab
        },

        canShow () {
            return this.queries.length === this.size
        },

        orgs () {
            return this.$store.state.organizations.organizations
        },

        nb_pages () {
            return this.queries.filter(query => query.type == 'Page').length
        },

        nb_docs () {
            return this.queries.filter(query => query.type == 'Document').length
        },

        isLogsDash () {
            return this.$router.history.current.name === 'logs-dash'
        },

        totalPages () {
            return Math.ceil(this.$store.state.totalLogs/this.perPage)
        },

        organization () {
            return this.isLogsDash
                ? JSON.parse(localStorage.getItem('user')).organisation
                : JSON.parse(localStorage.getItem('cur_org'))
        },

        user () {
            return JSON.parse(localStorage.getItem('user')).account
        },

        isAdmin () {
            return this.user.role.id === 2
        },

        isSuperAdmin () {
            return this.user.role.id === 1
        },

        checked () {
            this.selected.length < this.perPage
        }
    },

    methods: {
        resetAll () {
            this.selected = []
            this.selectedCopy = []
            this.isClicked = false
            this.resetGhost()
        },

        resetFiltered () {
            if (this.queries) {
                this.filtered = this.queries.slice()
            }
        },

        resetGhost () {
            this.ghost = {
                user: '',
                folder: '',
                org: '',
                type: '',
                start_date: '',
                start: '',
                end_date: '',
                end: ''
            }
        },

        initTypes () {
            this.types = [
                { id: 'Page', value: 'Page' },
                { id: 'Document', value: 'Document' },
            ]
        },

        getQueries () {
            this.page = 1

            const payload = {
                "organisation": this.organization.uuid,
                "page": this.page,
                "size": this.perPage,
                "start": this.ghost.start,
                "end": this.ghost.end
            }

            this.getApiResponse(payload)
        },

        getDatas () {
            if (this.auth.account.role.id == 1) {
                this.$store.dispatch('users/getUsers')
                this.$store.dispatch('organizations/getRoot')
                this.$store.dispatch('organizations/getOrganizations')
            } else {
                this.$store.dispatch('folders/getArborescence', this.organization.root_folder)
            }
        },

        nextPage () {
            this.getLogsByPage(this.page+1)
            this.page = this.page+1
            this.checkPage()
        },

        pageClicked (p) {
            this.getLogsByPage(p)
            this.page = p
            this.checkPage()
        },

        previousPage () {
            this.getLogsByPage(this.page-1)
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

        async getLogsByPage (n) {

            const payload = {
                "organisation": this.organization.uuid,
                "page": n,
                "size": this.perPage,
                "start": this.ghost.start,
                "end": this.ghost.end
            }

            this.getApiResponse(payload)
        },

        async getApiResponse (payload) {
            let check = !_.isEmpty(payload.start) && !_.isEmpty(payload.end) && moment(payload.end).isBefore(payload.start)
            if (check) {
                this.$swal.error(this.$translate.text('Error'), this.$translate.text('La date de fin est plus petite que la date de début'))
            } else {
                this.startLoading()

                if (payload.start === 'Invalid date') delete payload.start
                if (payload.end === 'Invalid date') delete payload.end

                const response = await ApiService.get(`api/query/details`, { params: payload })
                    .catch(error => {
                        console.log(error.response.data.errors)
                        this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                    })

                if (response) {
                    this.stopLoading()
                    this.$store.commit('filters/SET_QUERIES', response.data)
                }
            }
        },

        allselected (payload) {
            if (payload.action == 'add') {
                this.isClicked = true
                this.selectedCopy = this.filtered
                return this.selected = this.filtered.map(f => f.uuid)
            } else {
                this.emptySelected()
            }
        },

        emptySelected () {
            this.isClicked = false
            this.selectedCopy = []
            this.selected = []
        },

        QueriesChanged (payload) {
             if (payload.action == 'add') {
                 let temp = this.filtered.filter(f => f.uuid === payload.value)[0]
                 this.selectedCopy.push(temp)
                 return this.selected.push(payload.value)
             }

             this.selectedCopy = this.selectedCopy.filter(act => act.uuid !== payload.value)
             this.selected = this.selected.filter(act => act !== payload.value)
        },

        confirmDeleteQueries () {
            Swal.fire({
                // title: this.$translate.text('Are you sure ?'),
                text: this.$translate.text("Are you sure you want to delete the selected queries ?"),
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: this.$translate.text('Cancel'),
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: this.$translate.text('Yes, delete!')
            }).then((result) => {
                if (result.value) {
                    this.deleteQueries()
                }
            })
        },

        async deleteQueries () {

            let payload = {}
            let url = `api/query/delete/details`

            if (this.isClicked || this.selected.length>=1) {
                this.startLoading()
                payload = {
                    "queries": this.selected
                }

                const res = await this.$api.post(url, payload)
                    .catch(error => {
                        this.stopLoading()
                        this.$swal.error(this.$translate.text(error.response.data.errors))
                    })
                    if (res) {
                        this.resetAll()
                        this.stopLoading()
                        this.getLogsByPage(this.page)
                        this.$swal.success(this.$translate.text(res.data))
                    }
            } else {

                payload = {
                    organisation: this.ghost.org,
                    start: this.ghost.start,
                    end: this.ghost.end,
                    user: this.ghost.user,
                }

                if (payload.user == undefined || payload.user == '' || payload.user == null) delete payload.user
                if (payload.start === 'Invalid date') delete payload.start
                if (payload.end === 'Invalid date') delete payload.end

                if (this.ghost.org) {
                    this.startLoading()
                    const res = await this.$api.post(url, payload)
                        .catch(error => {
                            this.stopLoading()
                            this.$swal.error(this.$translate.text(error.response.data.errors))
                        })
                        if (res) {
                            this.resetAll()
                            this.stopLoading()
                            this.getLogsByPage(this.page)
                            this.$swal.success(this.$translate.text(res.data))
                        }
                } else {
                    Swal.fire({
                        // title: this.$translate.text('Are you sure ?'),
                        text: this.$translate.text("Sélectionnez une organisation pour valider la suppression"),
                        type: 'warning',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: this.$translate.text('OK')
                    })
                }
            }
        },
    }
}
