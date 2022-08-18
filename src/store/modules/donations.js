/* eslint no-unused-vars: "off" */
import ApiService from '@/services/api'

export default {
    namespaced: true,

    state: {
        donations: [],
    },

    mutations: {
        SET_DONATIONS (state, payload) {
            state.donations = payload
        },
    },

    actions: {
        async getDonations ({ commit }) {
            const response = await ApiService.get(`/payment-api/donations/`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_DONATIONS', response.data.results)
        },
    },

    getters: {
        getDonations: state => state.donations
    }
}
