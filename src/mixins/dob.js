export default {
    data: () => ({
        years: [],
        months: [],
        days: []
    }),

    mounted () {
        this.makeDates()
    },

    methods: {
        makeDates () {
            this.makeYears()
            this.makeMonths()
            this.makeDays()
        },

        makeYears () {
            let current = new Date().getFullYear()
            for (current; current > 1900; current--) {
                this.years.push(current)
            }
        },

        makeMonths () {
            this.months = [
                { value: '01', label: 'January' },
                { value: '02', label: 'February' },
                { value: '03', label: 'March' },
                { value: '04', label: 'April' },
                { value: '05', label: 'May' },
                { value: '06', label: 'June' },
                { value: '07', label: 'July' },
                { value: '08', label: 'August' },
                { value: '09', label: 'September' },
                { value: '10', label: 'October' },
                { value: '11', label: 'November' },
                { value: '12', label: 'December' }
            ]
        },

        makeDays () {
            for (let i = 1; i < 32; i++) {
                if (i < 10) {
                    this.days.push('0' + i)
                } else {
                    this.days.push(i.toString())
                }
            }
        }
    }
}
