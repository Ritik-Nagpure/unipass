import { createRoute, redirect, Outlet } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { store } from '../store/store'

const RouteComp = () => <Outlet />

export const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_authenticated',   
  beforeLoad: () => {
    const isUserLoggedIn = store.getState().auth.isLogin
    if (!isUserLoggedIn) {
      throw redirect({ to: '/auth' })
    }
  },
  component: RouteComp,
})