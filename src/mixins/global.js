export default {
    data: () => ({
        ghost: {},
        intervalIndex: null,
        isLoading: false,
        isOffline: false,
        showErrors: true,
        breadcrumb: [],
        keywords: ''
    }),

    created () {
        this.$on('online', () => { this.isOffline = false })
        this.$on('offline', () => { this.isOffline = true })
        this.makeBreadcrumb()
    },

    methods: {
        async validateForm () {
            const isValid = await this.$validator.validate()

            if (!isValid) {
                const firstError = this.$validator.errors.items[0].msg

                if (firstError) {
                    this.$swal.error(firstError)
                }

                return false
            }

            return true
        },

        startLoading () {
            this.isLoading = true
        },

        stopLoading () {
            this.isLoading = false
        },

        initBreadcrumb () {
            this.breadcrumb = []
        },

        closeAllModals () {
            window.$('.modal').modal('hide')
        },

        closeModal (id) {
            if (!id) {
                return this.closeAllModals()
            }
            window.$('#' + id).modal('hide')
        },

        openModal (params) {
            setTimeout(() => {
                window.$('#' + params.id).modal('show')
            }, params.timeout ? params.timeout : 100)
        },

        /*
        ** Object params { name, params }
        ** navigate est plus fexible parce qon peut y passer plusieurs parametres
        */
        navigate (params) {
            this.$router.push(params)
        },

        /*
        * Navigate to route by name
        *
        * @params String name
        * @return void
        */
        n (name) {
            this.$router.push({ name }) // equivaut a { name: name}
        },

        /*
        * Navigate to route by name
        *
        * @params String name
        * @return void
        */
        r (name) {
            this.$router.replace({ name }) // equivaut a { name: name}
        },

        /**
         * Navigate one step back
         *
         * @return void
         */
        goBack () {
            this.$router.go(-1)
        },

        /**
         * Navigate one step in front
         *
         * @return void
         */
        goForward () {
            this.$router.go(1)
        },

        /**
         * Make view breadcrumb
         *
         * @return void
         */
        makeBreadcrumb () {
            this.breadcrumb = []
        },

        /**
         * Enlever tous les caractères sauf
         * les lettres minuscules et les chiffres
         *
         * @return void
         */
        regexp (text) {
            return text.replace(new RegExp("[^(a-z0-9)]", "g"), '')
        },

        precise (nb) {
            let num = Number.parseFloat(nb)
            let size = ''
            if (num >= 1000) {
                let d = num/1000
                size = d.toFixed(2) + ' GB'
            } else { size = num.toFixed(2) + ' MB' }

            return size
        },

        sans_tirets (string) {
            return string.split('-').join('');
        },

        /*Remove duplicates Items in Array*/
        removeDuplicates (data) {
            return data.filter((value, index) => data.indexOf(value) === index)
        },

        addTokenBeforeOpen (url, token) {
            let request = new XMLHttpRequest()

            request.open('GET', url)
            request.setRequestHeader('Authorization', 'Token ' + token)
        },

        displayLanguage (lang) {
            let str = ''
            if (lang == 'fr') {
                str = 'French'
            } else if (lang == 'en') {
                str = 'English'
            } else if (lang == 'de') {
                str = 'Germany'
            } else if (lang == 'es') {
                str = 'Spanish'
            } else if (lang == 'pt') {
                str = 'Portuguese'
            }

            return str
        },

        makeLang (lang) {
            let str = ''
            if (lang == 'fr') {
                str = 'fr-FR'
            } else if (lang == 'en') {
                str = 'en-EN'
            } else if (lang == 'de') {
                str = 'de-DE'
            } else if (lang == 'es') {
                str = 'es-ES'
            } else {
                str = 'pt-PT'
            }

            return str
        }
    }
}
