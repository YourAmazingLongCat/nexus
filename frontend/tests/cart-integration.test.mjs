import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('cart route, fixtures, totals, vouchers and payment restrictions integrate with Nexus', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  try {
    const service = await server.ssrLoadModule('/src/features/cart/services/cartService.ts');
    const { initialCartItems, calculateTotals, findVoucher, formatCountdown, paymentMethods } = service;
    const voucher = findVoucher(' nexuswelcome ');
    assert.equal(voucher.discount, 150000);
    assert.equal(findVoucher('INVALID'), undefined);
    assert.ok(initialCartItems.every(item => item.image.endsWith('.webp')));
    const totals = calculateTotals(initialCartItems, { shippingFee: 0, voucher });
    assert.equal(totals.directSubtotal, 450000);
    assert.equal(totals.auctionSubtotal, 850000);
    assert.equal(totals.total, 1150000);
    assert.equal(calculateTotals(initialCartItems, { shippingFee: 45000, voucher }).total, 1195000);
    assert.equal(calculateTotals(initialCartItems.filter(item => item.mode === 'auction'), { shippingFee: 0, voucher }).discount, 0);
    assert.equal(calculateTotals([{ ...initialCartItems[0], unitPrice: 10000 }], { shippingFee: 0, voucher }).total, 0);
    assert.equal(calculateTotals([], { shippingFee: 45000, voucher }).total, 0);
    assert.equal(formatCountdown(-1), '00:00:00');
    assert.equal(formatCountdown(3661), '01:01:01');

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

    const { default: PaymentMethods } = await server.ssrLoadModule('/src/features/cart/components/PaymentMethods.tsx');
    const paymentHtml = hasAuctionItems => renderToStaticMarkup(createElement(PaymentMethods, {
      methods: paymentMethods, value: 'vnpay', onChange: () => {}, hasAuctionItems,
    }));
    assert.match(paymentHtml(true), /<input[^>]*disabled=""[^>]*value="cod"/);
    assert.doesNotMatch(paymentHtml(false), /disabled=""/);
    const { default: CartEmptyState } = await server.ssrLoadModule('/src/features/cart/components/CartEmptyState.tsx');
    const emptyHtml = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(CartEmptyState)));
    assert.match(emptyHtml, /href="\/products"/);
  } finally {
    await server.close();
  }
});
