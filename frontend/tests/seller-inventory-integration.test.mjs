import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('seller inventory route renders source inventory in the shared seller shell', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  try {
    const { default: AppRoutes } = await server.ssrLoadModule('/src/app/routes/AppRoutes.tsx');
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ['/seller/products'] }, createElement(AppRoutes)));
    assert.match(html, /nx-seller-layout/);
    assert.match(html, /nx-stock-page/);
    assert.match(html, /href="\/seller-hub"/);
    assert.match(html, /Kho hàng Niêm Yết/);
    assert.equal((html.match(/<header class="nexus-header/g) || []).length, 1);
    assert.equal((html.match(/<footer class="nexus-footer/g) || []).length, 1);
    assert.doesNotMatch(html, /u363-shell/);
    const { inventoryProducts } = await server.ssrLoadModule('/src/features/seller-inventory/mocks/inventory.mock.ts');
    assert.equal(inventoryProducts.length, 6);
    for (const product of inventoryProducts) {
      assert.ok(product.image.includes('seller-inventory') && product.image.endsWith('.jpg'));
      assert.ok(html.includes(product.sku));
    }
    const { default: InventoryTable } = await server.ssrLoadModule('/src/features/seller-inventory/components/InventoryTable.tsx');
    const noop = () => {};
    const empty = renderToStaticMarkup(createElement(InventoryTable, { hub: {
      rows: [], selected: [], tab: 'all', query: 'missing', category: 'all', condition: 'all',
      pageSize: '10', setPageSize: noop, toggleAll: noop, action: noop,
    } }));
    assert.match(empty, /Không có sản phẩm phù hợp với bộ lọc/);
    assert.match(empty, /Hiển thị 0 sản phẩm khớp bộ lọc/);
    const { default: InventoryRow } = await server.ssrLoadModule('/src/features/seller-inventory/components/InventoryRow.tsx');
    const product = inventoryProducts.find(row => row.status === 'listed');
    const hidden = renderToStaticMarkup(createElement('table', null, createElement('tbody', null,
      createElement(InventoryRow, { product: { ...product, visible: false }, hub: { selected: [], toggle: noop, toggleVisibility: noop, action: noop } }))));
    assert.match(hidden, /Đang ẩn/);
    assert.match(hidden, /aria-checked="false"/);
  } finally { await server.close(); }
});
