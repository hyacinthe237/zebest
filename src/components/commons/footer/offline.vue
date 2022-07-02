<template lang="html">
    <div class="_main-footer" v-show="!onlineState">
        <i class="feather icon-alert-triangle"></i>
        {{ t('You appear to be offline. Some features are not available and your data is not synchronized in real time.') }}
    </div>
</template>

<script>
export default {
    data () {
        return {
            onlineState: navigator.onLine
        }
    },

    mounted () {
        this.$on('online', () => { this.onlineState = true })
        this.$on('offline', () => { this.onlineState = false })
    }
}
</script>
