<template>
    <div @click="check()">
        <div class="check" v-if="types == 'all'">
            <i :class="`feather icon-${clicked ? 'check-square' : 'square'}`"></i>
        </div>
        <div class="check" v-else>
            <i :class="`feather icon-${isChecked ? 'check-square' : 'square'}`"></i>
        </div>
    </div>
</template>

<script>

export default {
    name: 'item-checkbox',

    props: {
        value: { type: [String, Number], default: '' },
        types: { type: String, default: '' },
        clicked: { type: Boolean, default: false },
        selected: { type: Array, default: () => [] },
    },

    computed: {
        isChecked () {
            return !!this.selected.find(l => l === this.value)
        }
    },

    methods: {
        check () {
            if (this.types == 'all') {
                this.$emit('allselected', {
                    action: this.clicked ? 'remove' : 'add'
                })
            } else {
                this.$emit('changed', {
                    action: this.isChecked ? 'remove' : 'add',
                    value: this.value,
                })
            }
        }
    }
}
</script>
