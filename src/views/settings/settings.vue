<template lang="html">
    <div class="">
        <section class="_header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="title">
                            {{ t('Settings') }}
                            <i class="feather icon-settings"></i>
                        </div>

                        <Breadcrumb :routes="breadcrumb"></Breadcrumb>
                    </div>

                    <div class="col-sm-8">
                        <div class="text-right">

                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard">
            <div class="container-fluid">
                <div v-show="isLoading" class="mt-40 pb-40 text-center">
                    <izy-hollow-loading loading />
                </div>

                <form @submit.prevent class="_form settings" v-show="!isLoading">
                    <div class="row">
                        <div class="col-sm-3">
                            <div class="form-group">
                                <label for="token_duration" v-translate>Token duration</label>
                                <input type="number"
                                    name="token_duration"
                                    v-model="ghost.token_duration"
                                    class="form-control form-control-lg"
                                    v-validate="'required'"
                                    :data-vv-as="t('Token duration')"
                                >
                                <v-error :name="'token_duration'" :err="errors" :show="showErrors"></v-error>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="form-group">
                                <label for="returned_page" v-translate>Returned page</label>
                                <input type="number"
                                    name="returned_page"
                                    v-model="ghost.returned_page"
                                    class="form-control form-control-lg"
                                    v-validate="'required'"
                                    :data-vv-as="t('Returned page')"
                                >
                                <v-error :name="'returned_page'" :err="errors" :show="showErrors"></v-error>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="form-group">
                                <label for="firstname" v-translate>Language</label>
                                <select
                                    name="language"
                                    id="language"
                                    v-validate="'required'"
                                    v-model="ghost.language"
                                    class="form-control form-control-lg"
                                    required
                                >
                                <option
                                    v-for="l in languages"
                                    :key="l.value"
                                    :value="l.value"
                                >
                                    {{ t(l.name) }}
                                </option>
                                </select>
                                <v-error :name="'language'" :err="errors" :show="showErrors"></v-error>
                            </div>
                        </div>
                        <div class="col-sm-3"></div>

                        <div class="col-sm-3">
                            <div class="icons" @click="toggle_active_semantic()">
                                <label for="active_suggestion" v-translate>Active semantic</label>
                                <div class="">
                                    <i class="feather icon-toggle-left" v-show="!ghost.active_semantic"></i>
                                    <i class="feather icon-toggle-right" v-show="ghost.active_semantic"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="icons" @click="toggle_active_suggestion()">
                                <label for="active_suggestion" v-translate>Active suggestion</label>
                                <div class="">
                                    <i class="feather icon-toggle-left" v-show="!ghost.active_suggestion"></i>
                                    <i class="feather icon-toggle-right" v-show="ghost.active_suggestion"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="icons" @click="toggle_skip_stopwords()">
                                <label for="skip_stopwords" v-translate>Skip stopwords</label>
                                <div class="">
                                    <i class="feather icon-toggle-left" v-show="!ghost.skip_stopwords"></i>
                                    <i class="feather icon-toggle-right" v-show="ghost.skip_stopwords"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="icons" @click="toggle_index_on_upload()">
                                <label for="index_on_upload" v-translate>Index on upload</label>
                                <div class="">
                                    <i class="feather icon-toggle-left" v-show="!ghost.index_on_upload"></i>
                                    <i class="feather icon-toggle-right" v-show="ghost.index_on_upload"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-40" v-show="isAdmin || isSuperAdmin">
                        <button class="btn-teal btn mr-20" @click="getSettings()">
                            {{ t('Annuler') }}
                        </button>

                        <button type="submit" class="btn-secondary btn" @click="save()">
                            <i class="feather icon-save mr-10"></i>
                            {{ t('Save') }}
                        </button>
                    </div>
                </form>

                <div class="row" v-show="!isLoading">
                    <div class="col-sm-12">
                        <h3 v-translate class="bold mt-40">Import setting's files</h3>
                    </div>
                    <div class="col-sm-6">
                        <form @submit.prevent class="_form mt-20 settings">
                            <div class="form-group l">
                                <div class="">
                                    <file-upload
                                      input-id="vocabulary"
                                      class="btn btn-secondary mt-10 mr-20"
                                      :custom-action="upload_vocabulary"
                                      :multiple="false"
                                      :drop-directory="true"
                                      :drop="true"
                                      :headers="other_headers"
                                      :extensions="['cvs', 'xls', 'owl', 'xlsx']"
                                      v-model="vocabulary"
                                      ref="vocabulary"
                                      chunk-enabled
                                      @input-file="input_vocabulary"
                                    >
                                      <i class="feather icon-file-plus"></i>
                                      {{ t('Select semantic file') }}
                                    </file-upload>
                                </div>
                                <div class="success" v-if="ghost.vocabulary_file">
                                    {{ ghost.vocabulary_file }}
                                </div>
                                <div class="preview" v-if="vocabulary.length>0">
                                    {{ vocabulary[0].name }} - {{ vocabulary[0].size }}
                                </div>
                            </div>

                            <div class="mt-20" v-show="isAdmin || isSuperAdmin">
                                <button class="btn-teal btn mr-20" @click="annulerVoca()">
                                    {{ t('Annuler') }}
                                </button>

                                <button type="submit" class="btn-primary btn" @click="saveVoca()">
                                    {{ t('Import') }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div class="col-sm-6">
                        <form @submit.prevent class="_form mt-20 settings">
                            <div class="form-group l">
                                <div class="">
                                    <file-upload
                                      input-id="metadata"
                                      class="btn btn-primary mt-10 mr-20"
                                      :custom-action="upload_metadata"
                                      :multiple="false"
                                      :drop-directory="true"
                                      :drop="true"
                                      :headers="xlsx_headers"
                                      :extensions="['xlsx']"
                                      v-model="metadata"
                                      ref="metadata"
                                      chunk-enabled
                                      @input-file="input_metadata"
                                    >
                                      <i class="feather icon-file-plus"></i>
                                      {{ t('Select metadata file') }}
                                    </file-upload>
                                </div>
                                <div class="success" v-if="ghost.metadata_file">
                                    {{ ghost.metadata_file }}
                                </div>

                                <div class="preview" v-if="metadata.length>0">
                                    {{ metadata[0].name }} - {{ metadata[0].size }}
                                </div>
                            </div>

                            <div class="mt-20" v-show="isAdmin || isSuperAdmin">
                                <button class="btn-teal btn mr-20" @click="annulerMeta()">
                                    {{ t('Annuler') }}
                                </button>

                                <button type="submit" class="btn-secondary btn" @click="saveMeta()">
                                    {{ t('Import') }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import FileUpload from 'vue-upload-component'

export default {
    data: () => ({
        setting: {},
        vhost: {},
        mhost: {},
        languages: [],
        vocabulary: [],
        metadata: [],
        xlsx_headers:  {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
        },
        other_headers:  {
            'Content-Type': 'text/csv;application/vnd.ms-excel;application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
        }
    }),

    components: { FileUpload },

    computed: {
        user () {
            return JSON.parse(localStorage.getItem('user'))
        },

        isAdmin () {
            return this.user.account.role.id === 2
        },

        isSuperAdmin () {
            return this.user.account.role.id === 1
        },

        organisation () {
            return this.user.organisation
        },

        settings () {
            return this.$store.state.settings.org_setting
        },
    },

    watch: {
        settings: {
            immediate: true,
            handler: function (val) {
                if (!_.isEmpty(val)) {
                    this.ghost = Object.assign({}, val)
                    this.showErrors = false
                }
            }
        },
    },

    mounted () {
        this.getSettings()
        this.makeLanguages()
    },

    methods: {
        annulerMeta () {
            this.$refs.metadata.clear()
        },

        annulerVoca () {
            this.$refs.vocabulary.clear()
        },

        upload_vocabulary (file) {
            this.vhost.vocabulary = file.file
        },

        upload_metadata (file) {
            this.mhost.metadata = file.file
        },

        makeLanguages () {
            this.languages = [
                { name: 'French', value: 'fr' },
                { name: 'English', value: 'en' },
                { name: 'Germany', value: 'de' },
                { name: 'Spanish', value: 'es' },
                { name: 'Portuguese', value: 'pt' },
            ]
        },

        makeBreadcrumb () {
            this.breadcrumb = [
                { name: 'Home', route: 'home', active: false },
                { name: 'Settings', route: 'settings', active: true },
            ]
        },

        toggle_active_semantic () {
            this.ghost.active_semantic = !this.ghost.active_semantic
        },

        toggle_active_suggestion () {
            this.ghost.active_suggestion = !this.ghost.active_suggestion
        },

        toggle_index_on_upload () {
            this.ghost.index_on_upload = !this.ghost.index_on_upload
        },

        toggle_skip_stopwords () {
            this.ghost.skip_stopwords = !this.ghost.skip_stopwords
        },

        async getSettings () {
            this.startLoading()

            let payload = {
                "organisation": this.organisation.uuid
            }

            const response = await this.$api.get('api/organisation/setting', payload)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                })

            this.stopLoading()
                if (response) {
                    this.$store.commit('settings/SET_ORG_SETTING', response.data)
                }
        },

        async save () {
            this.showErrors = true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()
            let payload = {
                "organisation": this.organisation.uuid
            }

            var formData = new FormData()
            formData.append('active_suggestion', this.ghost.active_suggestion)
            formData.append('active_semantic', this.ghost.active_semantic)
            formData.append('index_on_upload', this.ghost.index_on_upload)
            formData.append('language', this.ghost.language)
            formData.append('returned_page', this.ghost.returned_page)
            formData.append('skip_stopwords', this.ghost.skip_stopwords)
            formData.append('token_duration', this.ghost.token_duration)


            let url = `api/organisation/settings/${this.organisation.uuid}/update`
            const response = await this.$api.post(url, formData)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                })

            this.stopLoading()
            if (response) {
                this.$store.commit('settings/SET_ORG_SETTING', response.data)
                this.$swal.success('Confirmation', this.$translate.text('Settings updated'))
            }
        },

        async saveMeta () {
          if (this.metadata.length > 0) {
              let payload = {
                  "organisation": this.organisation.uuid
              }

              this.$refs.metadata.active = true

              var formData = new FormData()
              formData.append('metadata', this.metadata[0].file)

              this.startLoading()

              let url = `api/organisation/metadata/${this.organisation.uuid}/update`
              const response = await this.$api.post(url, formData)
                  .catch(error => {
                      this.stopLoading()
                      this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                  })

              if (response) {
                  this.stopLoading()
                  this.$store.commit('settings/SET_ORG_SETTING', response.data)
                  this.$swal.success('Confirmation', this.$translate.text('Metadata file setting uploaded'))
                  this.metadata = []
              }
          }
        },

        async saveVoca () {
            console.log('... waitting for api...')
            let payload = {
                "organisation": this.organisation.uuid
            }

            this.$refs.vocabulary.active = true

            var formData = new FormData()
            formData.append('vocabulary', this.vocabulary[0].file)

            this.startLoading()

            let url = `api/organisation/vocabulary/file/${this.organisation.uuid}/update`
            const response = await this.$api.post(url, formData)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                })

            if (response) {
                this.stopLoading()
                this.$store.commit('settings/SET_ORG_SETTING', response.data)
                this.$swal.success('Confirmation', this.$translate.text('Semantic file setting uploaded'))
                this.vocabulary = []
            }
        },

        /**
       * Has changed
       * @param  Object|undefined   newFile   Read only
       * @param  Object|undefined   oldFile   Read only
       * @return undefined
       */
      async input_vocabulary (newFile, oldFile) {
        if (newFile && oldFile && !newFile.active && oldFile.active) {
            newFile.data.vocabulary        = newFile.vocabulary
        }
      },

        /**
       * Has changed
       * @param  Object|undefined   newFile   Read only
       * @param  Object|undefined   oldFile   Read only
       * @return undefined
       */
      async input_metadata (newFile, oldFile) {
        if (newFile && oldFile && !newFile.active && oldFile.active) {
            newFile.data.metadata          = newFile.metadata
        }
      },
    }
}
</script>
