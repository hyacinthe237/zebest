/* eslint no-unused-vars: "off" */
import ApiService from '@/services/api'

export default {
    namespaced: true,

    state: {
        connectors: [],
        org_connectors: [],
        gdrive_folders: [],
        gdrive_synchronized_folders: [],
    },

    mutations: {
        ADD_CONNECTOR (state, payload) {
            state.connectors.push(payload)
        },

        SET_CONNECTORS (state, payload) {
            state.connectors = payload
        },

        SET_ORG_CONNECTORS (state, payload) {
            state.org_connectors = payload
        },

        SET_GDRIVE_FOLDERS (state, payload) {
            state.gdrive_folders = payload
        },

        SET_GDRIVE_SYNCHRONIZED_FOLDERS (state, payload) {
            state.gdrive_synchronized_folders = payload
        },
    },

    actions: {
        async getConnectors ({ commit }) {
            const response = await ApiService.get(`api/organisation/connector/types`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_CONNECTORS', response.data)
        },

        async getOrgConnectors ({ commit }, payload) {
            const response = await ApiService.get(`api/organisation/connector/list`, { params: payload})
                .catch(error => console.log(error.response.data.errors))

            commit('SET_ORG_CONNECTORS', response.data)
        },

        async getGoogleDriveFolders ({ commit }, payload) {
            const response = await ApiService.get(`api/organisation/connector/gdrive/folders`, { params: payload})
                .catch(error => console.log(error.response.data.errors))

            commit('SET_GDRIVE_FOLDERS', response.data)
        },

        async getGoogleDriveSynchronizedFolders ({ commit }, payload) {
            const response = await ApiService.get(`api/organisation/connector/synchronized/gdrive/folders`, { params: payload})
                .catch(error => console.log(error.response.data.errors))

            commit('SET_GDRIVE_SYNCHRONIZED_FOLDERS', response.data)
        },
    },

    getters: {
        getConnectors: state => state.connectors,
        getOrgConnectors: state => state.org_connectors,
        getGoogleDriveFolders: state => state.gdrive_folders,
        getGoogleDriveSynchronizedFolders: state => state.gdrive_synchronized_folders,
    }
}
