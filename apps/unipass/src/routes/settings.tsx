import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => <div>settings Page</div>,
})