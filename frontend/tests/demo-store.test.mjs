import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

test('runtime does not ship demo persistence or import mock datasets', () => {
 assert.equal(existsSync(new URL('../src/shared/demo/demoStore.ts', import.meta.url)), false);
 const visit = dir => { for (const entry of readdirSync(dir, { withFileTypes: true })) { if (entry.name === 'tests') continue; const path = join(dir, entry.name); if (entry.isDirectory()) visit(path); else if (/\.tsx?$/.test(path)) assert.doesNotMatch(readFileSync(path, 'utf8'), /from\s+['"][^'"]*(?:mocks\/|demoStore)/, path); } };
 for (const group of ['buyer-hub', 'cart', 'seller-hub', 'seller-inventory', 'seller-listing']) visit(fileURLToPath(new URL('../src/features/' + group, import.meta.url)));
});


test('listing starts with no fabricated product, shipping, fee or quality values', async () => {
 const { createServer } = await import('vite');
 const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
 try {
  const constants = await server.ssrLoadModule('/src/features/seller-listing/constants/createListing.constants.ts');
  for (const [key, value] of Object.entries(constants.initialListingDraft)) {
   assert.equal(value, key === 'quantity' ? 1 : ['price', 'dealPrice', 'minOffer'].includes(key) ? 0 : '', key);
  }
  assert.deepEqual(constants.listingAccessories, []);
  assert.deepEqual(constants.listingShippingMethods, []);
  assert.deepEqual(constants.listingQualityItems, []);
  assert.equal(constants.listingSaleModes.find(mode => mode.id === 'offer').enabled, false);
  const cart = await server.ssrLoadModule('/src/features/cart/constants/cart.constants.ts');
  assert.deepEqual(cart.shippingMethods, []);
  assert.deepEqual(cart.paymentMethods.map(method => method.id), ['cod']);
 } finally { await server.close(); }
});
