import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { listCatalogProducts, listAuctions, type Listing } from '../../../services/api/catalog';
import { apiErrorMessage } from '../../../services/api/client';
import { notify } from '../../../shared/components/Toast';

export const PAGE_SIZE = 24;
const budgetLabels: Record<string, string> = {
  under5: 'Dưới 5 triệu',
  '5to20': '5 triệu – 20 triệu',
  over20: 'Trên 20 triệu',
};

export function useProductListing() {
  const { categoryId: routeCategoryId = 'all' } = useParams();
  const [params, setParams] = useSearchParams();
  const categoryId = routeCategoryId !== 'all' ? routeCategoryId : params.get('categoryId') || 'all';
  const requestedMode = params.get('mode');
  const mode =
    requestedMode === 'auction' || requestedMode === 'buy-now'
      ? requestedMode
      : 'all';
  const query = params.get('q') ?? '';
  function setQuery(value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set('q', value);
    else next.delete('q');
    setParams(next);
  }
  const [sort, setSort] = useState('featured');
  const [budget, setBudget] = useState('all');
  const [pagination, setPagination] = useState({ key: '', page: 1 });
  function setMode(value: string) {
    const next = new URLSearchParams(params);
    if (value === 'all') next.delete('mode'); else next.set('mode', value);
    setParams(next);
  }
  function resetFilters() {
    const next = new URLSearchParams(params); next.delete('q'); next.delete('mode');
    setParams(next); setSort('featured'); setBudget('all');
  }
  const resultKey = JSON.stringify([categoryId, mode, query, budget, sort]);
  const page = pagination.key === resultKey ? pagination.page : 1;
  const [products, setProducts] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError(''); setProducts([]); setTotal(0);
    if (mode === 'auction' && (categoryId !== 'all' || budget !== 'all')) {
      const message = 'API đấu giá chưa hỗ trợ lọc danh mục hoặc khoảng giá. Bỏ các bộ lọc này để xem phiên đấu giá.';
      setError(message); notify.error(message); setLoading(false); return () => controller.abort();
    }
    const sortValue = sort === 'price-low' ? 'basePrice,asc' : sort === 'price-high' ? 'basePrice,desc' : 'createdAt,desc';
    const request = mode === 'auction' ? listAuctions(new URLSearchParams({ status: 'ACTIVE', keyword: query.trim(), page: String(page - 1), size: String(PAGE_SIZE), sort: sort === 'price-low' ? 'currentPrice,asc' : sort === 'price-high' ? 'currentPrice,desc' : 'endTime,asc' }), controller.signal)
      : listCatalogProducts({ keyword: query.trim(), categoryId: categoryId === 'all' ? undefined : categoryId, status: 'ACTIVE', page: page - 1, size: PAGE_SIZE, sort: sortValue,
       minPrice: budget === '5to20' ? 5000000 : budget === 'over20' ? 20000001 : undefined,
       maxPrice: budget === 'under5' ? 4999999 : budget === '5to20' ? 20000000 : undefined }, controller.signal);
    request.then(result => { setProducts(result.content); setTotal(result.totalElements); setPageCount(result.totalPages); }).catch(error => { if (!controller.signal.aborted) { setError(apiErrorMessage(error)); notify.error(apiErrorMessage(error)); } }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
  return () => controller.abort();
  }, [categoryId, mode, query, budget, sort, page, retry]);
  const start = (page - 1) * PAGE_SIZE;
  const pageProducts = products;
  const selectSort = (value: string) => { if (value === 'rating') { notify.error('API chưa hỗ trợ sắp xếp theo đánh giá.'); return; } setSort(value); };

  const activeFilters = [
    ...(query ? [{ label: `Tìm: ${query}`, clear: () => setQuery('') }] : []),
    ...(mode !== 'all'
      ? [
          {
            label: mode === 'auction' ? 'Đấu giá trực tiếp' : 'Mua ngay',
            clear: () => setMode('all'),
          },
        ]
      : []),
    ...(budget !== 'all'
      ? [{ label: budgetLabels[budget], clear: () => setBudget('all') }]
      : []),
  ];


    return { categoryId, mode, query, setQuery, sort, budget, setBudget, setMode, resetFilters, resultKey, page, products, total, pageCount, loading, error, setRetry, start, pageProducts, selectSort, activeFilters, setPagination };
}
