<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="addConnectorModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey" @click="closeModal()">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div class="secondary fs-20">
                        {{ t('Add Connector') }}
                    </div>

                    <form @submit.prevent class="_form mt-20">
                        <div class="row pb-20">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label for="type" v-translate>Type</label>
                                    <select
                                        name="type"
                                        id="type"
                                        v-validate="'required'"
                                        v-model="ghost.type"
                                        class="form-control form-control-lg"
                                    >
                                    <option value="" v-translate>Select type</option>
                                    <option
                                        v-for="r in types"
                                        :key="r.uuid"
                                        :value="r.uuid"
                                    >
                                        {{ r.name }}
                                    </option>
                                    </select>
                                    <v-error :name="'Type'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-12">
                                <label v-translate for="credentials">Credentials File</label>

                                <div :class="['_modal-content bg-grey bordered']">
                                  <div class="_upload">
                                      <div class="_icon">
                                          <i class="feather icon-upload-cloud"></i>
                                      </div>

                                      <table class="table" v-if="files.length">
                                          <thead>
                                              <tr>
                                                  <th v-translate>Name</th>
                                                  <th v-translate>Size</th>
                                              </tr>
                                          </thead>

                                          <tbody>
                                              <tr v-for="file in files" :key="file.id">
                                                  <td>{{file.name}}</td>
                                                  <td>{{ file.size }}</td>
                                              </tr>
                                          </tbody>
                                      </table>

                                      <p v-translate v-else>Drop credentials file here to upload</p>

                                    <div class="example-btn">
                                      <file-upload
                                        id="dropfile"
                                        class="btn btn-secondary"
                                        :custom-action="uploader"
                                        :multiple="false"
                                        :drop="true"
                                        :headers="headers"
                                        :drop-directory="true"
                                        v-model="files"
                                        @input-file="inputFile"
                                        ref="upload"
                                        chunk-enabled
                                      >
                                        <i class="feather icon-file-plus"></i>
                                        {{ t('Select file') }}
                                      </file-upload>
                                    </div>
                                  </div>

                                </div>
                            </div>

                            <div class="col-sm-12 text-right mt-20">
                                <izy-hollow-loading loading v-show="isLoading"/>
                                <button class="btn btn-primary" @click="create()">
                                    <i class="feather icon-check"></i>
                                    {{ t('Add') }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FileUpload from 'vue-upload-component'
import AuthService from '@/services/auth'

export default {
    data: () => ({
        selected: {},
        files: [],
        headers:  {
            'Content-Type': 'multipart/form-data;',
            'Authorization': 'Token ' + AuthService.getToken()
        }
    }),

    components: {
      FileUpload,
    },

    computed: {
        org () {
            let user = JSON.parse(localStorage.getItem('user'))
            return user.account.role.id === 1
                ? JSON.parse(localStorage.getItem('cur_org'))
                : user.organisation
        },

        types () {
            return this.$store.state.connectors.connectors
        },
    },

    mounted () {
        window.eventBus.$on('json-file', (result) => {
            if (result == 'jsonfile') {
                this.resetGhost()
                this.showErrors = false
            }
        })
    },

    methods: {
        async create () {
            this.showErrors = false
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()

            let formData = new FormData()
            formData.append('organisation', this.org.uuid)
            formData.append('type', this.ghost.type)
            formData.append('credentials', this.files[0].file)

            const response = await this.$api.postWithHeader(`api/organisation/connector/gdrive/create`, formData, this.headers)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                    this.isLoading = false
                })

                if (response) {
                    this.stopLoading()
                    this.closeModal()
                    this.showErrors = false

                    window.open(response.data.auth_url, '_blank')
                }
        },

        resetGhost () {
            this.ghost = {
                type: ''
            }

            this.files = []
            this.stopLoading()
        },

        closeModal () {
            this.$refs.upload.clear()
            window.$('.modal').modal('hide')
        },

        uploader (file) {
            this.selected = file.file
        },

        /**
       * Has changed
       * @param  Object|undefined   newFile   Read only
       * @param  Object|undefined   oldFile   Read only
       * @return undefined
       */
      async inputFile (newFile, oldFile) {
        if (newFile && oldFile && !newFile.active && oldFile.active) {
            newFile.data.folder = this.$router.history.current.params.id
            newFile.data.path = newFile.file
        }
      },
    }
}
</script>
