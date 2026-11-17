import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('obsolete notice and unused order-success mock group are removed', () => {
  for (const path of ['shared/demo/DemoNotice.tsx', 'features/seller-order-success/mocks/orderSuccess.mock.ts', 'features/seller-order-success/hooks/useOrderSuccess.ts', 'features/buyer-hub/components/DemoOrders.tsx']) {
    assert.equal(existsSync(new URL('../src/' + path, import.meta.url)), false, path);
  }
  for (const path of ['roles/buyer/layouts/BuyerLayout.tsx','roles/seller/layouts/SellerLayout.tsx']) {
    assert.doesNotMatch(readFileSync(new URL('../src/' + path, import.meta.url), 'utf8'), /DemoNotice/);
  }
  // Runtime mock groups have been replaced by constants and test-only fixtures.
  for (const path of ['buyer-hub/mocks/buyerHub.mock.ts','cart/mocks/cart.mock.ts','seller-hub/mocks/sellerHub.mock.ts','seller-inventory/mocks/inventory.mock.ts','seller-listing/mocks/createListing.mock.ts']) {
    assert.equal(existsSync(new URL('../src/features/' + path, import.meta.url)), false, path);
  }
});

test('buyer and seller pages retain their shell without the backend notice', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  try {
    const { default: Routes } = await server.ssrLoadModule('/src/app/routes/AppRoutes.tsx');
    for (const path of ['/', '/products', '/cart', '/buyer-hub', '/seller-hub', '/seller/products', '/seller/products/new', '/seller/orders/success']) {
      const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [path] }, createElement(Routes)));
      assert.doesNotMatch(html, /Backend connection notice|Các thao tác cần tài khoản và dịch vụ backend đang hoạt động|Dữ liệu máy chủ/, path);
      assert.equal((html.match(/<header class="nexus-header/g) || []).length, 1, path);
      assert.equal((html.match(/<footer class="nexus-footer/g) || []).length, 1, path);
    }
  } finally { await server.close(); }
});
