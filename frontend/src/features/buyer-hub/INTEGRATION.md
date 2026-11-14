# Buyer Hub — tích hợp UI từ temp

- Page: `src/roles/buyer/pages/BuyerHubPage.tsx`.
- Route `/buyer-hub` dùng BuyerLayout, Header/Footer và ToastProvider hiện có.
- Feature giữ components, hooks, mocks, styles, types và utils từ nguồn.
- Header: tài khoản và avatar dẫn tới Hub khi có session, khách vẫn tới login.
- Không thêm route guard hoặc thay đổi hệ thống xác thực trong Task này.

## Phạm vi UI-only

TODO: Chỉ thay mock bằng REST API khi có Task và API Contract riêng.
Hồ sơ Alex Nguyen, KPI, đấu giá, đơn hàng, giỏ lưu và C2C đều là dữ liệu mẫu.
State/timer chỉ tồn tại khi mở trang; các thao tác nghiệp vụ chưa gọi Backend.
Giỏ lưu không đồng bộ với `/cart`; helper định dạng tái sử dụng từ Cart như nguồn.
Breadcrumb `/account` là placeholder từ nguồn, route này chưa có trong Nexus.
Filter `won` hiện đối chiếu trạng thái `lost` theo code nguồn; giữ nguyên, cần làm rõ
ngữ nghĩa trước Task sửa hành vi. Không tự sửa thiết kế hoặc business logic.

## Verification

Test `tests/buyer-hub-integration.test.mjs`: route/layout, các tab, SSR của đơn hàng,
empty state giỏ lưu và helper định dạng. Test SSR không xác nhận click/timer thực tế.
Ảnh tham chiếu nằm trong `temp/design/buyer-hub-*.png`; không chỉnh thiết kế nguồn.
Chưa xác nhận pixel-perfect/responsive hoặc tương tác trong trình duyệt.
