<template lang="html">
    <div class="form_modal modal" id="showTextModal">
        <div class="modal-mask" @click="close()">
            <div class="modal-container" @click.stop>
                <div class="modal-header">
                    <h3>{{ data.name }}</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="">
                                {{ data.value }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-grey" @click="close()">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        data: {
            type: Object,
            default: () => {}
        },
    },

    methods: {
      close () {
          this.$emit('close');
      },
    }
}
</script>
