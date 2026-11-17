# Báo cáo rà soát API sau cập nhật Backend

## Trạng thái

**Đã hoàn tất đối chiếu mã nguồn và sửa tích hợp Frontend. Chưa xác minh end-to-end với Backend đang chạy.**

Phạm vi: Frontend hiện có trong `dev/frontend`, đối chiếu controller, DTO, validation và phân quyền của `dev/backend`. Không sửa Backend, không đổi bố cục giao diện, không thêm dependency hoặc endpoint chưa có. Không gửi yêu cầu thật, không dùng tài khoản và không tạo/sửa dữ liệu trên máy chủ.

## 1. Kết quả đối chiếu

URL, HTTP method và các khóa request chính nhìn chung vẫn khớp Backend mới; không cần thay hàng loạt endpoint. Những sai lệch đáng chú ý nằm ở validation, dữ liệu nullable, xử lý lỗi và trạng thái sau mutation.

| Nhóm tích hợp | Đã kiểm tra / điều chỉnh |
|---|---|
| Auth | Đọc response lỗi/JSON, xử lý abort và lỗi đọc body; giới hạn username, password, phone, email đăng ký |
| Catalog / Header | Category nullable, sortOrder nullable, chọn danh mục theo ID; bỏ truy cập icon không có trong DTO |
| Auction | Tìm kiếm theo UUID productId/sellerId thay vì ngầm coi là tìm tên; chặn metadata phân trang Seller không hợp lệ |
| Cart / Discount / Checkout | Chờ hàng đợi cập nhật, lấy subtotal máy chủ, loại phản hồi voucher cũ, kiểm tra thay đổi tài chính và địa chỉ |
| Buyer orders | Phân biệt DTO danh sách/chi tiết; giới hạn hủy đơn theo trạng thái Backend; hiển thị validation details |
| Seller product / Inventory | Giữ primaryImageUrl khi PUT thay danh sách ảnh; xử lý product 404 trong enrichment; bảo vệ retry tạo product → SKU |
| Notification / Fulfillment | Đối chiếu các tích hợp đang có; phát hiện rủi ro phân quyền fulfillment cần Backend xử lý |

## 2. Các lỗi Frontend đã sửa

- Chuẩn hóa lỗi mạng và lỗi đọc response body; giữ nguyên abort; đọc mã lỗi từ trường `error` và hiển thị `details[].field/message`.
- Đồng bộ validation đăng ký với Backend, thay vì giới hạn email/username/phone sai hợp đồng.
- Chấp nhận `categoryId` và `sortOrder` nullable đúng DTO; Header dùng ID để chọn, gửi và render danh mục.
- Làm rõ tìm kiếm auction chỉ hỗ trợ UUID trong Backend hiện tại; không quảng bá tìm theo tên khi API chưa hỗ trợ.
- Không làm hỏng toàn bộ cart/header hoặc Seller inventory chỉ vì một product đã bị xóa trả 404; các lỗi 401/500 vẫn được báo, không bị nuốt.
- Sau DELETE cart thành công, lỗi refresh không còn bị báo nhầm là xóa thất bại.
- Discount chờ cập nhật số lượng hoàn tất, dùng subtotal mới từ máy chủ và bỏ kết quả cũ khi giỏ thay đổi. Checkout so sánh cả dòng hàng, giá, số lượng và tổng tiền.
- Áp dụng giới hạn thông tin nhận hàng; không cho hủy đơn completed/cancelled từ Frontend.
- Giữ ảnh đại diện độc lập khi cập nhật product bằng PUT; tồn kho bằng 0 hiển thị “Hết hàng”.
- Nếu tạo product thành công nhưng tạo SKU thất bại, retry không được dùng dữ liệu product đã thay đổi để gắn SKU vào product cũ. Cả luồng Seller Hub và Create Listing đều dùng guard này.
- Tách thông báo “tạo thành công nhưng tải lại thất bại” để tránh người dùng gửi lại và tạo trùng.
- Giới hạn description HTML 5.000 ký tự theo Backend; nội dung vẫn do Frontend soạn thảo và gửi HTML cuối cùng.

## 3. Phát hiện Backend cần xử lý riêng

> [!WARNING]
> **Ưu tiên cao: API Buyer xem shipment chưa kiểm tra đơn hàng thuộc người đang đăng nhập.** Chỉ kiểm tra role BUYER không thay thế được kiểm tra quyền trên từng order.

- Endpoint: `GET /api/v1/buyer/fulfillment/shipments?orderId=...`.
- [FulfillmentBuyerController.java](file:///C:/Users/DELL/Documents/GitHub/dev/backend/nexus-fulfillment/src/main/java/com/nexus/fulfillment/controller/buyer/FulfillmentBuyerController.java#L19-L39): TODO xác nhận thiếu ownership check; controller truyền thẳng orderId xuống service.
- [ShipmentServiceImpl.java](file:///C:/Users/DELL/Documents/GitHub/dev/backend/nexus-fulfillment/src/main/java/com/nexus/fulfillment/service/impl/ShipmentServiceImpl.java#L85-L91): truy vấn theo orderId, chưa đối chiếu buyer hiện tại.

Đây là phát hiện từ mã nguồn, **không thử truy cập dữ liệu tài khoản khác**. Chưa sửa vì phạm vi hiện tại là Frontend. Cần Backend xác thực quyền sở hữu order trước khi trả shipment; không thể bảo vệ đầy đủ bằng cách ẩn nút hoặc lọc ở Frontend.

## 4. Xác minh

| Kiểm tra | Kết quả |
|---|---|
| `npm run typecheck` | PASS |
| `npm run build` | PASS; còn cảnh báo bundle >500 kB |
| `npm run lint` | 0 lỗi, 11 cảnh báo có sẵn |
| Toàn bộ test chạy tuần tự | 72/72 PASS |
| Rerun nhóm API/cart/retry/listing cuối | 12/12 PASS |
| API thật / đăng nhập / checkout thật | Chưa thực hiện |
| Browser E2E | Chưa thực hiện; môi trường Chrome remote debugging trước đó chưa sẵn sàng |

Toàn bộ suite đã chạy trước chỉnh sửa cuối chỉ xóa BOM thừa và thêm một assertion test; sau đó đã chạy lại nhóm test liên quan và typecheck. Các test hiện tại chủ yếu kiểm tra adapter/helper và một số source guard, không thay thế browser integration test.

## 5. Giới hạn và phần chưa xử lý

- Chưa thể kết luận mọi API hoạt động end-to-end nếu chưa chạy với Backend, database và tài khoản thực tế.
- Public auction và một số Seller auction vẫn ghép dữ liệu product theo kiểu all-or-nothing: product mồ côi trả 404 có thể làm hỏng cả lượt tải. Chưa thay đổi pagination hoặc tự tạo product DTO giả để che lỗi.
- Validation response cho một số auction detail/mutation và shipment còn hạn chế; guard mới chỉ bảo vệ metadata phân trang Seller.
- Chưa mirror đầy đủ giới hạn số chữ số/phần thập phân của giá ở Frontend; lỗi validation từ Backend được hiển thị.
- Guard retry product → SKU chỉ giữ trong bộ nhớ trang, không phải idempotency server-side; reload, chuyển trang hoặc lỗi mạng không rõ kết quả vẫn cần Backend hỗ trợ để giải quyết triệt để.
- Cart/voucher đã bổ sung kiểm tra phòng vệ, nhưng chưa chứng minh hết các race condition bằng browser test; đôi lúc preflight có thể yêu cầu xác nhận lại sau cập nhật hàng đợi.
- Backend hiện còn giới hạn checkout nhiều seller và các TODO xác minh giá/tồn kho. Không thêm kiểm tra tồn kho giả hoặc tính năng chưa có API.
- Các cảnh báo lint cũ và bundle size không được refactor trong đợt sửa API này.

## 6. Danh sách file thay đổi trong đợt API audit

- [src/features/auth/pages/RegisterPage.tsx](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/auth/pages/RegisterPage.tsx)
- [src/features/auth/services/auth.api.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/auth/services/auth.api.ts)
- [src/features/auth/services/register.validation.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/auth/services/register.validation.ts)
- [src/features/auth/tests/AuthApi.test.mjs](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/auth/tests/AuthApi.test.mjs)
- [src/features/auth/tests/RegisterPage.test.mjs](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/auth/tests/RegisterPage.test.mjs)
- [src/features/buyer-hub/components/OrderRow.tsx](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/buyer-hub/components/OrderRow.tsx)
- [src/features/buyer-hub/hooks/useBuyerHub.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/buyer-hub/hooks/useBuyerHub.ts)
- [src/features/cart/hooks/useCart.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/cart/hooks/useCart.ts)
- [src/features/cart/services/cart.contract.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/cart/services/cart.contract.ts)
- [src/features/product/pages/ProductPage.tsx](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/product/pages/ProductPage.tsx)
- [src/features/product/services/catalog.api.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/product/services/catalog.api.ts)
- [src/features/seller-hub/components/ProductInventory.tsx](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/seller-hub/components/ProductInventory.tsx)
- [src/features/seller-hub/hooks/productCreationRetry.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/seller-hub/hooks/productCreationRetry.ts)
- [src/features/seller-hub/hooks/useSellerHub.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/seller-hub/hooks/useSellerHub.ts)
- [src/features/seller-hub/services/seller.api.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/seller-hub/services/seller.api.ts)
- [src/features/seller-hub/types/sellerHub.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/seller-hub/types/sellerHub.ts)
- [src/features/seller-inventory/hooks/useInventory.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/seller-inventory/hooks/useInventory.ts)
- [src/features/seller-inventory/types/inventory.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/seller-inventory/types/inventory.ts)
- [src/features/seller-listing/hooks/listingValidation.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/seller-listing/hooks/listingValidation.ts)
- [src/features/seller-listing/hooks/useCreateListing.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/features/seller-listing/hooks/useCreateListing.ts)
- [src/services/api/buyer.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/services/api/buyer.ts)
- [src/services/api/catalog.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/services/api/catalog.ts)
- [src/services/api/client.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/services/api/client.ts)
- [src/services/api/commerce.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/services/api/commerce.ts)
- [src/services/api/header.ts](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/services/api/header.ts)
- [src/shared/components/Header/Header.tsx](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/src/shared/components/Header/Header.tsx)
- [tests/ApiClient.test.mjs](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/tests/ApiClient.test.mjs)
- [tests/backend-update-contracts.test.mjs](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/tests/backend-update-contracts.test.mjs)
- [tests/product-creation-retry.test.mjs](file:///C:/Users/DELL/Documents/GitHub/dev/frontend/tests/product-creation-retry.test.mjs)

Không sửa file Backend. Không có Git baseline trong thư mục hiện tại; danh sách trên ghi nhận file đã chỉnh trong đợt audit, không phải kết quả git diff.

