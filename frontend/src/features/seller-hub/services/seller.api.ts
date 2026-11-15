import { apiGet as rawGet, apiRequest as rawRequest } from '../../../shared/api/http';
export interface Page<T> { content: T[]; page: number; size: number; totalElements: number; totalPages: number; first: boolean; last: boolean }
export interface Category { id: string; name: string; status: string; children: Category[] }
export interface Product { id: string; sellerId: string; name: string; description: string | null; basePrice: number; categoryId: string; categoryName: string; status: string; images: string[] }
export interface ProductInput { name: string; description: string; basePrice: number; images: { imageUrl: string; primary: boolean }[] }
export interface Inventory { id: string; skuId: string; productId: string; skuCode: string; skuName: string | null; warehouseId: string; totalQuantity: number; availableQuantity: number; status: string }
export interface Sku { id: string; productId: string; sellerId: string; skuCode: string; name: string | null; price: number | null }
export interface SkuInput { productId: string; skuCode: string; name?: string; price?: number; initialTotalQuantity?: number; initialAvailableQuantity?: number }
export interface OrderItem { id: string; productId: string; skuId: string; productNameSnapshot: string; skuCodeSnapshot: string; quantity: number; unitPrice: number; subtotal: number }
export interface Order { id: string; orderNumber: string; status: string; totalAmount: number; itemCount?: number; createdAt: string; receiverName?: string; receiverPhone?: string; shippingAddress?: string; items?: OrderItem[] }
const productPath = '/seller/catalog/products';
const fulfillmentPath = '/seller/fulfillment';
const orderPath = '/seller/commerce/orders';
const json = (method: string, data?: unknown): RequestInit => ({ method, ...(data === undefined ? {} : { body: JSON.stringify(data) }) });
export const sellerApi = {
    categories: (signal?: AbortSignal) => apiGet<Category[]>('/catalog/categories', signal),
    product: (id: string, signal?: AbortSignal) => apiGet<Product>('/catalog/products/' + encodeURIComponent(id), signal),
    createProduct: (data: ProductInput & { categoryId: string }) => apiRequest<Product>(productPath, json('POST', data)),
    updateProduct: (id: string, data: ProductInput) => apiRequest<Product>(productPath + '/' + encodeURIComponent(id), json('PUT', data)),
    assignCategory: (id: string, categoryId: string) => apiRequest<Product>(productPath + '/' + encodeURIComponent(id) + '/category', json('PATCH', { categoryId })),
    deleteProduct: (id: string) => apiRequest<void>(productPath + '/' + encodeURIComponent(id), json('DELETE')),
    inventories: (query: URLSearchParams, signal?: AbortSignal) => apiGet<Page<Inventory>>(fulfillmentPath + '/inventories?' + query, signal),
    updateInventory: (id: string, operation: string, quantity: number) => apiRequest<Inventory>(fulfillmentPath + '/inventories/' + encodeURIComponent(id), json('PATCH', { operation, quantity })),
    skus: (page: number, signal?: AbortSignal) => apiGet<Page<Sku>>(fulfillmentPath + '/skus?page=' + page + '&size=10', signal),
    createSku: (data: SkuInput) => apiRequest<Sku>(fulfillmentPath + '/skus', json('POST', data)),
    orders: (page: number, status: string, signal?: AbortSignal) => apiGet<Page<Order>>(orderPath + '?page=' + page + '&size=10' + (status ? '&status=' + encodeURIComponent(status) : ''), signal),
    order: (id: string, signal?: AbortSignal) => apiGet<Order>(orderPath + '/' + encodeURIComponent(id), signal),
    updateOrder: (id: string, status: string) => apiRequest<Order>(orderPath + '/' + encodeURIComponent(id) + '/status', json('PATCH', { status })),
    cancelOrder: (id: string) => apiRequest<Order>(orderPath + '/' + encodeURIComponent(id) + '/cancel', json('POST')),
};
export const messageOf = (error: unknown) => error instanceof Error ? error.message : 'Yêu cầu không thành công.';
export function flatCategories(rows: Category[]): Category[] { return rows.flatMap(row => [row, ...flatCategories(row.children ?? [])]); }
export const nextOrderStatus: Record<string, string> = { PENDING: 'CONFIRMED', CONFIRMED: 'SHIPPING', SHIPPING: 'COMPLETED' };
export const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

function record(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value); }
function text(value: unknown) { return typeof value === 'string'; }
function money(value: unknown) { return (typeof value === 'number' || typeof value === 'string') && String(value).trim() !== '' && Number.isFinite(Number(value)); }
function strings(value: Record<string, unknown>, keys: string[]) { return keys.every(k => text(value[k])); }
function item(value: unknown, kind: string): boolean {
    if (!record(value)) return false;
    if (kind === 'inventory') return strings(value, ['id', 'skuId', 'productId', 'skuCode', 'warehouseId', 'status']) && (value.skuName === null || text(value.skuName)) && ['totalQuantity', 'availableQuantity'].every(k => Number.isInteger(value[k]) && Number(value[k]) >= 0);
    if (kind === 'sku') return strings(value, ['id', 'productId', 'sellerId', 'skuCode']) && (value.name === null || text(value.name)) && (value.price === null || money(value.price));
    if (kind === 'product') return strings(value, ['id', 'sellerId', 'name', 'categoryId', 'categoryName', 'status']) && (value.description === null || text(value.description)) && money(value.basePrice) && Array.isArray(value.images) && value.images.every(text);
    if (kind === 'order') return strings(value, ['id', 'orderNumber', 'status', 'createdAt']) && money(value.totalAmount) && (value.itemCount === undefined || (Number.isInteger(value.itemCount) && Number(value.itemCount) >= 0));
    return false;
}
function category(value: unknown): boolean { return record(value) && strings(value, ['id', 'name', 'status']) && Array.isArray(value.children) && value.children.every(category); }
function validate<T>(path: string, value: unknown): T {
    let valid = false;
    if (path === '/catalog/categories') valid = Array.isArray(value) && value.every(category);
    else {
        const kind = path.includes('/inventories') ? 'inventory' : path.includes('/skus') ? 'sku' : path.includes('/orders') ? 'order' : 'product';
        const paged = path.includes('?');
        if (paged) valid = record(value) && Array.isArray(value.content) && value.content.every(v => item(v, kind)) && ['page', 'size', 'totalElements', 'totalPages'].every(k => Number.isInteger(value[k]) && Number(value[k]) >= 0) && typeof value.first === 'boolean' && typeof value.last === 'boolean';
        else valid = item(value, kind);
        if (valid && kind === 'order' && !paged) { valid = record(value) && Array.isArray(value.items) && value.items.every(v => record(v) && strings(v, ['id', 'productId', 'skuId', 'productNameSnapshot', 'skuCodeSnapshot']) && Number.isInteger(v.quantity) && money(v.unitPrice) && money(v.subtotal)); }
    }
    if (!valid) throw new Error('Phản hồi API bán hàng không hợp lệ. Vui lòng tải lại.');
    return value as T;
}
async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> { return validate<T>(path, await rawGet<unknown>(path, signal)); }
async function apiRequest<T>(path: string, options: RequestInit): Promise<T> { const result = await rawRequest<unknown>(path, options); return options.method === 'DELETE' ? result as T : validate<T>(path, result); }
