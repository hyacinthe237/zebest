import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/home'
import UserProfile from '@/views/users/profile'
import ChoixDevise from '@/views/users/choix-devise'
import ListeDonateurs from '@/views/users/liste-donateurs'
import FaireUnRetrait from '@/views/users/faire-un-retrait'
import FaireUnDon from '@/views/fans/faire-un-don'
import MyPage from '@/views/dashboard/my-page'
import StripeCheckout from '@/views/stripe/checkout'

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
  { path: '/payment/checkout', name: 'checkout', component: StripeCheckout  },
]

/** Protected routes */
const authRoutes = [
  { path: '/profile', name: 'profile', component: UserProfile  },
  { path: '/choix/devise', name: 'choix-devise', component: ChoixDevise  },
  { path: '/liste/donateurs', name: 'liste-donateurs', component: ListeDonateurs  },
  { path: '/faire/un/retrait', name: 'faire-un-retrait', component: FaireUnRetrait  },
  { path: '/faire/un/don', name: 'faire-un-don', component: FaireUnDon  },
  { path: '/password-forgot', name: 'password-forgot', component: AuthPasswordForgot  },
]

authRoutes.forEach(r => {
    r.beforeEnter = Guard.auth
})

export default new Router({
    routes: [...guestRoutes, ...authRoutes]
})
