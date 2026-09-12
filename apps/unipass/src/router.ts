import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { authRoute } from './routes/auth'
import { dashboardRoute } from './routes/dashboard'
import { detailsRoute } from './routes/details'
import { homeRoute } from './routes/home'
import { profileRoute } from './routes/profile'
import { settingsRoute } from './routes/settings'
import { termsRoute } from './routes/info-pages/terms'
import { authenticatedRoute } from './routes/_authenticated'
import { privacyRoute } from './routes/info-pages/privacy'
import { aboutRoute } from './routes/info-pages/about'
import { contactRoute } from './routes/info-pages/contact'
import { helpRoute } from './routes/help'

const routeTree = rootRoute.addChildren([
    authRoute,
    termsRoute,
    privacyRoute,
    aboutRoute,
    contactRoute,

    authenticatedRoute.addChildren([
        dashboardRoute,
        helpRoute,
        homeRoute,
        detailsRoute,
        settingsRoute,
        profileRoute,
    ]),
])

export const router = createRouter({ routeTree })