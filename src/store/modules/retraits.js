/* eslint no-unused-vars: "off" */
import ApiService from '@/services/api'

export default {
    namespaced: true,

    state: {
        retraits: [],
    },

    mutations: {
        SET_RETRAITS (state, payload) {
            state.retraits = payload
        },
    },

    actions: {
        async getMoneyRequests ({ commit }) {
            const response = await ApiService.get(`/payment-api/money-requests/`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_RETRAITS', response.data.results)
        },
    },

    getters: {
        getMoneyRequests: state => state.retraits
    }
}
