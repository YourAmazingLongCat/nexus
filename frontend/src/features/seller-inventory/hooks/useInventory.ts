import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoActions, useDemoStore } from '../../../shared/demo/demoStore';
import type { InventoryProduct } from '../types/inventory';
import { inventoryProducts } from '../mocks/inventory.mock';
import { notify } from '../../../shared/components/Toast';
export function useInventory() {
  const navigate = useNavigate();
  const store = useDemoStore();
  const [hidden, setHidden] = useState<string[]>([]);
  const products = useMemo(() => {
  const sharedProducts: InventoryProduct[] = [...store.products].reverse().map(p => ({id:p.id,name:p.title,sku:p.id,category:p.category,categoryId:p.category,image:p.image,condition:p.condition,conditionId:p.condition,photoLabel:'Demo',price:p.price,priceNote:'Giá bán demo',stock:String(p.quantity),sold:'0 đã bán',views:'0',engagement:'Dữ liệu trên thiết bị',status:'listed',visible:!hidden.includes(p.id)}));
  const drafts: InventoryProduct[] = store.drafts.map(p => ({id:p.id,name:p.title || 'Bản nháp chưa có tên',sku:p.id,category:p.category,categoryId:p.category,image:inventoryProducts[0].image,condition:p.condition,conditionId:p.condition,photoLabel:'Nháp',price:p.price,priceNote:'Chưa đăng bán',stock:String(p.quantity),sold:'0 đã bán',views:'0',engagement:'Bản nháp trên thiết bị',status:'draft',visible:false}));
  return [...drafts,...sharedProducts,...inventoryProducts.map(p => ({...p,visible: hidden.includes(p.id) ? !p.visible : p.visible}))];
  }, [store.products, store.drafts, hidden]);
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const [sort, setSort] = useState('updated');
  const [pageSize, setPageSize] = useState('10');
  const [selected, setSelected] = useState<string[]>([]);
  const action = (label: string, id?: string) => { if (label.includes('Đăng bán sản phẩm mới')) { navigate('/seller/products/new'); return; } if (id && store.drafts.some(d => d.id === id)) { if (label === 'Tiếp tục sửa') { navigate(`/seller/products/new?draft=${encodeURIComponent(id)}`); return; } if (label === 'Xóa bản nháp') { demoActions.removeDraft(id); return; } } notify.info(`${label} — mô phỏng UI, chưa kết nối Backend.`); };
  const rows = useMemo(() => {
    const text = query.trim().toLocaleLowerCase('vi');
    const filtered = products.filter(p => (tab === 'all' || p.status === tab) && (category === 'all' || p.categoryId === category) && (condition === 'all' || p.conditionId === condition) && `${p.name} ${p.sku} ${p.verified ?? ''}`.toLocaleLowerCase('vi').includes(text));
    if (sort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
    if (sort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
    if (sort === 'views') { const views = (s: string) => Number.parseFloat(s) * (s.includes('k') ? 1000 : 1) || 0; filtered.sort((a,b) => views(b.views) - views(a.views)); }
    if (sort === 'stock') filtered.sort((a,b) => (Number(a.stock.match(/\d+/)?.[0]) || 0) - (Number(b.stock.match(/\d+/)?.[0]) || 0));
    return filtered;
  }, [products, tab, query, category, condition, sort]);
  function toggle(id: string) { setSelected(previous => previous.includes(id) ? previous.filter(key => key !== id) : [...previous, id]); }
  function toggleAll() { const ids = rows.map(row => row.id); setSelected(previous => ids.every(id => previous.includes(id)) ? previous.filter(id => !ids.includes(id)) : [...new Set([...previous, ...ids])]); }
  function toggleVisibility(id: string) { setHidden(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]); }
  return { tab, setTab, query, setQuery, category, setCategory, condition, setCondition, sort, setSort, pageSize, setPageSize, selected, toggle, toggleAll, rows, toggleVisibility, action };
}
export type InventoryState = ReturnType<typeof useInventory>;
