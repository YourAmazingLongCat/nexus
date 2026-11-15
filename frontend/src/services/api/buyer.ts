import { api } from './client';
export interface BuyerProfileResponse { id: string; email: string; username: string; fullName: string | null; phone: string | null; address: string | null; createdAt: string }
export interface CartProduct { id: string; name: string; sellerId: string; basePrice: number; primaryImageUrl: string | null }
export const buyerApi = {
  profile: () => api<BuyerProfileResponse>('/api/v1/buyer/profile'),
  product: (id: string) => api<CartProduct>(`/api/v1/catalog/products/${encodeURIComponent(id)}`),
  shipments: (orderId: string) => api<{ trackingNumber: string | null; status: string }[]>(`/api/v1/buyer/fulfillment/shipments?orderId=${encodeURIComponent(orderId)}`),
};
