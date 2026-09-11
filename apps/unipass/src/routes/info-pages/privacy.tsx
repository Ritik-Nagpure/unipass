import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../__root'
import PrivacyPolicyPage from '../../app/pages/privacy-policy'

const RouteComp = () => <PrivacyPolicyPage />

export const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: RouteComp,
})