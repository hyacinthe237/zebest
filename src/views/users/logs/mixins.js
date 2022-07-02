import { mapGetters } from 'vuex'
import ApiService from '@/services/api'
import AuthService from '@/services/auth'
import _ from 'lodash'

export default {

    data: () => ({
        filtered: [],
        types: [],
        ghost: {},
        page: 1,
        size: 20,
    }),

    mounted () {
        this.getQueries()
        this.getDatas()
        this.resetFiltered()
        this.resetGhost()
        this.initTypes()
    },

    watch: {
        'ghost.keywords' (val) {
            if (val.length) {
                this.filtered = this.queries.filter(f => {
                    return f.query.toLowerCase().includes(val.toLowerCase())
                })
            } else {
                this.resetFiltered()
            }
        },

        'ghost.user' (val) {
            if (val) {
                this.filtered = this.queries.filter(f => f.user.uuid == val)
            } else {
                this.resetFiltered()
            }
        },

        'ghost.folder' (val) {
            if (val) {
                this.filtered = this.queries.filter(f => f.folder.id == val)
            } else {
                this.resetFiltered()
            }
        },

        'ghost.org' (val) {
            if (val) {
                this.filtered = this.queries.filter(f => f.organisation.uuid == val)
            } else {
                this.resetFiltered()
            }
        },

        'ghost.type' (val) {
            if (val) {
                this.filtered = this.queries.filter(f => f.type == val)
            } else {
                this.resetFiltered()
            }
        },

        'ghost.start_date': function (val) {
            this.ghost.start = moment(val).format('YYYY-MM-DD')
        },

        'ghost.end_date': function (val) {
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

        isSuperAdmin () {
            return this.auth.account.role.id === 1
        },

        isAdmin () {
            return this.auth.account.role.id === 2
        },

        isUser () {
            return this.auth.account.role.id === 3
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

            let conct_tab = root.folders.concat(root)
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

        organization () {
            return JSON.parse(localStorage.getItem('user')).organisation
        },

        user () {
            return JSON.parse(localStorage.getItem('user')).account
        },
    },

    methods: {
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
            }
        },

        initTypes () {
            this.types = [
                { id: 'Page', value: 'Page' },
                { id: 'Document', value: 'Document' },
            ]
        },

        async getQueries () {
            this.page = 1

            const payload = {
                "organisation": this.organization.uuid,
                "page": this.page,
                "size": this.size,
                "start": this.ghost.start,
                "end": this.ghost.end
            }

            this.getApiResponse(payload)
        },

        getDatas () {
            if (this.isSuperAdmin) {
                this.$store.dispatch('users/getUsers')
                this.$store.dispatch('organizations/getRoot')
                this.$store.dispatch('organizations/getOrganizations')
            }

            if (this.isAdmin) {
                this.$store.dispatch('users/getUsers')
                this.$store.dispatch('organizations/getRoot')
            }
        },

        async prev () {
            let curpage = this.page - 1
            this.page = curpage < 1 ? 1 : curpage

            const payload = {
                "organisation": this.organization.uuid,
                "page": this.page,
                "size": this.size,
                "start": this.ghost.start,
                "end": this.ghost.end
            }

            this.getApiResponse(payload)
        },

        async next () {
            this.page = this.page + 1

            const payload = {
                "organisation": this.organization.uuid,
                "page": this.page,
                "size": this.size,
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
        }
    }
}
