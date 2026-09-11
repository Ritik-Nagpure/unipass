import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => <div>profile Page</div>,
})