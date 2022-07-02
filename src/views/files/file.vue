<template lang="html">
    <div class="">
        <section class="_header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="search-container">
                            <form @submit.prevent class="_form">
                                <div class="form-group form-group-lg">
                                    <div class="inner-addon left-addon">
                                        <i class="glyphicon feather icon-search"></i>

                                        <input type="text"
                                            name="keywords"
                                            :placeholder="t('Keywords')"
                                            autocomplete="off"
                                            class="form-control form-control-lg"
                                            v-model="ghost.keywords"
                                        >
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="buttons text-right">
                          <button
                              @click.prevent="retour()"
                              class="btn btn-dark mr-2"
                              :disabled="isLoading"
                          >
                              <i class="feather icon-arrow-left"></i> {{ t('Back') }}
                          </button>

                            <button
                                @click.prevent="new_folder()"
                                class="btn btn-primary mr-2"
                                :disabled="isLoading"
                            >
                                <i class="feather icon-folder-plus"></i> {{ t('Folder') }}
                            </button>

                            <button
                                @click.prevent="new_file()"
                                class="btn btn-secondary mr-2"
                                :disabled="isLoading"
                            >
                                <i class="feather icon-file-plus"></i> {{ t('File') }}
                            </button>

                            <button class="btn-danger btn"
                                :disabled="isLoading"
                                @click="confirmDeleteFiles()"
                                v-if="selected.length > 0"
                            >
                                <i class="feather icon-trash-2"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <Breadcrumb
                    v-show="!isLoading"
                    :routes="breadcrumb"
                    @editer="editer"
                    @indexer="indexer"
                    @onOpen="selectFolderOnBreadcrumb"
                ></Breadcrumb>
            </div>
        </section>

        <section class="dashboard" v-show="!isLoading">
            <div class="container-fluid">
                <div v-if="filteredFiles.length == 0">
                    <div class="_empty">
                        <i class="feather icon-info"></i>
                        <p v-translate>No files or folders found</p>
                    </div>
                </div>
                <div class="docs" v-else>
                    <izyPaginate
                        @nextPage="getArborescence"
                        @previousPage="getArborescence"
                        @currentPage="getArborescence"
                        :canClickedNext="canClickedNext"
                    ></izyPaginate>

                    <div class="_select-all text-right">
                        <ItemCheckbox
                            :types="'all'"
                            :clicked="isClicked"
                            @allselected="allselected"
                        ></ItemCheckbox>
                    </div>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th v-translate>Name</th>
                                <th v-translate>Size</th>
                                <th v-translate>Indexed</th>
                                <th v-translate>Type</th>
                                <th v-translate>Modified</th>
                                <th v-translate>Last Index Date</th>
                                <th v-translate>Select</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="f in displayedFiles" :key="f.uuid"
                            >
                                <td width="40%" @click="openFile(f)">
                                    <div class="_item-name"
                                        @contextmenu.prevent="$refs.menu.open($event, { file: f })"
                                        v-if="f.type == 'folder'"
                                    >
                                        <img :src="folder_icon" alt="">
                                        {{ f.name }}
                                    </div>

                                    <div class="_item-name" v-else>
                                        <img :src="pdf" alt="" v-show="f.extension.endsWith('pdf')">
                                        <img :src="pdf" alt="" v-show="f.extension.endsWith('PDF')">
                                        <img :src="pptx" alt="" v-show="f.extension.endsWith('pptx')">
                                        <img :src="ppt" alt="" v-show="f.extension.endsWith('ppt')">
                                        <img :src="html" alt="" v-show="f.extension.endsWith('html')">
                                        <img :src="htm" alt="" v-show="f.extension.endsWith('htm')">
                                        <img :src="xml" alt="" v-show="f.extension.endsWith('xml')">
                                        <img :src="png" alt="" v-show="f.extension.endsWith('png')">
                                        <img :src="jpeg" alt="" v-show="f.extension.endsWith('jpeg')">
                                        <img :src="jpg" alt="" v-show="f.extension.endsWith('jpg')">
                                        <img :src="xlsx" alt="" v-show="f.extension.endsWith('xlsx')">
                                        <img :src="xlsx" alt="" v-show="f.extension.endsWith('xls')">
                                        <img :src="excel" alt="" v-show="f.extension.endsWith('excel')">
                                        <img :src="excel" alt="" v-show="f.extension.endsWith('xlsm')">
                                        <img :src="docx" alt="" v-show="f.extension.endsWith('docx')">
                                        <img :src="doc" alt="" v-show="f.extension.endsWith('doc')">
                                        <img :src="zip" alt="" v-show="f.extension.endsWith('rar')">
                                        <img :src="zip" alt="" v-show="f.extension.endsWith('zip')">
                                        <img :src="csv" alt="" v-show="f.extension.endsWith('csv')">
                                        <img :src="odd" alt="" v-show="f.extension.endsWith('odd')">
                                        <img :src="odp" alt="" v-show="f.extension.endsWith('odp')">
                                        <img :src="ods" alt="" v-show="f.extension.endsWith('ods')">
                                        <img :src="odt" alt="" v-show="f.extension.endsWith('odt')">
                                       {{ displayName(f) }}
                                    </div>
                                </td>
                                <td @click="openFile(f)">{{ displaySize(f.size) }}</td>
                                <td @click="openFile(f)">{{ f.indexing ? 'En Indexation' : f.is_indexed ? 'Indexé' : 'Non indexé' }}</td>
                                <td v-translate>{{ f.extension ?  f.extension + ' File' : 'File Folder'}}</td>
                                <td @click="openFile(f)">{{ f.updated_at | datetime }}</td>
                                <td @click="openFile(f)">{{ f.last_index_date | datetime }}</td>
                                <td>
                                    <ItemCheckbox
                                        id="meta_del_btn"
                                        :value="f.uuid"
                                        :selected="selected"
                                        @changed="FilesChanged"
                                    >
                                    </ItemCheckbox>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <vue-context ref="menu" @open="onOpen">
                    <li>
                        <i class="feather icon-edit-2"></i>
                        <a href="#" @click.prevent="editer()" v-translate>Edit</a>
                    </li>
                    <li>
                        <i class="feather icon-trash-2"></i>
                        <a href="#" @click.prevent="supprimer()" v-translate>Delete</a>
                    </li>
                </vue-context>
            </div>
        </section>
        <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
        </div>

        <PreviewModal
            @downloaded="download"
            @rerenderPreview="rerenderPreview"
            :link="linkToCopy"
            :root="root"
            :isSuperAdmin="isAdmin"
        />

        <!-- Folder manipulation -->
        <NewFolderModal :folder="root" />
        <EditFolderModal :folder="selectedFolder"/>
        <DeleteFolderModal :folder="selectedFolder"/>
        <IndexerModal />

        <!-- File Manipulation -->
        <NewFileModal :current="root" @openRecap="RecapUploadFilesModal"/>
        <EditFileModal :file="selectedFile" :current="root" />
        <DeleteFileModal :file="selectedFile" :current="root" />

        <!-- recapitulatif -->
        <RecapUploadFilesModal />
        <DeleteLogsModal :files="deleted_files" :folders="deleted_folders"/>

    </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'
import ApiService from '@/services/api'
import fileMixins from './mixins'

export default {
    mixins: [fileMixins],

    mounted () {
        this.onScroll()
        this.getArborescence()
        this.resetFilteredFiles()
    },

    watch: {
        directory: {
            immediate: true,
            handler: function () {
                this.selected = []
                this.selectedCopy = []
                localStorage.removeItem('files')
                localStorage.removeItem('folders')

                return this.breadcrumb
            }
        },

        arborescence_folder: {
            immediate: true,
            handler: function () {
                this.resetFilteredFiles()
                return this.breadcrumb
            }
        },

        'ghost.keywords' (val) {
            if (val.length) {
                this.filteredFiles = this.allFiles.filter(f => {
                    return f.name.toLowerCase().includes(val.toLowerCase())
                })
            } else {
                this.resetFilteredFiles()
            }
        },
    },

    computed: {
        ...mapGetters('folders', {
            arborescence_folder: 'getArborescence'
        }),

        root () {
            return this.$store.state.folders.arborescence_folder.root
        },

        orgUuid () {
            if (this.root && this.root.organisation) {
                return this.root.organisation.uuid
            }
        },

        documentFilters () {
            return this.$store.state.filters.documentFilters
        },

        rootNode () {
            let root = this.root
            root.nodes = this.$store.state.folders.arborescence_folder.folders

            return root
        },

        files () {
            if (!this.$store.state.folders.arborescence_folder.files){
                return []
            }

            var cur_tab = this.$store.state.folders.arborescence_folder.files
            for (var i = 0; i < cur_tab.length; i++) {
                cur_tab[i].type = 'file'

                if ((cur_tab[i].extension === '.zip') || (cur_tab[i].extension === '.rar'))
                    cur_tab.splice(i, 1)
            }

            return cur_tab
        },

        folders () {
            if (!this.$store.state.folders.arborescence_folder.folders){
                return []
            }

            var cur_tab = this.$store.state.folders.arborescence_folder.folders
            if (cur_tab) {
                for (var i = 0; i < cur_tab.length; i++) {
                    cur_tab[i].type = 'folder'
                }
            }
            return cur_tab
        },

        allFiles () {
            return this.folders ? this.folders.concat(this.files): []
        },

        canClickedNext () {
            return this.$store.state.folders.more_files || this.$store.state.folders.more_folders
        }
    },

    methods: {
        displayName (file) {
            let extension = '.' + file.extension
            let splitName = file.display_name.split(extension)
            return splitName[0]
        },

        async retour () {
            if (!_.isEmpty(this.hierarchy)) {
                this.currentDirectory = this.hierarchy[0].uuid
                localStorage.setItem('currentDirectory', JSON.stringify(this.hierarchy[0].uuid))
                this.getArborescence()
                this.goBack()
                this.breadcrumb.pop()
                window.last_breadcrumb = JSON.stringify(this.breadcrumb)
            } else {
               this.navigate({ name: 'files' })
            }
        },

        async download (d) {
            this.startLoading()

            const payload = {
                "file": d.uuid
            }

            const response = await this.$api.get('api/file/content', { params: payload })
                .catch(error => {
                    this.stopLoading()
                    console.log(error.response.data.errors)
                    this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                })

                if (response) {
                    this.stopLoading()
                    this.initBaliseA(`data:application/pdf;base64,${response.data}`, d.name)
                }
        },

        initBaliseA (data, name) {
            let a = document.createElement('a')
            a.href = data
            a.download = name
            a.target = '_blank'
            a.click()
        },

        FilesChanged (payload) {
             if (payload.action == 'add') {
                 let temp = this.allFiles.filter(f => f.uuid === payload.value)[0]
                 this.selectedCopy.push(temp)
                 return this.selected.push(payload.value)
             }

             this.selectedCopy = this.selectedCopy.filter(act => act.uuid !== payload.value)
             this.selected = this.selected.filter(act => act !== payload.value)
         },

         allselected (payload) {
             if (payload.action == 'add') {
                 this.isClicked = true
                 this.selectedCopy = this.allFiles
                 return this.selected = this.allFiles.map(f => f.uuid)
             } else {
                 this.isClicked = false
                 this.selectedCopy = []
                 this.selected = []
             }
         },

         confirmDeleteFiles () {
             Swal.fire({
                 // title: this.$translate.text('Are you sure ?'),
                 text: this.$translate.text("Are you sure you want to delete the selected files ?"),
                 type: 'warning',
                 showCancelButton: true,
                 cancelButtonText: this.$translate.text('Cancel'),
                 confirmButtonColor: '#3085d6',
                 cancelButtonColor: '#d33',
                 confirmButtonText: this.$translate.text('Yes, delete!')
             }).then((result) => {
                 if (result.value) {
                     this.deleted_files = []
                     this.deleted_folders = []
                     this.deleteFolder()
                 }
             })
         },

         displayDeleteLogs () {
             if (this.selectedCopy.length == 0) {
                 this.selected = []
                 this.isClicked = false

                 setTimeout(() => {
                     window.$('#deleteLogsModal').modal('show')
                     window.eventBus.$emit('delete-logs', 'deletelogs')
                 }, 1000)
             }
         },

         async deleteFile () {
             let files = this.selectedCopy.filter(f => f.type === 'file')
             let folders = this.selectedCopy.filter(f => f.type === 'folder')
             let uuids = files.map(f => f.uuid)
             let f = {
                 "files": uuids
             }

             let msg = ''

             const res = await this.$api.post(`api/organisation/files/delete`, f)
                 .catch(error => {
                     this.stopLoading()
                     this.$swal.error(this.$translate.text(error.response.data.errors))
                 })
                 if (res) {
                     this.selectedCopy = this.selectedCopy.filter(f => f.type !== 'file')
                     this.deleted_files = files
                     if (!_.isEmpty(files) && _.isEmpty(folders)) {
                        msg = 'File(s) are deleted successfully !'
                     }

                     if (!_.isEmpty(files) && !_.isEmpty(folders)) {
                        msg = 'Folder(s) and file(s) are deleted successfully !'
                     }

                     this.$swal.success(this.$translate.text(msg))
                     this.stopLoading()
                     this.displayDeleteLogs()
                     this.getArborescence()
                 }
         },

         async deleteFolder () {
             this.startLoading()
             let folders = this.selectedCopy.filter(f => f.type === 'folder')
             let uuids = folders.map(f => f.uuid)
             let f = {
                 "folders": uuids
             }

             const res = await this.$api.post(`api/organisation/folders/delete`, f)
                 .catch(error => {
                     this.stopLoading()
                     this.$swal.error(this.$translate.text(error.response.data.errors))
                 })
                 if (res) {
                     let files = this.selectedCopy.filter(f => f.type === 'file')
                     this.selectedCopy = this.selectedCopy.filter(f => f.type !== 'folder')
                     this.deleted_folders = folders
                     if (!_.isEmpty(files)) {
                        this.deleteFile()
                     } else {
                        this.stopLoading()
                        this.$swal.success(this.$translate.text('Folder(s) are deleted successfully !'))
                        this.getArborescence()
                        this.displayDeleteLogs()
                     }
                 }
         },

        async back () {
            if (this.$router.history.current.name == 'file-content') {
                this.getArborescence()
            }

            this.goBack()
            this.breadcrumb.pop()
        },

        onScroll () {
            let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight
                                === document.documentElement.offsetHeight

            if (bottomOfWindow) {
                this.getArborescence()
            }
        },

        resetFilteredFiles () {
            if (this.allFiles) {
                this.filteredFiles = this.allFiles.slice()
            }
            window.last_parent = !_.isEmpty(this.last_parent) ? this.last_parent : window.last_parent
            window.last_breadcrumb = !_.isEmpty(this.last_breadcrumb) ? this.last_breadcrumb : window.last_breadcrumb
            window.last_filecontent = !_.isEmpty(this.last_filecontent) ? this.last_filecontent : window.last_filecontent
            window.last_filecontentitem = !_.isEmpty(this.last_filecontentitem) ? this.last_filecontentitem : window.last_filecontentitem
        },

        search () {
            const data = {
                query: this.ghost.keywords,
                folder: [this.$router.history.current.params.id]
            }

            this.$store.dispatch('filters/getFilteredDocuments', data)
            this.filteredFiles = this.documentFilters !== undefined
                                    ? this.documentFilters.slice()
                                    : this.allFiles.slice()
        },

        async getArborescence (page = 1) {
            this.startLoading()
            let url = ''
            let payload = {
                "page": page,
                "size": this.perPage
            }

            if (!_.isEmpty(localStorage.getItem('last_action'))) {
                const routeParams = this.$router.history.current.params
                let uuid = routeParams.file ? routeParams.file : routeParams.id
                url = `api/organisation/folder/${uuid}/directory`
                localStorage.removeItem('last_action')
                localStorage.setItem('currentDirectory', JSON.stringify(uuid))
            } else {
                url = `api/organisation/folder/${this.currentDirectory}/directory`
            }

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

        async rerenderPreview (f) {
            const routeParams = this.$router.history.current.params
            let uuid = routeParams.file ? routeParams.file : routeParams.id
            let url = `api/organisation/folder/${uuid}/directory`
            let payload = {
                "page": this.page,
                "size": this.perPage
            }
            const response = await ApiService.get(url, { params: payload })
                .catch(error => console.log(error))

            if (response) {
                this.$store.commit('folders/SET_ARBORESCENCE_FOLDER', response.data)
                this.$store.commit('folders/SET_HIERARCHY', response.data.hierarchy)
                this.$store.commit('folders/SET_MORE_FILES', response.data.more_files)
                this.$store.commit('folders/SET_MORE_FOLDERS', response.data.more_folders)
                let file = this.filteredFiles.filter(d => d.uuid === f.uuid)[0]
                let root = response.data.root
                this.total = root.nb_files + root.nb_folders


                this.$store.commit('SET_DIRECTORY', file)
                localStorage.setItem('filecontent', JSON.stringify(file))

                localStorage.setItem('file_name', file.name)
                localStorage.setItem('file_uuid', file.uuid)
                this.$store.commit('SET_FILE', file)
                this.selectedFile = file

                window.eventBus.$emit('preview-file', 'previewfile')
                return window.$('#previewModal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: false
                })
            }
        },
    }
}
</script>
