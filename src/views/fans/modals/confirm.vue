<template lang="html">
    <div class="modal animated fadeIn upload" id="confirmDonModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <!-- Uninstalling -->
                <div class="_modal-content text-center">
                    <div class="_img">
                      <img :src="logoPlaceholder">
                    </div>

                    <h2 class="mt-20">faire un don à "nom de créateur"</h2>

                    <form class="_form mt-20" @submit.prevent>
                      <div class="form-group mt-20">
                         <input type="email"
                             name="email"
                             placeholder="Email"
                             class="form-control form-control-lg input"
                             v-model="ghost.email"
                             v-validate="'required|min:6'"
                         >
                           <span class="has-error">{{ errors.first('email') }}</span>
                      </div>

                      <div class="form-group mt-20">
                         <input type="number"
                             name="cardId"
                             placeholder="Numéro de carte bancaire"
                             class="form-control form-control-lg input"
                             v-model="ghost.cardId"
                         >
                           <span class="has-error">{{ errors.first('cardId') }}</span>
                      </div>

                      <div class="form-group mt-20">
                         <input type="text"
                             name="name"
                             placeholder="Nom du titulaire de la carte"
                             class="form-control form-control-lg input"
                             v-model="ghost.name"
                             v-validate="'required|min:6'"
                         >
                           <span class="has-error">{{ errors.first('name') }}</span>
                      </div>

                      <div class="row">
                        <div class="col-6">
                          <div class="form-group mt-20">
                             <input type="text"
                                 name="name"
                                 placeholder="MM/AA"
                                 class="form-control form-control-lg input"
                                 v-model="ghost.name"
                                 v-validate="'required|min:6'"
                             >
                               <span class="has-error">{{ errors.first('name') }}</span>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-group mt-20">
                             <input type="text"
                                 name="name"
                                 placeholder="CVC"
                                 class="form-control form-control-lg input"
                                 v-model="ghost.name"
                                 v-validate="'required|min:6'"
                             >
                               <span class="has-error">{{ errors.first('name') }}</span>
                          </div>
                        </div>
                      </div>

                       <div class="mt-10">
                           <button class="btn btn-block btn-primary br-100" @click="payer()">
                               Payer
                           </button>
                       </div>
                     </form>
                </div>
            </div>
        </div>
        <!-- <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
        </div> -->
    </div>
</template>

<script>
import logoTiktok from '@/assets/images/logo-tiktok.png'
import logoFete from '@/assets/images/fete.png'
import logoPlaceholder from '@/assets/images/placeholder.png'

export default {

    data: () => ({
      logoTiktok,
      logoFete,
      logoPlaceholder
    }),

    props: {},

    watch: {},

    methods: {

        payer () {
            window.$('#confirmDonModal').modal('hide')
            // this.go('faire-un-don')
        },
    }
}
</script>
