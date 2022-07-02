/* eslint no-unused-vars: "off" */
import ApiService from '@/services/api'

const SET_ORGANIZATION = 'SET_ORGANIZATION'

export default {
    namespaced: true,

    state: {
        organization: {},
        organizations: [],
        dashboard: [],
        root: {},
    },

    mutations: {
        SET_ORGANIZATION (state, payload) {
            state.organization = payload
        },

        SET_SELECTED_ORG (state, payload) {
            state.selected_org = payload
        },

        SET_ORGANIZATIONS (state, payload) {
            state.organizations = payload
        },

        SET_DASHBOARD (state, payload) {
            state.dashboard = payload
        },

        SET_ROOT (state, payload) {
            state.root = payload
        },
    },

    actions: {
        async getDashboard ({ commit }, payload) {
            const response = await ApiService.get(`api/organisation/statistics`, { params: payload })
                .catch(error => console.log(error.response.data.errors))

            commit('SET_DASHBOARD', response.data)
        },

        async getOrganizations ({ commit }) {
            const response = await ApiService.get(`api/admin/organisations/index`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_ORGANIZATIONS', response.data)
        },

        async getOrganization ({ commit }, id) {
            const response = await ApiService.get(`api/admin/organisations/${id}/update`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_ORGANIZATION', response.data)
        },

        async getRoot ({ commit }) {
            const response = await ApiService.get(`api/organisation/root`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_ROOT', response.data)
        },

        async updateOrganization ({ state, commit }, org) {
            let organizations = state.organizations.slice()

            for (var i = 0; i < organizations.length; i++) {
                if (organizations[i].id === org.id) {
                    organizations[i] = org
                }
            }

            commit('SET_ORGANIZATIONS', organizations)
        },
    },

    getters: {
        getOrganization: state => state.organization,
        getOrganizations: state => state.organizations,
        getRoot: state => state.root,
        getSearchable: state => state.searchable,
        getDashboard: state => state.dashboard,
    }
}
