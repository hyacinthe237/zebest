<template lang="html">
    <div class="tab_data_modal modal filter_metadata_modal" id="filtersModal">
        <div class="modal-mask" @click="close()">
            <div class="modal-container" @click.stop>
                <div class="modal-header">
                    <h3>{{ t('Filter metadata') }}</h3>
                </div>
                <div class="modal-body">
                    <div class="row _meta-filters">
                        <div class="col-sm-12 mt-20">
                            <div class="row">
                                <div class="col-sm-4">
                                    <form class="_form" @submit.prevent v-show="!isLoading">
                                        <div class="search-input">
                                            <div class="form-group">
                                                <label class="typo__label">{{ t('Directory') }}</label>
                                                <multiselect
                                                    v-model="value"
                                                    label="name"
                                                    track-by="id"
                                                    :placeholder="t('Selection folder')"
                                                    :options="options"
                                                    :multiple="true"
                                                    :taggable="true"
                                                    @tag="addTag"
                                                ></multiselect>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div v-for="meta in metas" :key="meta.uuid" class="col-sm-4">
                                    <div v-if="meta.meta_type==1 || meta.meta_type==5" class="">
                                        <div class="search-input">
                                            <div class="form-group">
                                                <label class="typo__label">{{ meta.name }}</label>
                                                <multiselect
                                                    v-model="form[`selected-${meta.name}`]"
                                                    :placeholder="t('Selectionner valeurs')"
                                                    :options="meta.values"
                                                    :multiple="true"
                                                    :taggable="true"
                                                ></multiselect>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="meta.meta_type==2 || meta.meta_type==4" class="">
                                        <div class="row _intervalInput">
                                            <div class="col-sm-12">
                                                <label v-translate>{{ meta.name }}</label>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="form-inline">
                                                    <label :for="`date_from-${meta.name}`" class="date-label" v-translate>From:</label>
                                                    <date-picker
                                                        v-model="form[`selected-${meta.name}`]"
                                                        :config="pickerOptions"
                                                        class="date-picker"
                                                    >
                                                    </date-picker>
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="form-inline">
                                                    <label :for="`date_to-${meta.name}`" class="date-label" v-translate>To:</label>
                                                    <date-picker
                                                        v-model="form[`to-${meta.name}`]"
                                                        :config="pickerOptions"
                                                        class="date-picker"
                                                    >
                                                    </date-picker>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="meta.meta_type==3" class="">
                                        <div class="row _intervalInput">
                                            <div class="col-sm-12">
                                                <label v-translate>{{ meta.name }}</label>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="form-group">
                                                    <!-- <label :for="`number_from-${meta.name}`" v-translate>From</label> -->
                                                    <input type="number"
                                                        :name="`number_from-${meta.name}`"
                                                        v-model="form[`selected-${meta.name}`]"
                                                        class="form-control"
                                                        :data-vv-as="t('De')"
                                                        :placeholder="t('De')"
                                                    >
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="form-group">
                                                    <!-- <label :for="`number_to-${meta.name}`" v-translate>To</label> -->
                                                    <input type="number"
                                                        :name="`number_to-${meta.name}`"
                                                        v-model="form[`to-${meta.name}`]"
                                                        class="form-control"
                                                        :data-vv-as="t('A')"
                                                        :placeholder="t('A')"
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        class="btn btn-secondary"
                        @click="confirm()"
                    >
                        <i class="feather icon-check"></i>
                        OK
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
    name: 'filterModal',

    data: () => ({

    }),

    props: {
        form: {
            type: Object,
            default: () => {}
        },

        meta_filters: {
            type: Array,
            default: () => []
        },

        value: {
            type: Array,
            default: () => []
        },

        options: {
            type: Array,
            default: () => []
        },

        metas: {
            type: Array,
            default: () => []
        },

        pickerOptions: {
            type: Object,
            default: () => {}
        },
    },

    computed: {

    },

    methods: {
      addTag () {
          this.$emit('addTag')
      },

      close () {
          this.$emit('closeFiltersModal')
      },

      confirm () {
          this.$emit('confirmed')
      }
    }
}
</script>
