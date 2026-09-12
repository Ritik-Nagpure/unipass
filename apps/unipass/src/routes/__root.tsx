import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Layout } from '../app/features/layout'
import { useAppSelector } from '../app/shared/hooks/store/store'


const LoggedInApp = () => (
  <div className=''>
    <Layout>
      <Outlet />
    </Layout>
  </div>
)

const LoggedOutApp = () => (
  <div className='w-full h-full flex flex-row justify-center items-center p-0'>
    <Outlet />
  </div>
)

function MainApp() {
  const isLogin = useAppSelector((state) => state.auth.isLogin)
  const isDev = false
  return (
    <div className='w-screen h-screen p-0 overflow-y-auto no-scrollbar'>
      {isLogin ? <LoggedInApp /> : <LoggedOutApp />}
      {isDev && <TanStackRouterDevtools />}
    </div>
  )
}

export const rootRoute = createRootRoute({
  component: MainApp,
})