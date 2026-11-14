import InventoryOverview from '../../../features/seller-inventory/components/InventoryOverview';
import InventoryFilters from '../../../features/seller-inventory/components/InventoryFilters';
import InventoryTable from '../../../features/seller-inventory/components/InventoryTable';
import InventoryTips from '../../../features/seller-inventory/components/InventoryTips';
import { useInventory } from '../../../features/seller-inventory/hooks/useInventory';
import '../../../features/seller-inventory/styles/inventory.css';
export default function SellerInventoryPage() {
  const hub = useInventory();
  return <main className="nx-stock-page"><div className="nx-container"><InventoryOverview onAction={hub.action} /><InventoryFilters hub={hub} /><InventoryTable hub={hub} /><InventoryTips /></div></main>;
}
