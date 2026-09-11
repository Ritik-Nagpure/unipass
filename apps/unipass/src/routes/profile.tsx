import { createRoute } from '@tanstack/react-router'
import { authenticatedRoute } from './_authenticated'

export const profileRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/profile',
  component: () => <div>profile Page</div>,
})