<template lang="html">
    <hollow-dots-spinner
        :animation-duration="1000"
        :dot-size="14"
        :dots-num="3"
        :color="colour"/>
</template>

<script>
import { HollowDotsSpinner } from 'epic-spinners'

export default {
    components: {
        HollowDotsSpinner
    },

    props: {
        colour: {
            type: String,
            default: '#46D465'
        },

        size: {
            type: Number,
            default: 14
        },

        dots: {
            type: Number,
            default: 3
        },

        duration: {
            type: Number,
            default: 1000
        }
    }
}
</script>

<style lang="css" scoped>
.hollow-dots-spinner {
    margin: 0 auto;
}
</style>
