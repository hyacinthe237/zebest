import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/home'
import UserProfile from '@/views/users/profile'
import ChoixDevise from '@/views/users/choix-devise'
import MyPage from '@/views/dashboard/my-page'
import SuccessCheckout from '@/views/stripe/success'
import NotFoundComponent from '@/views/notfound/notfound'

import Guard from '@/services/middleware'
import Signin from '@/views/auth/signin'
import Signup from '@/views/auth/signup'
import Verify from '@/views/auth/verify'
import PasswordForgot from '@/views/auth/password-forgot'
import PasswordReset from '@/views/auth/reset'
// import AuthPasswordForgot from '@/views/auth/password-forgot'

Vue.use(Router)
/** Open rotues */
const guestRoutes = [
  { path: '/', name: 'home', component: Home },
  { path: '/:id', name: 'my-page', component: MyPage  },
  { path: '/auth/signin', name: 'signin', component: Signin  },
  { path: '/auth/signup', name: 'signup', component: Signup  },
  { path: '/auth/verify', name: 'verify', component: Verify  },
  { path: '/auth/password/forgot', name: 'password-forgot', component: PasswordForgot  },
  { path: '/auth/password/reset', name: 'password-reset', component: PasswordReset  },
  { path: '/checkout/success', name: 'success', component: SuccessCheckout },
  // { path: '/checkout/success', redirect: to => { return `/success/checkout?user=${to.query.user}&redirect_status=${to.query.redirect_status}` } },
  { path: '/:catchAll(.*)', name: 'NotFound', component: NotFoundComponent }
]

/** Protected routes */
const authRoutes = [
  { path: '/create/profile', name: 'profile', component: UserProfile  },
  { path: '/choix/devise', name: 'choix-devise', component: ChoixDevise  },
  // { path: '/forgot/password', name: 'password-forgot', component: AuthPasswordForgot  },
]

authRoutes.forEach(r => {
    r.beforeEnter = Guard.auth
})

export default new Router({
    mode: 'history',
    routes: [...guestRoutes, ...authRoutes]
})
