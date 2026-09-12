import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { AuthPage } from '../app/features/auth/auth'  
import { store } from '../store/store'

const RouteComp = () => <AuthPage />

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  beforeLoad: () => {
    const isUserLoggedIn = store.getState().auth.isLogin
    if (isUserLoggedIn) {
      throw redirect({ to: '/home' })
    }
  },
  component: RouteComp,
})