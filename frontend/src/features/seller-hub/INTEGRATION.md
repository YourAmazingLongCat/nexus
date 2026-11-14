# Seller Hub — tích hợp từ temp

## Cấu trúc

- Page: `src/roles/seller/pages/SellerHubPage.tsx`.
- Layout: `src/roles/seller/layouts/SellerLayout.tsx`; Header/Footer và Toast dùng bản Nexus hiện có.
- Route: `/seller-hub`, không thêm guard hay phân quyền trong Task UI này.
- Feature: `src/features/seller-hub`, giữ components/hooks/mocks/styles/types từ nguồn.
- Assets: `src/assets/images/seller-hub`, 4 ảnh JPG từ temp.
- Header: “Kênh Bán Hàng” và “Đăng bán / Tạo đấu giá” dẫn tới `/seller-hub`.

## Mock / phạm vi

TODO: Chỉ kết nối REST API khi có Task và API Contract được duyệt.
KPI, thông báo, 4 sản phẩm và thông tin shop là dữ liệu mẫu.
Tìm kiếm, lọc, sắp xếp, chọn hàng, đổi tồn kho và form chỉ dùng state cục bộ.
Đăng sản phẩm, CRUD, xuất Excel và phân trang chỉ mô phỏng.
Chọn ảnh chỉ giữ tên file, không upload. Không lưu state khi tải lại.
Không tích hợp `seller-inventory` hoặc route `/seller/products` từ temp.
Không chỉnh Buyer Hub, Auth hoặc Backend.

## Verification / giới hạn

Test `tests/seller-hub-integration.test.mjs` kiểm tra SSR route/layout, form,
header link, ảnh fixtures, empty inventory và collapsed form.
Chưa kiểm tra click, upload selector, focus hoặc responsive trực tiếp trong trình duyệt.
Không tìm thấy ảnh export Seller Hub riêng trong temp/design; giữ UI/CSS từ nguồn,
không tuyên bố pixel-perfect. CSS nguồn chỉ có thiết kế desktop.
Lint có cảnh báo React refs trong QuickListing từ cách truyền hub.nameRef của nguồn;
không truy cập nameRef.current khi render, nhưng compiler vẫn đưa ra cảnh báo.

## Cập nhật các tab Seller Hub

Đã đồng bộ tab products/auctions/orders/reports, bộ lọc đấu giá/đơn hàng và báo cáo,
biểu đồ doanh thu, top SKU và đánh giá shop từ temp. Tất cả vẫn dùng mock.
Nút sản phẩm chuyển tab nội bộ theo nguồn mới; /seller/products vẫn hoạt động độc lập.
Report range chỉ thay lựa chọn trong state; số liệu biểu đồ/KPI vẫn là fixtures.
Thời gian còn lại của đấu giá là nhãn tĩnh, không có realtime hoặc countdown.
Nút đăng sản phẩm mới ở tab khác chỉ mở form trong state/focus theo nguồn, chưa
tự chuyển về tab products. Các giới hạn hành vi nguồn được giữ nguyên.
