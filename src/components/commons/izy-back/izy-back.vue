<template lang="html">
    <button
        @click.prevent="back()"
        class="btn btn-dark mr-2"
        :disabled="isLoading"
    >
        <i class="feather icon-arrow-left"></i> {{ t('Back') }}
    </button>
</template>

<script>
export default {
    name: 'izyBack',

    methods: {
        back () {
            this.$emit('backed')
        }
    }
}
</script>

<style lang="css" scoped>
</style>
