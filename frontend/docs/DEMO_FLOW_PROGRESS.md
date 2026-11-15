# Local commerce demo — implementation progress

## Delivered
- Versioned `nexus.demo.v1` localStorage store with explicit persisted-field allowlists, malformed/unknown-version validation, stable SSR snapshot and `useSyncExternalStore` subscriptions; storage failures retain an in-memory session. Storage events synchronize supported same-origin tabs.
- Shared products, cart quantities, saved items, drafts, and explicitly DEMO orders. Cart starts empty rather than displaying fictional purchases. Checkout creates local orders, clears cart, and decreases demo stock; it does not contact payment/order APIs.
- Seller listing validation, draft save/resume/delete, temporary image file previews with object-URL cleanup, publish into inventory and buyer catalog. Publishing has its own inventory confirmation, not an order-success screen.
- Product card/detail additions, header quantity and previews, saved Buyer Hub items, buyer and seller order status views share the same store.
- Seller order details require an actual demo order ID. Packing and fulfilled transitions update the same order seen by the buyer. Unknown/missing order IDs show an empty state instead of fake success. AWB clipboard messages reflect awaited operation success/failure.
- Buyer auction won/lost filters are separate; no won state is fabricated from lost fixtures. Remaining sample dashboards are labeled as sample data.
- Shared demo notice/reset confirmation on buyer and seller shells. Reset clears local demo products/drafts/cart/saves/orders and restores the seeded catalog.

## Boundaries and remaining limitations
- No backend endpoints, authentication/authorization changes, extra dependencies, real payment, escrow, shipping labels, AWBs, notifications, or cross-user synchronization were added. This is browser-local shared demo data, not an account-level database.
- Uploaded image previews are deliberately not persisted; published products use an existing safe sample image. No base64/blob images, payment fields, credentials, or arbitrary extra fields are serialized by the store.
- Existing sample auction, inventory, report, address, shipping and payment selectors remain presentation fixtures. Real auction bidding, C2C publishing, promotions, stock reconciliation across clients, and actual fulfillment require APIs.
- LocalStorage is not transactional across tabs. Last writer wins; this is not suitable for production stock/orders. Quota/denied storage falls back to memory and is lost on refresh. Catalog image URL paths can change between application builds.
- SSR renders the deterministic seeded snapshot; persisted local state hydrates after browser subscription. No artificial loading delays or simulated backend successes were introduced.
- No browser interaction or visual verification has been performed during this implementation. Automated SSR and pure-store tests are the evidence; browser end-to-end/manual accessibility checks remain recommended.

## Verification
- `npm run typecheck`: passed.
- `npm run build`: passed; Vite retains a >500 kB bundle-size advisory.
- `npm run lint`: zero errors; 5 warnings remain: scaffold unused state (2), existing QuickListing ref and NotFound effect (2), and deliberate persisted-draft hydration effect (1).
- Regression command: `node --test --test-concurrency=1 tests/*.test.mjs src/features/cart/tests/*.test.mjs src/features/auth/tests/*.test.mjs src/features/product/tests/*.test.mjs src/features/seller-hub/tests/*.test.mjs`.
- Final regression result: **27/27 passed** (49.99 s). Additional seller-listing validator suite: **4/4 passed** (0.10 s).
- Added store tests cover persisted reload, malformed/version rejection, schema validation, safe field stripping, storage failure, reset, publish → quantity cart → DEMO checkout → packing → fulfilled, stock reduction, and SSR route regressions.
- Listing validation tests cover required fields, finite positive pricing/quantity and sale-mode constraints.
