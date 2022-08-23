import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/home'
import UserProfile from '@/views/users/profile'
import ChoixDevise from '@/views/users/choix-devise'
import MyPage from '@/views/dashboard/my-page'
import SuccessCheckout from '@/views/stripe/success'

import Guard from '@/services/middleware'
import AuthSignin from '@/views/auth/signin'
import Signup from '@/views/auth/signup'
import Verify from '@/views/auth/verify'
import AuthPasswordForgot from '@/views/auth/password-forgot'

Vue.use(Router)
/** Open rotues */
const guestRoutes = [
  { path: '/', name: 'home', component: Home },
  { path: '/auth/signin', name: 'signin', component: AuthSignin  },
  { path: '/auth/signup', name: 'signup', component: Signup  },
  { path: '/auth/verify', name: 'verify', component: Verify  },
  { path: '/:id', name: 'my-page', component: MyPage  },
  { path: '/success/checkout', name: 'success', component: SuccessCheckout  },
]

/** Protected routes */
const authRoutes = [
  { path: '/profile', name: 'profile', component: UserProfile  },
  { path: '/choix/devise', name: 'choix-devise', component: ChoixDevise  },
  { path: '/password-forgot', name: 'password-forgot', component: AuthPasswordForgot  },
]

authRoutes.forEach(r => {
    r.beforeEnter = Guard.auth
})

export default new Router({
    mode: 'history',
    routes: [...guestRoutes, ...authRoutes]
})
