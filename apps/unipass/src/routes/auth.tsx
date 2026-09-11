import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { AuthPage } from '../app/features/auth/auth'

const RouteComp = () => <AuthPage />

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: RouteComp,
})
