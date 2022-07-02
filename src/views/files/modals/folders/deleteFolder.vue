<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="deleteFolderModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <div class="secondary fs-20">
                        {{ t('Confirm delete folder') }}
                    </div>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div class="row">
                        <div class="col-sm-12" v-show="!isLoading">
                            {{ t('Do you really want to delete this folder permanently?') }}
                        </div>

                        <div v-show="isLoading" class="mt-40 pb-40 text-center">
                            <izy-hollow-loading loading />
                        </div>
                    </div>

                    <div class="mt-20">
                        <button
                            class="btn-grey btn mr-20"
                            @click.prevent="closeAllModals()"
                            :disabled="isLoading"
                        >
                            <i class="feather icon-x mr-10"></i>
                            {{ t('Cancel') }}
                        </button>

                        <button
                            class="btn-danger btn mr-20"
                            @click.prevent="deleteFolder()"
                            :disabled="isLoading"
                        >
                            <i class="feather icon-trash-2 mr-10"></i>
                            {{ t('Yes, i delete') }}
                        </button>
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

    computed: {
        isFileRoute () {
            return this.$router.history.current.name === 'file'
        },

        isFileContentRoute () {
            return this.$router.history.current.name === 'file-content'
        }
    },

    methods: {
        async deleteFolder () {
            this.startLoading()
            let uuid_param = this.folder.uuid.split("-").join("")

            const res = await this.$api.delete(`api/organisation/folder/${uuid_param}/delete`)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text(error.response.data.errors))
                })
                if (res) {
                    if (this.isFileRoute) {
                        let param = this.$router.history.current.params.id
                        this.getArborescence(param)
                    } else if (this.isFileContentRoute) {
                        let param = this.$router.history.current.params.file
                        this.getArborescence(param)
                    } else {
                        this.$store.dispatch('organizations/getRoot')
                    }

                    this.$store.dispatch('filters/getSearchable')
                    this.$swal.success(this.$translate.text('Folder deleted successfully !'))
                    this.stopLoading()
                    this.closeAllModals()
                }
        },

        async getArborescence (param) {
            this.startLoading()
            let payload = {
                "page": 1,
                "size": 30
            }

            let url = `api/organisation/folder/${param}/directory`
            const response = await this.$api.get(url, { params: payload })
                .catch(error => {
                    console.log(error.response.data.errors)
                    this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                })
            if (response) {
                this.$store.commit('folders/SET_ARBORESCENCE_FOLDER', response.data)
                this.$store.commit('folders/SET_HIERARCHY', response.data.hierarchy)
                this.$store.commit('folders/SET_MORE_FILES', response.data.more_files)
                this.$store.commit('folders/SET_MORE_FOLDERS', response.data.more_folders)
            }


            this.stopLoading()
        },
    }
}
</script>
