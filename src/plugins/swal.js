
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
                showConfirmButton: true,
                timer: 5000
            })
        },

        error (title, msg) {
            return swal.fire({
                title,
                position: 'top-end',
                text: msg ? msg : '',
                type: 'error',
                showConfirmButton: true,
                timer: 15000
            })
        }
    }
}

export default Swal
