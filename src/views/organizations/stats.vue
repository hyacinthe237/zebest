<template lang="html">
    <div class="">
        <section class="_header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="title">
                            {{ t('Dashboard') }}
                            <i class="feather icon-layers"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard">
            <div class="container-fluid">
                <div class="cards">
                    <div class="row">
                        <div class="col-sm-4" v-for="f in stats" :key="f.id">
                            <div class="card _stats elevated">
                                <a href="#"
                                    data-toggle="collapse"
                                    :data-target="'#collapse-' + f.id" aria-expanded="true">
                                    <div class="icon">
                                        <img :src="pdf" alt="" v-show="f.name.endsWith('.pdf' || '.PDF')">
                                        <img :src="pptx" alt="" v-show="f.extension.endsWith('.pptx' || '.ppt')">
                                        <img :src="html" alt="" v-show="f.extension.endsWith('.html' || '.xhtml' || '.htm')">
                                        <img :src="png" alt="" v-show="f.name.endsWith('.png')">
                                        <img :src="jpeg" alt="" v-show="f.name.endsWith('.jpg' || '.jpeg')">
                                        <img :src="xlsx" alt="" v-show="f.name.endsWith('.xlsx')">
                                        <img :src="excel" alt="" v-show="f.name.endsWith('.excel')">
                                        <img :src="docx" alt="" v-show="f.name.endsWith('.docx' || '.doc' || '.docm')">
                                        <img :src="zip" alt="" v-show="f.name.endsWith('.zip' || '.rar')">
                                    </div>
                                    <div class="_name">
                                        <span class="title">{{ f.name }}</span>
                                        <div class="counter" v-translate>{{ f.nb }} Fichiers</div>
                                    </div>
                                    <i class="feather icon-chevron-down text-right"></i>
                                </a>
                            	<div class="collapse" :id="'collapse-' + f.id">
                            		<div class="card-body">

                            		</div>
                            	</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import dashboardMixins from './mixins'

export default {
    mixins: [dashboardMixins],

    data: () => ({
        stats: []
    }),

    mounted () {
        this.initStats()
    },

    methods: {
        initStats () {
            this.stats = [
                { id: 1, name: 'le_monde.pdf', extension: '.pdf', nb: 5 },
                { id: 2, name: '45_SECONDES.docx', extension: '.docx', nb: 5 },
                { id: 3, name: 'une_belle.png', extension: '.png', nb: 5 },
                { id: 4, name: 'ma_presentation.pptx', extension: '.pptx', nb: 5 },
                { id: 5, name: 'mon_premier.html', extension: '.html', nb: 5 },
                { id: 7, name: 'catalogue.xlsx', extension: '.xlsx', nb: 5 },
                { id: 8, name: 'etat_caisse.excel', extension: '.excel', nb: 5 },
                { id: 9, name: 'fichier.zip', extension: '.zip', nb: 5 },
                { id: 10, name: 'un_tour.zip', extension: '.zip', nb: 5 },
            ]
        },
    }
}
</script>
