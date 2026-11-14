import SellerOverview from '../../../features/seller-hub/components/SellerOverview';
import QuickListing from '../../../features/seller-hub/components/QuickListing';
import ProductInventory from '../../../features/seller-hub/components/ProductInventory';
import SellerSidebar from '../../../features/seller-hub/components/SellerSidebar';
import AuctionsTab from '../../../features/seller-hub/components/AuctionsTab';
import OrdersTab from '../../../features/seller-hub/components/OrdersTab';
import ReportsTab from '../../../features/seller-hub/components/ReportsTab';
import { useSellerHub } from '../../../features/seller-hub/hooks/useSellerHub';

// TODO(seller-hub): toàn bộ tab dùng mock data; chưa gọi REST API nào.
export default function SellerHubPage() {
  const hub = useSellerHub();
  return <main className="nx-seller-page"><div className="nx-container">
    <SellerOverview activeTab={hub.activeTab} onTabChange={hub.setActiveTab} onCreateProduct={hub.focusListing} onAction={hub.mockAction} />
    {hub.activeTab === 'products' && <div className="nx-seller-content"><div className="nx-seller-main"><QuickListing hub={hub} /><ProductInventory hub={hub} /></div><SellerSidebar onAction={hub.mockAction} /></div>}
    {hub.activeTab === 'auctions' && <div className="nx-seller-content"><div className="nx-seller-main"><AuctionsTab hub={hub} /></div><SellerSidebar onAction={hub.mockAction} /></div>}
    {hub.activeTab === 'orders' && <div className="nx-seller-content"><div className="nx-seller-main"><OrdersTab hub={hub} /></div><SellerSidebar onAction={hub.mockAction} /></div>}
    {hub.activeTab === 'reports' && <div className="nx-seller-main nx-seller-main--full"><ReportsTab hub={hub} /></div>}
  </div></main>;
}
