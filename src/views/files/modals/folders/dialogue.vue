<template lang="html">
    <div class="form_modal modal" id="dialogModal">
        <div class="modal-mask" @click="close()">
            <div class="modal-container" @click.stop>
                <!-- <div class="modal-header">
                    <h3>{{ t('New Metadata') }}</h3>
                </div> -->
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-12">
                            Indexation en cours, contacter le super admin pour la stopper.
                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center">
                    <button class="btn btn-grey" @click="close()">
                        {{ t('Ok') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {

    methods: {
      close () {
          this.$emit('close')
      },
    }
}
</script>
