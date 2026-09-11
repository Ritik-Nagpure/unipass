import { createRoute } from '@tanstack/react-router'
import { authenticatedRoute } from './_authenticated'


export const settingsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/settings',
  component: () => <div>settings Page</div>,
})