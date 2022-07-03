/* eslint no-unused-vars: "off" */
// import ApiService from '@/services/api'

export default {
    namespaced: true,

    state: {
        user: {},
        users: [],
    },

    mutations: {
        SET_USER (state, payload) {
            state.user = payload
        },

        SET_USERS (state, payload) {
            state.users = payload
        },
    },

    actions: {},

    getters: {}
}
