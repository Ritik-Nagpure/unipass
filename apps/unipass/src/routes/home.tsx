import { createRoute } from '@tanstack/react-router'
import { authenticatedRoute } from './_authenticated'

export const homeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/home',
  component: () => <div>Home Page</div>,
})