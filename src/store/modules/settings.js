/* eslint no-unused-vars: "off" */
import ApiService from '@/services/api'

export default {
    namespaced: true,

    state: {
        org_setting: {},
    },

    mutations: {
        SET_ORG_SETTING (state, payload) {
            state.org_setting = payload
        },
    },

    actions: {
        async getOrgSetting ({ commit }, payload) {
            const response = await ApiService.get(`api/organisation/setting`, { params: payload })
                .catch(error => console.log(error.response.data.errors))

            commit('SET_ORG_SETTING', response.data)
        },
    },

    getters: {
        getOrgSetting: state => state.org_setting,
    }
}
