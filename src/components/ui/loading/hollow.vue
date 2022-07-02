<template lang="html">
    <div v-show="loading" style="width:200px;margin:0 auto">
        <hollow-dots-spinner
            :animation-duration="1000"
            :dot-size="14"
            :dots-num="3"
            :color="colour"/>
    </div>
</template>

<script>
import { HollowDotsSpinner } from 'epic-spinners'

export default {
    name: 'hollow-loading',

    components: {
        HollowDotsSpinner
    },

    props: {
        colour: { type: String, default: '#735996' },
        loading: { type: Boolean, default: false },
    },
}
</script>
