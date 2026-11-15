import OrderCard from './OrderCard';
import { packingChecklist, packingIntro, packingShield } from '../mocks/orderSuccess.mock';
import type { OrderSuccessState } from '../hooks/useOrderSuccess';

interface PackingChecklistCardProps {
  hub: OrderSuccessState;
}

export default function PackingChecklistCard({ hub }: PackingChecklistCardProps) {
  return (
    <OrderCard icon="bi-shield-check" title="Quy Chuẩn Đóng Gói Nexus Seal">
      <p className="nx-success-packing-intro">{packingIntro}</p>

      <div className="nx-success-checklist">
        {packingChecklist.map(item => (
          <label className="nx-success-check" key={item.id}>
            <input type="checkbox" checked={Boolean(hub.checklist[item.id])} onChange={() => hub.toggleChecklist(item.id)} />
            <span>
              <strong>{item.title}</strong>
              <em>{item.caption}</em>
            </span>
          </label>
        ))}
      </div>

      <div className="nx-success-shield">
        <i className="bi bi-shield-fill-check" aria-hidden="true" />
        <p>
          <strong>{packingShield.title}</strong> {packingShield.description}
        </p>
      </div>
    </OrderCard>
  );
}
