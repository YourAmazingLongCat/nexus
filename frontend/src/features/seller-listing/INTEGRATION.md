# Seller Listing — tích hợp từ temp

Trang “Đăng Bán Sản Phẩm Mới” dựng theo ảnh export Figma/Stitch
(`projects/7144581206472659692/screens/514eff8f64c84a4693119af5ea456e80`).

## Cấu trúc

- Page: `src/roles/seller/pages/CreateListingPage.tsx`; page được chuyển ra khỏi feature theo kiến trúc Nexus.
- Route: `/seller/products/new`, khai báo trong `src/roles/seller/routes.tsx`,
  nằm trong `SellerLayout` nên dùng Header/Footer/Toast hiện có.
- Layout: `src/roles/seller/layouts/SellerLayout.tsx`; feature không tự render
  Header/Footer và không tạo provider mới.
- Feature giữ nguyên components/hooks/mocks/styles/types từ nguồn:
  - `components/`: `ListingBreadcrumb`, `ListingHeader`, `ListingSection`,
    `ListingBasicInfo`, `ListingMedia`, `ListingCondition`, `ListingPricing`,
    `ListingShipping`, `ListingActionBar`, `ListingQualityCard`,
    `ListingPreviewCard`, `ListingEarningsCard`, `ListingAuctionCard`.
  - `hooks/useCreateListing.ts`: state, tính toán giá/phí, toast.
  - `mocks/createListing.mock.ts`: toàn bộ fixtures.
  - `types/createListing.ts`: kiểu dữ liệu của form và các option.
- CSS: `styles/create-listing.css`, import trong page; mọi class có prefix
  `.nx-listing-*` và scope dưới `.nx-listing-page`, không đụng Seller Hub.
- Assets: dùng lại ảnh sản phẩm có sẵn
  `src/assets/images/seller-inventory/product-0..4.jpg`; không copy thêm ảnh.
- Icon: Bootstrap Icons (`bi bi-*`) đã load sẵn từ `SellerLayout`, không import lại.
- Bố cục: grid 12 cột — main 8 cột (5 section + action bar), aside 4 cột sticky
  (điểm chất lượng, preview card, thực nhận, gợi ý đấu giá).
- Only desktop: chưa có layout mobile riêng, breakpoint chỉ để thu hẹp khoảng cách.

## Mock / phạm vi

TODO(seller-listing): Chỉ thay mock bằng REST API khi có Task và API Contract được duyệt.

- Dữ liệu mẫu: `initialListingDraft`, `listingBreadcrumb`, `listingCategoryPath`,
  `listingBrands`, `listingMediaSlots`, `listingConditions`, `listingAccessories`,
  `listingSaleModes`, `listingShippingMethods`, `listingQualityItems`, `listingWallet`.
- State cục bộ, không lưu khi tải lại: nhập/sửa text field, chọn tình trạng,
  bật/tắt phương thức bán, tăng/giảm số lượng, xóa phụ kiện, chọn người trả phí ship.
- `ListingShipping` tự giữ `useState` cho 2 checkbox vận chuyển, không đi qua hook;
  giữ nguyên hành vi nguồn, không refactor.
- Không upload: “Thêm ảnh”, “Tải lên Video”, “Xóa ảnh” chỉ gọi `mockAction` → toast.
- Mọi nút còn lại (Lưu nháp, Xem trước, Đăng bán ngay, Lưu Nháp, Đăng Bán Sản Phẩm,
  Chuyển sang đấu giá, Đổi địa chỉ kho, Nexus AI gợi ý tên, thanh công cụ editor…)
  đều đi qua `hub.mockAction(...)` → `notify.info`, không gọi HTTP.
- `submitListing()` chỉ kiểm tra tiêu đề rỗng bằng `notify.warning` rồi toast.
- Số liệu aside là tính toán client: phí dịch vụ 3% của `dealPrice`,
  thực nhận = `dealPrice - serviceFee`, `% OFF` = `(price - dealPrice) / price`.
- Không có guard, không phân quyền, không upload file, không persistence, không API.
- Không đụng Buyer Hub, Auth, Seller Hub hay Seller Inventory đã duyệt.

## Verification tại Nexus

TypeScript/build đã đạt; lint 0 lỗi, 4 cảnh báo hiện có ngoài Listing.
Build có cảnh báo JS chunk vượt 500 kB; không tự refactor/code-split ngoài Task.
Test SSR bổ sung tại tests/seller-listing-integration.test.mjs kiểm tra route/layout,
5 section, 4 aside card, breadcrumb và ảnh fixtures.
Chưa kiểm tra tương tác, sticky, responsive hoặc pixel-perfect trong trình duyệt Nexus.
Các ghi nhận kiểm thử của temp không thay thế kiểm thử thực tế tại Nexus.
Các nút tạo listing trên Hub/Inventory vẫn giữ hành vi nguồn cũ, chưa nối sang trang mới;
có thể mở trực tiếp /seller/products/new. Không tự đổi navigation ngoài nguồn.

## Cập nhật / tích hợp API sau này

- Chỉ khi có Task riêng: thêm `services/api/` (HTTP client + endpoint) và thay
  `mocks/createListing.mock.ts` bằng dữ liệu thật; không gọi HTTP trong component.
- `useCreateListing` là nơi duy nhất nên đổi sang gọi service; component chỉ nhận
  props/hub như hiện tại, giữ nguyên UI đã duyệt.
- Cần contract cho: tạo listing (POST), danh mục/thương hiệu, upload ảnh/video,
  phương thức vận chuyển và phí, điểm chất lượng tin đăng.
- Lưu nháp/Xem trước/Đăng bán phải chờ endpoint thật; hiện chỉ toast.
- Xóa mock là thay đổi có phạm vi — phải được duyệt thành Task riêng.
