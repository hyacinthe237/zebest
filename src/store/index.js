import Vue from 'vue'
import Vuex from 'vuex'
import UsersModule from './modules/users'
import DonationsModule from './modules/donations'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        breadcrumb: [],
        toggleIcon: false,
        showModal: false,
        showBancaireModal: false,
        showshareModal: false,
        amount: 0
    },

    mutations: {
        SET_AMOUNT (state, value) {
            state.amount = value
        },

        SET_SHOW_MODAL (state, value) {
            state.showModal = value
        },

        SET_SHOW_BANCAIRE_MODAL (state, value) {
            state.showBancaireModal = value
        },

        SET_SHOW_SHARE_MODAL (state, value) {
            state.showshareModal = value
        },

        SET_BREADCRUMB (state, payload) {
            state.breadcrumb = payload
        },

        ADD_BREADCRUMB (state, payload) {
            state.breadcrumb.push(payload)
        },
    },

    modules: {
        users: UsersModule,
        donations: DonationsModule,
    }
})
