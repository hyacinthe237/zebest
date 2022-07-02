/* eslint no-unused-vars: "off" */
import ApiService from '@/services/api'

export default {
    namespaced: true,

    state: {
        user: {},
        users: [],
        user_actions: [],
        more_actions: false,
    },

    mutations: {
        SET_USER (state, payload) {
            state.user = payload
        },

        SET_USERS (state, payload) {
            state.users = payload
        },

        SET_USER_ACTIONS (state, payload) {
            state.user_actions = payload
        },

        SET_MORE_ACTIONS (state, value) {
            state.more_actions = value
        },
    },

    actions: {
        async getUsers ({ commit }) {
            const response = await ApiService.get(`/api/accounts/list`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_USERS', response.data)
        },

        async getUserActions ({ commit }, payload) {
            const response = await ApiService.get(`/api/users/actions`,  { params: payload })
                .catch(error => console.log(error.response.data.errors))

            commit('SET_USER_ACTIONS', response.data.actions)
            commit('SET_MORE_ACTIONS', response.data.more)
        },

        async getUser ({ commit }, id) {
            const response = await ApiService.get(`api/accounts/${id}/update`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_USER', response.data)
        },

        async updateUser ({ state, commit }, user) {
            let users = state.users.slice()

            for (var i = 0; i < users.length; i++) {
                if (users[i].id === user.id) {
                    users[i] = user
                }
            }

            commit('SET_USERS', users)
        },
    },

    getters: {
        getUser: state => state.user,
        getUsers: state => state.users,
        getUserActions: state => state.user_actions,
    }
}
