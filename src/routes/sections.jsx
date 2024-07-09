import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import IngredientPage from 'src/pages/ingredient';
import DashboardLayout from 'src/layouts/dashboard';
import ProductTypesPage from 'src/pages/product-types';
import AxiosInterceptor from 'src/api/axiosInterceptor';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const UtensilPage = lazy(() => import('src/pages/utensil'));
export const PotPage = lazy(() => import('src/pages/pot'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '',
      element: <AxiosInterceptor />,
      children: [
        {
          element: (
            <DashboardLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Outlet />
              </Suspense>
            </DashboardLayout>
          ),
          children: [
            { element: <BlogPage />, index: true },
            { path: 'dashboard', element: <IndexPage /> },
            { path: 'user', element: <UserPage /> },
            { path: 'utensil', element: <UtensilPage /> },
            { path: 'pot', element: <PotPage /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'product-types', element: <ProductTypesPage /> },
            { path: 'ingredient', element: <IngredientPage /> },
            { path: 'blog', element: <BlogPage /> },
          ],
        },
        {
          path: 'login',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <LoginPage />
            </Suspense>
          ),
        },
        {
          path: 'register',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <RegisterPage />
            </Suspense>
          ),
        },
        {
          path: '404',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Page404 />
            </Suspense>
          ),
        },
        {
          path: '*',
          element: <Navigate to="/404" replace />,
        },
      ],
    },
  ]);

  return routes;
}
