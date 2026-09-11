import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { authRoute } from './routes/auth'
import { dashboardRoute } from './routes/dashboard'
import { detailsRoute } from './routes/details'
import { homeRoute } from './routes/home'
import { profileRoute } from './routes/profile'
import { settingsRoute } from './routes/settings'

const routeTree = rootRoute.addChildren([
    indexRoute,
    authRoute,
    dashboardRoute,
    homeRoute,
    detailsRoute,
    settingsRoute,
    profileRoute
])

export const router = createRouter({ routeTree })