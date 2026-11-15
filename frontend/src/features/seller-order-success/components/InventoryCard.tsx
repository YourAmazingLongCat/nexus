import OrderCard from './OrderCard';
import { hotline, inventoryActions, stockAlert } from '../mocks/orderSuccess.mock';
import type { OrderSuccessState } from '../hooks/useOrderSuccess';

interface InventoryCardProps {
  hub: OrderSuccessState;
}

export default function InventoryCard({ hub }: InventoryCardProps) {
  return (
    <OrderCard icon="bi-archive" iconTone="secondary" title="Quản Lý Tồn Kho Sản Phẩm" headSpacing="tight">
      <div className="nx-success-stock">
        <span className="nx-success-stock-left">
          <span className="nx-success-stock-dot" aria-hidden="true" />
          {stockAlert.message}
        </span>
        <span className="nx-success-stock-badge">{stockAlert.badge}</span>
      </div>

      <p className="nx-success-stock-caption">{stockAlert.caption}</p>

      <div className="nx-success-stock-actions">
        {inventoryActions.map(action => (
          <button type="button" className="nx-success-stock-action" key={action.id} onClick={() => hub.mockAction(action.label)}>
            <span>
              <i className={`bi ${action.icon}`} aria-hidden="true" />
              {action.label}
            </span>
            <i className="bi bi-chevron-right" aria-hidden="true" />
          </button>
        ))}
      </div>

      <footer className="nx-success-hotline">
        <span>
          <i className="bi bi-headset" aria-hidden="true" />
          {hotline.label}
        </span>
        <a href={hotline.href}>{hotline.phone}</a>
      </footer>
    </OrderCard>
  );
}
