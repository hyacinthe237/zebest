<template>
    <div class="_side-modal modal animated fadeIn upload" id="newFileModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">

                <div class="_modal-content bordered">
                    <button class="btn btn-grey" @click="closeModal()">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Module details  -->
                <h5 v-translate class="secondary bold pl-20 pb-20 mt-20">Upload files</h5>

                <div :class="['_modal-content bg-grey bordered']">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="_upload">
                                <div class="_icon">
                                    <i class="feather icon-upload-cloud"></i>
                                </div>

                                <div class="_table">
                                    <table class="table" v-if="files.length">
                                      <thead>
                                          <tr>
                                              <th v-translate>Name</th>
                                              <th v-translate>Size</th>
                                              <th v-translate>Messages</th>
                                              <th v-translate></th>
                                          </tr>
                                      </thead>

                                      <tbody>
                                          <tr v-for="file in files" :key="file.id">
                                              <td>{{file.name}}</td>
                                              <td>{{ file.size }}</td>
                                              <td>
                                                  <span v-show="file.error" v-translate>{{file.error}}</span>
                                                  <span v-show="file.success" v-translate>success</span>
                                                  <span v-show="file.active" v-translate>active</span>
                                              </td>
                                              <td>
                                                  <span @click="unsetFile(file.id)"><i class="feather icon-x"></i></span>
                                              </td>
                                          </tr>
                                      </tbody>
                                    </table>
                                </div>

                                <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
                                    <h3 v-translate>Drop files to upload</h3>
                                </div>

                                <p v-translate class="text-center">Drop files here to upload</p>

                                <div class="example-btn text-center">
                                    <file-upload
                                      id="dropfile"
                                      class="btn btn-primary"
                                      :custom-action="uploader"
                                      :multiple="true"
                                      :drop="true"
                                      :headers="headers"
                                      :drop-directory="true"
                                      v-model="files"
                                      @input-file="inputFile"
                                      ref="upload"
                                      chunk-enabled
                                    >
                                      <i class="feather icon-file-plus"></i>
                                      {{ t('Select files') }}
                                    </file-upload>

                                    <button
                                        type="button"
                                        class="btn btn-success ml-10 mr-10"
                                        v-if="!$refs.upload || !$refs.upload.active"
                                        @click.prevent="$refs.upload.active = true"
                                    >
                                      <i class="feather icon-play-circle" aria-hidden="true"></i>
                                      {{ t('Start Upload') }}
                                    </button>

                                    <button
                                        type="button"
                                        class="btn btn-danger mr-10"
                                        v-else
                                        @click.prevent="$refs.upload.active = false"
                                    >
                                      <i class="feather icon-pause-circle" aria-hidden="true"></i>
                                      {{ t('Stop Upload') }}
                                    </button>

                                    <button
                                        type="button"
                                        class="btn btn-warning"
                                        @click.prevent="clean()"
                                    >
                                      <i class="feather icon-x-circle" aria-hidden="true"></i>
                                      {{ t('Remove all files') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import FileUpload from 'vue-upload-component'
import AuthService from '@/services/auth'
import config from '@/services/config'

export default {
  components: {
    FileUpload,
  },

  data: () => ({
      files: [],
      folder: '',
      headers:  {
          'Content-Type': 'multipart/form-data;',
          'Authorization': 'Token ' + AuthService.getToken()
      }
  }),

  computed: {
      url () {
          return config.get('base_url') + 'api/organisation/files/upload/'
      },

      zipurl () {
          return config.get('base_url') + 'api/organisation/folder/upload/'
      },

      isFileRoute () {
          return this.$router.history.current.name === 'file'
      },

      isFileContentRoute () {
          return this.$router.history.current.name === 'file-content'
      },

      isFileContentItemRoute () {
          return this.$router.history.current.name === 'file-content-item'
      },

      parent () {
          return JSON.parse(localStorage.getItem('parent'))
      },

      filecontent () {
          return JSON.parse(localStorage.getItem('filecontent'))
      },

      filecontentitem () {
          return JSON.parse(localStorage.getItem('filecontentitem'))
      }
  },

  mounted () {
      window.eventBus.$on('new-file', (result) => {
          if (result == 'newfile') {
              this.files = []

              if (this.isFileRoute) {
                  this.folder = this.parent.uuid
              }

              if (this.isFileContentRoute) {
                  this.folder = this.filecontent.uuid
              }

              if (this.isFileContentItemRoute) {
                  this.folder = this.filecontentitem.uuid
              }
          }
      })


  },

  methods: {
      clean () {
          this.$refs.upload.clear()
      },

      closeModal () {
          this.clean()
          window.$('.modal').modal('hide')
      },

      unsetFile (id) {
          this.files = this.files.filter(f => f.id != id)
      },

      async uploader (file) {
          var formData = new FormData()

          if (file.name.includes('.zip') || file.name.includes('.rar')) {
              const zipheaders =  {
                  'Content-Type': 'application/x-zip-compressed;',
                  'Authorization': 'Token ' + AuthService.getToken()
              }

              formData.append('path', file.file)
              formData.append('folder', this.folder)

              const response = await this.$api.postWithHeader(this.zipurl, formData, {zipheaders})
                .catch(error => {
                    console.log('error', error.response.data.errors);
                    if (error.response.status === 400) {
                        this.$swal.error('Error', this.$translate.text(error.response.data.errors))
                    } else {
                        this.$swal.error('Error', this.$translate.text(error.response.data.errors))
                    }
                })

                if (response) {
                    this.$swal.success('Confirmation', this.$translate.text('Zip file uploaded !'))
                    this.unsetFile(file.id)
                    this.$store.dispatch('folders/getArborescence', this.folder)
                }
          } else {
              const headers =  {
                  'Content-Type': 'multipart/form-data;'
              }

              formData.append('path', file.file)
              formData.append('folder', this.folder)


              const response = await this.$api.postWithHeader(this.url, formData, {headers})
                .catch(error => {
                    if (error.response.status === 400) {
                        this.$swal.error('Error', this.$translate.text(error.response.data.errors))
                    } else {
                        this.$swal.error('Error', this.$translate.text(error.response.data.errors))
                    }
                })

                if (response) {
                    this.$swal.success('Confirmation', this.$translate.text('File uploaded !'))
                    this.unsetFile(file.id)
                    this.$store.dispatch('folders/getArborescence', this.folder)
                }
          }

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
