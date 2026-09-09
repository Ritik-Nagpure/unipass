import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: () => <div>Auth Page</div>,
})