<template>
    <nav aria-label="breadcrumb" class="crumb">
        <div class="label-wrapper" @click="toggleChildren">
            <div :style="indent" :class="labelClasses">
                <i v-if="nodes" class="fa" :class="iconClasses"></i>
                {{ label }}
            </div>
        </div>

        <tree-menu
            class="crumb-item"
            v-show="showChildren"
            v-for="node in nodes"
            :nodes="node.nodes"
            :label="node.name"
            :key="node.id"
            :depth="depth + 1"
        >
        </tree-menu>
    </nav>
</template>

<script>
    export default {
        name: 'tree-menu',

        data: () => ({
            showChildren: false
        }),

        props: {
            label: { type: String, default: '' },
            depth: { type: Number, default: 0 },
            nodes: { type: Array, default: () => [] }
        },

        computed: {
            indent () {
                return { transform: `translate(${this.depth * 50}px)` }
            },

            iconClasses () {
                return {
                    'feather icon-plus': !this.showChildren,
                    'feather icon-minus': this.showChildren
                }
            },

            labelClasses () {
                return { 'has-children': this.nodes }
            },
        },

        methods: {
            toggleChildren () {
                this.showChildren = !this.showChildren
            }
        }
    }
</script>
