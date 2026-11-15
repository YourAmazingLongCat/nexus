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
    assert.match(html, /DEMO.*dữ liệu mẫu/);
    const { matchesAuctionFilter } = await server.ssrLoadModule('/src/features/buyer-hub/hooks/useBuyerHub.ts');
    assert.equal(matchesAuctionFilter('lost', 'won'), false);
    assert.equal(matchesAuctionFilter('won', 'won'), true);
    assert.equal(matchesAuctionFilter('lost', 'all'), true);
    const { default: DemoOrders } = await server.ssrLoadModule('/src/features/buyer-hub/components/DemoOrders.tsx');
    const demo = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(DemoOrders)));
    assert.match(demo, /Đơn hàng DEMO của bạn/);
    assert.match(demo, /Chưa có đơn hàng DEMO/);
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
    assert.match(empty, /Chưa có sản phẩm đã lưu/);
    assert.match(empty, /aria-pressed="false"/);
    const helpers = await server.ssrLoadModule('/src/features/buyer-hub/utils/buyerHub.format.ts');
    assert.equal(helpers.formatWinCountdown(3661), 'Còn 01:01:01');
    assert.equal(helpers.parseCurrencyInput('1.200.000 đ'), 1200000);

    const { default: SavedCartCheckoutTab } = await server.ssrLoadModule('/src/features/buyer-hub/components/SavedCartTab.tsx');
    const saved = renderToStaticMarkup(createElement(SavedCartCheckoutTab, {
      title: 'Giỏ & Đã lưu',
      summary: 'Sản phẩm đã lưu',
      selectAllLabel: 'Chọn tất cả',
      items: [{
        id: 'saved-macbook',
        name: 'MacBook Pro',
        seller: 'Apple',
        condition: 'Mới 100%',
        unitPrice: 34900000,
        quantity: 1,
        maxQuantity: 5,
        icon: 'bi-laptop',
        selected: true,
      }],
      selectedCount: 1,
      subtotal: 34900000,
      onToggle: () => {},
      onSelectAll: () => {},
      onQuantityChange: () => {},
      onRemove: () => {},
      onCheckout: () => {},
    }));
    assert.match(saved, /Đã chọn 1 mục/);
    assert.match(saved, /34.900.000 đ/);
    assert.match(saved, /Chuyển đã chọn vào giỏ DEMO/);
  } finally { await server.close(); }
});
