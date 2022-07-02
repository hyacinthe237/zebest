import Vue from 'vue'
import Vuex from 'vuex'
import OrganizationsModule from './modules/organizations'
import UsersModule from './modules/users'
import FoldersModule from './modules/folders'
import FiltersModule from './modules/filters'
import MetadataModule from './modules/metadatas'
import ConnectorsModule from './modules/connectors'
import SubscriptionsModule from './modules/subscriptions'
import SettingsModule from './modules/settings'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        parent: null,
        viewer: null,
        totalLogs: 0,
        auth: {},
        file: {},
        directory: {},
        roles: [],
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

        SET_PARENT (state, value) {
            state.parent = value
        },

        SET_TOTAL_LOGS (state, value) {
            state.totalLogs = value
        },

        SET_VIEWER (state, value) {
            state.viewer = value
        },

        SET_FILE (state, payload) {
            state.file = payload
        },

        SET_TOGGLE_ICON (state, value) {
            state.toggleIcon = value
        },

        SET_DIRECTORY (state, payload) {
            state.directory = payload
        },

        SET_ROLES (state, payload) {
            state.roles = payload
        },
    },

    modules: {
        organizations: OrganizationsModule,
        users: UsersModule,
        folders: FoldersModule,
        filters: FiltersModule,
        metadatas: MetadataModule,
        connectors: ConnectorsModule,
        subscriptions: SubscriptionsModule,
        settings: SettingsModule,
    }
})
