<template lang="html">
    <div class="row _meta-filters">
        <div class="col-sm-6">
            <div class="row">
                <div class="col-sm-12">
                    <div class="form-group _metadatas">
                        <label for="metadata" v-translate>Metadata</label>
                        <span>
                            <button @click="addMetadataIfValueExists()" class="btn btn-teal btn-add">
                                    <i class="feather icon-plus"></i>
                            </button>
                        </span>
                        <select
                            name="metadata"
                            id="metadata"
                            v-model="ghost_data.id"
                            class="form-control"
                            v-validate="'required'"
                        >
                            <option  v-for="data in metadata"
                                :key="data.id"
                                :value="data.uuid">
                                {{ data.name }}
                            </option>
                        </select>
                        <v-error :name="'metadata'" :err="errors" :show="showErrors"></v-error>
                    </div>
                </div>

                <div v-show="isStringOrDate" class="col-sm-12">
                    <div class="form-group">
                        <label for="value" v-translate>Value</label>
                        <input :type="inputType"
                            name="value"
                            v-model="ghost_data.selected"
                            class="form-control"
                            :data-vv-as="t('Value')"
                            :placeholder="t('Value')"
                        >
                    </div>
                </div>

                <div v-show="isList" class="col-sm-12">
                    <ul class="list-inline list-clickable mt-10">
                        <span v-for="l in value" :key="l" @click="removeElement(l)">
                            <i class="feather icon-x"></i>
                            {{ l }}
                        </span>
                    </ul>

                    <form class="_form pb-40" @submit.prevent>
                        <div class="form-group">
                            <label>Saissisez et cliquez sur <i class="feather icon-plus"></i></label>
                        </div>

                        <div class="row">
                            <div class="col-sm-9">
                                <div class="form-group">
                                    <input type="text"
                                        name="list"
                                        v-model="listElement"
                                        class="form-control"
                                        :data-vv-as="t('Value')"
                                        :placeholder="t('Value')"
                                    >
                                </div>
                            </div>
                            <div class="col-sm-3">
                                <button type="" class="btn btn-grey btn-md btn-add"
                                        @click="storeElement()">
                                        <i class="feather icon-plus"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div v-show="isDateOrNumberInterval" class="col-sm-12">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="date_from" v-translate>From</label>
                                <input :type="dateNumber"
                                    name="date_from"
                                    v-model="ghost_data.selected"
                                    class="form-control"
                                    :data-vv-as="t('From')"
                                    :placeholder="t('From')"
                                >
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="date_to" v-translate>To</label>
                                <input :type="dateNumber"
                                    name="date_to"
                                    v-model="ghost_data.to"
                                    class="form-control"
                                    :data-vv-as="t('To')"
                                    :placeholder="t('To')"
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-sm-6">
            <table v-show="hasMetaFilters" class="table">
                <thead>
                    <tr>
                        <th v-translate>Name</th>
                        <th v-translate>Value</th>
                        <th v-translate></th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="data in payload.meta_filters" :key="data.id">
                        <td>{{ data.name }}</td>
                        <td>{{ dataVal(data) }}</td>
                        <td>
                            <i @click="removeFromFilter(data)" class="btn-teal feather icon-x"></i>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>

export default {
    name: 'metadata-filter',

    components: {

    },

    data: () => ({
        value: [],
        listElement: '',
        isStringOrDate: true,
        isList: false,
        isDateOrNumberInterval: false,
        inputType: 'text',
        dateNumber: 'date',
        stringInput: 0,
        dateInput: 0,
        dateInterval: 0,
        stringArray: 0,
        numRange: 0,
        selected: []
    }),

    props: {
        metadata: {
            type: Array,
            default: () => []
        },

        ghost_data: {
            type: Object,
            default: () => {}
        },

        payload: {
            type: Object,
            default: () => {}
        },
    },

    computed: {
        hasMetaFilters () {
            return this.payload.meta_filters.length ? true : false
        }
    },

    mounted () {

    },

    watch: {
        'ghost_data.id' (val) {
            if (val) {
                let data = this.metadata.filter(m => m.uuid === val)[0]
                if (data.type === 'Chaîne de caractères') {
                    this.stringInput = 1
                    this.inputType = 'text'
                    this.isList = false
                    this.isDateOrNumberInterval = false
                    this.isStringOrDate = true
                }
                else if (data.type === 'Date') {
                    this.dateInput = 1
                    this.inputType = 'date'
                    this.isList = false
                    this.isDateOrNumberInterval = false
                    this.isStringOrDate = true
                }
                else if (data.type === 'Intervalle de Dates') {
                    this.dateInterval = 1
                    this.dateNumber = 'date'
                    this.isList = false
                    this.isStringOrDate = false
                    this.isDateOrNumberInterval = true
                }
                else if (data.type === 'Liste de Chaînes') {
                    this.stringArray = 1
                    this.isStringOrDate = false
                    this.isDateOrNumberInterval = false
                    this.isList = true
                }
                else if (data.type === 'Intervalle Numérique') {
                    this.numRange = 1
                    this.dateNumber = 'number'
                    this.isStringOrDate = false
                    this.isList = false
                    this.isDateOrNumberInterval = true
                }
            }
        }
    },

    methods: {
      close () {
          this.$emit('close');
      },

      storeElement () {
          if (this.listElement) {
              let isAlreadyAdded = this.value.filter(m => m === this.listElement)

              if (isAlreadyAdded.length) {
                  this.$swal.error("Vous avez deja ajouter cette element !")
              }
              else {
                  this.value.push(this.listElement)
                  this.listElement = ''
              }
          }
          else {
              this.$swal.error("Veiller saisir pour ajouter !")
          }
      },

      removeElement (l) {
          this.value = this.value.filter(a => a !== l)
      },

      removeFromFilter (d) {
          this.payload.meta_filters = this.payload.meta_filters.filter(m => m.name !== d.name)
      },

      dataVal(data) {
          if (data.to) {
              return data.selected + ' - ' + data.to
          }
          else if (Array.isArray(data.selected)) {
              return data.selected.map( a => a).join(', ')
          }
          else {
              return data.selected
          }
      },

      saveMetadata () {
          let returnedVal = this.addMetadataIfValueExists()

          if (returnedVal === 0) {
              return this.$swal.error("Veuiller remplir le(s) champ(s) pour enregistrer !")
          }
          this.$emit('addMetadata', this.payload)
      },

      addMetadataIfValueExists () {
          let val = this.ghost_data.selected
          if (((val) && (this.stringInput=1)) || ((val) && (this.dateInput=1)) || (val && this.ghost_data.to) || this.value.length) {
              if ((this.stringArray = 1) && (this.value.length)) {
                  this.ghost_data.selected = this.value
              }

              let temp = {}
              temp.type = this.metadata.filter(m => m.uuid === this.ghost_data.id)[0].meta_type
              temp.name = this.metadata.filter(m => m.uuid === this.ghost_data.id)[0].name
              temp.selected = this.ghost_data.selected
              if (this.ghost_data.to) {
                  temp.to = this.ghost_data.to
              }

              this.payload.meta_filters.push(temp)
              this.$emit('reset')
              this.value = []
              this.$store.commit('metadatas/SET_META_PAYLOAD', this.payload)
              return 1
          }
          else {
              return 0
          }
      },
    }
}
</script>
