/* eslint no-unused-vars: "off" */
import ApiService from '@/services/api'

export default {
    namespaced: true,

    state: {
        query: '',
        initial_slide: 0,
        pageFilters: [],
        documentFilters: [],
        searchable_folders: [],
        queries: [],
        showFilters: false,
    },

    mutations: {
        SET_INITIAL_SLIDE (state, value) {
            state.initial_slide = value
        },

        SET_QUERY (state, value) {
            state.query = value
        },

        SET_QUERIES (state, payload) {
            state.queries = payload
        },

        SET_PAGE_FILTERS (state, payload) {
            state.pageFilters = payload
        },

        SET_DOCUMENT_FILTERS (state, payload) {
            state.documentFilters = payload
        },

        SET_SEARCHABLE_FOLDERS (state, payload) {
            state.searchable_folders = payload
        },

        SET_SHOW_FILTERS (state, value) {
            state.showFilters = value
        },
    },

    actions: {
        async getSearchable ({ commit }) {
            const response = await ApiService.get(`api/folders/searchable`)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_SEARCHABLE_FOLDERS', response.data)
        },

        async getQueries ({ commit }, payload) {
            const response = await ApiService.get(`api/query/details`, { params: payload })
                .catch(error => console.log(error.response.data.errors))

            commit('SET_QUERIES', response.data)
        },

        async getFilteredPages ({ commit }, payload) {
            const response = await ApiService.post(`api/pages/filter`, payload)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_PAGE_FILTERS', response.data['pages'])
            commit('SET_DOCUMENT_FILTERS', response.data['docs'])
        },

        async getFilteredDocuments ({ commit }, payload) {
            const response = await ApiService.post(`api/documents/filter`, payload)
                .catch(error => console.log(error.response.data.errors))

            commit('SET_DOCUMENT_FILTERS', response.data['docs'])
        },
    },

    getters: {
        getSearchable: state => state.searchable,
        getFilteredPages: state => state.pageFilters,
        getFilteredDocuments: state => state.documentFilters,
        getQueries: state => state.queries
    }
}
