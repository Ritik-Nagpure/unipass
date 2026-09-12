import { createRoute } from '@tanstack/react-router'
import { authenticatedRoute } from './_authenticated'
import ProfilePage from '../app/features/profile' 

export const profileRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/profile',
  component: ProfilePage,
})