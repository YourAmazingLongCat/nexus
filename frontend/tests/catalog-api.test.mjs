import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
const storage = () => { const map = new Map(); return { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key) }; };
const product = { id: 'real-product', name: 'Máy ảnh thật', basePrice: 1200000, status: 'ACTIVE', sellerId: 'seller', categoryId: 'category', categoryName: 'Máy ảnh', primaryImageUrl: null, createdAt: '2026-01-01T00:00:00Z' };
const detail = { ...product, description: 'Mô tả thật', images: ['https://example.test/one.webp'], updatedAt: product.createdAt };
const category = { id: 'category', name: 'Máy ảnh', description: null, parentId: null, status: 'ACTIVE', sortOrder: 0, children: [] };
test('catalog read API: bearer, query, adapters, paging, errors, expired session and abort', async () => {
    const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
    const oldFetch = globalThis.fetch;
    const oldLocal = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    const oldSession = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
    Object.defineProperty(globalThis, 'localStorage', { value: storage(), configurable: true });
    Object.defineProperty(globalThis, 'sessionStorage', { value: storage(), configurable: true });
    try {
        const auth = await server.ssrLoadModule('/src/features/auth/services/auth.api.ts');
        const api = await server.ssrLoadModule('/src/features/product/services/catalog.api.ts');
        const http = await server.ssrLoadModule('/src/shared/api/http.ts');
        const session = { userId: 'user', email: 'test@example.test', fullName: 'Test', roles: ['BUYER'], accessToken: 'mock-token', tokenType: 'Bearer', expiresAt: new Date(Date.now() + 60000).toISOString() };
        const login = () => auth.saveSession(session, false);
        let calls = 0, last;
        globalThis.fetch = async (url, options) => { calls++; last = { url, options }; return Response.json({ content: [product], page: 0, size: 24, totalElements: 1, totalPages: 1 }); };
        await assert.rejects(api.listCatalogProducts({}), error => error.status === 401); assert.equal(calls, 0);
        login();
        const controller = new AbortController();
        const result = await api.listCatalogProducts({ keyword: 'máy & ảnh', categoryId: 'category', minPrice: 0, maxPrice: 20000000, status: 'ACTIVE', page: 0, size: 24, sort: 'basePrice,asc' }, controller.signal);
        assert.deepEqual(result.content, [product]); assert.equal(result.totalElements, 1);
        const url = new URL(last.url); assert.equal(url.origin, 'http://localhost:8080'); assert.equal(url.pathname, '/api/v1/catalog/products');
        assert.deepEqual(Object.fromEntries(url.searchParams), { keyword: 'máy & ảnh', categoryId: 'category', minPrice: '0', maxPrice: '20000000', status: 'ACTIVE', page: '0', size: '24', sort: 'basePrice,asc' });
        assert.equal(last.options.headers.Authorization, 'Bearer mock-token'); assert.equal(last.options.signal, controller.signal); assert.equal(last.options.method, 'GET');
        assert.equal(api.catalogQueryString({ keyword: '', categoryId: undefined, page: 0 }), 'page=0');
        assert.equal(api.catalogQueryString({ categoryId: undefined }).includes('all'), false);
        globalThis.fetch = async (url, options) => { last = { url, options }; return Response.json(detail); };
        assert.deepEqual(await api.getCatalogProduct('id/with space'), detail); assert.ok(last.url.endsWith('/products/id%2Fwith%20space'));
        globalThis.fetch = async () => Response.json([category]); assert.deepEqual(await api.getCatalogCategories(), [category]);
        const child = { ...category, id: 'child', parentId: 'category' }; assert.deepEqual(api.flattenCategories([{ ...category, children: [child] }]).map(x => x.id), ['category', 'child']);
        const adapted = api.adaptProduct({ ...product, stock: 99, rating: 5, mode: 'auction' }); assert.equal('stock' in adapted, false); assert.equal('rating' in adapted, false); assert.equal('mode' in adapted, false);
        assert.notEqual(api.adaptProductDetail(detail).images, detail.images);
        for (const bad of [null, {}, { ...product, basePrice: '100' }, { ...product, basePrice: NaN }, { ...product, status: 'WRONG' }]) assert.throws(() => api.adaptProduct(bad), /không hợp lệ/);
        assert.throws(() => api.adaptProductDetail({ ...detail, images: null }), /không hợp lệ/);
        assert.throws(() => api.adaptCategory({ ...category, children: null }), /không hợp lệ/);
        assert.throws(() => api.adaptProductPage({ content: [product], page: -1, size: 24, totalElements: 1, totalPages: 1 }), /không hợp lệ/);
        for (const body of [null, {}, { content: 'wrong' }]) { globalThis.fetch = async () => Response.json(body); await assert.rejects(api.listCatalogProducts({}), /không hợp lệ/); }
        globalThis.fetch = async () => Response.json({ message: 'Backend validation error', details: [{ field: 'q' }] }, { status: 400 });
        await assert.rejects(http.apiGet('/catalog/products'), error => error.status === 400 && error.message === 'Backend validation error' && error.details.length === 1);
        for (const status of [403, 404, 500]) { globalThis.fetch = async () => Response.json({ message: 'server error' }, { status }); await assert.rejects(http.apiGet('/catalog/products'), error => error.status === status); assert.ok(auth.getSession()); }
        globalThis.fetch = async () => { throw new TypeError('network'); }; await assert.rejects(api.listCatalogProducts({}), error => error.status === 0);
        globalThis.fetch = async () => new Response('not json'); await assert.rejects(api.listCatalogProducts({}), /không hợp lệ/);
        const aborted = new AbortController(); aborted.abort(); calls = 0; globalThis.fetch = async () => { calls++; return Response.json([]); }; await assert.rejects(api.getCatalogCategories(aborted.signal), error => error.name === 'AbortError'); assert.equal(calls, 0);
        const pending = new AbortController(); globalThis.fetch = (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }));
        const request = api.getCatalogCategories(pending.signal); pending.abort(); await assert.rejects(request, error => error.name === 'AbortError');
        globalThis.fetch = async () => Response.json({ message: 'unauthorized' }, { status: 401 }); await assert.rejects(api.getCatalogCategories(), error => error.status === 401); assert.equal(auth.getSession(), null);
        auth.saveSession({ ...session, expiresAt: new Date(Date.now() + 100).toISOString() }, false);
        sessionStorage.setItem('nexus.auth.session', JSON.stringify({ ...session, expiresAt: '2000-01-01T00:00:00Z' }));
        calls = 0; globalThis.fetch = async () => { calls++; return Response.json([]); }; await assert.rejects(api.getCatalogCategories(), error => error.status === 401); assert.equal(calls, 0);
    } finally {
        globalThis.fetch = oldFetch;
        for (const [key, descriptor] of [['localStorage', oldLocal], ['sessionStorage', oldSession]]) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
        await server.close();
    }
});
test('real catalog cards and detail preserve layout without demo commerce or fabricated metadata', async () => {
    const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
    try {
        const { default: Card } = await server.ssrLoadModule('/src/features/product/components/CatalogProductCard.tsx');
        const { ProductDetail } = await server.ssrLoadModule('/src/features/product/pages/ProductDetailPage.tsx');
        const wrap = component => renderToStaticMarkup(createElement(MemoryRouter, null, component));
        const card = wrap(createElement(Card, { product })); assert.match(card, /real-product/); assert.match(card, /Đăng nhập để thêm giỏ/); assert.match(card, /Chưa có ảnh sản phẩm/); assert.doesNotMatch(card, /★★★★★|Miễn phí|Trả góp|nx-old-price/);
        const html = wrap(createElement(ProductDetail, { product: detail })); assert.match(html, /nx-detail-grid/); assert.match(html, /nx-detail-bottom/); assert.match(html, /nx-specs/); assert.match(html, /nx-reviews/); assert.match(html, /Mô tả thật/); assert.match(html, /chưa được kết nối/); assert.doesNotMatch(html, /CameraHub|842|398241|4\.95|Top Rated/);
    } finally { await server.close(); }
});
