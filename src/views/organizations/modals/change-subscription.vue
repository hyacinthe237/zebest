<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" :id="'changeFormulaModal'">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey" @click="closeAllModals()" v-show="!isLoading">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div v-show="isLoading" class="mt-40 pb-40 text-center">
                        <izy-hollow-loading loading />
                    </div>
                    <div class="secondary fs-20" v-show="!isLoading">
                        {{ t('Change subscription') }}
                    </div>

                    <form @submit.prevent class="_form mt-20" v-show="!isLoading">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="formula" v-translate>Select formula</label>
                                    <select
                                        class="form-control form-control-lg"
                                        name="formula"
                                        v-model="ghost.uuid"
                                        v-validate="'required'"
                                    >
                                        <option
                                            v-for="f in formules"
                                            :key="f.uuid"
                                            :value="f.uuid"
                                        >{{ t(f.name) }}</option>
                                    </select>
                                    <v-error :name="'formula'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div class="mt-20" v-show="!isLoading">
                        <button class="btn-secondary btn mr-20" @click.prevent="save()">
                            <i class="feather icon-save mr-10"></i>
                            {{ t('Save') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    props: {
        formules: {
            type: Array,
            default: () => []
        },
    },

    mounted () {
        window.eventBus.$on('changeFormula', (result) => {
            if (!_.isEmpty(result)) {
                let formule = this.formules.filter(f => f.uuid == result.formula.uuid)[0]
                this.ghost =  Object.assign({}, formule)
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
            let formData = new FormData()
            formData.append('formula', this.ghost.uuid)

            let orgUUID = localStorage.getItem('orgUUID')
            const response = await this.$api.post(`api/organisation/subscriptions/${orgUUID}/change`, formData)
                .catch(error => {
                    this.stopLoading()
                    console.log('Error', error.response.data.errors)
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.stopLoading()
                    this.showErrors = false
                    this.$store.dispatch('subscriptions/getOrgSubscription', orgUUID)
                    this.$swal.success(this.$translate.text('Subscription updated successfully !'))
                    this.closeAllModals()
                }
        },
    }
}
</script>
