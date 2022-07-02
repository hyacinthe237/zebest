import AuthService from '@/services/auth'
import PreviewImageModal from './modals/preview-image'
import MetadataModal from './items/modals/doc-metadata'
import DocumentItem from './items/item'
import FilterModal from './modals/metadata-filter'
import Config from '@/services/config'

export default {
    data: () => ({
        selectedDoc: undefined,
        value: [],
        options: [],
        metas: [],
        meta_options: [],
        pickerOptions: {
            format: 'YYYY/MM/DD',
            useCurrent: false,
            showClear: true,
            showClose: true,
        },

        page: 1,
    		perPage: 10,
    		pages: [],
    		from: null,
    		to: null,
    		paginateFreezeRight: false,
    		paginateFreezeLeft: false,
    }),

    components: { PreviewImageModal, MetadataModal, DocumentItem, FilterModal },

    computed: {
        auth () {
            return AuthService.getUser()
        },

        query () {
            return this.$store.state.filters.query
        },

        searchable_folders () {
            return this.$store.state.filters.searchable_folders
        },

        documents () {
            return this.$store.state.filters.documentFilters || []
        },

        isDocumentRoute () {
            return this.$router.history.current.name == 'documents-filtering'
        },

        isAdvancedRoute () {
            return this.$router.history.current.name == 'advanced-search'
        },

        isFilesSearchRoute () {
            return this.$router.history.current.name == 'files-search'
        },

        showFilters() {
            return this.$store.state.filters.showFilters
        },

        base_url () {
            return Config.get('base_url')
        },

        org_metadata () {
            return this.$store.state.metadatas.org_metadata || []
        },

        metadatas () {
            return this.$store.state.metadatas.metadatas || []
        },

        org () {
            return JSON.parse(localStorage.getItem('user')).organisation
        },

        lang () {
            return this.makeLang(this.org.language)
        }
    },

    mounted () {
        setTimeout(() => {
            if (this.isDocumentRoute) {
                this.activeDocumentsTab()
            }

            if (this.isAdvancedRoute || this.isFilesSearchRoute) {
                this.activePagesTab()
            }
        }, 0)

        this.initOptions()
        this.getMetadatas()
    },

    methods: {
        previewModal (d) {
            this.selectedDoc = d

            setTimeout(() => {
                window.$('#previewImageModal').modal('show')
            }, 100)

        },

        activeDocumentsTab () {
            $('#nav-documents-tab').click()
            $('#nav-documents').addClass("active")
            $('#nav-documents-tab').focus()
        },

        activePagesTab () {
            $('#nav-pages-tab').click()
            $('#nav-pages').addClass("active")
            $('#nav-pages-tab').focus()
        },

        openDataModal (m) {
            this.selectedDoc = m

            setTimeout(() => {
                window.$('#metadataModal').modal('show')
            }, 100)

        },

        addTag (newTag) {
            const tag = {
                uuid: newTag.uuid,
                name: newTag.name
            }

            this.options.push(tag)
            this.value.push(tag)
        },

        initOptions () { this.options = this.searchable_folders },

        async getMetadatas () {
            if (this.auth.account.role.id === 1) {
                this.metas = this.org_metadata
            }

            if (this.auth.account.role.id === 2) {
                this.metas = this.metadatas
            }
        },
    }
}
