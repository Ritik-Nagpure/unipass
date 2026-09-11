
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useState } from 'react'
import { Layout } from '../app/features/layout'

const LoggedInApp = () => (
  <div>
    <Layout>
      <Outlet />
    </Layout>
  </div>
)

const LoggedOutApp = () => (
  <div>
    <Outlet />
  </div>
)

function MainApp() {
  const [isLogin, setIsLogin] = useState(false)
  const isDev = true
  return (
    <div className='w-screen h-screen'>
      {isLogin ? <LoggedInApp /> : <LoggedOutApp />}
      {isDev && <TanStackRouterDevtools />}
    </div>
  )
}

export const rootRoute = createRootRoute({
  component: MainApp,
})