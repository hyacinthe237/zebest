import axios from 'axios'
import config from './config'
import Swal from 'sweetalert2'
import AuthService from './auth'
// import StoreService from '../store'
import _ from 'lodash'

axios.defaults.baseURL = config.get('base_url')

if (localStorage.getItem(config.get('token')) !=  null){
    axios.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem(config.get('token'))
}
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8'

// Intercept all 401
axios.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response.status === 401) {
        setTimeout(AuthService.logout(), 0)

        // Save Last Action
        localStorage.setItem('last_action', window.location.href)
        if (!_.isEmpty(window.last_breadcrumb)) {
            localStorage.setItem('last_breadcrumb', window.last_breadcrumb)
        }
        if (!_.isEmpty(window.last_parent)) {
            localStorage.setItem('last_parent', window.last_parent)
        }
        if (!_.isEmpty(window.last_filecontent)) {
            localStorage.setItem('last_filecontent', window.last_filecontent)
        }
        if (!_.isEmpty(window.last_filecontentitem)) {
            localStorage.setItem('last_filecontentitem', window.last_filecontentitem)
        }

        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: error.response.data,
        })
    }
    return Promise.reject(error)
})

export default {
    get (url, params) {
        return axios.get(url, params)
    },

    post (url, payload) {
        return axios.post(url, payload)
    },

    postWithHeader (url, payload, headers) {
        return axios.post(url, payload, headers)
    },

    put (url, payload) {
        return axios.put(url, payload)
    },

    patch (url, payload) {
        return axios.patch(url, payload)
    },

    delete (url, params) {
        return axios.delete(url, params)
    },

    setToken (token) {
        axios.defaults.headers.common['Authorization'] = `Token ${token}`
    },

    clearToken () {
        axios.defaults.headers.common['Authorization'] = ''
    }
}
