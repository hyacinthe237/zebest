<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="indexFolderModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <div class="secondary fs-20">
                        {{ t('Confirm folder indexing') }}
                    </div>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div class="row">
                        <div class="col-sm-12">
                            {{ t('Do you really want to index this folder?') }}
                        </div>
                    </div>

                    <div class="mt-20">
                        <button class="btn-grey btn mr-20" @click.prevent="closeAllModals()">
                            <i class="feather icon-x mr-10"></i>
                            {{ t('Cancel') }}
                        </button>

                        <button class="btn-success btn mr-20" @click.prevent="indexFolder()">
                            <i class="feather icon-trash-2 mr-10"></i>
                            {{ t('Yes, I index') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        folder: {
            type: Object,
            default: () => {}
        }
    },

    computed: {

    },

    methods: {
        async indexFolder () {
            // Run Indexing Here
            const response = await this.$api.post(`api/organisation/folder/${this.folder.uuid}/index`)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error Get Index'), this.$translate.text(error.response.data.errors))
                })

            if (response) {
                this.operation = response.data.operation
                localStorage.setItem('operation', response.data.operation)

                if (this.operation > 0) {
                    this.$store.dispatch('folders/setOperation', this.operation)
                    this.$store.dispatch('folders/setIndexation', this.operation)
                }

                this.closeAllModals()
                this.$store.commit('folders/SET_SHOW_MODAL', true)
            }
        },
    }
}
</script>
