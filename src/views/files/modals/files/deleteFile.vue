<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="deleteFileModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <div class="secondary fs-20">
                        {{ t('Confirm delete file') }}
                    </div>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div class="row">
                        <div class="col-sm-12" v-show="!isLoading">
                            {{ t('Do you really want to delete this file permanently?') }}
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
                            @click.prevent="deleteFile()"
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
        current: {
            type: Object,
            default: () => {}
        },

        file: {
            type: Object,
            default: () => {}
        },
    },

    methods: {
        async deleteFile () {
            this.startLoading()

            let uuid_param = this.file.uuid.split("-").join("")

            const res = await this.$api.delete(`api/organisation/files/${uuid_param}/delete`)
                .catch(error => {
                    this.$swal.error(this.$translate.text(error.response.data.errors))
                })
                if (res) {
                    this.closeAllModals()
                    this.$swal.success(this.$translate.text('File deleted successfully !'))
                    const routeParams = this.$router.history.current.params
                    let uuid = routeParams.file ? routeParams.file : routeParams.id
                    this.getArborescence(uuid)
                }

           this.stopLoading()
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
