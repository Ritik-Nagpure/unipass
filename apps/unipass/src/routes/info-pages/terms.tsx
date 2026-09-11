import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../__root'
import TermsPage from '../../app/pages/terms-of-use'

const RouteComp = () => <TermsPage />

export const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms-of-use',
  component: RouteComp,
})