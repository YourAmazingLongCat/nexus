import { useDemoStore } from '../../../shared/demo/demoStore';
import { products as fixtures } from './productService';
import type { Product } from '../types/product';

export function useDemoCatalog(): Product[] {
  const { products } = useDemoStore();
  return products.map((product) => ({
    originalPrice: product.price,
    mode: 'buy-now',
    badge: 'MUA NGAY · DEMO',
    bids: 0, rating: 0, endsAt: '',
    ...fixtures.find((item) => item.id === product.id),
    id: product.id, name: product.title, price: product.price,
    image: product.image, categoryId: product.category, condition: product.condition,
    description: product.description, quantity: product.quantity,
  }));
}
