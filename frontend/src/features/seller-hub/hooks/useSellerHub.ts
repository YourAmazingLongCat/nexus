import { useMemo, useRef, useState } from 'react';
import { useDemoStore } from '../../../shared/demo/demoStore';
import type { SellerOrder } from '../types/sellerHub';
import { notify } from '../../../shared/components/Toast';
import { initialDraft, initialProducts, sellerAuctions } from '../mocks/sellerHub.mock';
import type { ListingDraft, ProductStatus, SellerTabId } from '../types/sellerHub';

export function useSellerHub() {
  const [activeTab, setActiveTab] = useState<SellerTabId>('products');
  const [products, setProducts] = useState(initialProducts);
  const [draft, setDraft] = useState<ListingDraft>({ ...initialDraft });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('default');
  const [selected, setSelected] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [auctionFilter, setAuctionFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  const [reportRange, setReportRange] = useState('6m');
  const nameRef = useRef<HTMLInputElement>(null);
  // TODO(seller-hub): UI-only state; no persistence, upload, export or backend calls.
  const mockAction = (label: string) => { notify.info(`${label} — thao tác mô phỏng, chưa kết nối Backend.`); };
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('vi');
    const rows = products.filter(product => `${product.name} ${product.sku}`.toLocaleLowerCase('vi').includes(query)
      && (status === 'all' || product.status === status as ProductStatus));
    if (sort !== 'default') rows.sort((a, b) => sort === 'stock-desc' ? b.stock - a.stock : a.stock - b.stock);
    return rows;
  }, [products, search, status, sort]);
  // TODO(seller-hub): lọc phía client trên mock; chưa gọi REST API.
  const visibleAuctions = useMemo(
    () => sellerAuctions.filter(auction => auctionFilter === 'all' || auction.state === auctionFilter),
    [auctionFilter],
  );
  const { orders: demoOrders } = useDemoStore();
  const orders: SellerOrder[] = demoOrders.map(order => ({
    id: order.id, code: order.id, buyer: 'Khách mua DEMO', contact: 'Không có dữ liệu liên hệ thật',
    items: order.items.map(item => item.title).join(', '),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0) + ' sản phẩm', total: order.total,
    method: 'DEMO • Chưa vận chuyển', express: false,
    status: order.status === 'placed' ? 'pending' : order.status === 'fulfilled' ? 'done' : 'packing',
    placedAt: new Date(order.createdAt).toLocaleString('vi-VN'), deadline: 'Mô phỏng • không có hạn giao thật',
  }));
  const visibleOrders = orders.filter(order => orderFilter === 'all' || order.status === orderFilter);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const orderCounts = Object.fromEntries(['all', 'pending', 'packing', 'shipping', 'done', 'cancelled'].map(status =>
    [status, status === 'all' ? orders.length : orders.filter(order => order.status === status).length]));
  function updateDraft<K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) {
    setDraft(previous => ({ ...previous, [key]: value }));
  }
  function toggleSelected(id: string) {
    setSelected(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]);
  }
  function toggleAll() {
    const ids = visibleProducts.map(product => product.id);
    setSelected(previous => ids.every(id => previous.includes(id)) ? previous.filter(id => !ids.includes(id)) : [...new Set([...previous, ...ids])]);
  }
  function changeStock(id: string, delta: number) {
    setProducts(previous => previous.map(product => product.id === id ? { ...product, stock: Math.max(0, product.stock + delta) } : product));
  }
  function submitListing() {
    if (!draft.name.trim() || Number(draft.price) <= 0 || !Number.isInteger(Number(draft.stock)) || Number(draft.stock) < 0 || !draft.stock) {
      notify.warning('Vui lòng nhập tên, giá bán lớn hơn 0 và tồn kho nguyên không âm.');
      return;
    }
    mockAction(`Lưu & Đăng “${draft.name.trim()}”`);
  }
  function focusListing() { setCollapsed(false); requestAnimationFrame(() => nameRef.current?.focus()); }
  return { activeTab, setActiveTab, draft, updateDraft, search, setSearch, status, setStatus, sort, setSort, selected, toggleSelected, toggleAll,
    collapsed, setCollapsed, imageNames, setImageNames, nameRef, visibleProducts, changeStock, submitListing, focusListing, mockAction,
    auctionFilter, setAuctionFilter, visibleAuctions, orderFilter, setOrderFilter, visibleOrders, pendingOrders, orderCounts, reportRange, setReportRange };
}
export type SellerHubState = ReturnType<typeof useSellerHub>;
