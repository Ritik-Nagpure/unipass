import { createRoute } from '@tanstack/react-router'
import { authenticatedRoute } from './_authenticated'
import DetailsPage from '../app/features/details'

export const detailsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/details',
  component: DetailsPage,
})