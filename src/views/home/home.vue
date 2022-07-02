<template lang="html">
    <div class="">
      <section class="_header">
          <div class="logo">zebest</div>
          <div class="buttons">
            <button
                @click.prevent="subscribe()"
                class="btn btn-block btn-primary"
                :disabled="isLoading"
            >{{ t('Inscription') }}</button>
          </div>
      </section>
      <section class="home">
        <div class="block">
          <h1>recevez le soutien de vos fans.</h1>

          <p class="mt-20">
            Acceptez des donations de vos fans directement sur vos compte Orange Money, Mobile Money, Free Money et bien plus.
          </p>

          <form class="_form mt-20" @submit.prevent="signin()">
             <div class="input-group">
                 <!-- <div class="inner-addon left-addon"> -->
                 <div class="input-group-append">
                   <span class="input-group-text">zebest.com/</span>
                 </div>
                <input type="url"
                    name="url"
                    placeholder="tonnomdecreateur"
                    class="form-control form-control-lg"
                    v-model="ghost.url"
                    v-validate="'required|min:6'"
                >
                  <span class="has-error">{{ errors.first('url') }}</span>
                 <!-- </div> -->
             </div>

             <div class="mt-20">
                 <button class="btn btn-block btn-primary">
                     Créer ma page
                 </button>
             </div>
           </form>
        </div>

      <div class="mt-100"></div>

      <div class="block bg">
          <h1>pour les créateurs de contenu en Afrique</h1>

          <p class="mt-20">
            Zebest c'est la façon la plus simple pour les createurs de contenu en Afrique de recevoir des donations de leurs fans.
            En quelques clics, vous recevez le paiement de vos fans sur vos comptes mobile préférés.
          </p>
      </div>

      </section>

      <div class="footer pointer">
          <div class="ressources">Ressources</div>
          <div class="termes">Termes de confidentialité</div>
      </div>
    </div>
</template>

<script>
// import _ from 'lodash'
// import AuthService from '@/services/auth'
// import { mapGetters } from 'vuex'

export default {
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
