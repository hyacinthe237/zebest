<template lang="html">
    <div class="">
        <section class="_header" v-show="!isLoading">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="search-container">
                            <form @submit.prevent="search()" class="_form">
                                <div class="form-group form-group-lg">
                                    <div class="inner-addon left-addon">
                                        <i class="glyphicon feather icon-search"></i>

                                        <input type="text"
                                            name="keywords"
                                            :placeholder="t('Search subscription')"
                                            autocomplete="off"
                                            class="form-control form-control-lg"
                                            v-model="ghost.keywords"
                                        >
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="buttons text-right">
                            <button @click.prevent="add()" class="btn btn-primary mr-3">
                                <i class="feather icon-plus"></i> {{ t('Subscription') }}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <section class="dashboard">
            <div class="container-fluid">
                <div class="row" v-show="!isLoading">
                    <div class="col-sm-4" v-for="sub in filtered" :key="sub.uuid">
                        <div class="card card-pricing mb-4">
                            <span :class="`h6 w-60 mx-auto px-4 py-1 rounded-bottom ${sub.class} text-white shadow-sm`">{{ t(sub.name) }}</span>
                            <div class="bg-transparent card-header pt-4 border-0">
                                <h1
                                    class="h1 font-weight-normal text-secondary text-center mb-0"
                                    data-pricing-value="15">€<span class="price">{{ t(sub.price) }}</span></h1>
                            </div>
                            <div class="card-body pt-0">
                                <ul class="list-unstyled">
                                    <li><i class="feather icon-clock"></i> {{ t(sub.validity) }}</li>
                                    <li><i class="feather icon-users"></i> {{ sub.max_users }} {{ t('Max users') }}</li>
                                    <li><i class="feather icon-hard-drive"></i> {{ sub.max_size }} {{ t('Max size') }}</li>
                                    <li><i class="feather icon-activity"></i> {{ sub.max_queries }} {{ t('Max queries') }}</li>
                                </ul>

                                <div class="_more">
                                    <div class="text-left">
                                        Description<!--  <i class="feather icon-chevron-down" :id="'chevron-down-' + sub.uuid"></i>
                                                    <i class="feather icon-chevron-up" :id="'chevron-up-' + sub.uuid"></i> -->
                                    </div>
                                    <div class="_subdescription mt-10" :id="'description' + sub.uuid">
                                        <p v-html="sub.description"></p>

                                        <div class="buttons text-center mb-20">
                                            <button @click.prevent="edit(sub)" class="btn btn-secondary mr-3">
                                                <i class="feather icon-edit-2"></i>
                                            </button>

                                            <button @click.prevent="confirm(sub)" class="btn btn-danger">
                                                <i class="feather icon-trash-2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-show="isLoading" class="mt-40 pb-40 text-center">
                    <izy-hollow-loading loading />
                </div>
            </div>
        </section>

        <addFormula :validities="validities"></addFormula>
        <editFormula :validities="validities" :formula="selected"></editFormula>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import addFormula from './modals/add'
import editFormula from './modals/edit'

export default {
    data: () => ({
        selected: {},
        filtered: [],
        validities: [],
    }),

    components: { addFormula, editFormula },

    mounted () {
        this.initValidities()
        this.resetFiltered()
        this.getSubscriptions()
    },

    computed: {
        subscriptions () {
            let tab = this.$store.state.subscriptions.subscriptions
            for (var i = 0; i < tab.length; i++) {
                if (tab[i].validity == 'Month') {
                    tab[i].class = 'bg-month'
                }

                if (tab[i].validity == 'Quarter') {
                    tab[i].class = 'bg-quarter'
                }

                if (tab[i].validity == 'Semester') {
                    tab[i].class = 'bg-semester'
                }

                if (tab[i].validity == 'Annual') {
                    tab[i].class = 'bg-annual'
                }

                if (tab[i].validity == 'Unlimited') {
                    tab[i].class = 'bg-unlimited'
                }
            }

            return tab || []
        }
    },

    watch: {
        'ghost.keywords' (val) {
            if (val) {
                this.filtered = this.subscriptions.filter(f => {
                    return f.name.toLowerCase().includes(val.toLowerCase())
                })
            } else {
                this.resetFiltered()
            }
        },

        subscriptions () {
            this.resetFiltered()
        }

    },

    methods: {
        makeBreadcrumb () {
            this.breadcrumb = [
                { name: 'Home', route: 'home' },
                { name: 'Subscriptions', route: 'subscriptions' },
            ]
        },

        initValidities () {
            this.validities = [
                { id: 1, label: 'Month' },
                { id: 2, label: 'Quarter' },
                { id: 3, label: 'Semester'},
                { id: 4, label: 'Annual' },
                { id: 5, label: 'Unlimited' },
            ]
        },

        edit (sub) {
            this.selected = sub
            window.eventBus.$emit('editF', sub)
            setTimeout(() => {
                window.$('#editFormulaModal').modal('show')
            }, 100)
        },

        resetFiltered () {
            if (this.subscriptions) {
                this.filtered = this.subscriptions.slice()
            }
        },

        async getSubscriptions () {
            this.startLoading()

            const response = await this.$api.get(`api/admin/formula/list`)
                .catch(error => {
                    console.log(error.response.data.errors)
                    this.$swal.error(this.$translate.text('Error'), error.response.data.errors)
                })

                if (response) {
                    this.$store.commit('subscriptions/SET_SUBSCRIPTIONS', response.data)
                }
            this.stopLoading()
        },

        add () {
            window.eventBus.$emit('addF', "add-F")

            setTimeout(() => {
                window.$('#addFormulaModal').modal('show')
            }, 100)
        },

        confirm (item) {
            Swal.fire({
                title: this.$translate.text('Are you sure ?'),
                text: this.$translate.text("You won't be able to revert this!"),
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: this.$translate.text('Cancel'),
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: this.$translate.text('Yes, delete it!')
            }).then((result) => {
                if (result.value) {
                    this.deleteItem(item)
                } else {
                    this.closeAllModals()
                }
            })
        },

        async deleteItem (item) {
            this.startLoading()
            let formula_uuid = item.uuid.replace('-', '')

            const response = await this.$api.delete(`api/admin/formula/${formula_uuid}/delete`)
                .catch(error => {
                    this.$swal.error(this.$translate.text('Error'), this.$translate.text(error.response.data.errors))
                })

                if (response) {
                    this.$store.dispatch('subscriptions/getSubscriptions')
                    this.$swal.success(this.$translate.text('Subscription deleted successfully !'))
                }

            this.stopLoading()
        },

    }
}
</script>
