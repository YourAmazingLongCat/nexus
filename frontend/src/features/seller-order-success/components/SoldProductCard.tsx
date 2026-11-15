import OrderCard from './OrderCard';
import { soldProduct } from '../mocks/orderSuccess.mock';

export default function SoldProductCard() {
  return (
    <OrderCard
      icon="bi-camera"
      title="Sản Phẩm Đã Bán"
      aside={<span className="nx-success-sku">SKU: {soldProduct.sku}</span>}
    >
      <div className="nx-success-product">
        <figure className="nx-success-product-media">
          <img src={soldProduct.image} alt={soldProduct.imageAlt} />
          <figcaption className="nx-success-product-condition">{soldProduct.conditionBadge}</figcaption>
        </figure>

        <div className="nx-success-product-body">
          <div className="nx-success-product-verify">
            <span className="nx-success-product-chip">{soldProduct.verifiedBadge}</span>
            <span className="nx-success-product-serial">Serial: {soldProduct.serial}</span>
          </div>
          <h3>{soldProduct.title}</h3>
          <p className="nx-success-product-variant">Phân loại: {soldProduct.variant}</p>
          <div className="nx-success-product-meta">
            <span>
              Số lượng: <strong>{soldProduct.quantity}</strong>
            </span>
            <span className="nx-success-hero-sep" aria-hidden="true">
              •
            </span>
            <span>
              Hình thức: <strong className="is-primary">{soldProduct.saleType}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="nx-success-product-price">
        <span>{soldProduct.priceLabel}</span>
        <strong>{soldProduct.price}</strong>
      </div>
    </OrderCard>
  );
}
