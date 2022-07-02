/* eslint no-unused-vars: "off" */
import ApiService from '@/services/api'

export default {
    namespaced: true,

    state: {
        taux: 0,
        showModal: false,
        more_files: false,
        more_folders: false,
        arborescence_folder: {},
        parent_folder: {},
        folder: {},
        index: {},
        operation: -1,
        cleanup: {},
        folders: [],
        hierarchy: [],
    },

    mutations: {
        SET_SHOW_MODAL (state, value) {
            state.showModal = value
        },

        SET_TAUX (state, value) {
            state.taux = parseInt(value * 100)
        },

        SET_OPERATION (state, value) {
            state.operation = value
        },

        SET_ARBORESCENCE_FOLDER (state, payload) {
            state.arborescence_folder = payload
        },

        SET_HIERARCHY (state, payload) {
            state.hierarchy = payload
        },

        SET_PARENT_FOLDER (state, payload) {
            state.parent_folder = payload
        },

        SET_FOLDER (state, payload) {
            state.folder = payload
        },

        SET_INDEX (state, payload) {
            state.index = payload
        },

        SET_FOLDERS (state, payload) {
            state.folders = payload
        },

        SET_CLEANUP (state, payload) {
            state.cleanup = payload
        },

        SET_MORE_FILES (state, value) {
            if (value) {
              state.more_files = true
            } else {
              state.more_files = false
            }
        },

        SET_MORE_FOLDERS (state, value) {
            if (value) {
              state.more_folders = true
            } else {
              state.more_folders = false
            }
        },
    },

    actions: {
        setOperation({ commit }, operation){
            commit('SET_OPERATION', operation)
        },

        async setIndexation ({ commit }, operation) {

            if (operation < 0)
                return

            const resp = await ApiService.get(`api/organisation/operations/${operation}/status`)
                .catch(err => console.log('get operation error', err))

            if (resp)
                commit('SET_TAUX', resp.data.complete)

        },

        async getFolders ({ commit }) {
            const response = await ApiService.get(`api/organisation/folder/index`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_FOLDERS', response.data)
        },

        async getFolder ({ commit }, uuid) {
            const response = await ApiService.get(`api/organisation/folder/${uuid}/show`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_FOLDER', response.data)
        },

        async getCleanUp ({ commit }, operationId) {
            const response = await ApiService.get(`api/organisation/operations/${operationId}/cleanup`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_CLEANUP', response.data)
        },

        async getIndex ({ commit }, uuid) {
            const response = await ApiService.get(`api/organisation/folder/${uuid}/index`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_INDEX', response.data)
        },

        async getArborescence ({ commit }, uuid) {
            const response = await ApiService.get(`api/organisation/folder/${uuid}/directory`)
                .catch(error => console.log(error))

            commit('SET_ARBORESCENCE_FOLDER', response.data)
            commit('SET_HIERARCHY', response.data.hierarchy)
            commit('SET_MORE_FILES', response.data.more_files)
            commit('SET_MORE_FOLDERS', response.data.more_folders)
        },

        async getParentFolder ({ commit }, uuid) {
            const response = await ApiService.get(`api/organisation/folder/${uuid}/directory`)
                .catch(error => console.log(error))

            commit('SET_PARENT_FOLDER', response.data)
        },

        async updateFolder ({ state, commit }, folder) {
            let folders = state.folders.slice()

            for (var i = 0; i < folders.length; i++) {
                if (folders[i].id === folder.id) {
                    folders[i] = folder
                }
            }

            commit('SET_FOLDERS', folders)
        },
    },

    getters: {
        getFolder: state => state.folder,
        getIndex: state => state.index,
        getFolders: state => state.folders,
        getArborescence: state => state.arborescence_folder,
        getParentFolder: state => state.parent_folder,
        getOperation: state => state.operation,
        getCleanUp: state => state.cleanup,
    }
}
