import type { RouteObject } from 'react-router-dom';
import BuyerLayout from './layouts/BuyerLayout';
import HomePage from '../../features/home/pages/HomePage';
import CategoryPage from '../../features/category/pages/CategoryPage';
import ProductPage from '../../features/product/pages/ProductPage';
import ProductDetailPage from '../../features/product/pages/ProductDetailPage';
import CartPage from '../../features/cart/pages/CartPage';
import BuyerHubPage from '../../features/buyer-hub/pages/BuyerHubPage';

const buyerRoutes: RouteObject[] = [
  {
    element: <BuyerLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'categories', element: <CategoryPage /> },
      { path: 'categories/:categoryId', element: <CategoryPage /> },
      { path: 'products', element: <ProductPage /> },
      { path: 'products/:productId', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'buyer-hub', element: <BuyerHubPage /> },

    ],
  },
];
export default buyerRoutes;
