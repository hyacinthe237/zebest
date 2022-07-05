<template lang="html">
    <div class="">
      <section class="_header">
          <div class="logo pointer" @click="go('home')">zebest</div>
      </section>
      <section class="home">
        <div class="block">
          <h1>faire un don à "nom de créateur"</h1>

          <div class="list-ronds mt-20">
              <div class="rond-item">50 &euro;</div>
              <div class="rond-item">100 &euro;</div>
              <div class="rond-item">250 &euro;</div>
              <div class="rond-item">500 &euro;</div>
          </div>

          <div class="diviseur">
              <div class="l-gauche"></div>
              <div class="rond">Ou</div>
              <div class="l-droite"></div>
          </div>

          <form class="_form mt-20" @submit.prevent>
            <div class="form-group mt-20">
               <input type="number"
                   name="montant"
                   placeholder="Saisir le montant"
                   class="form-control form-control-lg input"
                   v-model="ghost.email"
                   v-validate="'required|min:6'"
               >
                 <span class="has-error">{{ errors.first('montant') }}</span>
            </div>

            <div class="form-group mt-20">
               <input type="text"
                   name="name"
                   placeholder="Votre nom (optionnel)"
                   class="form-control form-control-lg input"
                   v-model="ghost.name"
               >
                 <span class="has-error">{{ errors.first('name') }}</span>
            </div>

            <div class="form-group mt-20">
                 <textarea
                     name="nom"
                     placeholder="Bonjour, j'ai créé cette page pour ceux qui veulent me soutenir."
                     class="form-control textarea form-control-lg"
                     v-model="ghost.about" rows="5" cols="33"></textarea>
                 <span class="has-error">{{ errors.first('about') }}</span>
            </div>

             <div class="mt-10">
                 <button class="btn btn-block btn-primary br-100">
                     Ovations de 100 &euro;
                 </button>
             </div>
           </form>
        </div>

      </section>
    </div>
</template>

<script>
// import _ from 'lodash'
// import AuthService from '@/services/auth'
// import { mapGetters } from 'vuex'

export default {
    name: 'Home',

    data: () => ({
        payload: {}
    }),

    computed: {
    },

    watch: {},

    mounted () {},

    methods: {}
}
</script>
