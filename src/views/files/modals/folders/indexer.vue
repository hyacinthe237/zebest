<template lang="html">
    <div class="_bottom-modal modal animated fadeIn upload" id="indexerModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-heading bottom">
                    <div class="_name">
                        {{ t('Folder Indexation') }}
                    </div>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div class="set-size charts-container">
                      <div :class="'pie-wrapper progress-' + taux">
                        <span class="label">{{ taux }}<span class="smaller">%</span></span>
                        <div class="pie">
                          <div class="left-side half-circle"></div>
                          <div class="right-side half-circle"></div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        taux () {
            let taux =  this.$store.state.folders.taux
            if (taux >= 98.99) {
                this.$store.dispatch('folders/setOperation', -1)
                this.closeAllModals()
                return taux
            }
            return taux
        }
    },

   watch: {
        taux: {
            immediate: true,
            handler: function (value) {
                if ((value > 0) || (value >= 98.99)) {
                    this.$emit('indexationEnd')
                }
            }
        }
    },
}
</script>
