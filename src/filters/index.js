import Vue from 'vue'
import moment from 'moment'

Vue.filter('currency', function (value) {
    if (typeof value === 'string') {
        value = parseInt(value)
    }
    value = value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    return '$' + value
})

Vue.filter('date', function (value, formatted) {
    if (value) {
        if (formatted) {
            return moment(String(value)).format(formatted)
        }
        return moment(String(value)).format('DD/MM/YYYY')
    }
})

Vue.filter('datetime', function (value, formatted) {
    if (value) {
        if (formatted) {
            return moment(String(value)).format(formatted)
        }
        return moment(String(value)).format('DD/MM/YYYY HH:mm')
    }
})

Vue.filter('duration', function (value) {
    if (value) {
        return moment(String(value)).fromNow()
    }
})

Vue.filter('time', function (value) {
    if (value) {
        return moment(String(value)).format('hh:mm')
    }
})

Vue.filter('amPm', function (value) {
    if (value) {
        let values = value.split(':')
        let hour = parseInt(values[0])
        let minutes = values[1]
        let finalHour = hour
        let amPm = 'AM'

        if (hour > 12) {
            finalHour = hour - 12
            amPm = 'PM'
        } else if (hour === 12) {
            amPm = 'PM'
        }

        return finalHour + ':' + minutes + ' ' + amPm
    }
})

Vue.filter('age', function (value) {
    if (value) {
        return moment().diff(String(value), 'years')
    }
})
