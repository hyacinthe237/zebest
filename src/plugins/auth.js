import AuthService from '@/services/auth'

export default {
    install: function (Vue) {
        Vue.prototype.$auth = AuthService
    }
}
