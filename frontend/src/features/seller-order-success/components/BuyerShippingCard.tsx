import OrderCard from './OrderCard';
import { buyerInfo } from '../mocks/orderSuccess.mock';
import type { OrderSuccessState } from '../hooks/useOrderSuccess';

interface BuyerShippingCardProps {
  hub: OrderSuccessState;
}

export default function BuyerShippingCard({ hub }: BuyerShippingCardProps) {
  return (
    <OrderCard
      icon="bi-truck"
      title="Thông Tin Người Mua & Giao Nhận"
      aside={<span className="nx-success-shipping-badge">{buyerInfo.shippingBadge}</span>}
    >
      <div className="nx-success-buyer">
        <div className="nx-success-buyer-col">
          <span className="nx-success-buyer-label">Người nhận hàng:</span>
          <p className="nx-success-buyer-name">{buyerInfo.name}</p>
          <p className="nx-success-buyer-phone">
            <i className="bi bi-telephone" aria-hidden="true" />
            {buyerInfo.phone}
          </p>
          <p className="nx-success-buyer-rating">Đánh giá người mua: {buyerInfo.rating}</p>
        </div>

        <div className="nx-success-buyer-col">
          <span className="nx-success-buyer-label">Mã vận đơn bưu kiện:</span>
          <p className="nx-success-awb">
            <strong>{buyerInfo.awb}</strong>
            <button
              type="button"
              className="nx-success-copy"
              onClick={() => hub.copyAwb(buyerInfo.awb)}
              title="Sao chép mã"
              aria-label="Sao chép mã vận đơn"
            >
              <i className="bi bi-clipboard" aria-hidden="true" />
            </button>
          </p>
          <p className="nx-success-buyer-method">Phương thức lấy hàng: {buyerInfo.pickupMethod}</p>
        </div>
      </div>

      <div className="nx-success-address">
        <span className="nx-success-address-icon" aria-hidden="true">
          <i className="bi bi-geo-alt" />
        </span>
        <p>
          <span>Địa chỉ giao hàng:</span>
          <strong>{buyerInfo.address}</strong>
        </p>
      </div>

      <div className="nx-success-note">
        <i className="bi bi-chat-left-quote" aria-hidden="true" />
        <p>
          <span className="nx-success-note-label">{buyerInfo.noteLabel}</span>
          <em>{buyerInfo.note}</em>
        </p>
      </div>
    </OrderCard>
  );
}
