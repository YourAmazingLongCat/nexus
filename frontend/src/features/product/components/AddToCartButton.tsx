import { useState } from 'react';
import type { CatalogProduct } from '../services/catalog.api';
import { commerceApi } from '../../../services/api/commerce';
import { apiErrorMessage } from '../../../services/api/client';
import { notify } from '../../../shared/components/Toast';
export default function AddToCartButton({ product, quantity = 1, onAdded, className = "nx-button nx-button-primary" }: { product: CatalogProduct; quantity?: number; onAdded?: () => void; className?: string }) {
 const [pending, setPending] = useState(false);
 async function add() { if (pending) return; setPending(true);
 try { await commerceApi.add({ productId: product.id, sellerId: product.sellerId, productName: product.name, quantity, unitPrice: product.basePrice });
 window.dispatchEvent(new Event('nexus:cart-changed')); notify.success('Đã thêm sản phẩm vào giỏ hàng.'); onAdded?.();
 } catch (error) { notify.error(apiErrorMessage(error)); } finally { setPending(false); }
 }
 return <button className={className} disabled={pending || product.status !== 'ACTIVE' || !Number.isInteger(quantity) || quantity < 1} onClick={add}>{pending ? 'Đang thêm…' : '🛒 Thêm giỏ'}</button>;
}
