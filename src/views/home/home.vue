<template lang="html">
    <div class="">

      <VueScrollFixedNavbar>
        <section class="_header padding">
        <div class="block bg" id="navbar">
            <div class="logo pointer" @click="go('home')">zebest</div>
            <div class="buttons" v-if="!isConnected">
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
            <div class="buttons" v-else>
              <button
                  @click="logout()"
                  class="btn btn-default br-100 mr-10"
                  :disabled="isLoading"
              >{{ t('Se déconnecter') }}</button>

              <button
                  @click="go('profile')"
                  class="btn btn-primary br-100"
                  :disabled="isLoading"
              >{{ t('Mon compte') }}</button>
            </div>
        </div>
        </section>
      </VueScrollFixedNavbar>

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
                     <input type="text"
                         name="username"
                         placeholder="tonnomdecreateur"
                         class="form-control form-control-lg dark no-white"
                         v-model="ghost.username"
                         v-validate="'required|min:6'"
                     >
                     <button class="btn btn-url btn-primary br-100" @click="save()">Créer ma page</button>
                 </div>
                 <span class="has-error">{{ errors.first('username') }}</span>
                 <div class="text-center button mt-20">
                    <button class="btn btn-block btn-primary br-100" @click="save()">Créer ma page</button>
                 </div>
             </div>
           </form>
        </div>
      </section>
      <section class="home bg-primary mt-20">
      <div class="block">
          <h1>pour les créateurs de contenu en Afrique</h1>

          <p class="mt-20">
            Zebest c'est la façon la plus simple pour les créateurs de contenu en Afrique de recevoir des donations de leurs fans.
            En quelques clics, vous recevez le paiement de vos fans sur vos comptes mobile préférés.
          </p>

          <div class="social-icons mt-40">
              <ul>
                  <li><img :src="logOM" alt="logo orange money" /></li>
                  <li><img :src="mpesa" alt="logo mpesa" /></li>
                  <li><img :src="logMTN" alt="logo mtn mobile money" /></li>
                  <li><img :src="freemoney" alt="logo free money" /></li>
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
import _ from 'lodash'
// import AuthService from '@/services/auth'
// import { mapGetters } from 'vuex'
import fondFooter from '@/assets/images/fond.png'
import logOM from '@/assets/images/logo-om.png'
import logMTN from '@/assets/images/logo-mtn.png'
import mpesa from '@/assets/images/mpesa.jpg'
import freemoney from '@/assets/images/free_money.png'
import { VueScrollFixedNavbar } from "vue-scroll-fixed-navbar"

export default {
    name: 'Home',

    data: () => ({
        ghost: { username: '' },
        fondFooter,
        logOM,
        logMTN,
        mpesa,
        freemoney,
    }),

    components: { VueScrollFixedNavbar },

    computed: {
        username () { return localStorage.getItem('username') },
        user () { return JSON.parse(localStorage.getItem(this.$config.get('user'))) },
        isConnected () { return !_.isEmpty(this.user) },
    },

    mounted () {
        if (!_.isEmpty(this.username)) {
            localStorage.removeItem('username')
        }
    },

    methods: {
        save () {
            if (this.ghost.username !== '') {
                localStorage.setItem('username', this.ghost.username)
                this.go('signup')
            } else {
                this.$swal.error('Erreur de validation', 'Votre nom de créateur est vide. Saisissez le et validez à nouveau')
            }
        }
    }
}
</script>
