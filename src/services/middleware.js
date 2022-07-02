import authenticator from './auth'

export default {
    guest (to, from, next) {
        next(authenticator.check() ? '/' : true)
    },

    auth (to, from, next) {
        next(authenticator.check() ? true : '/signin')
    }
}
