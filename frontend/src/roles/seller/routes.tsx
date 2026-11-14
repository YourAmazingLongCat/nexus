import type { RouteObject } from 'react-router-dom';
import SellerLayout from './layouts/SellerLayout';
import SellerHubPage from './pages/SellerHubPage';
import SellerInventoryPage from './pages/SellerInventoryPage';
import CreateListingPage from './pages/CreateListingPage';

// UI-only route: authorization is outside this integration task.
const sellerRoutes: RouteObject[] = [
  {
    element: <SellerLayout />,
    children: [
      { path: '/seller-hub', element: <SellerHubPage /> },
      { path: '/seller/products', element: <SellerInventoryPage /> },
      { path: '/seller/products/new', element: <CreateListingPage /> },
    ],
  },
];
export default sellerRoutes;
