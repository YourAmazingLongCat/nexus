import { api, type PageResponse } from './client';
export interface HeaderCategory { id: string; name: string; children: HeaderCategory[] }
export interface HeaderNotification { id: string; title: string; content?: string; read: boolean; createdAt: string }
const flattenCategories = (categories: HeaderCategory[]): HeaderCategory[] => categories.flatMap(category => [category, ...flattenCategories(category.children ?? [])]);
const notificationsPath = '/api/v1/notification/notifications';
export const headerApi = {
  categories: (signal?: AbortSignal) => api<HeaderCategory[]>('/api/v1/catalog/categories', { signal }).then(flattenCategories),
  cart: async (signal?: AbortSignal) => {
    const cart = await api<{ items: { id: string; productId: string; quantity: number; unitPrice: number; productName?: string }[] }>('/api/v1/buyer/commerce/cart', { signal });
    const products = new Map(await Promise.all([...new Set(cart.items.map(item => item.productId))].map(async id => {
      const product = await api<{ id: string; name: string }>('/api/v1/catalog/products/' + encodeURIComponent(id), { signal });
      return [id, product.name] as const;
    })));
    return { ...cart, items: cart.items.map(item => ({ ...item, productName: products.get(item.productId) })) };
  },
  notifications: (signal?: AbortSignal) => api<PageResponse<HeaderNotification>>(notificationsPath + '?size=5', { signal }),
  unreadCount: (signal?: AbortSignal) => api<number>(notificationsPath + '/unread-count', { signal }),
  readAll: () => api(notificationsPath + '/read-all', { method: 'PATCH' }),
  notification: (id: string) => api<HeaderNotification>(notificationsPath + '/' + encodeURIComponent(id)),
  read: (id: string) => api(notificationsPath + '/' + encodeURIComponent(id) + '/read', { method: 'PATCH' }),
};
