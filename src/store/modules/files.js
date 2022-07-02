/* eslint no-unused-vars: "off" */
import ApiService from '@/services/api'

export default {
    namespaced: true,

    state: {
        upload_file: {},
        file: {}
    },

    mutations: {
        SET_FILE (state, payload) {
            state.file = payload
        },

        SET_UPLOAD_FILE (state, payload) {
            state.upload_file = payload
        }
    },

    actions: {
        async getFile ({ commit }, id) {
            const response = await ApiService.get(`/api/organisation/folder/${id}/update`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_FILE', response.data)
        },

        async uploadFile ({ commit }, payload) {
            const response = await ApiService.get(`/api/organisation/files/upload/`, payload)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_UPLOAD_FILE', response.data)
        },
    },

    getters: {
        getFile: state => state.file,
        uploadFile: state => state.upload_file,
    }
}
