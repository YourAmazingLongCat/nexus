// Kiểu dữ liệu cho trang "Bán hàng thành công" — giai đoạn UI (mock only).

export interface OrderBreadcrumbItem {
  label: string;
  icon?: string;
  to?: string;
}

export type OrderMoneyTone = 'value' | 'deduct' | 'free' | 'net';

export interface OrderMoneyRow {
  id: string;
  label: string;
  value: string;
  note: string;
  tone: OrderMoneyTone;
  noteStrong?: boolean;
  highlight?: boolean;
  highlightIcon?: string;
}

export type FulfillmentState = 'done' | 'active' | 'pending';
export type FulfillmentTimeTone = 'outline' | 'deadline';

export interface FulfillmentStep {
  id: string;
  index: number;
  title: string;
  caption: string;
  timestamp: string;
  timeTone: FulfillmentTimeTone;
  state: FulfillmentState;
  stateLabel: string;
  badgeIcon?: string;
}

export interface OrderHeroInfo {
  orderType: string;
  paidAt: string;
  orderCode: string;
  title: string;
  buyerName: string;
  buyerHandle: string;
  buyerBadge: string;
  escrowNote: string;
}

export interface SoldProduct {
  sku: string;
  image: string;
  imageAlt: string;
  conditionBadge: string;
  verifiedBadge: string;
  serial: string;
  title: string;
  variant: string;
  quantity: string;
  saleType: string;
  priceLabel: string;
  price: string;
}

export interface OrderBuyerInfo {
  shippingBadge: string;
  name: string;
  phone: string;
  rating: string;
  awb: string;
  pickupMethod: string;
  address: string;
  noteLabel: string;
  note: string;
}

export interface PackingChecklistItem {
  id: string;
  title: string;
  caption: string;
}

export interface InventoryAction {
  id: string;
  icon: string;
  label: string;
}

export interface EscrowBanner {
  title: string;
  description: string;
  secondaryLabel: string;
  primaryLabel: string;
}

export interface OrderSuccessToastMessages {
  print: string;
  packed: string;
  copied: string;
}
