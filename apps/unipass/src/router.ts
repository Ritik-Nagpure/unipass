import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { authRoute } from './routes/auth'

const routeTree = rootRoute.addChildren([indexRoute, authRoute])

export const router = createRouter({ routeTree })