import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('buyer hub route uses buyer layout and renders source mock dashboard', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  try {
    const { default: AppRoutes } = await server.ssrLoadModule('/src/app/routes/AppRoutes.tsx');
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ['/buyer-hub'] }, createElement(AppRoutes)));
    assert.match(html, /nx-buyer-layout/);
    assert.match(html, /nx-hub-page/);
    assert.match(html, /Alex Nguyen/);
    assert.match(html, /id="hub-panel-auctions"/);
    for (const tab of ['auctions', 'orders', 'cart', 'c2c']) assert.match(html, new RegExp(`id="hub-tab-${tab}"`));
    assert.equal((html.match(/<header class="nexus-header/g) || []).length, 1);
    assert.equal((html.match(/<footer\b/g) || []).length, 1);
    assert.doesNotMatch(html, /u363-shell/);
    const { default: OrdersTab } = await server.ssrLoadModule('/src/features/buyer-hub/components/OrdersTab.tsx');
    const orders = renderToStaticMarkup(createElement(OrdersTab, { filters: [], activeFilter: 'all', summary: '', orders: [], onFilterChange: () => {} }));
    assert.match(orders, /id="hub-panel-orders"/);
    const { default: SavedCartTab } = await server.ssrLoadModule('/src/features/buyer-hub/components/SavedCartTab.tsx');
    const empty = renderToStaticMarkup(createElement(SavedCartTab, { title: '', summary: '', selectAllLabel: '', items: [] }));
    assert.match(empty, /Giỏ hàng của bạn đang trống/);
    assert.match(empty, /aria-pressed="false"/);
    const helpers = await server.ssrLoadModule('/src/features/buyer-hub/utils/buyerHub.format.ts');
    assert.equal(helpers.formatWinCountdown(3661), 'Còn 01:01:01');
    assert.equal(helpers.parseCurrencyInput('1.200.000 đ'), 1200000);
  } finally { await server.close(); }
});
