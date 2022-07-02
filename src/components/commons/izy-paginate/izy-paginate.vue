<template lang="html">
    <nav aria-label="Page navigation example" class="btn-paginate">
        <ul class="pagination">
            <li class="">
                <button
                    type="button"
                    class="page-link"
                    @click="previous()"
                    v-show="page>1"
                >
                   Previous
               </button>
            </li>

            <li class="page-item">
                <button
                    type="button"
                    class="page-link pages-btns"
                    @click="current()"
                >
                        {{ page }}
                </button>
            </li>

            <li class="">
                <button
                    type="button"
                    class="page-link"
                    @click="next()"
                    v-show="canClickedNext"
                >
                    Next
                </button>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: "izyPaginate",

    props: {
        canClickedNext: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        page: 1
    }),

    methods: {
        previous () {
            let page = this.page-1
            this.page = page < 1 ? 1 : page
            this.$emit('previousPage', this.page)
        },

        next () {
            if (this.canClickedNext) {
                this.page = this.page+1
                this.$emit('nextPage', this.page)
            }
        },

        current () {
            this.$emit('currentPage', this.page)
        },
    }
}
</script>
