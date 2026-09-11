import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../__root'
import AboutPage from '../../app/pages/about'

const RouteComp = () => <AboutPage />

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: RouteComp,
})