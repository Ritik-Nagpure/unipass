import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: () => <div>Home Page</div>,
})