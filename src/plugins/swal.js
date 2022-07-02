
import swal from 'sweetalert2'

var Swal = {}

Swal.install = function (Vue) {
    Vue.prototype.$swal = {
        success (title, msg) {
            return swal.fire({
                title,
                position: 'top-end',
                text: msg ? msg : '',
                type: 'success',
                showConfirmButton: false,
                timer: 2000
            })
        },

        error (title, msg) {
            return swal.fire({
                title,
                position: 'top-end',
                text: msg ? msg : '',
                type: 'error',
                showConfirmButton: false,
                timer: 15000
            })
        }
    }
}

export default Swal
