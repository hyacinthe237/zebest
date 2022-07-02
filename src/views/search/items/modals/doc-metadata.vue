<template lang="html">
    <div class="tab_data_modal modal" id="metadataModal">
        <div class="modal-mask" @click="close()">
            <div class="modal-container" @click.stop>
                <div class="modal-header">
                    <h3>{{ t('File metadata') }}</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-12">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th v-translate>Name</th>
                                        <th v-translate>Value</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="data in metadata" :key="data.id">
                                        <td>{{ data.name }}</td>
                                        <td>{{ computeValue (data) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-grey" @click="close()">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    name: 'metadataModal',

    data: () => ({

    }),

    props: {
        doc: {
            type: Object,
            default: () => {}
        },
    },

    computed: {
        metadata () {
            return (this.doc && this.doc.metadata.length) ? this.doc.metadata : []
        }
    },

    methods: {
      close () {
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
              return moment(p.min_date).format('DD/MM/YYYY') + ' - ' + moment(p.max_date).format('DD/MM/YYYY')
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
