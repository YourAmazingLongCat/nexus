import type { CreateListingState } from '../hooks/useCreateListing';

// Bước 4 — Phương thức bán, định giá và số lượng kho.
export default function ListingPricing({ hub }: { hub: CreateListingState }) {
  const { draft } = hub;
  return (
    <div className="nx-listing-stack">
      <p className="nx-listing-price-note">Bán giá cố định. Giá ưu đãi và trả giá chưa được hỗ trợ.</p>
      <div className="nx-listing-price-grid">
        <div>
          <label htmlFor="listing-price" className="nx-listing-label">Giá bán <em>*</em></label>
          <div className="nx-listing-price">
            <input id="listing-price" type="number" min="0.01" step="0.01" required
              aria-describedby="listing-price-help"
              value={draft.price || ''}
              onChange={event => hub.updateDraft('price', Number(event.target.value))} />
            <span>đ</span>
          </div>
          <p id="listing-price-help" className="nx-listing-price-note">Giá lớn hơn 0, tối đa 2 chữ số thập phân. Giá này được lưu cho sản phẩm và SKU.</p>
        </div>
      </div>
      <div className="nx-listing-stock">
        <div className="nx-listing-stock-main">
          <i className="bi bi-box-seam" aria-hidden="true" />
          <div>
            <p>
              Số lượng sản phẩm trong kho:{' '}
              <strong>{String(draft.quantity).padStart(2, '0')} chiếc</strong>
            </p>
            <span>Sản phẩm sưu tầm / cá nhân đơn chiếc, tự động đóng tin khi bán xong</span>
          </div>
        </div>
        <div className="nx-listing-stepper">
          <button type="button" onClick={() => hub.changeQuantity(-1)} aria-label="Giảm số lượng">-</button>
          <span>{draft.quantity}</span>
          <button type="button" onClick={() => hub.changeQuantity(1)} aria-label="Tăng số lượng">+</button>
        </div>
      </div>
    </div>
  );
}
