import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

test('cart route integrates with buyer layout and product navigation', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  try {
    const { initialCartItems } = await server.ssrLoadModule('/src/features/commerce/cart/mocks/cart.mock.ts');
    assert.ok(initialCartItems.every(item => item.image.endsWith('.webp')));
    const { default: AppRoutes } = await server.ssrLoadModule('/src/app/routes/AppRoutes.tsx');
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ['/cart'] }, createElement(AppRoutes)));
    assert.match(html, /nx-buyer-layout/);
    assert.match(html, /nx-cart-page/);
    assert.match(html, /Kashtira Fenrir/);
    assert.match(html, /Red-Eyes Dark Dragoon/);
    assert.match(html, /NEXUSWELCOME/);
    assert.equal((html.match(/<header class="nexus-header/g) || []).length, 1);
    assert.equal((html.match(/<footer\b/g) || []).length, 1);
    assert.doesNotMatch(html, /u363-shell/);

    const { default: CartEmptyState } = await server.ssrLoadModule('/src/features/commerce/cart/components/CartEmptyState.tsx');
    const emptyHtml = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(CartEmptyState)));
    assert.match(emptyHtml, /href="\/products"/);
  } finally {
    await server.close();
  }
});
