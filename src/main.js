window._ = require('lodash')
window.moment = require('moment')
window.$ = window.jQuery = require('jquery')
window.PDFViewer = require('pdfjs')
window.FS = require('fs')
window.FileSaver = require('file-saver')

import 'bootstrap'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import vueAutosize from 'vue-autosize'
import VueTranslate from 'vue-translate-plugin'
import VueOffline from 'vue-offline'
import VuePageTransition from 'vue-page-transition'
import vue2Dropzone from 'vue2-dropzone'

import datePicker from 'vue-bootstrap-datetimepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';


import App from './App.vue'
import router from './routes/'
import store from './store/'
import api from '@/plugins/api'
import auth from '@/plugins/auth'
import swal from '@/plugins/swal'
import config from '@/plugins/config'
import toastr from '@/plugins/toastr'
import { french } from '@/assets/i18n'

import Spinners from '@/components/commons/loaders/spinners'
import OfflineFooter from '@/components/commons/footer/offline'
import Breadcrumb from '@/components/commons/breadcrumb/breadcrumb'
import VErrorComponent from '@/components/commons/error/v-error'
import IzyPaginate from '@/components/commons/izy-paginate/izy-paginate'
import IzyBack from '@/components/commons/izy-back/izy-back'

// eslint-disable-next-line
import globalMixins from '@/mixins/global'
import messagesFr from 'vee-validate/dist/locale/fr.js'

global.$ = $
window.eventBus = new Vue()

require('./filters')
require('./components/ui')

Vue.use(api)
Vue.use(auth)
Vue.use(swal)
Vue.use(config)
Vue.use(toastr)
Vue.use(datePicker)
Vue.use(VueOffline)
Vue.use(vueAutosize)
Vue.use(VueTranslate)
Vue.locales({ french })
Vue.mixin(globalMixins)
Vue.use(VuePageTransition)
Vue.use(VeeValidate, { locale: 'fr', dictionary: { fr: messagesFr } })

Vue.config.productionTip = false
Vue.component('OfflineFooter', OfflineFooter)
Vue.component('v-error', VErrorComponent)
Vue.component('izyPaginate', IzyPaginate)
Vue.component('Breadcrumb', Breadcrumb)
Vue.component('Spinners', Spinners)
Vue.component('izyBack', IzyBack)
Vue.component('vue-dropzone', vue2Dropzone)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
