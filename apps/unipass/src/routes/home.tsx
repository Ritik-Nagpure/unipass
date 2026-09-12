import { createRoute } from '@tanstack/react-router'
import { authenticatedRoute } from './_authenticated'
import HomePage from '../app/features/home'

export const homeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/home',
  component: HomePage,
})