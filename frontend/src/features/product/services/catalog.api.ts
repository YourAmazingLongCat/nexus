import { api, ApiError } from '../../../services/api/client';
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';
export interface CatalogProduct {
  id: string; name: string; basePrice: number; status: ProductStatus;
  sellerId: string; categoryId: string | null; categoryName: string | null;
  primaryImageUrl: string | null; createdAt: string;
}
export interface CatalogProductDetail extends CatalogProduct {
  description: string | null; images: string[]; updatedAt: string;
}
export interface CatalogCategory {
  id: string; name: string; description: string | null; parentId: string | null;
  status: 'ACTIVE' | 'INACTIVE'; sortOrder: number | null; children: CatalogCategory[];
}
export interface CatalogPage<T> {
  content: T[]; page: number; size: number; totalElements: number; totalPages: number;
}
export interface CatalogQuery {
  keyword?: string; categoryId?: string; minPrice?: number; maxPrice?: number;
  status?: ProductStatus; page?: number; size?: number;
  sort?: 'basePrice,asc' | 'basePrice,desc' | 'createdAt,asc' | 'createdAt,desc';
}
export function catalogQueryString(query: CatalogQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  return params.toString();
}
function invalid(): never { throw new ApiError(200, 'Dữ liệu catalog từ máy chủ không hợp lệ. Vui lòng thử lại.'); }
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid();
  return value as Record<string, unknown>;
}
function text(value: unknown): string { return typeof value === 'string' ? value : invalid(); }
function nullableText(value: unknown): string | null { return value == null ? null : text(value); }
function nonnegativeInteger(value: unknown): number { return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : invalid(); }
// Explicit adapters reject malformed wire data; never synthesize commercial metadata.
export function adaptProduct(value: unknown): CatalogProduct {
  const product = record(value);
  if (typeof product.basePrice !== 'number' || !Number.isFinite(product.basePrice) || product.basePrice < 0 || !['DRAFT', 'ACTIVE', 'INACTIVE'].includes(String(product.status))) return invalid();
  return {
    id: text(product.id), name: text(product.name), basePrice: product.basePrice, status: product.status as ProductStatus,
    sellerId: text(product.sellerId), categoryId: nullableText(product.categoryId), categoryName: nullableText(product.categoryName),
    primaryImageUrl: nullableText(product.primaryImageUrl), createdAt: text(product.createdAt)
  };
}
export function adaptProductDetail(value: unknown): CatalogProductDetail {
  const product = record(value);
  if (!Array.isArray(product.images)) return invalid();
  return { ...adaptProduct(product), description: nullableText(product.description), images: product.images.map(text), updatedAt: text(product.updatedAt) };
}
export function adaptCategory(value: unknown): CatalogCategory {
  const category = record(value);
  if (!Array.isArray(category.children) || !['ACTIVE', 'INACTIVE'].includes(String(category.status))) return invalid();
  return {
    id: text(category.id), name: text(category.name), description: nullableText(category.description), parentId: nullableText(category.parentId),
    status: category.status as CatalogCategory['status'], sortOrder: category.sortOrder == null ? null : nonnegativeInteger(category.sortOrder), children: category.children.map(adaptCategory)
  };
}
export function flattenCategories(tree: CatalogCategory[]): CatalogCategory[] {
  return tree.flatMap(category => [category, ...flattenCategories(category.children)]);
}
export function adaptProductPage(value: unknown): CatalogPage<CatalogProduct> {
  const page = record(value);
  if (!Array.isArray(page.content)) return invalid();
  return {
    content: page.content.map(adaptProduct), page: nonnegativeInteger(page.page), size: nonnegativeInteger(page.size),
    totalElements: nonnegativeInteger(page.totalElements), totalPages: nonnegativeInteger(page.totalPages)
  };
}
export async function listCatalogProducts(query: CatalogQuery, signal?: AbortSignal): Promise<CatalogPage<CatalogProduct>> {
  return adaptProductPage(await api(`/api/v1/catalog/products?${catalogQueryString(query)}`, { signal }));
}
export async function getCatalogProduct(id: string, signal?: AbortSignal): Promise<CatalogProductDetail> {
  return adaptProductDetail(await api(`/api/v1/catalog/products/${encodeURIComponent(id)}`, { signal }));
}
export async function getCatalogCategories(signal?: AbortSignal): Promise<CatalogCategory[]> {
  const tree = await api<unknown>('/api/v1/catalog/categories', { signal });
  if (!Array.isArray(tree)) return invalid();
  return tree.map(adaptCategory);
}
