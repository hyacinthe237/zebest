<template lang="html">
    <div class="">
        <button
            v-show="!toDelete"  @click="addMetadata()"
            class="btn-success btn float-right w-150"
        >
            {{ t('Add') }}
        </button>

        <button
            v-show="toDelete" @click="deleteFileMetadata()"
            class="btn-danger btn float-right w-150"
        >
            {{ t('Delete') }}
        </button>

        <h4 class="secondary">{{ t('File metadata') }}</h4>

        <table v-if="meta_data == 1" class="table mt-20">
            <thead>
                <tr>
                    <th class="w20" v-translate>Name</th>
                    <th class="w70" v-translate>Value</th>
                    <th class="w10" v-translate></th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="data in file.metadata" :key="data.id">
                    <td class="w20">{{ data.name }}</td>
                    <span @click="showText(data)" :style="data.type=='Texte' ? 'cursor:pointer' : ''">
                        <td class="w70">{{ computeValue(data) }}</td>
                    </span>
                    <td class="w10">
                        <ItemCheckBox
                            :value="data.uuid"
                            :selected="selected"
                            @changed="MetadatasChanged"
                        >
                        </ItemCheckBox>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import moment from 'moment'
import ItemCheckBox from '@/components/metadata/item-checkbox'
import Swal from 'sweetalert2'

export default {
    components: { ItemCheckBox },

    data: () => ({
        selected: []
    }),

    props: {
        file: {
            type: Object,
            default: () => {}
        },

        metadatas: {
            type: Array,
            default: () => []
        },

        delete_params: {
            type: Object,
            default: () => {}
        }
    },

    computed: {
        meta_data () {
            if (this.file.metadata) {
                return this.file.metadata.length ? 1 : 0
            }
            return 0
        },

        toDelete () {
            if (this.selected.length) {
                return true
            }
            return false
        }
    },

    mounted () {
        window.eventBus.$on('preview-file', (result) => {
            if (result == 'previewfile') {
                this.selected = []
            }
        })
    },

    methods: {
        MetadatasChanged (payload) {
            if (payload.action == 'add') {
                return this.selected.push(payload.value)
            }

            this.selected = this.selected.filter(act => act !== payload.value)
        },

        computeValue (p) {
            if (Array.isArray(p.value)) {
                return p.value.map( a => a).join(', ')
            }
            else if (p.min_date && (p.max_date === null)) {
                return moment(p.min_date).format('DD/MM/YYYY')
            }
            else if ((p.min_date !== null) && (p.max_date !== null)) {
                return moment(p.min_date).format('DD/MM/YYYY') + ' - ' + moment(p.max_date).format('DD/MM/YYYY')
            }
            else if (!p.value && !Array.isArray(p.value) && !(p.min_date || p.max_date)) {
                return p.min_value + ' - ' + p.max_value
            }
            else if (p.type == 'Texte') {
                return p.value.slice(0, 80) + '...'
            }
            else {
                return p.value ? p.value : '...'
            }
        },

        showText (data) {
            if (data.type == 'Texte') {
                this.$emit('dataToView', data)
                this.openModal({ id: 'showTextModal' })
            }
        },

        addMetadata () {
            this.openModal({ id: 'formModal' })
        },

        deleteFileMetadata () {
            if (!this.selected.length) {
                return this.$swal.error("Veiller selectionner le(s) metadonnée(s) pour supprimer !")
            }
            Swal.fire({
                title: this.$translate.text('Are you sure ?'),
                text: this.$translate.text("You won't be able to revert this!"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: this.$translate.text('Cancel'),
                confirmButtonText: this.$translate.text('Yes, delete!')
            }).then((result) => {
                if (result.value) {
                    this.delete_params.metadata = this.selected
                    this.$emit('deleteMetadata', this.delete_params)
                    this.selected = []
                }
            })
        }
    }
}
</script>
