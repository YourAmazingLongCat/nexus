export * from '../../features/product/services/catalog.api';
import { api, ApiError, type PageResponse } from './client';
import { getCatalogProduct, type CatalogProduct } from '../../features/product/services/catalog.api';
export interface Auction { id: string; productId: string; sellerId: string; startingPrice: number; currentPrice: number; startTime: string; endTime: string; status: string; highestBidderId: string | null; acceptedBidCount?: number }
export interface Listing extends CatalogProduct { auction?: Auction }
export interface Review { id: string; buyerId: string; score: number; comment: string | null; createdAt: string }
export interface Bid { id: string; bidderId: string; amount: number; placedAt: string }
export async function listAuctions(query: URLSearchParams, signal?: AbortSignal): Promise<PageResponse<Listing>> {
 const keyword = query.get('keyword')?.trim();
 if (keyword && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(keyword)) {
   throw new ApiError(400, 'Tìm kiếm đấu giá chỉ hỗ trợ UUID sản phẩm hoặc người bán; chưa hỗ trợ tìm theo tên.');
 }
 const page = await api<PageResponse<Auction>>('/api/v1/auction/auctions?' + query, { signal });
 const content = await Promise.all(page.content.map(async auction => ({ ...await getCatalogProduct(auction.productId, signal), auction })));
 return { ...page, content };
}
export const getAuction = (id: string, signal?: AbortSignal) => api<Auction>('/api/v1/auction/auctions/' + encodeURIComponent(id), { signal });
export const getBids = (id: string, page = 0, signal?: AbortSignal) => api<PageResponse<Bid>>('/api/v1/auction/auctions/' + encodeURIComponent(id) + '/bids?page=' + page + '&size=10', { signal });
export const getReviews = (id: string, page = 0, signal?: AbortSignal) => api<PageResponse<Review>>('/api/v1/catalog/products/' + encodeURIComponent(id) + '/reviews?page=' + page + '&size=10', { signal });
export const placeBid = (id: string, amount: number) => api<Bid>('/api/v1/buyer/auction/auctions/' + encodeURIComponent(id) + '/bids', { method: 'POST', body: JSON.stringify({ amount }) });
