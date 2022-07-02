<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="addFormulaModal">
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
                        {{ t('Add subscription') }}
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
                                    >
                                    <v-error :name="'name'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="validity" v-translate>Validity</label>
                                    <select
                                        name="validity"
                                        id="validity"
                                        v-validate="'required'"
                                        v-model="ghost.validity"
                                        class="form-control form-control-lg"
                                        required
                                    >
                                    <option value="">{{ t('Select validity') }}</option>
                                    <option
                                        v-for="v in validities"
                                        :key="v.id"
                                        :value="v.label"
                                    >
                                        {{ t(v.label) }}
                                    </option>
                                    </select>
                                    <v-error :name="'validity'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="max_users" v-translate>Max users</label>
                                    <input type="number"
                                        name="max_users"
                                        v-model="ghost.max_users"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('Max users')"
                                        :placeholder="t('Max users')"
                                    >
                                    <v-error :name="'max_users'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="max_size" v-translate>Max size</label>
                                    <input type="number"
                                        name="max_size"
                                        v-model="ghost.max_size"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('Max size')"
                                        :placeholder="t('Max size')"
                                    >
                                    <v-error :name="'max_size'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="max_queries" v-translate>Max queries</label>
                                    <input type="number"
                                        name="max_queries"
                                        v-model="ghost.max_queries"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('Max queries')"
                                        :placeholder="t('Max queries')"
                                    >
                                    <v-error :name="'max_queries'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="price" v-translate>{{ t('Price') }} (€)</label>
                                    <input type="number"
                                        name="price"
                                        v-model="ghost.price"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        :data-vv-as="t('Price')"
                                        :placeholder="t('Price')"
                                    >
                                    <v-error :name="'price'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="description" v-translate>Description</label>
                                    <textarea
                                        name="description"
                                        v-model="ghost.description"
                                        rows="4" cols="40"
                                        class="form-control form-control-lg"
                                        v-validate="'required'"
                                        ref="description"
                                        :placeholder="t('Description')"
                                    >
                                    </textarea>
                                    <v-error :name="'description'" :err="errors" :show="showErrors"></v-error>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div class="mt-20">
                        <button class="btn-secondary btn mr-20" @click.prevent="create()">
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
export default {
    props: {
        validities: {
            type: Array,
            default: () => []
        }
    },

    mounted () {
        window.eventBus.$on('addF', (result) => {
            if (result=== "add-F") {
                this.resetGhost()
                this.showErrors = false
            }
        })
    },

    methods: {
        async create () {
            this.showErrors = true
            const isValid = await this.$validator.validate()
            if (!isValid) return false

            this.startLoading()
            const response = await this.$api.post('api/admin/formula/store', this.ghost)
                .catch(error => {
                    console.log('Error', error.response.data.errors)
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.resetGhost()
                    this.$store.dispatch('subscriptions/getSubscriptions')
                    this.showErrors = false
                    this.closeAllModals()
                    this.$swal.success(this.$translate.text('Subscription created successfully !'))
                }
            this.stopLoading()
        },

        resetGhost () {
            this.ghost = {
                name: '',
                validity: '',
                max_size: 0,
                price: 0,
                max_users: 0,
                max_queries: 0,
                description: ''
            }
        }
    }
}
</script>
