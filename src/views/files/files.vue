<template lang="html">
    <div class="">
        <section class="_header" v-show="!showAdvancedSearch">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-9">
                        <form class="_form ml-20" @submit.prevent="search()" v-show="!isLoading">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="feather icon-search"></i></span>
                                </div>
                                <input
                                    type="text"
                                    class="search-query form-control form-control-lg"
                                    id="query"
                                    name="query"
                                    v-model="ghost.query"
                                    :placeholder="t('Search')"
                                >
                                <div class="input-group-append pointer" @click="openVocalSearch()">
                                    <span class="input-group-text"><i class="feather icon-mic"></i></span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="col-sm-3">
                        <div class="btn btn-block btn-primary" @click.prevent="navigate({ name: 'files-search' })">
                            <i class="feather icon-search"></i> {{ t('Advanced Search') }}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard" v-show="!showAdvancedSearch">
            <div class="container-fluid">
                <div class="docs">
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

                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th width="40%" v-translate>Name</th>
                                <th v-translate>Size</th>
                                <th v-translate>Indexed</th>
                                <th v-translate>Modified</th>
                                <th v-translate>Last Index Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="f in displayedFiles" :key="f.id"
                                @click="openFile(f)"
                            >
                                <td>
                                    <div class="_item-name"
                                        @contextmenu.prevent="$refs.menu.open($event, { file: f })"
                                    >
                                        <img :src="folder_icon" alt="">
                                        {{ f.name }}
                                    </div>
                                </td>
                                <td>{{ displaySize(f.size) }}</td>
                                <td>{{ f.indexing ? 'En Indexation' : f.is_indexed ? 'Indexé' : 'Non indexé' }}</td>
                                <td>{{ f.updated_at | datetime }}</td>
                                <td>{{ f.last_index_date | datetime }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <vue-context ref="menu" @open="onOpen" v-if="isAdmin">
                    <li>
                        <i class="feather icon-chevrons-right"></i>
                        <a v-show="showText==true" href="#" @click.prevent="confirmRelease()">Liberer</a>
                        <a v-show="showText==false" href="#" @click.prevent="indexer()">Indexer</a>
                        <i v-show="showText==true" class="feather icon-plus-circle"></i>
                    </li>
                </vue-context>

                <vue-context ref="menu" @open="dialog" v-if="isOrgAdmin">
                    <li v-show="showText==false">
                        <i class="feather icon-chevrons-right"></i>
                        <a href="#" @click.prevent="indexer()">Indexer</a>
                    </li>
                </vue-context>
            </div>
        </section>

        <!-- Folder manipulation -->
        <NewFolderModal :folder="folder"/>
        <EditFolderModal :folder="selectedFolder"/>
        <DeleteFolderModal :folder="selectedFolder"/>
        <IndexFolderModal :folder="selectedFolder"/>
        <IndexerModal @indexationEnd="getRoot" />
        <DialogModal @close="close()" />
        <VocalSearchModal @speechend="speechEnd" :text="'Bonjour'" :lang="lang"></VocalSearchModal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import fileMixins from './mixins'

import Swal from 'sweetalert2'

export default {
    mixins: [fileMixins],

    data: () => ({
        showAdvancedSearch: false,
    }),

    mounted () {
        this.payload = {
            "organisation": this.org.uuid
        }

        if (this.isAdmin) {
            this.$store.dispatch('organizations/getOrganizations')
        }

        if (this.isAdmin || this.isOrgAdmin) {
            this.$store.dispatch('organizations/getRoot')
            this.$store.dispatch('users/getUsers')
        }

        this.getMetadatas()
        this.initGhost()
        this.onScroll()
        this.getRoot()
        this.initFolder()
        this.resetFilteredFiles()
        this.$store.dispatch('filters/getSearchable')
        this.$store.dispatch('filters/getQueries')
        this.$store.commit('filters/SET_SHOW_FILTERS', false)

        setTimeout(() => {
            $('#query').focus()
        }, 0)
    },

    computed: {
        ...mapGetters('organizations', {
            root: 'getRoot',
        }),

        rootFolder () {
            return this.root.root || []
        },

        operation () {
            return this.$store.state.folders.operation
        },

        isRoot () {
            return this.$router.history.current.name === 'files'
        },

        files () {
            if (!this.root.files){
                return []
            }
            var cur_tab = this.root.files
            for (var i = 0; i < cur_tab.length; i++) {
                cur_tab[i].type = 'file'

                if ((cur_tab[i].extension === 'zip') || (cur_tab[i].extension === 'rar'))
                    cur_tab.splice(i, 1)
            }
            return cur_tab
        },

        folders () {
            if (!this.root.folders){
                return []
            }

            var cur_tab = this.root.folders.concat(this.rootFolder)
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

    },

    watch: {
        allFiles: {
            immediate: true,
            handler: function () {
                this.resetFilteredFiles()
            }
        },

        operation: {
            immediate: true,
            handler: function () {
                return this.operation
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

    methods: {
        onScroll () {
            const _shit = this
            let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight
                    === document.documentElement.offsetHeight

            if (bottomOfWindow) {
                _shit.getRoot()
            }
        },

        indexationEnd () {
            this.$store.dispatch('folders/setOperation', -1)
            this.getRoot()
            document.location.reload(true)
        },

        getMetadatas () {
            this.$store.dispatch('metadatas/getMetadatas')
        },

        initFolder () {
            this.folder = {
                name: '',
                org: this.auth.organisation.id,
                parent: this.auth.organisation.root_folder
            }

            this.ghost.uuid = this.folder.parent
        },

        makeBreadcrumb () {
            this.breadcrumb = [
                { name: 'Home', route: 'home', active: false },
                { name: 'Files', route: 'files', active: true },
            ]
        },

        resetFilteredFiles () {
            if (this.allFiles) {
                this.filteredFiles = this.allFiles.slice()
            }
        },

        async getRoot () {
            this.$store.dispatch('organizations/getRoot')
        },

        async liberer () {
            let uuid = this.selectedFolder.uuid
            const response = await this.$api.get(`api/organisation/folder/${uuid}/indexing`)
                .catch(error => console.log(error.response.data))

            if (response) {
                // console.log(response.data);
            }
        },

        confirmRelease () {
            let _shit = this
            Swal.fire({
                // title: this.$translate.text('Are you sure ?'),
                text: this.$translate.text("Are you sure you want to release") + ' "' + _shit.selectedFolder.name + '" ?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: this.$translate.text('Yes, Release')
            }).then((result) => {
                if (result.value) {
                    this.liberer()
                }
            })
        },
    }
}
</script>
