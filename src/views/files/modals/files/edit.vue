<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="editFileModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey" @click="closeAllModals()" :disabled="isLoading">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content" v-show="!isLoading">
                    <div class="secondary fs-20">
                        {{ t('Edit File') }}
                    </div>

                    <form @submit.prevent class="_form mt-20">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="display_name" v-translate>File name</label>
                                    <input type="text"
                                        name="display_name"
                                        v-model="ghost.display_name"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('Name')"
                                        :placeholder="t('Name')"
                                    >
                                    <v-error :name="'display name'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div class="mt-20">
                        <button class="btn-secondary btn mr-20" @click.prevent="updateFile()">
                            <i class="feather icon-save mr-10"></i>
                            {{ t('Update file') }}
                        </button>
                    </div>
                </div>

                <div v-show="isLoading" class="mt-40 text-center">
                    <izy-hollow-loading loading />
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

    computed: {
        auth () {
            return this.$store.state.auth
        },
    },

    mounted () {
        window.eventBus.$on('modif', (result) => {
            if (result == 'modif') {
                let ext = '.' + this.file.extension
                let name = this.file.display_name.split(ext)
                let obj = {
                    uuid: this.file.uuid,
                    display_name: name[0],
                    extension: this.file.extension
                }
                this.ghost = Object.assign({}, obj)
                window.eventBus.$emit('modif', 'modified')
                this.showErrors = false
            }
        })
    },

    methods: {
        async updateFile () {
            this.showErrors = true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()
            let formData = new FormData()
            let name = this.ghost.display_name + '.' + this.ghost.extension
            formData.append('name', name)
            let uuid_param = this.ghost.uuid.split("-").join("")

            const res = await this.$api.put(`api/organisation/files/${uuid_param}/edit`, formData)
                .catch(error => {
                    this.stopLoading()
                    let detail = error.response.data.non_field_errors
                                  ? error.response.data.non_field_errors[0]
                                  : error.response.data.errors
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(detail))
                })
                if (res) {
                    this.stopLoading()
                    this.showErrors = false
                    this.closeAllModals()
                    this.getArborescence(JSON.parse(localStorage.getItem('currentDirectory')))
                    this.$swal.success(this.$translate.text('File updated successfully !'))
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
