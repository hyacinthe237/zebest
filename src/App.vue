<template>
    <div id="app">
        <vue-page-transition name="fade">
            <router-view />
        </vue-page-transition>

        <LoadingModal />

        <OfflineFooter></OfflineFooter>
    </div>
</template>

<script>
// import AuthService from '@/services/auth'
import LoadingModal from '@/components/commons/loaders/modal'
// import { mapGetters } from 'vuex'
// import moment from 'moment'
// import _ from 'lodash'

export default {
    data: () => ({
        duration: '',
        endDate: '',
        interval: null
    }),

    components: { LoadingModal },

    created () { },

    mounted () {
        this.listenToEvents()
    },

    watch: {},

    computed: {},

    methods: {

        /**
         * Events listeners
         *
         * @return {void}
         */
        listenToEvents () {
            window.eventBus.$on('loading:show', () => {
                $('#loadingModal').modal('show')
            })

            window.eventBus.$on('loading:hide', () => {
                $('#loadingModal').modal('hide')
            })
        }
    }
}
</script>

<style lang="scss">
@import "./assets/sass/app";
</style>
