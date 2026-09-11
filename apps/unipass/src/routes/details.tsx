import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const detailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/details',
  component: () => <div>details Page</div>,
})