import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('buyer hub renders real-data loading shell and honest unsupported tabs, without fixture records', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  try {
    const { default: BuyerHubPage } = await server.ssrLoadModule('/src/features/buyer-hub/pages/BuyerHubPage.tsx');
    const render = path => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [path] }, createElement(BuyerHubPage)));
    const html = render('/buyer-hub');
    assert.match(html, /nx-hub-page/);
    assert.match(html, /Đang tải dữ liệu/);
    assert.match(html, /id="hub-panel-orders"/);
    assert.match(html, /chưa được hỗ trợ\./);
    assert.match(html, /class="nx-hub-win"/);
    assert.match(html, /Xem danh sách phiên thắng và hạn thanh toán cá nhân chưa được hỗ trợ\./);
    assert.match(html, /disabled=""[^>]*>Thanh toán chưa được hỗ trợ\./);
    assert.doesNotMatch(html, /Chúc mừng! Bạn đã thắng phiên đấu giá/);
    assert.doesNotMatch(html, /Alex Nguyen|Đơn hàng DEMO|#AUC-|Nexus Gold Verified/);
    for (const tab of ['auctions', 'orders', 'cart', 'c2c']) assert.match(html, new RegExp(`id="hub-tab-${tab}"`));
    const saved = render('/buyer-hub?tab=saved');
    assert.match(saved, /id="hub-panel-cart"/);
    assert.match(saved, /Danh sách sản phẩm lưu sau chưa được hỗ trợ\./);
    const c2c = render('/buyer-hub?tab=c2c');
    assert.match(c2c, /Đấu giá C2C dành cho người mua chưa được hỗ trợ\./);
    assert.doesNotMatch(c2c, /#AUC-|MacBook|Kashtira/);
    const { matchesAuctionFilter } = await server.ssrLoadModule('/src/features/buyer-hub/hooks/useBuyerHub.ts');
    assert.equal(matchesAuctionFilter('lost', 'won'), false);
    assert.equal(matchesAuctionFilter('won', 'won'), true);
    assert.equal(matchesAuctionFilter('lost', 'all'), true);
  } finally { await server.close(); }
});
