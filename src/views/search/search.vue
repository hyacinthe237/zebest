<template lang="html">
    <div class="">
        <section class="dashboard">
            <div class="container-fluid">
                <div id="sticky">
                    <div class="row">
                        <div class="col-sm-9">
                            <form class="_form" @submit.prevent="dismissInitValues()">
                                <div class="search-input">
                                    <label class="text-center">{{ t('What are you looking for ?') }}</label>
                                    <div class="input-group">
                                        <input type="text"
                                            v-model="ghost.query"
                                            class="search-query form-control form-control-lg"
                                            :placeholder="t('Search')" />

                                        <div class="input-group-append">
                                            <span class="input-group-text">
                                              <i class="feather icon-search"></i>
                                            </span>
                                            <span class="input-group-text pointer" @click="openVocalSearch()">
                                              <i class="feather icon-mic"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div class="col-sm-3">
                            <div class="text-right mt-30">
                                <button
                                    class="btn btn-primary"
                                    @click="advancedSearch = !advancedSearch"
                                >
                                    <i class="feather icon-sliders"></i>
                                    {{ t('Advanced Filters') }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="row mt-10 filter-reset" v-show="!isEmpty && !advancedSearch">
                        <div class="col-sm-9">
                            <div class="text-center text-red">
                                Il y'a des métadonnées actives. Cliquer sur le boutton <span>"{{ t('Reset') }}"</span> pour recommencer.
                            </div>
                        </div>

                        <div class="col-sm-3">
                            <div class="text-right">
                                <button
                                    class="btn btn-secondary"
                                    @click="resetFilters()"
                                >
                                    <i class="feather icon-check"></i>
                                    {{ t('Reset') }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Advanced filters  -->
                    <div class="row _meta-filters" v-show="advancedSearch">
                        <div class="col-sm-9 mt-20">
                            <div class="row">
                                <div class="col-sm-4">
                                    <form class="_form" @submit.prevent>
                                        <div class="search-input">
                                            <div class="form-group">
                                                <label class="typo__label">{{ t('Directory') }}</label>
                                                <multiselect
                                                    v-model="value"
                                                    label="name"
                                                    track-by="id"
                                                    :placeholder="t('Selection folder')"
                                                    :options="options"
                                                    :multiple="true"
                                                    :taggable="true"
                                                    @tag="addTag"
                                                ></multiselect>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div v-for="meta in metas.slice(0, 2)" :key="meta.uuid" class="col-sm-4">
                                    <div v-if="meta.meta_type==1 || meta.meta_type==5" class="">
                                        <div class="search-input">
                                            <div class="form-group">
                                                <label class="typo__label">{{ meta.name }}</label>
                                                <multiselect
                                                    v-model="form[`selected-${meta.name}`]"
                                                    :placeholder="t('Selectionner valeurs')"
                                                    :options="meta.values"
                                                    :multiple="true"
                                                    :taggable="true"
                                                ></multiselect>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="meta.meta_type==2 || meta.meta_type==4" class="">
                                        <div class="row _intervalInput">
                                            <div class="col-sm-12">
                                                <label v-translate>{{ meta.name }}</label>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="form-inline">
                                                    <label :for="`date_from-${meta.name}`" class="date-label" v-translate>From:</label>
                                                    <date-picker
                                                        v-model="form[`selected-${meta.name}`]"
                                                        :config="pickerOptions"
                                                        class="date-picker"
                                                    >
                                                    </date-picker>
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="form-inline">
                                                    <label :for="`date_to-${meta.name}`" class="date-label" v-translate>To:</label>
                                                    <date-picker
                                                        v-model="form[`to-${meta.name}`]"
                                                        :config="pickerOptions"
                                                        class="date-picker"
                                                    >
                                                    </date-picker>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="meta.meta_type==3" class="">
                                        <div class="row _intervalInput">
                                            <div class="col-sm-12">
                                                <label v-translate>{{ meta.name }}</label>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="form-group">
                                                    <!-- <label :for="`number_from-${meta.name}`" v-translate>From</label> -->
                                                    <input type="number"
                                                        :name="`number_from-${meta.name}`"
                                                        v-model="form[`selected-${meta.name}`]"
                                                        class="form-control"
                                                        :data-vv-as="t('De')"
                                                        :placeholder="t('De')"
                                                    >
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="form-group">
                                                    <!-- <label :for="`number_to-${meta.name}`" v-translate>To</label> -->
                                                    <input type="number"
                                                        :name="`number_to-${meta.name}`"
                                                        v-model="form[`to-${meta.name}`]"
                                                        class="form-control"
                                                        :data-vv-as="t('A')"
                                                        :placeholder="t('A')"
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-3">
                            <div class="text-right mt-20">
                                <button
                                    class="btn btn-secondary"
                                    @click="dismissInitValues()"
                                >
                                    <i class="feather icon-check"></i>
                                    {{ t('Apply Filters') }}
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- End of advanced filters  -->

                    <div class="row" v-show="advancedSearch && metas.length > 2">
                        <div class="col-sm-12 text-center">
                            <span @click="openFiltersModal" class="more-filters">
                                {{ t('More filters') }}
                            </span>
                        </div>
                    </div>
                </div>
                <!-- End of sticky  -->

                <div>
                    <div class="_tabs mt-20">
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                            <a class="nav-item nav-link" id="nav-pages-tab"
                                data-toggle="tab" href="#nav-pages" role="tab"
                                aria-controls="nav-pages">Pages</a>

                            <a class="nav-item nav-link" id="nav-documents-tab"
                                data-toggle="tab" href="#nav-documents" role="tab"
                                aria-controls="nav-documents">Documents</a>
                        </div>
                    </div>

                    <div class="tab-content" id="nav-tabContent">
                        <div class="tab-pane fade" id="nav-pages" role="tabpanel" aria-labelledby="nav-pages-tab">
                            <VueGlideSlide @openDetails="openPage"></VueGlideSlide>
                        </div>

                        <div class="tab-pane fade" id="nav-documents" role="tabpanel" aria-labelledby="nav-documents-tab">
                            <div class="row">
                                <div class="col-sm-12 text-center" v-show="documents.length > 0">
                                    <nav aria-label="Page navigation example" class="btn-paginate">
                                        <ul class="pagination">
                                            <li :class="[{ noClick: paginateFreezeLeft }, 'page-item']">
                                                <button type="button" class="page-link" @click="previousPage()">
                                                   <i class="feather icon-chevron-left"></i>
                                               </button>
                                            </li>

                                            <li class="page-item">
                                                <button type="button" class="page-link pages-btns"
                                                        v-for="pageNumber in pages.slice(page-1, page+5)"
                                                        :key="pageNumber" @click="pageClicked(pageNumber)">
                                                        {{ pageNumber }}
                                                </button>
                                            </li>

                                            <li :class="[{ noClick: paginateFreezeRight }, 'page-item']">
                                                <button type="button" @click="nextPage()" class="page-link">
                                                    <i class="feather icon-chevron-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>

                                <div class="_doc-items" v-if="documents.length > 0">
                                    <div class="col-sm-12">
                                        <DocumentItem
                                            v-for="d in paginatedDocuments"
                                            :doc="d"
                                            :key="d.id"
                                            :isAvailable="isAvailable"
                                            @preview="previewModal"
                                            @openDoc="openDocument"
                                            @openDataModal="openDataModal"
                                            @openEmplacement="openEmplacement"
                                            @downloaded="download"
                                        ></DocumentItem>
                                    </div>
                                </div>

                                <div class="" v-else>
                                    <p v-translate>No Results</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <div v-show="isLoading" class="mt-40 pb-40 text-center">
                    <izy-hollow-loading loading />
                </div> -->
                <!-- End of loader  -->
            </div>
        </section>

        <PreviewImageModal :doc="selectedDoc"></PreviewImageModal>

        <MetadataModal
            :doc="selectedDoc"
            @addTag="addTag"
            @closeMetadataModal="closeMetadataModal" />

        <FilterModal
            :form="form"
            :value="value"
            :options="options"
            :metas="metas"
            :meta_filters="ghost.meta_filters"
            :pickerOptions="pickerOptions"
            @confirmed="confirmed"
            @closeFiltersModal="closeFiltersModal" />

        <VocalSearchModal @speechend="speechEnd" :text="'Bonjour'" :lang="lang"></VocalSearchModal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import searchMixins from './mixins'
import AuthService from '@/services/auth'
import VueGlideSlide from '@/components/slick/slick-slide'
import moment from 'moment'

export default {
    mixins: [searchMixins],
    components: { VueGlideSlide },

    data: () => ({
        form: {},
        isEmpty: true,
        initialDates: {},
        removedDates: {},
        advancedSearch: false,
    }),

    mounted () {
        this.ghost.meta_filters = []

        this.initFormInput()
        this.emptyRequestAndResults()
        this.setPages()
    },

    computed: {
        ...mapGetters('folders', {
            arborescence_folder: 'getArborescence',
            parent_folder: 'getParentFolder'
        }),

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
        totalPages () {
            return Math.ceil(this.documents.length/this.perPage)
        },

        paginatedDocuments () {
			return this.documents.length ? this.paginate(this.documents) : []
		},

        auth () {
            return AuthService.getUser()
        },

        account () {
            return this.auth.account
        },

        isAvailable () {
            return this.account.role.id == 1 || this.account.role.id == 2
        },
    },

    watch: {
        'value' (val) {
            if (val == null || val !== null) {
                this.search()
            }
        },

        documents () {
            this.pages = []
            this.page = 1
			this.setPages()
		},
    },

    methods: {
        openPage (d) {
            let routeData = this.$router.resolve({ name: 'PDFViewer', params: {doc_uuid: d.file, page_num: d.page } })
            window.open(routeData.href, '_blank')
        },

        initFormInput () {
            let temp = this.metas.filter(m => m.meta_type == 2 || m.meta_type == 4)

            for (var i = 0; i < temp.length; i++) {
                let from_field_name = 'selected-' + temp[i].name
                let to_field_name = 'to-' + temp[i].name
                let nextYear = moment().year() + 1

                this.form[from_field_name] = moment().startOf('year').format('YYYY/MM/DD')
                this.form[to_field_name] = moment([nextYear]).endOf("year").format('YYYY/MM/DD')

                this.initialDates[from_field_name] = moment().startOf('year').format('YYYY/MM/DD')
                this.initialDates[to_field_name] = moment([nextYear]).endOf("year").format('YYYY/MM/DD')
            }
        },

        addRemovedDates () {
            let rDates = Object.entries(this.removedDates)

            if (rDates.length > 0) {
                for (var i = 0; i < rDates.length; i++) {
                    Object.assign(this.form, this.removedDates)
                    this.initialDates = this.removedDates
                }
            }
        },

        emptyRequestAndResults () {
            if (!this.showFilters) {
                this.ghost.query = ''
                this.$store.commit('filters/SET_PAGE_FILTERS', [])
                this.$store.commit('filters/SET_DOCUMENT_FILTERS', [])
            }
            else {
                this.ghost.query = this.query
            }
        },

        openDocument (doc) {
            localStorage.setItem('current_doc', doc.ref)

            let route = this.$router.resolve({ name: 'display-document', params: { id: doc.uuid } })
            window.open(route.href, '_blank')
        },

        async download (d) {
            window.eventBus.$emit('loading:show')

            const payload = {
                "file": d.uuid
            }

            const response = await this.$api.get('api/file/content', { params: payload })
                .catch(error => {
                    console.log(error.response.data.errors)
                    this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                })

            window.eventBus.$emit('loading:hide')

            if (response) {
                this.initBaliseA(`${response.data.url}`, d.display_name)
            }
        },

        initBaliseA (data, name) {
            let a = document.createElement('a')
            a.href = data
            a.download = name
            a.target = '_blank'
            a.click()
        },

        openEmplacement (d) {
            this.$store.dispatch('folders/getArborescence', d.folder)
            let root = this.arborescence_folder.root
            if ((root.parent !== null) && (root.parent !== undefined)) {
                let parent = this.sans_tirets(root.parent)
                this.$store.dispatch('folders/getParentFolder', parent)
                localStorage.setItem('parent', JSON.stringify(this.parent_folder.root))

                this.breadcrumb.push({
                    name: root.name,
                    uuid: parent,
                    file: root.uuid,
                    route: 'file-content'
                })
                this.navigate({ name: 'file-content', params: { id: parent, file: root.uuid }})
            }

            localStorage.setItem('parent', JSON.stringify(root))
            this.navigate({ name: 'file', params: { id: d.folder }})
        },

        openFiltersModal () { window.$('#filtersModal').modal('show') },

        closeMetadataModal () { window.$('#metadataModal').modal('hide') },

        closeFiltersModal () { window.$('#filtersModal').modal('hide') },

        confirmed () { window.$('#filtersModal').modal('hide') },

        resetGhost () {
            this.ghost = {
                id: this.metadata.length ? this.metadata[0].uuid : '',
                value: ''
            }
        },

        resetFilters () {
            this.form = {}
            this.initFormInput()
            this.isEmpty = true
        },

        dismissInitValues () {
            this.removedDates = {}
            const result = {}
            const keys = Object.keys(this.initialDates)

            for (var key in this.form) {
                if (keys.includes(key)) {
                    result[key] = this.form[key]
                }
            }

            if (_.isEqual(this.initialDates, result)) {
                const formKeys = Object.keys(this.form)

                for (var item in result) {
                    if (formKeys.includes(item)) {
                        this.removedDates[item] = this.form[item]
                        delete this.form[item]
                    }
                }
                this.arrangeFilters()
            }
            else {
                const difference = this.differenceBtnObjects(result, this.initialDates)

                const diffArr = Object.entries(difference)
                let diffMetaNames = []
                diffArr.forEach(function(value){
                    const metaName = value[0].split('-')[1]
                    diffMetaNames.push(metaName)
                })

                const resultArr = Object.entries(result)
                let resultMetaNames = []
                resultArr.forEach(function(res){
                    const rMetaName = res[0].split('-')[1]
                    resultMetaNames.push(rMetaName)
                })

                let MetaToSearch = resultMetaNames.filter( val => diffMetaNames.includes(val))
                MetaToSearch = [...new Set(MetaToSearch)]

                let formFieldName = []
                for (var i = 0; i < MetaToSearch.length; i++) {
                    let fromName = 'selected-' + MetaToSearch[i]
                    let toName = 'to-' + MetaToSearch[i]
                    formFieldName.push(fromName)
                    formFieldName.push(toName)
                }

                const resKeys = Object.keys(result)

                for (var a in resKeys) {
                    let b = resKeys[a]
                    if (!formFieldName.includes(b)) {
                        this.removedDates[b] = this.form[b]
                        delete this.form[b]
                    }
                }
                this.arrangeFilters()
            }
        },

        differenceBtnObjects(obj1, obj2) {
            function changes(obj1, obj2) {
                return _.transform(obj1, function(result, value, key) {
                    if (!_.isEqual(value, obj2[key])) {
                        result[key] = (_.isObject(value) && _.isObject(obj2[key])) ? changes(value, obj2[key]) : value
                    }
                })
            }
            return changes(obj1, obj2);
        },

        arrangeFilters () {
            const ghost_meta = Object.entries(this.form)
            let metadata = this.metas
            let filters = []

            ghost_meta.forEach(function(item){
                const temp = {}
                const meta_name = item[0].split('-')[1]
                const field_name = item[0].split('-')[0]
                let meta = metadata.filter(m => m.name == meta_name)[0]
                temp.type = meta.meta_type
                temp.name = meta.name
                const exists = filters.filter(f => f.name == temp.name)[0]
                if ((exists) && (field_name === 'to')) {
                    filters = filters.map(f =>
                        f.name === exists.name
                        ? { ...f, to: item[1] }
                        : f
                    )
                }
                else if ((exists) && (field_name === 'selected')) {
                    filters = filters.map(f =>
                        f.name === exists.name
                        ? { ...f, selected: item[1] }
                        : f
                    )
                }
                else {
                    if (field_name === 'selected') { temp.selected = item[1] }
                    if (field_name === 'to') { temp.to = item[1] }
                    filters.push(temp)
                }
            })

            let tmp = filters.filter(f =>
                    !((f.selected && Array.isArray(f.selected)) && !f.selected.length)
                )
            filters = tmp.filter(f =>
                        !(((f.selected == '') || (f.selected == null)) && !Array.isArray(f.selected))
                    )

            this.ghost.meta_filters = filters
            this.isEmpty = Object.keys(this.form).length === 0
            this.search()
        },

        openVocalSearch() {
            window.eventBus.$emit('vocal', 'search')
            window.$('#VocalSearchModal').modal('show')
        },

        speechEnd ({sentences, text}) {
            this.ghost.query = text
            this.$store.commit('filters/SET_QUERY', text)
            if (!_.isEmpty(this.ghost.query)) {
                this.search()
            }

            if (_.isEmpty(this.ghost.query)) {
                window.eventBus.$off('vocal')
            }
        },

        async search () {
            if (this.ghost.query != '' || this.ghost.meta_filters.length) {
                window.eventBus.$emit('loading:show')

                // Get the selected folders
                if ((this.auth.account.role.id == 2) || (this.auth.account.role.id == 3)) {
                    this.ghost.folder = this.value.map(a => a.uuid)
                } else {
                    this.ghost.folder = this.value ? this.value.map(a => a.uuid) : []
                }

                const response = await this.$api.post('api/pages/filter', this.ghost)
                    .catch(error => {
                        console.log(error.response.data.errors)
                        this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                    })

                    if (response) {
                        window.eventBus.$off('vocal')
                        this.advancedSearch = !this.advancedSearch
                        let pages = response.data['pages']
                        let documents = response.data['docs']
                        this.$store.commit('filters/SET_PAGE_FILTERS', pages)
                        this.$store.commit('filters/SET_DOCUMENT_FILTERS', documents)
                        this.$store.commit('filters/SET_INITIAL_SLIDE', 0)
                        this.$store.commit('filters/SET_QUERY', this.ghost.query)
                        this.$store.commit('filters/SET_SHOW_FILTERS', true)

                        // Condition d'ouverture des Tabs
                        if (_.isEmpty(pages) && !_.isEmpty(documents)) {
                            this.activeDocumentsTab()
                        } else if (!_.isEmpty(pages) && _.isEmpty(documents)) {
                            this.activePagesTab()
                        } else {
                            this.activePagesTab()
                        }

                        if (Object.entries(this.removedDates).length > 0) {
                            this.addRemovedDates()
                        }
                    }
                this.advancedSearch = false
                window.eventBus.$emit('loading:hide')
            } else {
                if (Object.entries(this.removedDates).length > 0) {
                    this.addRemovedDates()
                }
                this.$swal.error(this.$translate.text('Empty Query'), this.$translate.text('Please fill the query !'))
            }
        },

        nextPage () {
            this.page = this.page+1
            this.checkPage()
        },

        pageClicked (p) {
            this.page = p
            this.checkPage()
        },

        previousPage () {
            this.page = this.page-1
            this.checkPage()
        },

		setPages () {
			for (let index = 1; index <= this.totalPages; index++) {
				this.pages.push(index)
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
    }
}
</script>
