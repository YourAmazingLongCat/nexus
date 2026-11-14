# Seller Inventory — tích hợp từ temp

- Route: `/seller/products`, dùng SellerLayout và Header/Footer hiện có.
- Page đặt tại `src/roles/seller/pages/SellerInventoryPage.tsx`.
- Feature giữ components/hooks/mocks/styles/types; CSS được import từ page.
- Chép 6 ảnh sản phẩm vào `src/assets/images/seller-inventory`.
- Mục “Quản lý Sản phẩm & Tồn kho” ở Seller Hub điều hướng tới trang này.
- Không nhập các thay đổi tab/feature mới khác của Seller Hub trong temp.

## UI-only / TODO

Chỉ thay mock bằng API khi có Task và API Contract riêng.
6 sản phẩm, KPI, số lượng tab, thông tin kho và các nhãn đồng bộ là dữ liệu mẫu.
Search/filter/sort, chọn hàng và bật/tắt hiển thị chỉ tác động state cục bộ.
CSV, bulk upload, tạo sản phẩm/đấu giá, CRUD và chuyển trang chỉ hiện toast.
Page-size selector chỉ đổi state/nhãn, chưa chia trang dữ liệu thực tế.
Không lưu dữ liệu khi tải lại hoặc đồng bộ với danh sách của Seller Hub.
Không thêm guard, tích hợp Backend hoặc thay đổi thiết kế.

## Verification

Test SSR: route/layout, ảnh fixtures, SKU, empty table và trạng thái ẩn của row.
Chưa kiểm tra tương tác trình duyệt hoặc responsive. Không thấy ảnh export Inventory
riêng trong temp/design nên giữ nguyên CSS/UI nguồn, không xác nhận pixel-perfect.
