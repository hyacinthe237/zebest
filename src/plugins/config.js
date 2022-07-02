import ConfigService from '@/services/config'

export default {
    install: function (Vue) {
        Vue.prototype.$config = ConfigService
    }
}
