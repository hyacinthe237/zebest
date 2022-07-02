<template>
    <div class="_side-modal modal animated fadeIn upload" id="newFileModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">

                <div class="_modal-content bordered">
                    <button class="btn btn-grey" @click="closeModal()" :disabled="isUploading">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Module details  -->
                <h5 v-translate class="secondary bold pl-20 pb-20 mt-20">Upload files</h5>
                <div v-show="isUploading" class="text-center pb-20">
                    <izy-hollow-loading loading />
                </div>
                <div class="bandeau text-center pb-20" v-show="isUploading">
                    La page sera figée pendant le traitement, ouvrez un nouvel onglet SVP
                </div>
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

                                <p v-translate class="text-center" v-show="isUploading">Drop files here to upload</p>

                                <div class="example-btn text-center">
                                    <file-upload
                                      id="dropfile"
                                      class="btn btn-primary mt-10"
                                      :custom-action="uploader"
                                      :multiple="true"
                                      :drop="true"
                                      :headers="headers"
                                      :drop-directory="true"
                                      v-model="files"
                                      @input-file="inputFile"
                                      ref="upload"
                                      chunk-enabled
                                      :disabled="isUploading"
                                    >
                                      <i class="feather icon-file-plus"></i>
                                      {{ t('Select files') }}
                                    </file-upload>

                                    <button
                                        type="button"
                                        class="btn btn-success mt-10 ml-10 mr-10"
                                        v-if="!$refs.upload || !$refs.upload.active"
                                        @click.prevent="save()"
                                    >
                                      <i class="feather icon-play-circle" aria-hidden="true"></i>
                                      {{ t('Import') }}
                                    </button>

                                    <button
                                        type="button"
                                        class="btn btn-danger mt-10 ml-10 mr-10"
                                        v-else
                                        @click.prevent="save()"
                                    >
                                      <i class="feather icon-pause-circle" aria-hidden="true"></i>
                                      {{ t('Stop Import') }}
                                    </button>

                                    <button
                                        type="button"
                                        class="btn btn-warning mt-10"
                                        @click.prevent="clean()"
                                        :disabled="isUploading"
                                    >
                                      <i class="feather icon-x-circle" aria-hidden="true"></i>
                                      {{ t('Remove all') }}
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

  props: {
      current: {
          type: Object,
          default: () => {}
      }
  },

  data: () => ({
      files: [],
      upLoadfiles: [],
      errorfiles: [],
      folder: '',
      headers:  {
          'Content-Type': 'multipart/form-data;',
          'Authorization': 'Token ' + AuthService.getToken()
      },
      isUploading: false
  }),

  computed: {
      url () {
          return config.get('base_url') + '/api/organisation/files/upload/'
      },

      zipurl () {
          return config.get('base_url') + '/api/organisation/folder/upload/'
      },

      isFileRoute () {
          return this.$router.history.current.name === 'file'
      },

      routeParams () {
          const routeParams = this.$router.history.current.params
          return routeParams.file ? routeParams.file : routeParams.id
      }
  },

  watch: {
      files: {
          immediate: true,
          handler: function (val) {
              if (val.length > 500) {
                  this.clean()
                  this.$swal.error(this.$translate.text('Maximum de fichiers'), 'Vous ne pouvez pas télécharger plus de 500 fichiers à la fois')
              } else if (val.length > 0 && val.length == 500) {
                  let last = val[val.length-1]
                  if (last != undefined) {
                      this.unsetFile(last.id)
                      this.$swal.error(this.$translate.text('Maximum de fichiers'), 'Le dernier fichier de la liste a été retiré')
                  }
              }
          }
      }
  },

  mounted () {
      window.eventBus.$on('new-file', (result) => {
          if (result == 'newfile') {
              this.files = []
              this.upLoadfiles = []
              this.errorfiles = []
              // this.folder = this.current.uuid
              this.isUploading = false
              localStorage.removeItem('upLoadfiles')
              localStorage.removeItem('errorsfiles')
          }
      })
  },

  methods: {
      clean () {
          this.$refs.upload.clear()
      },

      save () {
          if (this.files.length) {
              this.isUploading = !this.isUploading
              this.$refs.upload.active = !this.$refs.upload.active
          }
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
              formData.append('folder', this.routeParams)

              const response = await this.$api.postWithHeader(this.zipurl, formData, {zipheaders})
                .catch(error => {
                    this.unsetFile(file.id)
                    this.errorfiles.push(file)

                    if (error.response.status === 400) {
                        this.$swal.error('Error', this.$translate.text(error.response.data.errors))
                    } else {
                        this.$swal.error('Error', this.$translate.text(error.response.data.errors))
                    }

                    this.displayRecapUpload()
                })

                if (response) {
                    this.upLoadfiles.push(file)
                    this.unsetFile(file.id)
                    this.$store.dispatch('folders/getArborescence', this.routeParams)
                    this.$swal.success('Confirmation', this.$translate.text('Zip file uploaded !'))
                    this.displayRecapUpload()
                }
          } else {
              const headers =  {
                  'Content-Type': 'multipart/form-data;'
              }

              formData.append('path', file.file)
              formData.append('folder', this.routeParams)

              const response = await this.$api.postWithHeader(this.url, formData, {headers})
                .catch(error => {
                    this.unsetFile(file.id)
                    this.errorfiles.push(file)

                    if (error.response.status === 400) {
                        this.$swal.error('Error', this.$translate.text(error.response.data.errors))
                    } else {
                        this.$swal.error('Error', this.$translate.text(error.response.data.errors))
                    }

                    this.displayRecapUpload()
                })

                if (response) {
                    this.upLoadfiles.push(file)
                    this.unsetFile(file.id)
                    this.$store.dispatch('folders/getArborescence', this.routeParams)
                    this.$swal.success('Confirmation', this.$translate.text('File uploaded !'))
                    this.displayRecapUpload()
                }
          }

      },

      displayRecapUpload () {
          if (this.files.length == 0) {
              localStorage.setItem('upLoadfiles', JSON.stringify(this.upLoadfiles))
              localStorage.setItem('errorsfiles', JSON.stringify(this.errorfiles))

              setTimeout(() => {
                  window.$('#newFileModal').modal('hide')
                  this.$emit('openRecap')
                  window.eventBus.$emit('recap', 'recap')
                  window.eventBus.$emit('uploaded', 'finished')
              }, 1000)
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
