# Frontend ↔ Backend API integration

## Setup

- Existing Java controllers and DTOs are the source of truth; backend code is unchanged.
- Copy `.env.example` to `.env.local` if customization is needed. `VITE_API_BASE_URL` is an origin (without `/api/v1`); empty means same-origin `/api`.
- Development: `npm run dev` proxies `/api` to `API_PROXY_TARGET` (default `http://localhost:8080`). Production: configure a reverse proxy for `/api`, or set `VITE_API_BASE_URL` before building and allow the frontend origin in backend CORS.
- Start/configure the backend and PostgreSQL separately using its documented environment variables. No credentials or backend UUIDs are supplied by the frontend.
- Login/register use `/api/v1/auth`. Catalog and most other APIs require an authenticated account, including browsing; use the appropriate BUYER/SELLER role. The backend is the authorization authority.

## Coverage

| Existing page / affordance | Real backend contract |
| --- | --- |
| Login, register, logout | `POST /api/v1/auth/login`, `/register`, `/logout`; current-user adapter `GET /api/v1/auth/me`; role landing navigation after existing success animation |
| Shared header | `GET /api/v1/catalog/categories`; buyer cart; `GET /api/v1/notification/notifications`, `/unread-count`, `/{id}`; `PATCH /{id}/read`, `/read-all` |
| Home, categories, product listing | Catalog category tree and paged `GET /api/v1/catalog/products`; query filters supported by the controller; auction search keyword accepts product/seller UUID, not arbitrary product names; auction list queried through `/api/v1/auction/auctions` |
| Product detail | Catalog product detail/reviews; auction detail/bid history; `POST /api/v1/buyer/auction/auctions/{id}/bids`; real cart-item POST |
| Cart | `GET /api/v1/buyer/commerce/cart`; `POST /cart/items`; `PUT` / `DELETE /cart/items/{id}`; `POST /checkout/apply-discount`, `/checkout` |
| Buyer hub | `GET /api/v1/buyer/profile`; commerce order list/details; cancel, seller rating, current catalog-price rebuy; buyer fulfillment shipments by order |
| Seller hub | Seller commerce order list/details/status/cancel; catalog product + SKU creation; category options from catalog; global auction list paged and filtered to the session seller; seller auction create/update/cancel |
| Seller inventory | Seller fulfillment inventory/SKU list and inventory PATCH; catalog product detail, edit/delete where supported |
| Seller listing | Seller catalog product creation followed by fulfillment SKU/initial stock creation; uses returned product ID, preserves partial-success information |
| Seller order page | Server order ID in `?orderId=`; seller order detail/status/cancel; explicit shipment create/status update via `/api/v1/seller/fulfillment/shipments`; no fabricated success |

## Unsupported or intentionally not fabricated

- No watchlist/saved-items or current buyer bids/wins list endpoint, buyer C2C auction creation, wallet/live-feed/KPI/reputation aggregate endpoint. Existing controls show unavailable notices, unavailable numbers use dashes, and empty lists do not imply successful requests.
- No seller-owned catalog product-list endpoint. Seller inventory is derived from seller-scoped fulfillment inventories/SKUs, not the global catalog list; products without a SKU may therefore not appear. Seller auctions use the authorized global list filtered to the authenticated seller ID. Auction list/detail results, not fabricated IDs, drive edits/cancellation.
- No image upload, persisted listing drafts, offers, seller reports/exports, online chat, or carrier-service selection endpoint. Seller shipment GET/list is absent (buyer-only shipment retrieval is not called with seller credentials). Shipment create/status APIs are connected to the existing order-card action with explicit confirmation and user-entered real tracking number. Reload cannot retrieve existing seller shipments; the UI warns not to create a duplicate. Images selected locally cannot be published as uploaded backend assets.
- Online payment-provider UI options (VNPay, cards, MoMo) are not treated as working payment gateways. Checkout is explicitly COD; no payment-confirmation endpoint is called or fake payment success reported.
- Informational/footer/help links without implemented destinations report unavailable content. Location choice is presentation-only and is not falsely persisted as a profile address.
- Backend commerce currently accepts client-supplied cart snapshots and has documented cross-module limitations. Frontend obtains IDs/prices from real catalog responses, but this is not a substitute for server-side price/stock validation.
- Existing mock fixture files and demo-store unit tests may remain as unused historical UI assets; active routes must not use their local success mutations.

## HTTP / session behavior

`services/api/client.ts` handles configurable base URL, Bearer token, JSON/204, network and backend error messages, abort signals and invalid success JSON. DTOs are returned directly; `PageResponse.content` is not stripped. A 401 clears a stored authenticated session; 403 does not. Header account state also validates `/auth/me`, tracks expiry and storage changes, aborts replaced loads, and ignores results for an old token. Existing auth persistence honors Remember Me (local storage) vs tab-only session storage, validates expiry and never stores passwords. No token refresh endpoint exists, so expired sessions require login again. Cart changes notify the shared header. Successful mutation acknowledgements are separated from subsequent refresh errors so an accepted bid/cancel/cart update is not reported as rejected.

## Verification

- `npm run typecheck`: PASS.
- `npm run lint`: PASS, 0 errors / 12 warnings (unused legacy root state/one sidebar prop and React effect-state/compiler warnings; no lint rules disabled).
- `npm run build`: PASS, 279 modules. Existing large-bundle warning remains (about 563 kB minified main JS).
- Complete Node/Vite regression suite: 39/39 PASS using `node --test --test-concurrency=1 tests/*.test.mjs src/features/auth/tests/*.test.mjs src/features/cart/tests/*.test.mjs src/features/seller-hub/tests/*.test.mjs src/features/seller-listing/tests/*.test.mjs`.
- Tests cover HTTP/auth errors, exact request paths/bodies, nullable/omitted DTO fields, raw pagination, SKU-less seller orders, seller ownership filtering, shipment mutations, accepted-bid refresh failure, existing route shells and important UI class scaffolds. Historical isolated demo-store tests are included but demo actions are not mounted by active routes.
- Targeted post-scaffold reruns: catalog 4/4 and seller 11/11 PASS. A non-fatal Vite HMR port-in-use diagnostic appeared in one SSR test; tests completed successfully.
- Backend/CSS files and package dependencies remain unchanged. No commit or push performed. Exact file inventory: `API_INTEGRATION_FILES.md`.

These are compile, mocked-fetch contract and server-rendering tests only; no live backend/database or browser end-to-end verification has been performed. UI class/structure checks do not establish pixel-perfect visual equivalence. No claim of production/live integration success is made.
