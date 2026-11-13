# Cart đã tích hợp vào Nexus

Module từ `temp/src/features/cart` được tích hợp tại `frontend/src/features/commerce/cart`.

- Route: `/cart`, dùng Header/Footer chung của BuyerLayout.
- CSS: được import trong BuyerLayout, class và token có prefix riêng.
- Ảnh sản phẩm: dùng assets có sẵn của Nexus.
- Header: nút "Xem tất cả" và "Tiến hành thanh toán" đóng preview và điều hướng tới `/cart`.
- Toast: dùng notify và ToastProvider hiện có, không thêm stub/provider mới.

## Phạm vi: UI-only (Phase A)

Dữ liệu giỏ hàng, địa chỉ, vận chuyển và voucher là fixtures trong `mocks/cart.mock.ts`.
Thay đổi số lượng/xóa sản phẩm chỉ nằm trong state của trang, không lưu khi tải lại.
Voucher `NEXUSWELCOME` giảm tối đa 150.000 đ cho hàng mua trực tiếp.
COD bị vô hiệu hóa khi giỏ chứa hàng đấu giá.
Đặt hàng, đổi địa chỉ và chat chỉ hiển thị toast, không gửi yêu cầu API.
Header preview và badge vẫn là dữ liệu demo độc lập, chưa đồng bộ với giỏ hàng.
Layout giữ nguyên thiết kế desktop-first từ nguồn; chưa xác nhận hiển thị mobile.

## Kiểm tra

Chạy từ `frontend`:

```sh
npm run typecheck
npm run lint
npm run build
node --test tests/*.test.mjs
```

Test `tests/cart-integration.test.mjs` kiểm tra route/layout, ảnh fixtures và navigation của empty state bằng SSR.
Các test trong feature kiểm tra tổng tiền, voucher, phí vận chuyển, định dạng và hạn chế COD.
Kiểm tra tương tác trong trình duyệt vẫn cần thực hiện riêng.

## Cấu trúc sau refactor

- Buyer CartPage: bố cục trang và kết nối hook.
- components/: component hiển thị; giữ nguyên CSS và hành vi.
- hooks/useCart.ts: state, tương tác và toast.
- mocks/cart.mock.ts: dữ liệu mẫu; chưa gọi API.
- services/cart.calculation.ts: hàm thuần tính tổng tiền.
- services/cart.voucher.ts: tra voucher từ danh sách truyền vào, không phụ thuộc mock.
- utils/cart.format.ts: định dạng tiền và countdown.
- tests/: test calculation, voucher, format và phương thức thanh toán.
- styles/, types/: CSS và kiểu dữ liệu của Cart.

Test route/layout/empty-state navigation giữ ở frontend/tests/cart-integration.test.mjs.
Chạy cả test feature và integration từ frontend:

```sh
node --test tests/*.test.mjs src/features/commerce/cart/tests/*.test.mjs
```

Không tạo cart.api.ts khi chưa có Task API Integration.
