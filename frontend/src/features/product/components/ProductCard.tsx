// Lucian UX/UI Prompt #049 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#049
import { useState } from 'react';
import { demoActions, useDemoStore } from '../../../shared/demo/demoStore';
import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { formatPrice } from '../services/productService';
import ProductImage from './ProductImage';
import HeartBurstButton from '../../../shared/components/Button/HeartBurstButton';
import useProductCardMotion from '../hooks/useProductCardMotion';
import '../styles/product-card-motion.css';

function ProductCard({ product }: { product: Product }) {
  const store = useDemoStore();
  const saved = store.saved.includes(product.id);
  const inCart = store.cart.find((item) => item.productId === product.id)?.quantity ?? 0;
  const remaining = (product.quantity ?? 99) - inCart;
  const [added, setAdded] = useState(false);
  const auction = product.mode === 'auction';
  const { cardRef, onPointerMove, onPointerLeave } = useProductCardMotion();

  return (
    <article
      ref={cardRef}
      className="nx-product-card u049-product-card"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="nx-card-media">
        <span className={`nx-tag ${auction ? 'nx-tag-red' : ''}`}>
          {auction ? '◷ Đấu giá trực tiếp' : product.badge}
        </span>
        <HeartBurstButton
          className="nx-save"
          pressed={saved}
          label={saved ? 'Bỏ lưu sản phẩm' : 'Lưu sản phẩm'}
          onToggle={() => demoActions.toggleSaved(product.id)}
        />
        <Link to={`/products/${product.id}`}>
          <ProductImage
            kind={product.image}
            label={product.name}
            className="u049-product-image"
          />
        </Link>
      </div>
      <div className="nx-card-body">
        <div className="nx-card-meta">
          {auction ? product.condition : `★ ${product.rating}`}{' '}
          <span>
            {product.bids} {auction ? 'lượt đấu' : 'đánh giá'}
          </span>
        </div>
        <Link className="nx-card-title" to={`/products/${product.id}`}>
          {product.name}
        </Link>
        <del className="nx-old-price">{formatPrice(product.originalPrice)}</del>
        <div className={`nx-price ${auction ? 'nx-red' : 'nx-blue'}`}>
          {auction && <small>Giá đấu hiện tại: </small>}
          {formatPrice(product.price)}
        </div>
        {!auction && (
          <small className="nx-shipping">
            Miễn phí vận chuyển · Trả góp 0%
          </small>
        )}
        <div className="nx-card-actions">
          {auction ? (
            <Link
              className="nx-button nx-button-red"
              to={`/products/${product.id}`}
            >
              ♧ Đặt giá thầu
            </Link>
          ) : (
            <>
              <button
                className="nx-button nx-button-primary"
                disabled={remaining < 1}
                onClick={() => setAdded(demoActions.addToCart(product.id))}
              >
                {remaining < 1 ? 'Đã đủ số lượng' : added ? '✓ Đã thêm vào giỏ' : '🛒 Thêm giỏ'}
              </button>
              <Link
                className="nx-button nx-button-soft"
                to={`/products/${product.id}`}
              >
                Mua ngay
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
