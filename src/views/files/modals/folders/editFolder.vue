<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="editFolderModal">
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
                <div class="_modal-content" v-show="!isLoading">
                    <div class="secondary fs-20">
                        {{ t('Edit Folder') }}
                    </div>

                    <form @submit.prevent class="_form mt-20">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="name" v-translate>Folder name</label>
                                    <input type="text"
                                        name="name"
                                        v-model="ghost.name"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('Name')"
                                        :placeholder="t('Name')"
                                    >
                                    <v-error :name="'name'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div class="mt-20">
                        <button
                            class="btn-secondary btn mr-20"
                            @click.prevent="updateFolder()"
                            :disabled="ghost.name==''"
                        >
                            <i class="feather icon-save mr-10"></i>
                            {{ t('Update Folder') }}
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
import _ from 'lodash'

export default {
    props: {
        folder: {
            type: Object,
            default: () => {}
        }
    },

    computed: {
        auth () {
            return this.$store.state.auth
        },

        isFileRoute () {
            return this.$router.history.current.name === 'file'
        },

        isFileContentRoute () {
            return this.$router.history.current.name === 'file-content'
        }
    },

    mounted () {
        window.eventBus.$on('edit', (result) => {
            if (result == 'folder') {
                this.ghost = Object.assign({}, this.folder)
                this.showErrors = false
            }
        })
    },

    watch: {
        folder: {
            immediate: true,
            handler: function (val) {
                if (!_.isEmpty(val)) {
                    this.ghost = Object.assign({}, val)
                }
            }
        }
    },

    methods: {
        async updateFolder () {
            this.showErrors = true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()

            let formData = new FormData()
            formData.append('name', this.ghost.name)

            let uuid_param = this.ghost.uuid.split("-").join("")

            const res = await this.$api.patch(`api/organisation/folder/${uuid_param}/edit`, formData)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })
                if (res) {
                    this.showErrors = false
                    this.stopLoading()
                    this.closeAllModals()
                    this.$swal.success(this.$translate.text('Folder updated successfully !'))

                    if (this.isFileRoute) {
                        let param = this.$router.history.current.params.id
                        this.$store.dispatch('folders/getArborescence', param)
                    } else if (this.isFileContentRoute) {
                        let param = this.$router.history.current.params.file
                        this.$store.dispatch('folders/getArborescence', param)
                    } else {
                        this.$store.dispatch('organizations/getRoot')
                    }
                }
        },
    }
}
</script>
