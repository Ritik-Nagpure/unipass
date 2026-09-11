import { createRoute } from '@tanstack/react-router'
import { authenticatedRoute } from './_authenticated'

export const detailsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/details',
  component: () => <div>details Page</div>,
})