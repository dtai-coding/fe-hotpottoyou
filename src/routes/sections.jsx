import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import IngredientPage from 'src/pages/ingredient';
import DashboardLayout from 'src/layouts/dashboard';
import OrderCanceled from 'src/pages/order-canceled';
import ProductTypesPage from 'src/pages/product-types';
import OrderDelivered from 'src/pages/order-delivered';
import OrderProgress from 'src/pages/order-in-progress';
import AxiosInterceptor from 'src/api/axiosInterceptor';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const UtensilPage = lazy(() => import('src/pages/utensil'));
export const PotPage = lazy(() => import('src/pages/pot'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const DetailHotpotPage = lazy(() => import('src/pages/detail-hotpot'));
export const DetailOrderPage = lazy(() => import('src/pages/detail-order'));
export const DetailUtensilPage = lazy(() => import('src/pages/detail-utensil'));
export const DetailPotPage = lazy(() => import('src/pages/detail-pot'));
export const OrderPendingView = lazy(() => import('src/pages/order-pending'));
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
            { path: 'order-pending', element: <OrderPendingView /> },
            { path: 'product-types', element: <ProductTypesPage /> },
            { path: 'order-in-process', element: <OrderProgress /> },
            { path: 'order-canceled', element: <OrderCanceled /> },
            { path: 'order-delivered', element: <OrderDelivered /> },
            { path: 'detail-hotpot', element: <DetailHotpotPage /> },
            { path: 'detail-order', element: <DetailOrderPage /> },
            { path: 'detail-utensil', element: <DetailUtensilPage /> },
            { path: 'detail-pot', element: <DetailPotPage /> },
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
