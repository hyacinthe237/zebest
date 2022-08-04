import config from './config'

const TOKEN = config.get('token')
const USER = config.get('user')

export default {
    user () {
        return this.$store.state.auth
    },

    setUser (user) {
        localStorage.setItem(USER, JSON.stringify(user))
    },

    getUser () {
        return JSON.parse(localStorage.getItem(USER))
    },

    getToken () {
        return localStorage.getItem(TOKEN)
    },

    setToken (token) {
        localStorage.setItem(TOKEN, token)
    },

    logout () {
        localStorage.clear()
    },

    check () {
        return localStorage.getItem(TOKEN)
    }
}
