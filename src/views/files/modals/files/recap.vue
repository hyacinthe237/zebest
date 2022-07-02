<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="RecapUploadFilesModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey mr-10" @click="closeAllModals()">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Modal content -->
                <div class="_modal-content bg-grey">
                    <div class="secondary fs-20">
                        {{ t('') }}
                    </div>

                    <div class="teal fs-16 mt-10">
                        <ul class="list-unstyled">
                            <li>Nombre de fichiers soumis à l'import: {{ totalfiles }}</li>
                            <li>Nombre de fichier importés avec succès: {{ upLoadfiles.length }}</li>
                            <li>Nombre d'erreurs: {{ errorsfiles.length }} </li>
                        </ul>
                    </div>

                    <div class="teal fs-16 mt-10">
                        <h4>Liste des fichiers non importés</h4>
                        <ol class="ml-20">
                            <li v-for="f in errorsfiles" :key="f.id">{{ f.name }}</li>
                        </ol>
                    </div>
                </div>

                <!-- Modal content -->

            </div>
        </div>
    </div>
</template>

<script>

export default {

    data: () => ({
        upLoadfiles: [],
        errorsfiles: []
    }),

    computed: {
        totalfiles () {
            return this.upLoadfiles.length + this.errorsfiles.length
        }
    },

    mounted () {
        window.eventBus.$on('recap', (result) => {
            if (result == 'recap') {
                this.upLoadfiles = JSON.parse(localStorage.getItem('upLoadfiles'))
                this.errorsfiles = JSON.parse(localStorage.getItem('errorsfiles'))
            }
        })
    }

}
</script>
