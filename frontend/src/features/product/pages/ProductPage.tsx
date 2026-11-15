import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { listCatalogProducts, listAuctions, type Listing } from '../../../services/api/catalog';
import { apiErrorMessage } from '../../../services/api/client';
import { notify } from '../../../shared/components/Toast';
import ProductList from '../components/ProductList';
import ProductFilter from '../components/ProductFilter';
import ProductSort from '../components/ProductSort';
import ProductPagination from '../components/ProductPagination';
import '../styles/product-list.css';

const PAGE_SIZE = 24;
const budgetLabels: Record<string, string> = {
  under5: 'Dưới 5 triệu',
  '5to20': '5 triệu – 20 triệu',
  over20: 'Trên 20 triệu',
};

function ProductPage() {
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


  return (
    <main className="nx-container nx-category-page nx-product-results">
      <div className="nx-results-toolbar">
        <p role="status">
          {total ? (
            <>
              <strong>
                {start + 1}–{Math.min(start + PAGE_SIZE, total)}
              </strong>{' '}
              trong <strong>{total}</strong> kết quả
            </>
          ) : (
            '0 kết quả'
          )}
          {query.trim() && (
            <>
              {' '}
              cho “<strong>{query.trim()}</strong>”
            </>
          )}
        </p>
        <ProductSort sort={sort} setSort={selectSort} />
      </div>
      <div className="nx-category-layout">
        <ProductFilter
          categoryId={categoryId}
          mode={mode}
          setMode={setMode}
          budget={budget}
          setBudget={setBudget}
          onReset={resetFilters}
        />
        <section aria-labelledby="product-results-title">
          <label className="nx-results-search">
            <span>Tìm trong danh sách</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={mode === 'auction' ? 'Nhập UUID sản phẩm hoặc người bán…' : 'Nhập tên sản phẩm…'}
            />
          </label>
          {activeFilters.length > 0 && (
            <div className="nx-active-filters" aria-label="Bộ lọc đang áp dụng">
              {activeFilters.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={filter.clear}
                  aria-label={`Bỏ bộ lọc ${filter.label}`}
                >
                  {filter.label} <span aria-hidden="true">×</span>
                </button>
              ))}
              <button
                type="button"
                className="nx-clear-filters"
                onClick={resetFilters}
              >
                Xóa tất cả
              </button>
            </div>
          )}
          <div className="nx-results-intro">
            <h2 id="product-results-title">Kết quả</h2>
            <p>
              {mode === 'auction' ? 'Phiên đấu giá đang hoạt động từ máy chủ.' : 'Danh sách sản phẩm mua trực tiếp từ máy chủ. Chọn Đấu giá để xem các phiên đang hoạt động.'}
            </p>
          </div>
          {loading ? <p role="status">Đang tải sản phẩm…</p> : error ? <div className="nx-empty" role="alert"><p>{error}</p><button className="nx-button nx-button-soft" onClick={() => setRetry(value => value + 1)}>Thử lại</button></div> : total ? (
            <>
              <ProductList products={pageProducts} />
              <ProductPagination
                page={page}
                pageCount={pageCount}
                onPageChange={(nextPage) =>
                  setPagination({ key: resultKey, page: nextPage })
                }
              />
            </>
          ) : (
            <div className="nx-empty">
              <h2>
                {products.length
                  ? 'Không tìm thấy sản phẩm phù hợp'
                  : 'Chưa có sản phẩm'}
              </h2>
              <p>
                {products.length
                  ? 'Thử từ khóa khác hoặc bỏ bớt bộ lọc để xem thêm sản phẩm.'
                  : 'Danh sách sẽ hiển thị khi có nguồn dữ liệu sản phẩm.'}
              </p>
              <button
                type="button"
                className="nx-button nx-button-primary"
                onClick={resetFilters}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default ProductPage;
