<template lang="html">
    <div class="form_modal modal" id="formModal">
        <div class="modal-mask" @click="close()">
            <div class="modal-container" @click.stop>
                <div class="modal-header">
                    <h3>{{ t('New Metadata') }}</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label for="metadata" v-translate>Metadata</label>
                                <select
                                    name="metadata"
                                    id="metadata"
                                    v-model="ghost_data.id"
                                    class="form-control"
                                    v-validate="'required'"
                                >
                                    <option  v-for="data in metadatas"
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
                                    v-model="ghost_data.value"
                                    class="form-control"
                                    :data-vv-as="t('Value')"
                                    :placeholder="t('Value')"
                                >
                            </div>
                        </div>

                        <div v-show="isText" class="col-sm-12">
                            <div class="form-group">
                                <label for="value" v-translate>Value</label>
                                <textarea name="value"
                                    v-model="ghost_data.value"
                                    class="form-control"
                                    :data-vv-as="t('Value')"
                                    :placeholder="t('Value')"
                                    rows="4" cols="80"
                                >
                                </textarea>
                            </div>
                        </div>

                        <div v-show="isList" class="col-sm-12">
                            <ul class="list-inline list-clickable mt-10">
                                <li v-for="l in value" :key="l" @click="removeElement(l)">
                                    <i class="feather icon-x"></i>
                                    {{ l }}
                                </li>
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
                                        <button type="" class="btn btn-grey btn-md"
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
                                            v-model="ghost_data.value"
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
                                            v-model="ghost_data.sup"
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
                <div class="modal-footer">
                    <button class="btn-primary btn mr-20" @click.prevent="saveMetadata()">
                        <i class="feather icon-save"></i>
                        {{ t('Save') }}
                    </button>

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

export default {

    components: {

    },

    data: () => ({
        value: [],
        listElement: '',
        isStringOrDate: true,
        isList: false,
        isText: false,
        isDateOrNumberInterval: false,
        inputType: 'text',
        dateNumber: 'date',
        stringInput: 0,
        dateInput: 0,
        dateInterval: 0,
        stringArray: 0,
        numRange: 0,
        texte: 0,
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

        payload: {
            type: Object,
            default: () => {}
        },

        ghost_data: {
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
    },

    mounted () {

    },

    watch: {
        'ghost_data.id' (val) {
            if (val) {
                let data = this.metadatas.filter(m => m.uuid === val)[0]
                if (data.type === 'Chaîne de caractères') {
                    this.stringInput = 1
                    this.inputType = 'text'
                    this.isList = false
                    this.isDateOrNumberInterval = false
                    this.isText = false
                    this.isStringOrDate = true
                }
                else if (data.type === 'Date') {
                    this.dateInput = 1
                    this.inputType = 'date'
                    this.isList = false
                    this.isDateOrNumberInterval = false
                    this.isText = false
                    this.isStringOrDate = true
                }
                else if (data.type === 'Intervalle de Dates') {
                    this.dateInterval = 1
                    this.dateNumber = 'date'
                    this.isList = false
                    this.isStringOrDate = false
                    this.isText = false
                    this.isDateOrNumberInterval = true
                }
                else if (data.type === 'Liste de Chaînes') {
                    this.stringArray = 1
                    this.isStringOrDate = false
                    this.isDateOrNumberInterval = false
                    this.isText = false
                    this.isList = true
                }
                else if (data.type === 'Intervalle Numérique') {
                    this.numRange = 1
                    this.dateNumber = 'number'
                    this.isStringOrDate = false
                    this.isList = false
                    this.isText = false
                    this.isDateOrNumberInterval = true
                }
                else if (data.type === 'Texte') {
                    this.texte = 1
                    this.isStringOrDate = false
                    this.isList = false
                    this.isDateOrNumberInterval = false
                    this.isText = true
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

      saveMetadata () {
          let returnedVal = this.addMetadataIfValueExists()

          if (returnedVal === 0) {
              return this.$swal.error("Veuiller remplir le(s) champ(s) pour enregistrer !")
          }
          this.$emit('addMetadata', this.payload)
      },

      addMetadataIfValueExists () {
          let val = this.ghost_data.value
          if (((val) && (this.stringInput=1)) || ((val) && (this.dateInput=1)) || ((val) && (this.texte=1))
                || (val && this.ghost_data.sup) || this.value.length) {
              if ((this.stringArray = 1) && (this.value.length)) {
                  this.ghost_data.value = this.value
              }
              this.payload.metadata.push(this.ghost_data)
              this.$emit('reset')
              this.value = []
              return 1
          }
          else {
              return 0
          }
      },
    }
}
</script>
