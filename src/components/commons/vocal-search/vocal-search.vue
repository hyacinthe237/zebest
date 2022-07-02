<template lang="html">
    <div class="_vocal-modal modal" id="VocalSearchModal">
        <div class="_vocal-dialog" role="document">
            <div class="_vocal-content">
                <div class="close" @click="endSpeechRecognition()">
                    <i class="feather icon-x"></i>
                </div>

                <div class="body">
                    <div class="message" v-if="error">
                        {{ error }}
                    </div>
                    <div class="message line" v-else>
                        <span v-if="sentences.length > 0" :key="sentence" v-for="sentence in sentences">{{sentence}}. </span>
                        <span>{{ runtimeTranscription }}</span>
                    </div>

                    <div
                        class="icon mt-20"
                        @click="endSpeechRecognition()"
                    >
                        <span class="feather icon-mic"></span>
                    </div>

                    <div class="buttons text-center">
                        <button
                            @click.prevent="endSpeechRecognition()"
                            class="btn btn-grey mt-20"
                        >
                            <i class="feather icon-search"></i> {{ t('Search') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const SPEECH_RECOGNITION = window.webkitSpeechRecognition
const RECOGNITION = SPEECH_RECOGNITION ? new SPEECH_RECOGNITION() : false

export default {
    name: 'VocalSearchModal',

    props: {
        lang: {
            type: String,
            default: 'fr-FR'
        },
        text: {
            type: [String, null],
            required: true
        }
    },

    data: () => ({
        error: false,
        speaking: true,
        toggle: true,
        runtimeTranscription: '',
        sentences: []
    }),

    mounted () {
        window.eventBus.$on('vocal', (result) => {
            if (result == 'search') {
                setTimeout(this.startSpeechRecognition(), 0)
            }
        })
    },

    methods: {
        checkCompatibility () {
            if (!RECOGNITION) {
                this.runtimeTranscription = 'La recherche vocale n\'est pas disponible sur ce navigateur.'
            }
        },

        endSpeechRecognition () {
            RECOGNITION.stop()
            this.toggle = false
            this.$emit('speechend', {
                sentences: this.sentences,
                text: this.sentences.join(' ')
            })
            setTimeout(this.closeModal(), 0)
        },

        startSpeechRecognition () {
            if (!RECOGNITION) {
                this.runtimeTranscription = 'La recherche vocale n\'est pas disponible sur ce navigateur.'
                return false
            }
            this.toggle = true
            RECOGNITION.lang = this.lang
            RECOGNITION.interimResults = true

            RECOGNITION.addEventListener('speechstart', () => {
                this.speaking = true
            })

            RECOGNITION.addEventListener('speechend', () => {
                this.speaking = false
            })

            RECOGNITION.addEventListener('result', () => {
                const text = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('')
                this.runtimeTranscription = text
            })

            RECOGNITION.addEventListener('end', () => {
                if (this.runtimeTranscription !== '') {
                    this.sentences.push(this.capitalizeFirstLetter(this.runtimeTranscription))
                    this.$emit('update:text', `${this.text}${this.sentences.slice(-1)[0]}. `)
                }
                this.runtimeTranscription = ''
                RECOGNITION.stop()
                if (this.toggle) {
                    // keep it going.
                    RECOGNITION.start()
                }
            })

            RECOGNITION.start()
        },

        capitalizeFirstLetter (string) {
            return string.charAt(0).toUpperCase() + string.slice(1)
        },

        closeModal () {
            this.sentences = []
            this.toggle = false
            this.speaking = false
            RECOGNITION.removeEventListener('speechstart', () => {})
            RECOGNITION.removeEventListener('speechend', () => {})
            RECOGNITION.removeEventListener('result', () => {})
            RECOGNITION.removeEventListener('end', () => {})
            window.$('#VocalSearchModal').modal('hide')
        }
    },
}
</script>
