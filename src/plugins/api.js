import ApiService from '@/services/api'

export default {
    install: function (Vue) {
        Vue.prototype.$api = ApiService
    }
}