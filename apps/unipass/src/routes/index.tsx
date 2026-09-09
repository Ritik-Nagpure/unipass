import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { Homepage } from '../app/features/home'
import { Layout } from '../app/features/layout'


const LandingPage = () => {
  const Login = true
  return Login ? <div>Layout</div> : <Homepage />
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})