import _ from 'lodash'

export default {
    data: () => ({
        user_actions: [],
        more_actions: false,
        showGroup: false,
        resetHost: {
            password: '',
            confirm_password: ''
        }
    }),

    computed: {
        auth () {
            return JSON.parse(localStorage.getItem('user'))
        },

        account () {
            return this.auth.account
        },

        roles () {
            return this.$store.state.roles
        },

        isUser () {
            return this.account.role.id === 3
        },

        isAdmin () {
            return this.account.role.id === 2
        },

        isSuperAdmin () {
            return this.account.role.id === 1
        },

        canSeeClean () {
            return this.isSuperAdmin
        },

        isAvailable () {
            return this.account.role.id == 1 || this.account.role.id == 2
        },

        availableRoles () {
            let tab = []
            if (this.isUser) tab = this.roles.filter(r => r.id != 1 && r.id != 2)

            if (this.isAdmin) tab = this.roles.filter(r => r.id != 1)

            if (this.isSuperAdmin) tab = this.roles.slice()

            return tab
        },
    },
}
