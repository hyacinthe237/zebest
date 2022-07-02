<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" :id="'previewModal'">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey mr-2" @click="closeModal()" :disabled="isLoading">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>

                    <button class="btn-primary btn mr-2" @click="modifier()"
                        v-if="isConnected && type == 'subscription'">
                        <i class="feather icon-edit"></i>
                    </button>

                    <button class="btn-success btn mr-2" @click="renouveller()"
                        v-if="isConnected && type == 'subscription'">
                        <i class="feather icon-check"></i> {{ t('Renew') }}
                    </button>

                    <button class="btn-secondary btn mr-2" @click="changer()"
                        v-if="isConnected && type == 'subscription'">
                        <i class="feather icon-chevrons-right"></i> {{ t('Change') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content bordered" v-if="type == 'users'">
                    <div class="secondary fs-18">
                        {{ t('Preview') }} {{ t(type) }}
                    </div>
                </div>

                <div class="_modal-content" v-if="type == 'users'">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th v-translate>Name</th>
                                <th v-translate>Email</th>
                                <th v-translate>Role</th>
                                <th v-translate>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="i in tableau" :key="i.id">
                                <td>{{ i.username }}</td>
                                <td>{{ i.email }}</td>
                                <td>{{ t(i.role.name) }}</td>
                                <td>{{ t('Active') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="_modal-content bordered" v-if="type == 'subscription'">
                    <div class="secondary fs-18">
                        {{ t('Subscription') }} {{ t(subscription.formula.name) }}
                    </div>
                </div>

                <div class="_modal-content bg-grey" v-if="type == 'subscription'">
                    <div class="teal fs-16 mt-10">
                        <ul class="list-unstyled">
                            <li class="item"><i class="feather icon-clock"></i>
                                {{ t('Validity') }}: {{ t(subscription.formula.validity) }}</li>

                            <li class="item"><i class="feather icon-hard-drive"></i>
                                {{ t('Max size') }}: {{ subscription.max_size }} Mo</li>

                            <li class="item"><i class="feather icon-activity"></i>
                                {{ t('Max queries') }}: {{ subscription.max_queries }} </li>

                            <li class="item"><i class="feather icon-users"></i>
                                {{ t('Max users') }}: {{ subscription.max_users }}</li>

                            <li class="item"><i class="feather icon-calendar"></i>
                                {{ t('Expiration') }}: {{ subscription.end_date | datetime }} </li>
                        </ul>
                    </div>
                </div>

                <div class="_modal-content" v-if="type == 'subscription'">
                    <div class="secondary fs-18">
                        {{ t('Description') }}
                    </div>
                    <div class="teal fs-16">
                        {{ t(subscription.formula.description) }}
                    </div>
                </div>

                <div class="_modal-content" v-if="type == 'subscription'">
                    <div class="secondary fs-18">
                        {{ t('Historic') }}
                    </div>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th v-translate>Formula</th>
                                <th v-translate>Status</th>
                                <th v-translate>Max queries</th>
                                <th v-translate>Max users</th>
                                <th v-translate>Max size</th>
                                <th v-translate>Start date</th>
                                <th v-translate>Due date</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="h in historiques" :key="h.uuid">
                                <td>{{ t(h.formula) }}</td>
                                <td>{{ t(h.status) }}</td>
                                <td>{{ h.max_queries }}</td>
                                <td>{{ h.max_users }}</td>
                                <td>{{ h.max_size }}</td>
                                <td>{{ h.start_date | datetime }}</td>
                                <td>{{ h.end_date | datetime }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-show="isLoading" class="mt-40 pb-40 text-center">
                    <izy-hollow-loading loading />
                </div>
                <div class="_modal-content bordered" v-if="type == 'settings' && !isLoading">
                    <div class="secondary fs-18">
                        {{ t('Preview') }} {{ t(type) }}
                    </div>

                    <form @submit.prevent class="_form settings mt-20">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="icons" @click="toggle_active_semantic()">
                                    <label for="active_suggestion" v-translate>Active semantic</label>
                                    <div class="">
                                        <i class="feather icon-toggle-left" v-show="!ghost.active_semantic"></i>
                                        <i class="feather icon-toggle-right" v-show="ghost.active_semantic"></i>
                                    </div>
                                </div>

                                <div class="icons" @click="toggle_active_suggestion()">
                                    <label for="active_suggestion" v-translate>Active suggestion</label>
                                    <div class="">
                                        <i class="feather icon-toggle-left" v-show="!ghost.active_suggestion"></i>
                                        <i class="feather icon-toggle-right" v-show="ghost.active_suggestion"></i>
                                    </div>
                                </div>

                                <div class="icons" @click="toggle_index_on_upload()">
                                    <label for="index_on_upload" v-translate>Index on upload</label>
                                    <div class="">
                                        <i class="feather icon-toggle-left" v-show="!ghost.index_on_upload"></i>
                                        <i class="feather icon-toggle-right" v-show="ghost.index_on_upload"></i>
                                    </div>
                                </div>

                                <div class="icons" @click="toggle_skip_stopwords()">
                                    <label for="skip_stopwords" v-translate>Skip stopwords</label>
                                    <div class="">
                                        <i class="feather icon-toggle-left" v-show="!ghost.skip_stopwords"></i>
                                        <i class="feather icon-toggle-right" v-show="ghost.skip_stopwords"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-6">
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
                                <div class="form-group mt-20">
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
                                            v-for="l in tableau"
                                            :key="l.value"
                                            :value="l.value"
                                            :selected="l.value === 'fr'"
                                        >
                                            {{ t(l.name) }}
                                        </option>
                                    </select>
                                    <v-error :name="'language'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                        </div>

                        <div class="mt-40">
                            <button class="btn-teal btn mr-20" @click="annuler()">
                                {{ t('Annuler') }}
                            </button>

                            <button class="btn-secondary btn mr-20" @click="save()">
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
                                <div class="form-group">
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

                                <div class="mt-20">
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
                                <div class="form-group">
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

                                <div class="mt-20">
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
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data: () => ({
        vocabulary: [],
        metadata: [],
        xlsx_headers:  {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
        },
        other_headers:  {
            'Content-Type': 'text/csv;application/vnd.ms-excel;application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
        }
    }),

    props: {
        type: {
            type: String,
            default: () => ''
        },

        historiques: {
            type: Array,
            default: () => []
        },

        tableau: {
            type: Array,
            default: () => []
        },

        subscription: {
            type: Object,
            default: () => {}
        },

        organisation: {
            type: Object,
            default: () => {}
        },

        isConnected: {
            type: Boolean,
            default: () => false
        },
    },

    watch: {
        setting (val) {
            if (!_.isEmpty(val)) {
                this.ghost = Object.assign({}, val)
            }
        }
    },

    computed: {
        setting () {
            return this.$store.state.settings.org_setting
        },
    },

    mounted () {
        window.eventBus.$on('preview-type', (result) => {
            if (result === 'settings') {
                this.ghost = Object.assign({}, this.setting)
            }
        })
    },

    methods: {
        modifier () {
            window.$('#previewModal').modal('hide')
            this.$emit('modifier', this.subscription)
        },

        renouveller () {
            window.$('#previewModal').modal('hide')
            this.$emit('renouveller', this.subscription)
        },

        changer () {
            window.$('#previewModal').modal('hide')
            this.$emit('changer', this.subscription)
        },

        annuler () {
            this.ghost = Object.assign({}, this.setting)
        },

        annulerMeta () {
            this.$refs.metadata.clear()
        },

        annulerVoca () {
            this.$refs.vocabulary.clear()
        },

        upload_vocabulary (file) {
            this.ghost.vocabulary = file.file
        },

        upload_metadata (file) {
            this.ghost.metadata = file.file
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

        closeModal () {
            this.ghost = Object.assign({}, this.setting)
            this.closeAllModals()
        },

        async save () {
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

            let uuid = localStorage.getItem('orgUUID')
            let url = `api/organisation/settings/${uuid}/update`
            const response = await this.$api.post(url, formData)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                })

            this.stopLoading()
            if (response) {
                this.$store.commit('settings/SET_ORG_SETTING', response.data)
                this.$store.commit('organizations/SET_LANGUAGE', response.data.language)
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

        saveVoca () {
            console.log('... waitting for api...')
            // let payload = {
            //     "organisation": this.organisation.uuid
            // }
            //
            // this.$refs.vocabulary.active = true
            //
            // var formData = new FormData()
            // formData.append('metadata', this.vocabulary[0].file)
            //
            // this.startLoading()
            //
            // let url = `api/organisation/metadata/${this.organisation.uuid}/update`
            // const response = await this.$api.post(url, formData)
            //     .catch(error => {
            //         this.stopLoading()
            //         this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
            //     })
            //
            // if (response) {
            //     this.stopLoading()
            //     this.$store.commit('settings/SET_ORG_SETTING', response.data)
            //     this.$swal.success('Confirmation', this.$translate.text('Semantic file setting uploaded'))
            //     this.vocabulary = []
            // }
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
