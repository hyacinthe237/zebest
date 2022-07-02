<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="selectFolderModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey mr-5" @click="closeModal()" :disabled="isLoading">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>

                    <button class="btn btn-primary" :disabled="isLoading" @click="synch()" v-if="selected.length !== 0">
                        <i class="feather icon-save"></i>
                        {{ t('Synchronise') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div class="secondary fs-20" v-show="!isLoading">
                        {{ t('Select folder') }}
                    </div>

                    <div v-show="isLoading">
                        <izy-hollow-loading loading />
                    </div>

                    <div class="dashboard" v-show="!isLoading">
                        <div class="container-fluid">
                            <div v-if="folders.length == 0">
                                <div class="_empty">
                                    <i class="feather icon-info"></i>
                                    <p v-translate>No Goole Drive folders found</p>
                                </div>
                            </div>

                            <div class="cards" v-else>
                                <div class="row">
                                    <CardItem
                                        v-for="fil in folders"
                                        :key="fil.id"
                                        :value="fil.id"
                                        :file="fil"
                                        :types="'card'"
                                        :col="6"
                                        :icon="folder_icon"
                                        :selected="selected"
                                        @changed="connectorsChanged"
                                    ></CardItem>
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
import folder_icon from '@/assets/images/icon-folder.png'
import CardItem from '../card/card-item'

export default {
    data: () => ({
        folder_icon,
        selected: [],
    }),

    components: { CardItem },

    props: {
        folders: { type: Array, default: () => [] }
    },

    computed: {
        org () {
            let user = JSON.parse(localStorage.getItem('user'))
            return user.account.role.id === 1
                ? JSON.parse(localStorage.getItem('cur_org'))
                : user.organisation
        },

        type () {
            return JSON.parse(localStorage.getItem('type_con'))
        },
    },

    mounted () {
        window.eventBus.$on('select-folder', (result) => {
            if (result == 'selectfolder') {
                this.selected = []
            }
        })
    },

    methods: {
        async synch () {
            this.isLoading = true

            const payload = {
                "organisation": this.org.uuid,
                "type": this.type.uuid,
                "folders": this.selected.map(c => c)
            }

            const response = await this.$api.post(`api/organisation/connector/gdrive/synchronize/folders`, payload)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.closeAllModals()
                    this.getGoogleDriveSynchronizedFolders()

                    this.$swal.success(this.$translate.text('Folders Synchronised'))
                }

            this.isLoading = false
        },

        /**
         * Folder selected
         *
         * @param  {[type]}  payload
         * @return {Promise}
         */
        async connectorsChanged (payload) {
            if (payload.action === 'add') {
                return this.selected.push(payload.value)
            }

            this.selected = this.selected.filter(s => s !== payload.value)
        },

        getGoogleDriveSynchronizedFolders () {
            let payload = {
                "organisation": this.org.uuid,
                "type": this.type.uuid
            }

            this.$store.dispatch('connectors/getGoogleDriveSynchronizedFolders', payload)
        },
    }
}
</script>
