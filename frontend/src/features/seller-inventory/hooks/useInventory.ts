import { useMemo, useState } from 'react';
import { inventoryProducts } from '../mocks/inventory.mock';
import { notify } from '../../../shared/components/Toast';
export function useInventory() {
  const [products, setProducts] = useState(inventoryProducts);
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const [sort, setSort] = useState('updated');
  const [pageSize, setPageSize] = useState('10');
  const [selected, setSelected] = useState<string[]>([]);
  const action = (label: string) => { notify.info(`${label} — mô phỏng UI, chưa kết nối Backend.`); };
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
  function toggleVisibility(id: string) { setProducts(previous => previous.map(p => p.id === id ? { ...p, visible: !p.visible } : p)); }
  return { tab, setTab, query, setQuery, category, setCategory, condition, setCondition, sort, setSort, pageSize, setPageSize, selected, toggle, toggleAll, rows, toggleVisibility, action };
}
export type InventoryState = ReturnType<typeof useInventory>;
