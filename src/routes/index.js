import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/home'
import UserProfile from '@/views/users/profile'
import ChoixDevise from '@/views/users/choix-devise'
import ListeDonateurs from '@/views/users/liste-donateurs'

import Guard from '@/services/middleware'
import AuthSignin from '@/views/auth/signin'
import Signup from '@/views/auth/signup'
import AuthPasswordForgot from '@/views/auth/password-forgot'

Vue.use(Router)

export default new Router({
    mode: 'history',

    routes: [
        { path: '/', name: 'home', component: Home, beforeEnter: Guard.guest },
        { path: '/signin', name: 'signin', component: AuthSignin, beforeEnter: Guard.guest  },
        { path: '/signup', name: 'signup', component: Signup, beforeEnter: Guard.guest  },
        { path: '/profile', name: 'profile', component: UserProfile, beforeEnter: Guard.guest  },
        { path: '/choix/devise', name: 'choix-devise', component: ChoixDevise, beforeEnter: Guard.guest  },
        { path: '/liste/donateurs', name: 'liste-donateurs', component: ListeDonateurs, beforeEnter: Guard.guest  },
        { path: '/password-forgot', name: 'password-forgot', component: AuthPasswordForgot, beforeEnter: Guard.guest  },
    ]
})
