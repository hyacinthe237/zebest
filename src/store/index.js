import Vue from 'vue'
import Vuex from 'vuex'
import UsersModule from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        breadcrumb: [],
        toggleIcon: false
    },

    mutations: {
        SET_BREADCRUMB (state, payload) {
            state.breadcrumb = payload
        },

        ADD_BREADCRUMB (state, payload) {
            state.breadcrumb.push(payload)
        },
    },

    modules: {
        users: UsersModule,
    }
})
