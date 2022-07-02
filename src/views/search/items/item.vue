<template lang="html">
    <div class="_doc-item">

       <div class="_doc-image" @click="previewImage()">
           <img :src="`data:image/png;base64,${doc.image}`" alt="">
       </div>

       <div class="_doc-content">
           <div class="_doc-head" @click="open()">
               <div class="_doc-name bold">{{ doc.name }}</div>

               <div class="_doc-parent">
                   <span v-translate>In folder</span> {{ doc.folder_name }}
               </div>
           </div>

           <div v-if="!hasNoDesc" class="_doc-text" v-html="doc.text.trim().slice(0, 400)" @click="open()"></div>
           <div v-if="hasNoDesc" class="_doc-text" v-html="textMetaToShow.value.trim().slice(0, 400)" @click="open()"></div>

            <div class="doc_meta_info">
                <div class="row">
                    <div class="col-sm-7">
                        <div class="_meta_wrapper">
                            <div v-if="hasMetadata" class="_metadata">
                                <div class="_data_wrapper">
                                    <div v-for="data in dataToShow" :key="data.id" class="_meta_block">
                                        <div class="meta_item">
                                            <p class="name">{{ data.name }} : {{ computeValue (data) }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="doc.metadata.length>3" class="_more" @click="openDataModal()"><a>Plus de metadonnées</a></div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-5">
                        <ul class="list-inline _download">
                            <li class="list-inline-item" @click="download()">
                                <a class="btn btn-primary">
                                    <i class="feather icon-download"></i>
                                    {{ t('Download') }}
                                </a>
                            </li>

                            <li class="list-inline-item" @click="openEmplacement()" v-show="isAvailable">
                                <a class="btn btn-secondary">
                                    <i class="feather icon-anchor"></i>
                                    Accéder
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
       </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    name: 'DocumentItem',

    data: () => ({

    }),

    props: {
        doc: {
            type: Object,
            default: () => {}
        },

        isAvailable: {
            type: Boolean,
            default: false
        },
    },

    computed: {
        hasMetadata () {
            return this.doc.metadata.length ? true : false
        },

        dataToShow () {
            return this.hasMetadata ? this.doc.metadata.filter(m => m.type != 'Texte').slice(0, 3) : []
        },

        hasNoDesc () {
            return (!(this.doc.text.length>150) && this.hasTextMeta) ? true : false
        },

        hasTextMeta () {
            return this.hasMetadata ?
                    this.doc.metadata.filter(m => m.type == 'Texte').length > 0 : false
        },

        textMetaToShow () {
            return this.hasTextMeta ? this.doc.metadata.filter(m => m.type == 'Texte')[0] : {}
        },
    },

    methods: {
        previewImage () {
            return this.$emit('preview', this.doc)
        },

        open () {
            this.$emit('openDoc', this.doc)
        },

        download () {
            this.$emit('downloaded', this.doc)
        },

        openEmplacement () {
            this.$emit('openEmplacement', this.doc)
        },

        openDataModal () {
            this.$emit('openDataModal', this.doc)
        },

        closeMetadataModal () {
            this.$emit('closeMetadataModal')
        },

        computeValue (p) {
            if (Array.isArray(p.value)) {
                return p.value.map( a => a).join(', ')
            }
            else if (p.min_date && (p.max_date === null)) {
                return moment(p.min_date).format('DD/MM/YYYY')
            }
            else if ((p.min_date !== null) && (p.max_date !== null)) {
                return moment(p.min_date).format('DD/MM/YYYY') + ' - ' +  moment(p.max_date).format('DD/MM/YYYY')
            }
            else if (!p.value && !Array.isArray(p.value) && !(p.min_date || p.max_date)) {
                return p.min_value + ' - ' + p.max_value
            }
            else {
                return p.value ? p.value : '...'
            }
        },
    }
}
</script>
