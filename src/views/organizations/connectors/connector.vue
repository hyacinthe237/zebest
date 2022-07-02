<template lang="html">
    <div class="">
        <section class="_header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="search-container" v-show="!isLoading">
                            <form @submit.prevent class="_form">
                                <div class="form-group form-group-lg">
                                    <div class="inner-addon left-addon">
                                        <i class="glyphicon feather icon-search"></i>

                                        <input type="text"
                                            name="keywords"
                                            :placeholder="t('Search folder')"
                                            autocomplete="off"
                                            class="form-control form-control-lg"
                                            v-model="ghost.keywords"
                                        >
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="col-sm-8">
                        <div class="buttons text-right">
                            <button @click.prevent="goBack()" class="btn btn-dark mr-2" :disabled="isLoading">
                                <i class="feather icon-arrow-left"></i> {{ t('Back') }}
                            </button>

                            <button @click.prevent="selectFolder()" class="btn btn-success mr-2" :disabled="isLoading">
                                <i class="feather icon-plus"></i> {{ t('Select Folder') }}
                            </button>

                            <button :disabled="isLoading" @click.prevent="desynch()" class="btn btn-secondary" v-if="unselected.length !== 0">
                                <i class="feather icon-minus"></i> {{ t('Desynchronise') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard">
            <div class="container-fluid">
                <div class="cards" v-show="!isLoading">
                    <div class="row">
                        <CardItem
                            v-for="fil in paginatedFolders"
                            :key="fil.id"
                            :value="fil.id"
                            :file="fil"
                            :icon="folder_icon"
                            :selected="selected"
                            @changed="connectorsChanged"
                        ></CardItem>
                    </div>
                </div>

                <div v-show="isLoading">
                    <izy-hollow-loading loading />
                </div>

                <div class="col-sm-12" v-if="paginatedFolders.length == 0">
                    <div class="_empty">
                        <i class="feather icon-info"></i>
                        <p v-translate>No synchronized folders found</p>
                    </div>
                </div>

                <div class="mt-10 mb-20 ss-controls" v-show="pageNumber > 0">
                    <button class="ss-controls-btn prev js-ss-prev" @click="prev()" :disabled="pageNumber === 0">
                        <i class="feather icon-chevrons-left"></i> Previous
                    </button>
                    <button class="ss-controls-btn next js-ss-next" @click="next()" :disabled="pageNumber >= pageCount -1">
                    Next <i class="feather icon-chevrons-right"></i>
                    </button>
                </div>
            </div>

        </section>

        <SelectFolder :folders="gdrive_folders"></SelectFolder>
    </div>
</template>

<script>
import folder_icon from '@/assets/images/icon-folder.png'
import CardItem from './card/card-item'
import SelectFolder from './modals/select-folder'

export default {

    data: () => ({
        folder_icon,
        filtered: [],
        selected: [],
        unselected: [],
        unselectedSave: [],
        size: 10,
        pageNumber: 0
    }),

    components: { CardItem, SelectFolder },

    mounted () {
        this.getGoogleDriveFolders()
        this.getGoogleDriveSynchronizedFolders()
        this.resetFiltered()
    },

    watch: {
        'ghost.keywords' (val) {
            if (val.length) {
                this.filtered = this.folders.filter(c => {
                    return c.name.toLowerCase().includes(val.toLowerCase())
                })
            } else {
                this.resetFiltered()
            }
        },

        folders () {
            this.resetFiltered()
        },
    },

    computed: {
        folders () {
            let syncDrive = this.synchronized_folders
            if (!syncDrive){
                return []
            }

            return syncDrive
        },

        gdrive_folders () {
            let folders = this.$store.state.connectors.gdrive_folders
            if (!folders) {
                return []
            }

            let syncDrive = this.synchronized_folders
            let name = ''

            for (var i = 0; i < syncDrive.length; i++) {
                name = this.regexp(syncDrive[i].name)
                let folder = folders.filter(f => this.regexp(f.name) == name)

                if (folder !== undefined) {
                    folders.splice(i, 1)
                }
            }

            return folders
        },

        synchronized_folders () {
            return this.$store.state.connectors.gdrive_synchronized_folders
        },

        org () {
            let user = JSON.parse(localStorage.getItem('user'))
            return user.account.role.id === 1
                ? JSON.parse(localStorage.getItem('cur_org'))
                : user.organisation
        },

        type () {
            return JSON.parse(localStorage.getItem('type_con'))
        },

        pageCount () {
            let l = this.filtered.length,
                s = this.size;

            return Math.ceil(l/s);
        },

        paginatedFolders () {
            const start = this.pageNumber * this.size
            const end = start + this.size

            return this.filtered.slice(start, end)
        }
    },

    methods: {
        selectFolder () {
            window.eventBus.$emit('select-folder', 'selectfolder')
            setTimeout(() => {
                window.$('#selectFolderModal').modal({
                    show: true
                })
            }, 10)
        },

        resetFiltered () {
            if (this.folders) {
                this.filtered = this.folders.slice()
            }

            if (this.synchronized_folders) {
                this.selected = this.synchronized_folders.map(c => c.id)
            }
        },

        async desynch () {
            this.isLoading = true

            const payload = {
                "organisation": this.org.uuid,
                "type": this.type.uuid,
                "folders": this.unselectedSave.map(c => c)
            }

            const response = await this.$api.post(`api/organisation/connector/gdrive/desynchronize/folders`, payload)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.getGoogleDriveSynchronizedFolders()

                    this.$swal.success(this.$translate.text('Folders Desynchronised'))
                    this.resetArray()
                }

            this.isLoading = false
        },

        resetArray () {
            this.unselectedSave = []
            this.unselected = []
        },

        getGoogleDriveFolders () {
            let payload = {
                "organisation": this.org.uuid,
                "type": this.type.uuid
            }

            this.$store.dispatch('connectors/getGoogleDriveFolders', payload)
        },

        getGoogleDriveSynchronizedFolders () {
            let payload = {
                "organisation": this.org.uuid,
                "type": this.type.uuid
            }

            this.$store.dispatch('connectors/getGoogleDriveSynchronizedFolders', payload)
        },

        /**
         * Folder selected
         *
         * @param  {[type]}  payload
         * @return {Promise}
         */
        async connectorsChanged (payload) {
            if (payload.action === 'add') {
                if (this.unselected.length > 0)
                    this.unselected = this.unselected.filter(s => s !== payload.value)

                return this.selected.push(payload.value)
            }

            if (payload.action === 'remove') {
                let folder = this.synchronized_folders.filter(f => f.id == payload.value)[0]

                if (this.selected.length > 0)
                    this.selected = this.selected.filter(s => s !== payload.value)

                if (folder !== undefined) {
                    this.unselectedSave.push(folder.uuid)
                } else {
                    this.unselectedSave = this.unselectedSave.push(s => s !== folder.uuid)
                }

                return this.unselected.push(payload.value)
            }
        },

        next () {
            this.pageNumber++;
        },

        prev () {
            this.pageNumber--;
        }
    }
}
</script>
