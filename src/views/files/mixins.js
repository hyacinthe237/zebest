import pdfFileIcon from '@/assets/images/icon-pdf.png'
import pptxFileIcon from '@/assets/images/icon-pptx.png'
import pptFileIcon from '@/assets/images/icon-ppt.png'
import htmlFileIcon from '@/assets/images/icon-html.png'
import htmFileIcon from '@/assets/images/icon-htm.png'
import pngFileIcon from '@/assets/images/icon-png.png'
import docxFileIcon from '@/assets/images/icon-docx.png'
import docFileIcon from '@/assets/images/icon-doc.png'
import folderIcon from '@/assets/images/icon-folder.png'
import jpegFileIcon from '@/assets/images/icon-jpeg.png'
import jpgFileIcon from '@/assets/images/icon-jpg.png'
import xlsxFileIcon from '@/assets/images/icon-xlsx.png'
import zipFileIcon from '@/assets/images/icon-zip.png'
import excelFileIcon from '@/assets/images/icon-xlsm.png'
import csvFileIcon from '@/assets/images/icon-csv.png'
import oddFileIcon from '@/assets/images/icon-odd.png'
import odpFileIcon from '@/assets/images/icon-odp.png'
import odsFileIcon from '@/assets/images/icon-ods.png'
import odtFileIcon from '@/assets/images/icon-odt.png'
import xmlFileIcon from '@/assets/images/icon-xml.png'

import ItemCheckbox from '@/components/metadata/item-checkbox'


import AuthService from '@/services/auth'
import Config from '@/services/config'
import { VueContext } from 'vue-context'

// Modals for Folder
import EditFolderModal from './modals/folders/editFolder'
import DeleteFolderModal from './modals/folders/deleteFolder'
import IndexFolderModal from './modals/folders/indexFolder'
import IndexerModal from './modals/folders/indexer'
import NewFolderModal from './modals/folders/new-folder'
import DialogModal from './modals/folders/dialogue'

// Modals for File
import DeleteFileModal from './modals/files/deleteFile'
import EditFileModal from './modals/files/edit'
import PreviewModal from './modals/files/preview'
import NewFileModal from './modals/files/new-file'
import RecapUploadFilesModal from './modals/files/recap'
import DeleteLogsModal from './modals/files/delete-logs'
import lodash from 'lodash'

export default {
    data: () => ({
        taux: 0,
        type: '',
        currentDirectory: '',
        deleted_files: [],
        deleted_folders: [],
        filteredFiles: [],
        selectedFolder: {},
        selectedFile: {},
        selectedAll: '',
        selected: [],
        selectedCopy: [],
        folder: { name: '', org: null, parent: '' },

        page: 1,
    		perPage: 30,
    		pages: [],
    		oldPages: [],
    		from: null,
    		to: null,
    		paginateFreezeRight: false,
    		paginateFreezeLeft: false,
    		isClicked: false,
    		linkToCopy: '',
    }),

    components: {
        VueContext,
        EditFolderModal,
        DeleteFolderModal,
        DeleteFileModal,
        IndexerModal,
        NewFolderModal,
        NewFileModal,
        PreviewModal,
        EditFileModal,
        IndexFolderModal,
        DialogModal,
        ItemCheckbox,
        RecapUploadFilesModal,
        DeleteLogsModal
     },

    computed: {
        auth () {
            return AuthService.getUser()
        },

        isAdmin () {
            return this.auth.account.role.id == 1
        },

        isOrgAdmin () {
            return this.auth.account.role.id == 2
        },

        operation() {
            return this.$store.state.folders.operation
        },

        current_folder () {
            return this.$store.state.folders.folder
        },

        totalPages () {
            if (this.isFilesRoute) {
                return Math.ceil(this.filteredFiles.length/this.perPage)
            }
        },

        displayedFiles () {
            return this.filteredFiles.length ? this.paginate(this.filteredFiles) : []
        },

        pdf () { return pdfFileIcon },
        pptx () { return pptxFileIcon },
        ppt () { return pptFileIcon },
        html () { return htmlFileIcon },
        htm () { return htmFileIcon },
        xml () { return xmlFileIcon },
        png () { return pngFileIcon },
        jpeg () { return jpegFileIcon },
        docx () { return docxFileIcon },
        doc () { return docFileIcon },
        xlsx () { return xlsxFileIcon },
        zip () { return zipFileIcon },
        excel () { return excelFileIcon },
        jpg () { return jpgFileIcon },
        folder_icon () { return folderIcon },
        csv () { return csvFileIcon },
        odd () { return oddFileIcon },
        odp () { return odpFileIcon },
        ods () { return odsFileIcon },
        odt () { return odtFileIcon },

        isFileRoute () { return this.$router.history.current.name === 'file' },

        isFilesRoute () { return this.$router.history.current.name === 'files' },

        isFileContentRoute () { return this.$router.history.current.name === 'file-content' },

        isFileContentItemRoute () { return this.$router.history.current.name === 'file-content-item' },

        parent () { return this.$store.state.parent },

        directory () { return this.$store.state.directory },

        availableFolder () { return this.$store.state.folders.arborescence_folder.root },

        showText () { return this.selectedFolder ? this.selectedFolder.indexing : false },

        org () { return JSON.parse(localStorage.getItem('user')).organisation },

        lang () { return this.makeLang(this.org.language) },

        hierarchy () { return this.$store.state.folders.hierarchy },

        last_action () { return localStorage.getItem('last_action') },

        last_breadcrumb () {
            let last = JSON.parse(localStorage.getItem('last_breadcrumb'))
            if (!lodash.isEmpty(last)) { return last }
        },

        last_parent () {
            let last = JSON.parse(localStorage.getItem('last_parent'))
            if (!lodash.isEmpty(last)) { return last }
        },

        last_filecontent () {
            let last = JSON.parse(localStorage.getItem('last_filecontent'))
            if (!lodash.isEmpty(last)) { return last }
        },

        last_filecontentitem () {
            let last = JSON.parse(localStorage.getItem('last_filecontentitem'))
            if (!lodash.isEmpty(last)) { return last }
        },
    },

    watch: {
        filteredFiles: {
            immediate: true,
            handler: function (val) {
                if (!lodash.isEmpty(val)) {
                    this.currentDirectory = JSON.parse(localStorage.getItem('currentDirectory'))
                    this.pages = []
                    this.page = 1
                    this.setPages()
                }
            }
        },
    },

    beforeMount () {
        this.currentDirectory = JSON.parse(localStorage.getItem('currentDirectory'))
    },

    mounted () {
        if (this.isFilesRoute) {
            this.setPages()
        }

        let intervalIndex = setInterval(() => {
            this.$store.dispatch('folders/setIndexation', this.operation)
        }, 6000)

        window.eventBus.$on('kill_status', (result) => {
            if (result == 'kill') {
                clearInterval(intervalIndex)
                window.eventBus.$emit('kill_status', 'killed')
                this.$store.dispatch('folders/getCleanUp', localStorage.getItem('operation'))
            }
        })
    },

    methods: {
        openVocalSearch() {
            window.eventBus.$emit('vocal', 'search')
            window.$('#VocalSearchModal').modal('show')
        },

        speechEnd ({sentences, text}) {
            this.ghost.query = text
            if (!_.isEmpty(this.ghost.query)) {
                this.search()
            }

            if (_.isEmpty(this.ghost.query)) {
                window.eventBus.$off('vocal')
            }
        },

        initGhost () {
            this.ghost = {
                query: ''
            }
        },

        /**
         * Apply Search
         *
         * @return {void} [description]
         */
        async search () {
            if (this.isOrgAdmin) {
                this.ghost.folder = [localStorage.getItem('organisation')]
            }

            if (this.ghost.query != '') {
                window.eventBus.$emit('loading:show')

                const response = await this.$api.post('api/pages/filter', this.ghost)
                    .catch(error => {
                        console.log(error.response.data.errors)
                        this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                    })

                if (response) {
                    this.$store.commit('filters/SET_PAGE_FILTERS', response.data['pages'])
                    this.$store.commit('filters/SET_DOCUMENT_FILTERS', response.data['docs'])
                    this.$store.commit('filters/SET_QUERY', this.ghost.query)
                    this.$store.commit('filters/SET_INITIAL_SLIDE')
                    this.$store.commit('filters/SET_SHOW_FILTERS', true)
                    this.$router.push({ name: 'files-search' })
                    window.eventBus.$off('vocal')
                }

                window.eventBus.$emit('loading:hide')
            } else {
                this.$swal.error(this.$translate.text('Empty Query'), this.$translate.text('Please fill the query !'))
            }
        },

        getMetadatas () {
            if (this.isAdmin) {
                this.$store.dispatch('metadatas/getOrgMetadatas', this.payload)
            }

            if (this.isOrgAdmin) {
                this.$store.dispatch('metadatas/getMetadatas')
            }
        },

        new_file () {
            setTimeout(() => {
                window.$('#newFileModal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: false
                })
            }, 10)
            window.eventBus.$emit('new-file', 'newfile')
        },

        new_folder () {
            window.eventBus.$emit('new-folder', 'newfolder')
            setTimeout(() => {
                window.$('#newFolderModal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: false
                })
            }, 10)
        },

        openFile(file) {
            localStorage.setItem('file_name', file.name)
            localStorage.setItem('file_uuid', file.uuid)

            if (file.type !== 'folder') {
                this.$store.commit('SET_FILE', file)
                this.selectedFile = file
                this.linkToCopy = `${Config.get('front_url')}file/${this.selectedFile.uuid}/display`

                window.eventBus.$emit('preview-file', 'previewfile')
                return window.$('#previewModal').modal({
                    show: true
                })
            }

            if (this.isFilesRoute) {
                this.getMetas(file)
            }

            if (this.isFileContentRoute) {
                let filecontent = !lodash.isEmpty(this.last_filecontent) ? JSON.parse(this.last_filecontent) : JSON.parse(localStorage.getItem('filecontent'))
                let parent = !lodash.isEmpty(this.last_parent) ? JSON.parse(this.last_parent) : JSON.parse(localStorage.getItem('parent'))

                // if last file content item is defined
                if (!lodash.isEmpty(this.last_filecontentitem)) {
                    localStorage.setItem('filecontentitem', this.last_filecontentitem)
                } else { localStorage.setItem('filecontentitem', JSON.stringify(file)) }

                localStorage.setItem('currentDirectory', JSON.stringify(file.uuid))
                this.$store.commit('SET_DIRECTORY', file)
                this.getCurrentArborescence(file.uuid)

                this.breadcrumb.push({
                    name: file.name,
                    uuid: parent.uuid,
                    file: filecontent.uuid,
                    item: file.uuid,
                    route: 'file-content-item'
                })

                this.navigate({ name: 'file-content-item', params: {
                    id: parent.uuid,
                    file: filecontent.uuid,
                    item: file.uuid,
                }})

                // For last connexion if 401 error
                window.last_breadcrumb = JSON.stringify(this.breadcrumb)
                window.last_filecontentitem = JSON.stringify(file)
                localStorage.removeItem('last_filecontentitem')
            }

            if (this.isFileRoute) {
                this.getMetas(file)
                let parent = !lodash.isEmpty(this.last_parent) ? JSON.parse(this.last_parent) : JSON.parse(localStorage.getItem('parent'))
                this.$store.commit('SET_DIRECTORY', file)
                this.getCurrentArborescence(file.uuid)
                localStorage.setItem('currentDirectory', JSON.stringify(file.uuid))

                // if last file content is defined
                if (!lodash.isEmpty(this.last_filecontent)) {
                    localStorage.setItem('filecontent', this.last_filecontent)
                } else { localStorage.setItem('filecontent', JSON.stringify(file)) }

                this.breadcrumb.push({
                    name: file.name,
                    uuid: parent.uuid,
                    file: file.uuid,
                    route: 'file-content'
                })
                this.navigate({ name: 'file-content', params: { id: parent.uuid, file: file.uuid }})

                // For last connexion if 401 error
                window.last_breadcrumb = JSON.stringify(this.breadcrumb)
                window.last_filecontent = JSON.stringify(file)
                localStorage.removeItem('last_filecontent')
            } else {
                this.$store.commit('SET_PARENT', file.name)
                this.$store.commit('SET_DIRECTORY', file)
                localStorage.setItem('currentDirectory', JSON.stringify(file.uuid))

                // if last parent is defined
                if (!lodash.isEmpty(this.last_parent)) {
                    localStorage.setItem('parent', this.last_parent)
                } else { localStorage.setItem('parent', JSON.stringify(file)) }
                this.navigate({ name: 'file', params: { id: file.uuid }})

                // For last connexion if 401 error
                window.last_breadcrumb = JSON.stringify(this.breadcrumb)
                window.last_parent = JSON.stringify(file)
                localStorage.removeItem('last_parent')
            }
        },

        makeBreadcrumb () {
            if (!lodash.isEmpty(this.last_breadcrumb)) {
                this.breadcrumb = this.last_breadcrumb
                localStorage.removeItem('last_breadcrumb')
                window.last_breadcrumb = JSON.stringify(this.breadcrumb)
            } else {
                let parent = JSON.parse(localStorage.getItem('parent'))
                this.breadcrumb = [
                    { name: 'Home', route: 'home' },
                    { name: 'Files', route: 'files' },
                    { name: parent.name, route: 'file', uuid: parent.uuid },
                ]
            }
        },

        getMetas (f) {
            let payload = {
                organisation: f.organisation.uuid
            }

            if (this.isAdmin) {
                this.$store.dispatch('metadatas/getOrgMetadatas', payload)
            } else {
                this.$store.dispatch('metadatas/getOrgMetadatas')
            }
        },

        onOpen (event, data) { this.selectedFolder = data.file },

        dialog (event, data) {
            this.selectedFolder = data.file
            if (this.selectedFolder.indexing) {
                $('.v-context').hide()
                window.$('#dialogModal').modal('show')
            }
        },

        selectFolderOnBreadcrumb () { this.selectedFolder = this.availableFolder },

        close () { window.$('.modal').modal('hide') },

        editer () {
            window.eventBus.$emit('edit', 'folder')
            window.$('#editFolderModal').modal('show')
        },

        RecapUploadFilesModal () { window.$('#RecapUploadFilesModal').modal('show') },

        supprimer () { window.$('#deleteFolderModal').modal('show') },

        indexer () { window.$('#indexFolderModal').modal('show') },

        nextPage () {
            this.page = this.page+1
            if (this.isFileRoute) {
                this.getArb()
            }

            this.checkPage()
        },

        pageClicked (p) {
            this.page = p
            if (this.isFileRoute) {
                this.getArb()
            }
            this.checkPage()
        },

        previousPage () {
            let current_page = this.page - 1
            this.page = current_page <= 0 ? 1 : current_page
            if (this.isFileRoute) {
                this.getArb()
            }
            this.checkPage()
        },

        setPages () {
            if (this.isFilesRoute) {
                for (let index = 1; index <= this.totalPages; index++) {
                    this.pages.push(index)
                }
            }

            this.checkPage()
        },

        checkPage () {
            const index = this.pages.indexOf(this.page)
            this.paginateFreezeRight = (index + 1) == this.pages.length ? true : false
            this.paginateFreezeLeft = index == 0 ? true : false
        },

        paginate (data) {
            let page = this.page
            let perPage = this.perPage
            let from = ((page * perPage) - perPage)
            let to = (page * perPage)
            this.from = from
            this.to = to
            return  data.slice(from, to)
        },

        async getCurrentArborescence (uuid) {
            this.startLoading()
            let payload = {
                "page": this.page,
                "size": this.perPage
            }
            const URL = `api/organisation/folder/${uuid}/directory`
            const response = await this.$api.get(URL, { params: payload })
                .catch(error => {
                    console.log(error.response.data.errors)
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

        async getArb () {
            this.startLoading()
            let url  = `api/organisation/folder/${this.currentDirectory}/directory`
            let payload = {
                "page": this.page,
                "size": 30
            }
            const response = await this.$api.get(url, { params: payload })
                .catch(error => console.log(error))

            if (response) {
                this.stopLoading()
                this.$store.commit('folders/SET_ARBORESCENCE_FOLDER', response.data)
                this.$store.commit('folders/SET_HIERARCHY', response.data.hierarchy)
                this.$store.commit('folders/SET_MORE_FILES', response.data.more_files)
                this.$store.commit('folders/SET_MORE_FOLDERS', response.data.more_folders)
            }
        },

        displaySize (size) { return this.precise(size) },
    }
}
