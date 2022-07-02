<template lang="html">
    <div class="_slide-content" v-if="pages.length > 0">
        <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
        </div>

        <VueSlickCarousel ref="carousel"
            :infinite="true"
            :swipe="true"
            :arrows="true"
            :speed=500
            :slidesToShow=2
            :slidesToScroll=1
            :initialSlide=initial_slide
            :adaptiveHeight="true"
            :dontAnimate="true"
        >
            <div class="slick-slides pointer" v-for="page in pages" :key="page.id">
                <div class="details" v-if="pages.length > 0" @click="openDetails(page)">
                    <div class="_page_head pointer">
                        <div class="doc_name pointer">
                            <p>{{ page.file_name }}</p>
                        </div>

                        <div class="parent_name pointer">
                            <span>In folder</span> {{ page.folder_name }}
                        </div>
                    </div>

                    <div class="_doc_body pointer">
                        <div class="bg-image">
                             <img :src="getChunkImage(page)" alt="" class="img-responsive">
                        </div>
                    </div>
                    <div class="_page_number pointer">
                        <span>{{ getIndex(page) }}</span>
                    </div>
                </div>

            </div>

        </VueSlickCarousel>
    </div>
    <div v-else>
        <div class="row">
            <p v-translate>No Results</p>
        </div>
    </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
    name: 'slick-slider',

    components: { VueSlickCarousel },

    computed: {
        pageFilters () {
            return this.$store.state.filters.pageFilters || []
        },

        pages () {
            return this.pageFilters.slice()
        },

        initial_slide () {
            return this.$store.state.filters.initial_slide
        },

        displayPages () {
            let tab = this.pages
            if (tab) {
                for (var i = 0; i < tab.length; i++) {
                    if (tab[i].html.includes('w0 ')) {
                        tab[i].html = tab[i].html.replace('w0 ', '')
                    }

                    // tab[i].html = tab[i].html.replace(' h0', '')
                }
            }

            return tab

        }
    },

    watch: {
        pages () {
            if (this.pages.length > 0) {
                this.goToSlide()
            }
        }
    },

    mounted () {
         if (this.pages.length > 0) {
             this.goToSlide()
         }
    },

    methods: {
        goBack () {
            this.$router.go()
       },

       getChunkImage(i){
           return `data:image/png;base64,${i.image}`
       },

       goToSlide () {
           this.$refs.carousel.goTo(0)
       },

        getIndex (i) {
            return (this.pages.findIndex(x => x.id === i.id) + 1) + ' / ' + this.pages.length
       },

        /**
         * Open PDF page
         *
         * @return {void}
         */
        async openDetails (i) {
            localStorage.setItem('current_page', i.ref)

            let route = this.$router.resolve({ name: 'display-file', params: { id: i.file } })
            window.open(route.href, '_blank')
       },
    }
}
</script>
