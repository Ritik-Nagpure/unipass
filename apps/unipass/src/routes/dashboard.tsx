import { createRoute } from '@tanstack/react-router'
import { authenticatedRoute } from './_authenticated'

export const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/dashboard',
  component: () => <div>dashboard Page</div>,
})