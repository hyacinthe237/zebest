<template lang="html">
    <div class="_preview-modal modal animated fadeIn" id="previewImageModal">
        <div class="_preview-dialog" role="document">
            <div class="_preview-content">
                <div class="close" @click="closeAllModals()">
                    <i class="feather icon-x"></i>
                </div>

                <img :src="image" class="img-responsive">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PreviewImageModal',

    props: {
        doc: {
            type: Object,
            default: () => {}
        }
    },

    computed: {
        image () {
            return this.doc != undefined ? `data:image/png;base64,${this.doc.image}` : ''
        }
    }
}
</script>
