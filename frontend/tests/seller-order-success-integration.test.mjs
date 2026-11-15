import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('seller order detail integrates seller shell without inventing an order success', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  try {
    const { default: AppRoutes } = await server.ssrLoadModule('/src/app/routes/AppRoutes.tsx');
    for (const url of ['/seller/orders/success', '/seller/orders/success?orderId=does-not-exist']) {
      const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(AppRoutes)));
      assert.match(html, /nx-seller-layout/);
      assert.match(html, /nx-success-page/);
      assert.match(html, /Không tìm thấy đơn DEMO/);
      assert.match(html, /href="\/seller-hub"/);
      assert.equal((html.match(/<header class="nexus-header/g) || []).length, 1);
      assert.equal((html.match(/<footer class="nexus-footer/g) || []).length, 1);
      assert.doesNotMatch(html, /u363-shell|#ORD-2025-8839|Xác nhận đóng gói DEMO|Hoàn tất đơn DEMO/);
    }
  } finally { await server.close(); }
});