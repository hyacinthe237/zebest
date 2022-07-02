<template lang="html">
    <nav aria-label="breadcrumb" v-if="show">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"
                :key="index"
                v-for="(r, index) in routes"
                :class="(routes.length == index+1) ? 'active' : ''"
                @click="open(r)"
                @contextmenu.prevent="$refs.menu.open($event, { file: r })"
            >
                {{ t(r.name) }}
            </li>
        </ol>

        <vue-context ref="menu" @open="onOpen">
            <li>
                <i class="feather icon-edit-2"></i>
                <a href="#" @click.prevent="editer()">Modifier</a>
            </li>
            <li>
                <i class="feather icon-chevrons-right"></i>
                <a href="#" @click.prevent="indexer()">Indexer</a>
            </li>
        </vue-context>
    </nav>
</template>

<script>
import { VueContext } from 'vue-context'

export default {
    name: 'Breadcrumb',

    components: { VueContext },

    props: {
        routes: {
            type: Array,
            default: () => []
        },

        show: {
            type: Boolean,
            default: true
        },
    },

    methods: {
        open (link) {
          let indexLink = this.routes.indexOf(link)
          this.routes.splice(indexLink+1, this.routes.length)
            if (link.route == 'file-content') {
                this.$store.dispatch('folders/getArborescence', link.file)
                localStorage.setItem('currentDirectory', JSON.stringify(link.file))
                this.navigate({ name: 'file-content', params: { id: link.uuid, file: link.file }})
            } else if (link.route == 'file') {
                localStorage.setItem('currentDirectory', JSON.stringify(link.uuid))
                this.$store.dispatch('folders/getArborescence', link.uuid)
                this.navigate({ name: 'file', params: { id: link.uuid }})
            } else if (link.route == 'file-content-item') {
                localStorage.setItem('currentDirectory', JSON.stringify(link.item))
                this.$store.dispatch('folders/getArborescence', link.item)
                this.navigate({ name: 'file-content-item', params: {
                    id: link.uuid,
                    file: link.file,
                    item: link.item,
                }})
            } else {
                localStorage.removeItem('currentDirectory')
                this.r(link.route)
            }
        },

        onOpen (event, data) {
            if (data.file.uuid != undefined) {
                this.$store.dispatch('folders/getArborescence', data.file.uuid)
            }

            this.$emit('onOpen', data.file)
        },

        editer () {
            this.$emit('editer')
        },

        indexer () {
            this.$emit('indexer')
        }
    }
}
</script>
