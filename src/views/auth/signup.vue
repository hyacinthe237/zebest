<template lang="html">
    <div class="">
      <section class="_header">
          <div class="logo pointer" @click="go('home')">zebest</div>
          <div class="buttons">
            <button
                @click="go('signin')"
                class="btn btn-block btn-primary br-100"
                :disabled="isLoading"
            >{{ t('Se connecter') }}</button>
          </div>
      </section>
      <section class="home">
        <div class="block">
          <h1>créer mon compte</h1>

          <form class="_form mt-20" @submit.prevent>
             <div class="form-group">
                <input type="email"
                    name="email"
                    placeholder="email"
                    class="form-control form-control-lg input"
                    v-model="ghost.email"
                    v-validate="'required|min:6'"
                >
                  <span class="has-error">{{ errors.first('email') }}</span>
             </div>

             <div class="form-group">
                <input type="password"
                    name="password"
                    placeholder="mot de passe"
                    class="form-control form-control-lg input"
                    v-model="ghost.password"
                    v-validate="'required|min:6'"
                >
                  <span class="has-error">{{ errors.first('password') }}</span>
             </div>

             <div class="form-group">
                 <div class="content">
                     <input type="url"
                         name="url"
                         placeholder="coller votre code de vérification"
                         class="form-control form-control-lg no-white"
                         v-model="ghost.url"
                         v-validate="'required|min:6'"
                     >
                     <a class="dark pointer bold">Renvoyer</a>
                 </div>
                 <span class="has-error">{{ errors.first('url') }}</span>
             </div>

             <div class="mt-20">
                 <button class="btn btn-block btn-primary br-100" @click="go('profile')">
                     Valider mon inscription
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
    name: 'SignUp',

    data: () => ({
        message: 'Merci de vérifier votre email. Un code de vérification vous a été envoyé.'
    }),

    computed: {
    },

    watch: {},

    mounted () {},

    methods: {}
}
</script>
