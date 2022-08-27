import _ from 'lodash'

export default {
    data: () => ({
        montant: 5,
        duration: '',
        endDate: '',
        interval: null,
        taux_retrait: 0.07,
        displayIcon: true,

        // les Tableaux
        devises: [],
        creators: [],
        social_links: [],

        // Les Objets
        creator: {},
        selected: {},
        donation: {},
        shost: {  name: '', link: '' },
        dhost: {  amount: '', receiver: '', sender_first_name: '', sender_last_name: '' },
        rhost: {  amount: 0 },
        host: {  currency: '', phone: '', balance: '' },
        phost: {  new_password1: '', new_password2: '' },
        chartData: { labels: [], datasets: [] },
    }),

    computed: {
        auth () { return JSON.parse(localStorage.getItem(this.$config.get('user'))) },
        is_creator () { return this.auth.is_creator },
        payment_link () { return this.auth.payment_link },
        donations () { return this.$store.state.donations },
        rates () { return this.$store.state.donations.rates },
        taux_xaf () { return this.rates.XAF - 5 },
        taux_usd () { return this.rates.USD },
        taux_gbp () { return this.rates.GBP },
        showModal () { return this.$store.state.showModal },
        showshareModal () { return this.$store.state.showshareModal },
        showBancaireModal () { return this.$store.state.showBancaireModal },
        title_name () { return this.$route.params.id },
        isConnected () { return !_.isEmpty(this.auth) },
        host_amount () { return !_.isEmpty(this.rhost.amount) ? this.rhost.amount : 0 },

        xaf_amount () {
          let m = Number.parseInt(this.host_amount, 10) * this.taux_xaf
          return Number.parseFloat(m).toFixed(2)
        },

        transfert_amount () {
            let m = Number.parseInt(this.host_amount, 10) * this.taux_retrait
            return Number.parseFloat(m).toFixed(2)
        },

        donation_amount () { return !_.isEmpty(this.dhost.amount) ? this.dhost.amount : this.montant },

        donation_transfert_amount () {
            let m = Number.parseInt(this.dhost.amount, 10) * this.taux_retrait
            return Number.parseFloat(m).toFixed(2)
        },

        donation_total_euro_amount () {
            let m = Number.parseInt(this.dhost.amount, 10)
            return Number.parseFloat(m).toFixed(2)
        },

        total_euro_amount () {
            let m = Number.parseInt(this.host_amount, 10)
            return Number.parseFloat(m).toFixed(2)
        },

        net_a_recevoir () {
            let m = +Number.parseInt(this.host_amount, 10)  * this.taux_xaf
            return Number.parseFloat(m).toFixed(2)
        },

        donation_xaf_total_euro_amount () {
            let m = this.donation_total_euro_amount * this.taux_xaf
            return Number.parseFloat(m).toFixed(2)
        },

        xaf_total_euro_amount () {
            let m = this.total_euro_amount * this.taux_xaf
            return Number.parseFloat(m).toFixed(2)
        },

        total_amount () {
            let m = +Number.parseInt(this.rhost.amount, 10) + +this.transfert_amount
            return Number.parseFloat(m).toFixed(2)
        },
    },

    mounted () {
        if (this.isConnected) {
            $('#nav-editer-tab').click()
            $('#nav-editer').addClass("active")
            $('#nav-editer-tab').focus()
            this.selectFile()
        }
        this.dhost = {  amount: this.montant, receiver: '', sender_first_name: '', sender_last_name: '' }
    },

    methods: {
        selectFile () {
            var fileSelect = document.getElementById("fileSelect")
            var fileElem = document.getElementById("fileElem")

            fileSelect.addEventListener("click", function (e) {
                if (fileElem) {
                    fileElem.click()
                }
                e.preventDefault()
            }, false)
        },
    }
}
