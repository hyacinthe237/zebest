<template>
    <div class="_modal modal fadeIn" id="loadingModal">
        <div class="_loading-modal-content">
            <izy-hollow-loading loading :colour="'#46D465'"/>
        </div>
    </div>
</template>

<script>
export default {
    mounted () {

    },

    methods: {
        closeModal () {
            window.$('.modal').modal('hide')
        },
    }
}
</script>
