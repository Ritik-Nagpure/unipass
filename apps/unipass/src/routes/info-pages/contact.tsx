import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../__root'
import ContactPage from '../../app/pages/contact'

const RouteComp = () => <ContactPage />

export const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: RouteComp,
})