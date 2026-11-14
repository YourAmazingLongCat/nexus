import type { SavedItem } from '../types/buyerHub';
import { formatVnd } from '../utils/buyerHub.format';

interface SavedItemRowProps {
  item: SavedItem;
  onToggle: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function SavedItemRow({
  item,
  onToggle,
  onQuantityChange,
  onRemove,
}: SavedItemRowProps) {
  return (
    <div className="nx-hub-saved-row">
      <div className="nx-hub-saved-main">
        <input
          type="checkbox"
          className="nx-hub-checkbox"
          checked={item.selected}
          onChange={() => onToggle(item.id)}
          aria-label={`Chọn ${item.name} để thanh toán`}
        />

        <div className="nx-hub-saved-thumb">
          <i className={`bi ${item.icon}`} aria-hidden="true"></i>
        </div>

        <div className="nx-hub-saved-body">
          <h4 className="nx-hub-saved-name">{item.name}</h4>
          <p className="nx-hub-saved-meta">
            Đơn vị bán: {item.seller} • Tình trạng: {item.condition}
          </p>
          <span className="nx-hub-saved-price">{formatVnd(item.unitPrice)}</span>
        </div>
      </div>

      <div className="nx-hub-saved-side">
        <div className="nx-hub-qty" role="group" aria-label={`Số lượng ${item.name}`}>
          <button
            type="button"
            className="nx-hub-qty-btn nx-hub-qty-btn--left"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label={`Giảm số lượng ${item.name}`}
          >
            -
          </button>
          <span className="nx-hub-qty-value" aria-live="polite">
            {item.quantity}
          </span>
          <button
            type="button"
            className="nx-hub-qty-btn nx-hub-qty-btn--right"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.maxQuantity}
            aria-label={`Tăng số lượng ${item.name}`}
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="nx-hub-saved-remove"
          title="Xóa khỏi giỏ"
          aria-label="Xóa khỏi giỏ"
          onClick={() => onRemove(item.id)}
        >
          <i className="bi bi-trash" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}
