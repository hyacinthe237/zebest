import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/home'

import Guard from '@/services/middleware'
import AuthSignin from '@/views/auth/signin'
import AuthPasswordForgot from '@/views/auth/password-forgot'

Vue.use(Router)

export default new Router({
    mode: 'history',

    routes: [
        { path: '/', name: 'home', component: Home, beforeEnter: Guard.guest },
        { path: '/signin', name: 'signin', component: AuthSignin, beforeEnter: Guard.guest  },
        { path: '/password-forgot', name: 'password-forgot', component: AuthPasswordForgot, beforeEnter: Guard.guest  },
    ]
})
