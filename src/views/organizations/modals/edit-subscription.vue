<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" :id="'editFormulaModal'">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey" @click="closeModal()" :disabled="isLoading">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content" v-show="!isLoading">
                    <div class="secondary fs-20">
                        {{ t('Edit subscription') }}
                    </div>

                    <form @submit.prevent="save()" class="_form mt-20">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="max_users" v-translate>Max users</label>
                                    <input type="text"
                                        name="max_users"
                                        v-model="ghost.max_users"
                                        class="form-control form-control-lg"
                                        v-validate="'required|numeric'"
                                        :data-vv-as="t('Max users')"
                                        :placeholder="t('Max users')"
                                    >
                                    <v-error :name="'max_users'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="max_size" v-translate>Max size</label>
                                    <input type="text"
                                        name="max_size"
                                        v-model="ghost.max_size"
                                        class="form-control form-control-lg"
                                        v-validate="'required|numeric'"
                                        :data-vv-as="t('Max size')"
                                        :placeholder="t('Max size')"
                                    >
                                    <v-error :name="'max_size'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="max_queries" v-translate>Max queries</label>
                                    <input type="text"
                                        name="max_queries"
                                        v-model="ghost.max_queries"
                                        class="form-control form-control-lg"
                                        v-validate="'required|numeric'"
                                        :data-vv-as="t('Max queries')"
                                        :placeholder="t('Max queries')"
                                    >
                                    <v-error :name="'max_queries'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="datetime" v-translate>End Date</label>
                                    <input type="datetime-local"
                                        name="datetime"
                                        v-model="ghost.datetime"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('End Date')"
                                        :placeholder="t('End Date')"
                                    >
                                    <v-error :name="'end_date'" :err="errors" :show="showErrors"></v-error>

                                    <input type="hidden"
                                        v-model="ghost.end_date" name="end_date"
                                        v-validate="'required'">
                                </div>
                            </div>
                        </div>
                    </form>

                    <div class="mt-20">
                        <button class="btn-teal btn mr-20" @click="resetGhost()">
                            {{ t('Annuler') }}
                        </button>

                        <button class="btn-secondary btn mr-20" @click="save()">
                            <i class="feather icon-save mr-10"></i>
                            {{ t('Save') }}
                        </button>
                    </div>
                </div>

                <div v-show="isLoading" class="mt-40 pb-40 text-center">
                    <izy-hollow-loading loading />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    props: {
        formula: {
            type: Object,
            default: () => {}
        },

        organisation: {
            type: Object,
            default: () => {}
        },
    },

    watch: {
        formula (val) {
            if (!_.isEmpty(val)) {
                this.ghost = Object.assign({}, val)
            }
        }
    },

    mounted () {
        window.eventBus.$on('editFormula', (result) => {
            if (result == 'edit-formula') {
                this.resetGhost()
                this.showErrors = false
            }
        })
    },

    methods: {
        async save () {
            this.showErrors = true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()
            this.ghost.end_date = moment(this.ghost.datetime).format('YYYY-MM-DD HH:mm:00')

            const response = await this.$api.put(`api/admin/subscription/${this.ghost.uuid}/update`, this.ghost)
                .catch(error => {
                    this.stopLoading()
                    console.log('Error', error.response.data.errors)
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.$store.dispatch('subscriptions/getSubscriptions')
                    this.showErrors = false
                    this.resetGhost()
                    this.closeAllModals()
                    this.$swal.success(this.$translate.text('Subscription updated successfully !'))
                }
        },

        resetGhost () {
            this.ghost = Object.assign({
                datetime: moment(this.formula.end_date).format('YYYY-MM-DDTHH:mm'),
            }, this.formula)
        },

        closeModal () {
            this.resetGhost()
            this.closeAllModals()
        }
    }
}
</script>
