/* eslint no-unused-vars: "off" */
import ApiService from '@/services/api'

const SET_METADATA = 'SET_METADATA'
const SET_METADATA_TYPES = 'SET_METADATA_TYPES'
const SET_ORG_METADATAS = 'SET_ORG_METADATAS'
const SET_META_PAYLOAD = 'SET_META_PAYLOAD'

export default {
    namespaced: true,

    state: {
        metadata: {},
        metadatas: [],
        metadata_types: [],
        org_metadata: [],
        meta_payload: {},
    },

    mutations: {
        SET_METADATA (state, payload) {
            state.metadata = payload
        },

        SET_METADATAS (state, payload) {
            state.metadatas = payload
        },

        SET_METADATA_TYPES (state, payload) {
            state.metadata_types = payload
        },

        SET_ORG_METADATAS (state, payload) {
            state.org_metadata = payload
        },

        SET_META_PAYLOAD (state, payload) {
            state.meta_payload = payload
        },
    },

    actions: {
        async getMetadataTypes ({ commit }) {
            const response = await ApiService.get(`api/organisation/metadata/types`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_METADATA_TYPES', response.data)
        },

        async getMetadatas ({ commit }) {
            const response = await ApiService.get(`api/organisation/metadata/list`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_METADATAS', response.data)
        },

        async getOrgMetadatas ({ commit }, uuid = null) {
            const response = await ApiService.get(`api/organisation/metadata/list`, { params: uuid })
                .catch(error => console.log(error.response.data.errors))

            commit('SET_ORG_METADATAS', response.data)
        },

        async getMetadata ({ commit }, id) {
            const response = await ApiService.get(`api/organisation/${id}/update`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_METADATA', response.data)
        },

        async updateOrganization ({ state, commit }, data) {
            let metadatas = state.metadatas.slice()

            for (var i = 0; i < metadatas.length; i++) {
                if (metadatas[i].id === data.id) {
                    metadatas[i] = data
                }
            }

            commit('SET_METADATAS', metadatas)
        },
    },

    getters: {
        getMetadata: state => state.metadata,
        getMetadatas: state => state.metadatas,
        getMetadataTypes: state => state.metadata_types,
        getOrgMetadatas: state => state.org_metadata,
    }
}
