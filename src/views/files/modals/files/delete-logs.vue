<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="deleteLogsModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey mr-10" @click="closeModal()">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Modal content -->
                <div class="_modal-content bg-grey">
                    <div class="secondary fs-20">
                        {{ t('Delete logs') }}
                    </div>

                    <div class="teal fs-16 mt-10">
                        <ul class="list-unstyled">
                            <li v-if="files_length > 0">Nombre de fichiers soumis à la suppression {{ files_length }}</li>
                            <li v-if="folders_length > 0">Nombre de dossiers soumis à la suppression {{ folders_length }}</li>
                        </ul>
                    </div>

                    <div class="teal fs-16 mt-10" v-if="files_length > 0">
                        <h4>Liste des fichiers supprimés</h4>
                        <ol class="ml-20">
                            <li v-for="f in files" :key="f.id">{{ f.name }}</li>
                        </ol>
                    </div>

                    <div class="teal fs-16 mt-10" v-if="folders_length > 0">
                        <h4>Liste des dossiers supprimés</h4>
                        <ol class="ml-20">
                            <li v-for="f in folders" :key="f.id">{{ f.name }}</li>
                        </ol>
                    </div>
                </div>

                <!-- Modal content -->

            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'

export default {

    data: () => ({
        // files: [],
        // folders: []
    }),

    props: {
        files: { type: Array, default: () => [] },
        folders: { type: Array, default: () => [] },
    },

    computed: {
        allFiles () {
            return this.folders.concat(this.files)
        },

        folders_length () {
            return !_.isEmpty(this.folders) ? this.folders.length : 0
        },

        files_length () {
            return !_.isEmpty(this.files) ? this.files.length : 0
        }
    },

    mounted () {
        // window.eventBus.$on('delete-logs', (result) => {
        //     if (result == 'deletelogs') {
        //         // this.files = JSON.parse(localStorage.getItem('files'))
        //         // this.folders = JSON.parse(localStorage.getItem('folders'))
        //     }
        // })
    },

    methods: {
        closeModal () {
            this.closeAllModals()
        }
    }

}
</script>
