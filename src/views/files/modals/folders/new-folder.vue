<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="newFolderModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">

                <div class="_modal-content bordered">
                    <button
                        class="btn btn-grey"
                        @click="closeAllModals()"
                        :disabled="isLoading"
                    >
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <h5 v-translate class="bold secondary" v-show="!isLoading">New directory</h5>

                    <form @submit.prevent class="_form mt-20" v-show="!isLoading">
                        <div class="row pb-20">
                            <div class="col-sm-7">
                                <div class="form-group form-group-lg pb-20">
                                    <div class="inner-addon left-addon">
                                        <i class="glyphicon feather icon-folder"></i>

                                        <input type="text"
                                            name="name"
                                            :placeholder="t('Directory name')"
                                            autocomplete="off"
                                            class="form-control form-control-lg"
                                            v-model="ghost.name"
                                            v-validate="'required|min:3'"
                                        >
                                        <v-error :name="'name'" :err="errors" :show="showErrors"></v-error>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-5">
                                <button
                                    class="btn btn-primary"
                                    @click="create()"
                                    :disabled="isLoading"
                                >
                                    <i class="feather icon-check"></i>
                                    {{ t('Create') }}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div v-show="isLoading" class="mt-40 text-center">
                        <izy-hollow-loading loading />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        folder: {
            type: Object,
            default: () => {}
        }
    },

    data: () => ({
        ghost: {},
    }),

    computed: {
        isFileRoute () {
            return this.$router.history.current.name === 'file'
        },

        isFileContentRoute () {
            return this.$router.history.current.name === 'file-content'
        }
    },

    mounted () {
        window.eventBus.$on('new-folder', (result) => {
            if (result == 'newfolder') {
                this.ghost = {}
                this.showErrors = false
            }
        })
    },

    methods: {
        async create () {
            this.showErrors = true
            const isValid = await this.$validator.validate()
            if (!isValid) return false
            this.startLoading()

            this.ghost.parent = this.folder.uuid
            this.ghost.parent = this.ghost.parent.replace("-", "")
            const res = await this.$api.post('api/organisation/folder/store/', this.ghost)
                .catch(error => {
                    this.stopLoading()
                    if (error.response.status === 400) {
                        this.$swal.error('Error', this.$translate.text(error.response.data.errors))
                    } else {
                        this.$swal.error('Error', this.$translate.text(error.response.data.errors))
                    }

                })
                if (res) {
                    this.showErrors = false
                    this.stopLoading()
                    this.ghost = {}
                    this.closeAllModals()
                    this.$swal.success('Confirmation', this.$translate.text('Folder added'))

                    if (this.isFileRoute || this.isFileContentRoute) {
                        const routeParams = this.$router.history.current.params
                        let uuid = routeParams.file ? routeParams.file : routeParams.id
                        this.$store.dispatch('folders/getArborescence', uuid)
                    } else {
                        this.$store.dispatch('organizations/getRoot')
                        this.$store.dispatch('filters/getSearchable')
                        this.$router.push({ name: 'file', params: { id: res.data.parent } })
                    }
                }
        },
    }
}
</script>
