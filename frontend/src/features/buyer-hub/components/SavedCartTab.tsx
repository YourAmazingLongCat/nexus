import SavedItemRow from './SavedItemRow';
import type { SavedItem } from '../types/buyerHub';

interface SavedCartTabProps {
  title: string;
  summary: string;
  selectAllLabel: string;
  items: SavedItem[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function SavedCartTab({
  title,
  summary,
  selectAllLabel,
  items,
  onToggle,
  onSelectAll,
  onQuantityChange,
  onRemove,
}: SavedCartTabProps) {
  const allSelected = items.length > 0 && items.every((item) => item.selected);

  return (
    <section
      className="nx-hub-panel nx-hub-panel--card"
      id="hub-panel-cart"
      role="tabpanel"
      aria-labelledby="hub-tab-cart"
      tabIndex={0}
    >
      <div className="nx-hub-saved-head">
        <div>
          <h3 className="nx-hub-saved-title">{title}</h3>
          <p className="nx-hub-saved-summary">{summary}</p>
        </div>
        <button
          type="button"
          className="nx-hub-saved-selectall"
          aria-pressed={allSelected}
          onClick={onSelectAll}
        >
          {selectAllLabel}
        </button>
      </div>

      <div className="nx-hub-saved-list">
        {items.length === 0 ? (
          <p className="nx-hub-empty">Giỏ hàng của bạn đang trống.</p>
        ) : (
          items.map((item) => (
            <SavedItemRow
              key={item.id}
              item={item}
              onToggle={onToggle}
              onQuantityChange={onQuantityChange}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </section>
  );
}
