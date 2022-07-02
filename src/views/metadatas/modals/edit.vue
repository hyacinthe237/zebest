<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="editMetadataModal">
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
                        {{ t('Edit metadata') }}
                    </div>

                    <form @submit.prevent class="_form mt-20">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="name" v-translate>Name</label>
                                    <input type="text"
                                        name="name"
                                        v-model="ghost.name"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('Name')"
                                        :placeholder="t('Name')"
                                        required
                                    >
                                    <v-error :name="'name'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div class="mt-20">
                        <button class="btn-secondary btn mr-20" @click.prevent="updateMetadata()">
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

export default {
    props: {
        metadata: {
            type: Object,
            default: () => {}
        }
    },

    watch: {
        metadata: {
            immediate: true,
            handler: function (val) {
                if (val) {
                    this.ghost = Object.assign(this.metadata, {})
                    this.showErrors = false
                }
            }
        }
    },

    methods: {
        async updateMetadata () {
            this.showErrors = true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.$emit('updateMetadata', this.ghost)
        },
    }
}
</script>
