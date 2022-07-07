<template lang="html">
    <div class="">
      <section class="_header">
          <div class="logo pointer" @click="go('home')">zebest</div>
      </section>
      <section class="home">
        <div class="block">
          <h1>faire un don à "nom de créateur"</h1>

          <div class="list-ronds mt-20">
              <div :class="['rond-item', montant == 50 ? 'active' : '']" @click="selectMontant(50)">50 &euro;</div>
              <div :class="['rond-item', montant == 100 ? 'active' : '']" @click="selectMontant(100)">100 &euro;</div>
              <div :class="['rond-item', montant == 250 ? 'active' : '']" @click="selectMontant(250)">250 &euro;</div>
              <div :class="['rond-item', montant == 500 ? 'active' : '']" @click="selectMontant(500)">500 &euro;</div>
          </div>

          <div class="diviseur">
              <div class="divider"></div>
              <div class="rond">Ou</div>
              <div class="divider"></div>
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
                 <button class="btn btn-block btn-primary br-100" @click="confirm()">
                     Ovations de {{ montant }} &euro;
                 </button>
             </div>
           </form>
        </div>

        <!-- <confirmModal :nature="'paie'"></confirmModal> -->
      </section>
    </div>
</template>

<script>
// import confirmModal from '../users/modals/confirm'

export default {
    name: 'Home',

    data: () => ({
        payload: {},
        montant: 100,
        // nature: ''
    }),

    // components: { confirmModal },

    watch: {},

    mounted () {},

    methods: {
        selectMontant (montant) {
            this.montant = montant
        },

        confirm () {
            window.eventBus.$emit('open', 'confirm')
            window.$('#confirmModal').modal('show')
        }
    }
}
</script>
