import { createRoute } from '@tanstack/react-router'
import { authenticatedRoute } from './_authenticated'
import HelpPage from '../app/features/help'

export const helpRoute = createRoute({
    getParentRoute: () => authenticatedRoute,
    path: '/help',
    component: HelpPage,
})
