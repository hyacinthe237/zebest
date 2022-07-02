/* eslint no-unused-vars: "off" */
import ApiService from '@/services/api'

export default {
    namespaced: true,

    state: {
        subscription: {},
        subscriptions: [],
        org_subscription: {},
        historiques: [],
    },

    mutations: {
        SET_HISTORIQUES (state, payload) {
            state.historiques = payload
        },

        SET_SUBSCRIPTION (state, payload) {
            state.subscription = payload
        },

        SET_SUBSCRIPTIONS (state, payload) {
            state.subscriptions = payload
        },

        SET_ORG_SUBSCRIPTION (state, payload) {
            state.org_subscription = payload
        },
    },

    actions: {
        async getSubscriptions ({ commit }) {
            const response = await ApiService.get(`api/admin/formula/list`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_SUBSCRIPTIONS', response.data)
        },

        async getSubscription ({ commit }, formula_uuid) {
            const response = await ApiService.get(`api/admin/formula/${formula_uuid}/show`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_SUBSCRIPTION', response.data)
        },

        async getOrgSubscription ({ commit }, uuid) {
            const response = await ApiService.get(`api/organisation/subscriptions/${uuid}/current`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_ORG_SUBSCRIPTION', response.data)
        },

        async getHistoriques ({ commit }, org_uuid) {
            const response = await ApiService.get(`api/organisation/subscriptions/${org_uuid}/history`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_HISTORIQUES', response.data)
        },
    },

    getters: {
        getSubscriptions: state => state.subscriptions,
        getSubscription: state => state.subscription,
        getOrgSubscription: state => state.org_subscription,
        getHistoriques: state => state.historiques,
    }
}
