import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('seller hub integrates seller layout, listing form, mock inventory and header entry', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  try {
    const { default: AppRoutes } = await server.ssrLoadModule('/src/app/routes/AppRoutes.tsx');
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ['/seller-hub'] }, createElement(AppRoutes)));
    assert.match(html, /nx-seller-layout/);
    assert.match(html, /nx-seller-page/);
    assert.match(html, /Trung tâm Quản lý Bán hàng/);
    assert.match(html, /id="seller-listing-form"/);
    for (const tab of ['products', 'auctions', 'orders', 'reports']) assert.match(html, new RegExp('id="hub-tab-' + tab + '"'));
    assert.match(html, /aria-selected="true"/);
    for (const tab of ['products', 'auctions', 'orders', 'reports']) assert.match(html, new RegExp('id="hub-tab-' + tab + '"'));
    assert.match(html, /aria-selected="true"/);
    assert.match(html, /href="\/seller-hub"/);
    assert.match(html, /Dell XPS 15 9530/);
    assert.equal((html.match(/<header class="nexus-header/g) || []).length, 1);
    assert.equal((html.match(/<footer\b/g) || []).length, 1);
    assert.doesNotMatch(html, /u363-shell|nx-hub-page/);
    const { initialProducts, initialDraft } = await server.ssrLoadModule('/src/features/seller-hub/mocks/sellerHub.mock.ts');
    assert.equal(initialProducts.length, 4);
    assert.ok(initialProducts.every(product => product.image.includes('seller-hub') && product.image.endsWith('.jpg')));
    const { default: ProductInventory } = await server.ssrLoadModule('/src/features/seller-hub/components/ProductInventory.tsx');
    const empty = renderToStaticMarkup(createElement(ProductInventory, { hub: { visibleProducts: [], selected: [], search: 'missing', status: 'all', sort: 'default', toggleAll: () => {} } }));
    assert.match(empty, /Không có sản phẩm khớp bộ lọc hiện tại/);
    assert.match(empty, /Hiển thị 0 sản phẩm khớp bộ lọc/);
    const { default: QuickListing } = await server.ssrLoadModule('/src/features/seller-hub/components/QuickListing.tsx');
    const collapsed = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(QuickListing, { hub: { collapsed: true, draft: initialDraft, imageNames: [] } })));
    assert.match(collapsed, /href="\/seller\/products\/new"/);
    assert.match(collapsed, /aria-expanded="false"/);
    assert.doesNotMatch(collapsed, /<form/);
  } finally { await server.close(); }
});
