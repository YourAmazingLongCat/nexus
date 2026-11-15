import type { RouteObject } from 'react-router-dom';
import SellerLayout from './layouts/SellerLayout';
import SellerHubPage from '../../features/seller-hub/pages/SellerHubPage';
import SellerInventoryPage from '../../features/seller-inventory/pages/SellerInventoryPage';
import CreateListingPage from '../../features/seller-listing/pages/CreateListingPage';
import OrderSuccessPage from '../../features/seller-order-success/pages/OrderSuccessPage';

// UI-only route: authorization is outside this integration task.
const sellerRoutes: RouteObject[] = [
  {
    element: <SellerLayout />,
    children: [
      { path: '/seller-hub', element: <SellerHubPage /> },
      { path: '/seller/products', element: <SellerInventoryPage /> },
      { path: '/seller/products/new', element: <CreateListingPage /> },
      { path: '/seller/orders/success', element: <OrderSuccessPage /> },
    ],
  },
];
export default sellerRoutes;
