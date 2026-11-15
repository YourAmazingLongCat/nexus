import type { Product } from '../types/product';
// Legacy demo store compatibility only. Live catalog pages request backend data.
export const products: Product[] = [];
export const formatPrice = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
