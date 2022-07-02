<template lang="html">
    <div class="">
        <section class="_header" v-show="!isLoading">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-6">

                    </div>

                    <div class="col-sm-6">
                        <div class="buttons text-right">

                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard" v-show="!isLoading" id="dashboard">
            <div v-html="viewer" id="viewer_content"></div>
        </section>

        <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
        </div>
    </div>

</template>

<script>
import _ from 'lodash'

export default {
    name: 'DisplayFile',

    computed: {
        viewer () {
            return this.$store.state.viewer
        },

        currentPageRoute () {
            return this.$router.history.current.name == 'display-file'
        },

        currentDocumentRoute () {
            return this.$router.history.current.name == 'display-document'
        },

        currentLinkRoute () {
            return this.$router.history.current.name == 'copy-link'
        },

        param () {
            return this.$router.history.current.params.id
        },

        divId () {
            let id = ''
            if (this.currentPageRoute) {
                id = localStorage.getItem('current_page')
            }

            if (this.currentDocumentRoute) {
                id = localStorage.getItem('current_doc')
            }

            if (_.isEmpty(id)) {
                id = `pf1`
            }

            return id
        },
    },

    updated () {
        this.$nextTick(() => {
            if(this.$route.hash) {
                const el = document.querySelector(this.$route.hash);
                el && el.scrollIntoView();
            }
        })
    },

    mounted () {
        this.getCurrentFile()
        this.$nextTick(() => { this.scrollToDiv() })
    },

    methods: {
        async getCurrentFile () {
            this.startLoading()

            let payload = { "file": this.param }
            const response = await this.$api.get(`api/file/html`, { params: payload })
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                })

            if (response) {
                this.stopLoading()
                this.$store.commit('SET_VIEWER', response.data)
            }
        },

        scrollToDiv () {
            let a = document.createElement('a')
            a.href ='#' + this.divId
            a.target = '_self'
            a.click()
        },
    }
}
</script>
