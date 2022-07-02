<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="addMetadataModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey" @click="closeAllModals()">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div class="secondary fs-20">
                        {{ t('Add metadata') }}
                    </div>

                    <form @submit.prevent class="_form mt-20">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="name" v-translate>Name</label>
                                    <input type="text"
                                        name="name"
                                        v-model="ghost_data.name"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('Name')"
                                        :placeholder="t('Name')"
                                    >
                                    <v-error :name="'name'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="role" v-translate>Metadata Type</label>
                                    <select
                                        name="metadata_type"
                                        id="metadata_type"
                                        v-model="ghost_data.type"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                    >
                                        <option  v-for="type in metadataTypes"
                                            :key="type.id"
                                            :value="type.uuid">
                                            {{ type.name }}
                                        </option>
                                    </select>
                                    <v-error :name="'metadata_type'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div v-if="isSuperAdmin" class="col-sm-6">
                                <div class="form-group">
                                    <label for="organisation" v-translate>Organisation</label>
                                    <select name="organisation"
                                        id="organisation"
                                        v-model="ghost_data.organisation"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                    >
                                        <option  v-for="org in organizations"
                                            :key="org.id"
                                            :value="org.uuid">
                                            {{ org.name }}
                                        </option>
                                    </select>
                                    <v-error :name="'organisation'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div class="mt-20">
                        <button class="btn-secondary btn mr-20" @click.prevent="confirmCreate()">
                            <i class="feather icon-save mr-10"></i>
                            {{ t('Save metadata') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {

    props: {
        isSuperAdmin: {
            type: Boolean,
            default: false
        },

        ghost_data: {
            type: Object,
            default: () => {}
        },

        metadataTypes: {
            type: Array,
            default: () => []
        },

        organizations: {
            type: Array,
            default: () => []
        },
    },

    mounted () {
        window.eventBus.$on('add', (result) => {
            if (result == 'metadata') {
                this.showErrors = false
            }
        })
    },

    methods: {
        async confirmCreate () {
          this.showErrors = true
          const isValid = await this.$validator.validate()
          if (!isValid) return false

            Swal.fire({
                title: this.$translate.text('Are you sure ?'),
                text: "",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: this.$translate.text('Yes, create it!')
            }).then((result) => {
                if (result.value) {
                    this.$emit('createMetadata', this.ghost_data)
                    this.showErrors = false
                }
            })
        },
    }
}
</script>
