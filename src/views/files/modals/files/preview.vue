<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="previewModal">
        <div class="modal-dialog" role="document" v-show="!isLoading">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey mr-10" @click="close()">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>

                    <input type="hidden" id="toCopy" :value="link">
                    <button
                        class="btn-secondary btn mr-10"
                        @click.stop.prevent="copyLink()"
                        :disabled="!resource.is_indexed"
                    >
                        <i class="feather icon-copy mr-10"></i>
                        {{ t('Copy link') }}
                    </button>

                    <button class="btn-primary btn mr-10" @click="download()">
                        <i class="feather icon-download mr-10"></i>
                        {{ t('Download') }}
                    </button>

                    <button class="btn-success btn mr-2" @click="changeName()">
                        <i class="feather icon-edit"></i>
                    </button>

                    <button class="btn-danger btn" @click="deleteFile()">
                        <i class="feather icon-trash-2"></i>
                    </button>
                </div>

                <div class="_modal-content">
                    <h4 class="secondary">{{ resource.display_name }}</h4>
                </div>

                <!-- Modal content -->
                <div class="_modal-content bg-grey">
                    <div class="teal fs-16 mt-10">
                        <ul class="list-unstyled">
                            <li>
                                <i :class="[`feather icon-download mr-1`]"></i>
                                {{ resource.size ? resource.size.toFixed(2) + ' Mo' : 'Unknow' }}
                            </li>
                            <li>{{ t('Added by') }}: {{ resource.owner }}</li>
                            <li>{{ t('Last modified') }}: 22/08/2019 14:27</li>
                        </ul>
                    </div>
                </div>

                <!-- Modal content -->
                <div class="_modal-content">
                    <FileMetadata
                        :file="resource"
                        :metadatas="metadatas"
                        :delete_params="delete_params"
                        @deleteMetadata="deleteMetadata"
                        @dataToView="toView"
                    ></FileMetadata>
                </div>
            </div>
        </div>

        <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
        </div>

        <FormModal
            :file="resource"
            :metadatas="metadatas"
            :payload="payload"
            :ghost_data="ghost"
            @addMetadata="saveFileMetadata"
            @reset="resetGhost"
            @close="closeCreateModal"
        ></FormModal>

        <TextModal
            :data="dataToView"
            @close="closeTextModal"
        ></TextModal>
    </div>
</template>

<script>
import _ from 'lodash'
import FileMetadata from '@/components/metadata/file-metadata'
import FormModal from '@/components/metadata/modals/form-modal'
import TextModal from '@/components/metadata/modals/text-modal'
import { mapGetters } from 'vuex'

export default {

    props: {
        root: {
            type: Object,
            default: () => {},
        },

        isSuperAdmin: {
            type: Boolean,
            default: true,
        },

        link: {
            type: String,
            default: '',
        }
    },

    components: { FileMetadata, FormModal, TextModal },

    data: () => ({
        delete_params: { file: '', metadata: [] },
        payload: { file: '', metadata: [] },
        dataToView: {},
    }),

    computed: {
        resource () {
            return this.$store.state.file
        },

        ...mapGetters('metadatas', {
            metadatas: 'getOrgMetadatas'
        })
    },

    watch: {
        resource: {
            immediate: true,
            handler: function (val) {
                if (!_.isEmpty(val)) {
                    this.payload.file = val.uuid
                    this.delete_params.file = val.uuid
                }
            }
        }
    },

    mounted () {
        window.eventBus.$on('preview-file', (result) => {
            if (result == 'previewfile') {
                this.resetGhost()
                this.initPayload()
                this.getOrgMetadatas()
                this.setDeleteParams()
            }
        })
    },

    methods: {
        close () {
            window.$('.modal').modal('hide')
        },

        closeCreateModal () {
            window.$('#formModal').modal('hide')
            this.resetGhost()
        },

        closeTextModal () {
            window.$('#showTextModal').modal('hide')
        },

        async getOrgMetadatas () {
            let payload = {
                organisation: this.root.organisation.uuid
            }

            if (this.isSuperAdmin) {
                this.$store.dispatch('metadatas/getOrgMetadatas', payload)
            } else {
                this.$store.dispatch('metadatas/getOrgMetadatas')
            }

        },

        toView (data) {
            this.dataToView = data
        },

        changeName () {
            window.$('.modal').modal('hide')
            window.eventBus.$emit('modif', 'modif')
            this.openModal({ id: 'editFileModal' })
        },

        download () {
            window.$('.modal').modal('hide')
            this.$emit('downloaded', this.resource)
        },

        deleteFile () {
            this.close()
            this.openModal({ id: 'deleteFileModal' })
        },

        copyLink () {
          let toCopy = document.querySelector('#toCopy')
          toCopy.setAttribute('type', 'text')
          toCopy.select()

          try {
            document.execCommand('copy')
            this.$swal.success(this.$translate.text('Link copied'))
          } catch (err) {
            this.$swal.error(this.$translate.text('Link unable to copy !'))
          }

          /* unselect the range */
          toCopy.setAttribute('type', 'hidden')
          window.getSelection().removeAllRanges()
        },

        resetGhost () {
            this.ghost = {
                id: this.metadatas.length ? this.metadatas[0].uuid : '',
                value: ''
            }
        },

        initPayload () {
            if (this.isSuperAdmin) {
                this.payload = {
                    file: this.resource.uuid,
                    metadata: [],
                    organisation: this.root.organisation.uuid
                }
            } else {
                this.payload = {
                    file: this.resource.uuid,
                    metadata: [],
                    // organisation: this.root.organisation.uuid
                }
            }

        },

        setDeleteParams () {
            this.delete_params = {
                file: this.resource.uuid ? this.resource.uuid : '',
                metadata: []
            }
        },

        async saveFileMetadata (params) {
            const response = await this.$api.post('api/organisation/metadata/save', params)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })
                if (response) {
                    const routeParams = this.$router.history.current.params
                    let param = routeParams.file ? routeParams.file : routeParams.id
                    this.getArborescence(param)
                    this.$emit('rerenderPreview', this.resource)
                    this.closeCreateModal()
                    this.$swal.success(this.$translate.text('File metadata added successfully !'))
                }
        },

        async deleteMetadata (delete_params) {
            const response = await this.$api.post('api/organisation/metadata/remove', delete_params)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })
                if (response) {
                    const routeParams = this.$router.history.current.params
                    let param = routeParams.file ? routeParams.file : routeParams.id
                    this.getArborescence(param)
                    this.$emit('rerenderPreview', this.resource)
                    this.closeCreateModal()
                    this.$swal.success(this.$translate.text('The metadata has been deleted successfully !'))
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
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                })
            if (response) {
                this.stopLoading()
                this.$store.commit('folders/SET_ARBORESCENCE_FOLDER', response.data)
                this.$store.commit('folders/SET_HIERARCHY', response.data.hierarchy)
                this.$store.commit('folders/SET_MORE_FILES', response.data.more_files)
                this.$store.commit('folders/SET_MORE_FOLDERS', response.data.more_folders)
            }
        },
    }
}
</script>
