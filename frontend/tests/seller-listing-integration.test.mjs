import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('seller listing route renders five sections and four aside cards in seller layout', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  try {
    const { default: AppRoutes } = await server.ssrLoadModule('/src/app/routes/AppRoutes.tsx');
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ['/seller/products/new'] }, createElement(AppRoutes)));
    assert.match(html, /nx-seller-layout/);
    assert.match(html, /nx-listing-page/);
    assert.equal((html.match(/class="nx-listing-step"/g) || []).length, 5);
    const aside = html.match(/<aside class="nx-listing-aside">([\s\S]*?)<\/aside>/);
    assert.ok(aside);
    assert.equal((aside[1].match(/<section\b/g) || []).length, 4);
    assert.equal((html.match(/<header class="nexus-header/g) || []).length, 1);
    assert.equal((html.match(/<footer class="nexus-footer/g) || []).length, 1);
    assert.match(html, /href="\/seller-hub"/);
    assert.match(html, /href="\/seller\/products"/);
    assert.doesNotMatch(html, /u363-shell/);
    const { listingMediaSlots, initialListingDraft } = await server.ssrLoadModule('/src/features/seller-listing/mocks/createListing.mock.ts');
    assert.equal(listingMediaSlots.length, 5);
    for (const slot of listingMediaSlots) assert.ok(slot.image.includes('seller-inventory'));
    assert.ok(html.includes(initialListingDraft.title));
  } finally { await server.close(); }
});
