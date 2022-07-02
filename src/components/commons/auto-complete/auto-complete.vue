<template lang="html">
    <div>
        <form class="_form mt-20" @submit.prevent="search()" v-show="!isLoading">
            <div class="search-input">
                <div class="inner-addon left-addon">
                    <span class="input-group-btn">
                        <i class="feather icon-search"></i>
                    </span>
                    <input
                        type="text"
                        id="query"
                        name="query"
                        v-model="ghost.query"
                        class="search-query form-control form-control-lg round"
                        :placeholder="t('Search')" />
                </div>
            </div>
        </form>
        <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
        </div>
        <div class="buttons text-center mt-40">
            <button class="btn btn-primary" :disabled="isLoading" @click="search()">{{ t('Search') }}</button>
        </div>
    </div>

</template>

<script>
export default {
    name: 'AutoComplete',

    data: () => ({
        ghost: {
            query: '',
            folder: []
        },
        focused: false,
        selected: {},
    }),

    props: {
        value: { type: String, required: false},
        // data:  { type: Array, required: true},
        field: { type: String, required: true},
        auth: {
            type: Object,
            default: () => {}
        }
    },

    created() {
        this.query = this.value || ''
    },

    updated() {
        this.$emit('query', this.query)
    },

    computed: {
        filter () {
            return this.selected[this.field].toLowerCase().indexOf(this.query.toLowerCase()) != -1
        },

        queries () {
            return this.$store.state.filters.queries.length
        },

        orgs () {
            return this.$store.state.organizations.organizations.length
        },

        users () {
            return this.$store.state.users.users.length
        },

        isAdmin () {
            return JSON.parse(localStorage.getItem('user')).account.role.id == 2
        },

        nb_folders () {
            let root = this.$store.state.organizations.root
            if (!root.folders){
                return 0
            }

            var nb = 0
            let conct_tab = root.folders.concat(root)

            for (var i = 0; i < conct_tab.length; i++) {
                if (conct_tab[i].nb_folders != undefined) {
                    nb += conct_tab[i].nb_folders
                }
            }

            return nb
        },

        nb_files () {
            let root = this.$store.state.organizations.root
            if (!root.folders){
                return 0
            }

            let nb = 0
            let conct_tab = root.folders.concat(root)

            for (var i = 0; i < conct_tab.length; i++) {
                if (conct_tab[i].nb_files != undefined) {
                    nb += conct_tab[i].nb_files
                }
            }

            return nb
        }
    },

    methods: {
        complete (i) {
            if (i == undefined) {
                for (let row of this.data) {
                    if (this.filter) {
                        this.select(row)
                        return
                    }
                }
            }

            this.select(this.data[i])
        },

        select (row) {
            this.query = row[this.field]
            this.selected = row
        },

        focus (f) {
            this.focused = f
        },

        /**
         * Apply Search
         *
         * @return {void} [description]
         */
        async search () {
            this.startLoading()

            if (this.isAdmin) {
                this.ghost.folder = [localStorage.getItem('organisation')]
            }

            if (this.ghost.query != '') {
                this.$store.dispatch('filters/getFilteredPages', this.ghost)
                this.$store.commit('filters/SET_QUERY', this.ghost.query)
                this.$router.push({ name: 'advanced-search' })

                this.stopLoading()
            } else {
                this.stopLoading()
                this.$swal.error(this.$translate.text('Empty Query'), this.$translate.text('Please fill the query !'))
            }
        },
    }
}
</script>
