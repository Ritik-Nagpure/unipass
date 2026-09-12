import { createRoute } from '@tanstack/react-router'
import { authenticatedRoute } from './_authenticated'
import Dashboard from '../app/features/dashboard'

export const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/dashboard',
  component: Dashboard
})