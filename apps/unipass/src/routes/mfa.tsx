import { createRoute } from '@tanstack/react-router'
import { authenticatedRoute } from './_authenticated'
import MfaPage from '../app/features/multi-factor-auth/multi-factor-auth'

export const mfaRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/multi-factor-auth',
  component: MfaPage,
})