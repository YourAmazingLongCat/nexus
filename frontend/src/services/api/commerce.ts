import { api } from './client';

export interface CommerceCartLine { id: string; productId: string; skuId: string | null; sellerId: string; quantity: number; unitPrice: number; lineTotal: number }
export interface CommerceCart { id: string; subtotal: number; itemCount: number; items: CommerceCartLine[] }
export interface CommerceOrderSummary { id: string; orderNumber: string; sellerId: string; orderType: string; status: string; totalAmount: number; itemCount: number; createdAt: string }
export interface CommerceOrderItem { id: string; productId: string; skuId: string | null; sellerId: string; productNameSnapshot: string; quantity: number; unitPrice: number }
export interface CommerceOrder extends Omit<CommerceOrderSummary, 'itemCount'> { items: CommerceOrderItem[]; shippingAddress: string; receiverName: string; receiverPhone: string }
export interface AddCartLine { productId: string; sellerId: string; skuId?: string | null; productName?: string; quantity: number; unitPrice: number }
interface Page<T> { content: T[]; totalElements: number; totalPages: number }
const base = '/api/v1/buyer/commerce';
const json = (method: string, body?: unknown): RequestInit => ({ method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
export const commerceApi = {
  cart: () => api<CommerceCart>(`${base}/cart`),
  add: (line: AddCartLine) => api<CommerceCart>(`${base}/cart/items`, json('POST', line)),
  quantity: (id: string, quantity: number) => api<CommerceCart>(`${base}/cart/items/${encodeURIComponent(id)}`, json('PUT', { quantity })),
  remove: (id: string) => api<void>(`${base}/cart/items/${id}`, json('DELETE')),
  discount: (code: string, orderAmount: number) => api<{ code: string; discountAmount: number }>(`${base}/checkout/apply-discount`, json('POST', { code, orderAmount, orderType: 'DIRECT' })),
  checkout: (body: { receiverName: string; receiverPhone: string; shippingAddress: string; paymentMethod: 'COD'; discountCode?: string }) => api<CommerceOrder>(`${base}/checkout`, json('POST', body)),
  orders: (page = 0) => api<Page<CommerceOrderSummary>>(`${base}/orders?page=${page}&size=100&sort=createdAt,desc`),
  order: (id: string) => api<CommerceOrder>(`${base}/orders/${encodeURIComponent(id)}`),
  cancel: (id: string) => api<CommerceOrder>(`${base}/orders/${encodeURIComponent(id)}/cancel`, json('POST')),
  rateSeller: (orderId: string, sellerId: string, score: number) => api<unknown>(`${base}/seller-ratings`, json('POST', { orderId, sellerId, score })),
};
