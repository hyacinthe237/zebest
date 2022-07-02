import config from './config'

const TOKEN = config.get('token')

export default {
    user() {
        return this.$store.state.auth
    },

    setUser (user) {
        localStorage.setItem('user', JSON.stringify(user))
    },

    getUser () {
        return JSON.parse(localStorage.getItem('user'))
    },

    getToken() {
        return localStorage.getItem(TOKEN)
    },

    setToken(token) {
        localStorage.setItem('Token', token)
    },

    logout() {
        localStorage.clear()
        window.setTimeout(location.reload(), 50000)
    },

    check() {
        return localStorage.getItem(TOKEN)
    }
}
