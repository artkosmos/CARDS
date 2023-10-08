import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
} from 'react-router-dom'
import { DeckPackPage } from '@/features/deck-pack-page'
import { CardPage } from '@/features/CardPage'
// import { ForgotPasswordForm } from '@/components/auth/forgot-pasword-form'

const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <div>Login a little boy</div>,
  },
]

const privateRoutes: RouteObject[] = [
  {
    path: '/',
    // element: <div>Your component is shown here</div>,
    // element: <ForgotPasswordForm onSubmit={() => {}} />,
    element: <CardPage cardId={'clmgvz5of0i79vo2qm7bj7jxm'} />,
  },
  {
    path: '/decks',
    element: <DeckPackPage />,
  },
]

const router = createBrowserRouter([
  { element: <PrivateRoutes />, children: privateRoutes },
  ...publicRoutes,
])

export const Router = () => {
  return <RouterProvider router={router} />
}

function PrivateRoutes() {
  const isAuthenticated = true

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}
