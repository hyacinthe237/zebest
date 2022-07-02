<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="DeleteOrganizationModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <div class="secondary fs-20">
                        {{ t('Confirm delete organization') }}
                    </div>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div class="row">
                        <div class="col-sm-12" v-show="isLoading">
                            {{ t('Do you really want to delete this organization permanently?') }}
                        </div>
                        <div v-show="isLoading" class="mt-40 pb-40 text-center">
                            <izy-hollow-loading loading />
                        </div>
                    </div>

                    <div class="mt-20">
                        <button class="btn-grey btn mr-20" @click.prevent="closeAllModals()" :disabled="isLoading">
                            <i class="feather icon-x mr-10"></i>
                            {{ t('Cancel') }}
                        </button>

                        <button class="btn-danger btn mr-20" @click.prevent="deleteOrg()" :disabled="isLoading">
                            <i class="feather icon-trash-2 mr-10"></i>
                            {{ t('Yes, i delete') }}
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
        organization: {
            type: Object,
            default: () => {}
        }
    },

    methods: {
        async deleteOrg () {
            this.startLoading()
            let orgID = localStorage.getItem('orgID')
            let url = `api/admin/organisations/${orgID}/delete`
            const res = await this.$api.delete(url)
                .catch(error => {
                    this.stopLoading()
                    this.$swal.error(this.$translate.text(error.response.data.errors))
                })
                if (res) {
                    this.stopLoading()
                    this.closeAllModals()
                    this.$store.dispatch('organizations/getOrganizations')
                    this.$swal.success(this.$translate.text('Organization deleted successfully !'))
                }
        },
    }
}
</script>
