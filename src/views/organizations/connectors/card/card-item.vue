<template>
    <div :class="`col-sm-${col}`" @click="check()">
        <div class="card _stats elevated _check">
            <div class="_head-collapse con">
                <div class="icon">
                    <img :src="icon" alt="">
                </div>

                <div class="check" v-show="isChecked">
                    <i class="feather icon-check"></i>
                </div>

                <div class="check no" v-show="!isChecked">
                    <i class="feather icon-x"></i>
                </div>

                <div class="_name">
                    <span class="title">{{ file.name }}</span>

                    <div class="counter">
                        <span class="label">Folders: </span>{{ file.nb_folders }}
                    </div>
                    <div class="counter">
                         <span class="label">Files: </span> {{ file.nb_files }}
                    </div>
                    <div class="counter">
                        <span class="label">Index: </span> {{ file.last_index_date | datetime }}
                    </div>
                    <div class="counter">
                        <span class="label">Synchro: </span> {{ file.last_synchronisation | datetime }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'CardItem',

    props: {
        col: { type: Number, default: 4 },
        icon: { type: String, default: '' },
        file: { type: Object, default: () => {} },
        value: { type: [String, Number], default: '' },
        selected: { type: Array, default: () => [] }
    },

    computed: {
        isChecked () {
            return !!this.selected.find(l => l === this.value)
        },
    },

    methods: {
        check () {
            this.$emit('changed', {
                action: this.isChecked ? 'remove' : 'add',
                value: this.value,
            })
        }
    }
}
</script>
