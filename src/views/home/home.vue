<template lang="html">
    <div class="">
      <section class="_header padding">
          <div class="block bg" id="sticky">
              <div class="logo pointer" @click="go('home')">zebest</div>
              <div class="buttons">
                <button
                    @click="go('signin')"
                    class="btn btn-default br-100 mr-10"
                    :disabled="isLoading"
                >{{ t('Se connecter') }}</button>

                <button
                    @click="go('signup')"
                    class="btn btn-primary br-100"
                    :disabled="isLoading"
                >{{ t('Inscription') }}</button>
              </div>
          </div>
      </section>
      <section class="home">
        <div class="block mt-60">
          <h1>recevez le soutien de vos fans.</h1>

          <p class="mt-20">
            Acceptez des donations de vos fans directement sur vos comptes Orange Money, Mobile Money, Free Money et bien plus.
          </p>

          <form class="_form mt-20" @submit.prevent>
             <div class="form-group mt-20">
                 <div class="content bs pl-100">
                     <div class="dark">zebest.com/</div>
                     <input type="url"
                         name="url"
                         placeholder="tonnomdecreateur"
                         class="form-control form-control-lg dark no-white"
                         v-model="ghost.url"
                         v-validate="'required|min:6'"
                     >
                     <button class="btn btn-url btn-primary br-100">Créer ma page</button>
                 </div>
                 <span class="has-error">{{ errors.first('url') }}</span>
                 <div class="text-center button mt-20">
                    <button class="btn btn-block btn-primary br-100">Créer ma page</button>
                 </div>
             </div>
           </form>
        </div>
      </section>
      <section class="home bg-primary mt-20">
      <div class="block">
          <h1>pour les créateurs de contenu en Afrique</h1>

          <p class="mt-20">
            Zebest c'est la façon la plus simple pour les createurs de contenu en Afrique de recevoir des donations de leurs fans.
            En quelques clics, vous recevez le paiement de vos fans sur vos comptes mobile préférés.
          </p>

          <div class="social-icons">
              <ul>
                  <li><a class="pointer" href="#" target="_blank"><i class="feather icon-facebook"></i></a></li>
                  <li><a class="pointer" href="#" target="_blank"><i class="feather icon-twitter"></i></a></li>
                  <li><a class="pointer" href="#" target="_blank"><i class="feather icon-instagram"></i></a></li>
                  <li><a class="pointer" href="#" target="_blank"><i class="feather icon-linkedin"></i></a></li>
                  <li><a class="pointer" href="mailto:infos@zebest.com"><i class="feather icon-mail"></i></a></li>
              </ul>
          </div>
      </div>

      </section>

      <div class="footer pointer">
          <div class="left">
            <div class="item">A propos</div>
            <div class="item">Aide</div>
            <div class="item">Resources</div>
          </div>
          <div class="right">
            <div class="item">©ZeBest</div>
          </div>
      </div>
    </div>
</template>

<script>
// import _ from 'lodash'
// import AuthService from '@/services/auth'
// import { mapGetters } from 'vuex'
import fondFooter from '@/assets/images/fond.png'

export default {
    name: 'Home',

    data: () => ({
        payload: {},
        fondFooter
    }),

    computed: {
    },

    watch: {},

    mounted () {},

    methods: {}
}
</script>
