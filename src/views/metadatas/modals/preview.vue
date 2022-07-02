<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="metadataPreviewModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey" @click="closeAllModals()">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div class="secondary fs-18">
                        {{ metadata.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        metadata: {
            type: Object,
            default: () => {}
        }
    },
}
</script>
