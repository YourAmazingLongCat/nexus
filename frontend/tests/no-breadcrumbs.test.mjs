import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readdirSync, readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('application source no longer contains breadcrumb markup, styles or data', () => {
  function inspect(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
      if (entry.isDirectory()) inspect(path);
      else if (/\.(tsx?|jsx?|css)$/.test(entry.name)) {
        assert.doesNotMatch(readFileSync(path, 'utf8'), /breadcrumb|breadscumb|nx-[\w-]*crumb/i, path.pathname);
      }
    }
  }
  inspect(new URL('../src/', import.meta.url));
});

test('affected pages omit breadcrumbs but preserve checkout steps, inventory status and navigation', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  try {
    const { default: AppRoutes } = await server.ssrLoadModule('/src/app/routes/AppRoutes.tsx');
    const renderRoute = path => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [path] }, createElement(AppRoutes)));
    for (const path of ['/buyer-hub', '/cart', '/seller/products', '/seller/products/new', '/seller/orders/success']) {
      const html = renderRoute(path);
      assert.doesNotMatch(html, /breadcrumb|nx-[\w-]*crumb|aria-label="Đường dẫn"/i, path);
      assert.match(html, /nexus-header/);
      assert.match(html, /nexus-footer/);
    }
    const cart = renderRoute('/cart');
    assert.match(cart, /nx-cart-stepper/);
    assert.equal((cart.match(/class="nx-cart-step-item"/g) || []).length, 3);
    const inventory = renderRoute('/seller/products');
    assert.match(inventory, /Đồng bộ kho/);
    assert.match(inventory, /nx-stock-heading/);
    assert.match(renderRoute('/seller/orders/success'), /Điều hướng đơn hàng/);

  } finally { await server.close(); }
});
