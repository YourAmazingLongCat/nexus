// TODO(seller-order-success): Dữ liệu tĩnh theo ảnh export từ Stitch, chưa nối API.
import photo0 from '../../../assets/images/seller-inventory/product-0.jpg';
import type {
  EscrowBanner,
  FulfillmentStep,
  InventoryAction,
  OrderBreadcrumbItem,
  OrderBuyerInfo,
  OrderHeroInfo,
  OrderMoneyRow,
  OrderSuccessToastMessages,
  PackingChecklistItem,
  SoldProduct,
} from '../types/orderSuccess';

export const breadcrumbItems: OrderBreadcrumbItem[] = [
  { label: 'Kênh Người Bán', icon: 'bi-shop', to: '/seller-hub' },
  { label: 'Quản lý Đơn hàng', to: '/seller/orders/success' },
  { label: 'Thông báo Bán hàng thành công #ORD-2025-8839' },
];

export const escrowStatus = 'Đã thanh toán Escrow thành công • Chờ xác nhận đóng gói giao hàng';

export const heroInfo: OrderHeroInfo = {
  orderType: 'Đơn hàng Mua Ngay',
  paidAt: '10:24, Hôm nay',
  orderCode: '#ORD-2025-8839',
  title: 'Tuyệt vời! Sản phẩm của bạn đã được bán thành công!',
  buyerName: 'Nguyễn Minh Trí',
  buyerHandle: '(@tri_nguyen)',
  buyerBadge: '5.0 ★ Uy tín cao',
  escrowNote: 'Đã khóa quỹ an toàn trong Nexus Escrow Vault',
};

export const heroActions = {
  print: 'In Phiếu Giao Hàng & Mã Vận Đơn (AWB)',
  pack: 'Đã Đóng Gói Xong',
  packed: 'Đã Báo Đóng Gói Xong',
  chat: 'Chat Với Người Mua',
};

export const moneyRows: OrderMoneyRow[] = [
  {
    id: 'gross',
    label: 'Tổng giá trị đơn hàng',
    value: '36.900.000 đ',
    note: 'Giá chốt Fixed Deal',
    tone: 'value',
  },
  {
    id: 'fee',
    label: 'Phí dịch vụ Nexus (3%)',
    value: '-1.107.000 đ',
    note: 'Chiết khấu sàn chuẩn',
    tone: 'deduct',
  },
  {
    id: 'insurance',
    label: 'Bảo hiểm Escrow & Đóng gói',
    value: '0 đ (Miễn phí)',
    note: 'Được tài trợ bởi Nexus Pro',
    tone: 'free',
    noteStrong: true,
  },
  {
    id: 'net',
    label: 'Thực nhận (Net Earning)',
    value: '35.793.000 đ',
    note: 'Tạm giữ Escrow • Tự động giải ngân khi giao xong',
    tone: 'net',
    highlight: true,
    highlightIcon: 'bi-lock',
  },
];

export const fulfillmentDeadline = 'Hạn chót gửi hàng: Còn 23 giờ 45 phút';

export const fulfillmentSteps: FulfillmentStep[] = [
  {
    id: 'paid',
    index: 1,
    title: 'Người mua thanh toán',
    caption: 'Tiền đã khóa vào tài khoản ký quỹ Nexus Escrow an toàn.',
    timestamp: '10:24 - Hôm nay',
    timeTone: 'outline',
    state: 'done',
    stateLabel: 'Hoàn tất',
    badgeIcon: 'bi-check-lg',
  },
  {
    id: 'packing',
    index: 2,
    title: 'Chuẩn bị hàng & Niêm phong',
    caption: 'Đóng gói chuẩn quy cách, dán tem Seal và in mã AWB.',
    timestamp: 'Hạn chót: 10:00 sáng mai',
    timeTone: 'deadline',
    state: 'active',
    stateLabel: 'Đang xử lý',
  },
  {
    id: 'handover',
    index: 3,
    title: 'Bàn giao Nexus Express',
    caption: 'Tài xế nhận hàng tận nơi hoặc gửi tại bưu cục gần nhất.',
    timestamp: 'Dự kiến hôm nay',
    timeTone: 'outline',
    state: 'pending',
    stateLabel: 'Chờ lấy',
  },
  {
    id: 'payout',
    index: 4,
    title: 'Giao thành công & Giải ngân',
    caption: 'Cộng 35.793.000 đ vào Số dư Khả dụng của người bán.',
    timestamp: 'Tức thì sau khi ký nhận',
    timeTone: 'outline',
    state: 'pending',
    stateLabel: 'Tự động',
  },
];

export const soldProduct: SoldProduct = {
  sku: 'CAM-CANON-R6M2-089',
  // Ảnh minh hoạ lấy từ bộ ảnh sản phẩm sẵn có của Seller Inventory.
  image: photo0,
  imageAlt: 'Canon EOS R6 Mark II Fullbox Like New 99%',
  conditionBadge: 'Like New 99%',
  verifiedBadge: 'Đã kiểm định Nexus Authenticated',
  serial: '#88204192',
  title: 'Canon EOS R6 Mark II Fullbox Like New 99%',
  variant: 'Body + Pin Zin LP-E6NH + Sạc Zin + Thẻ nhớ SanDisk Extreme Pro 64GB',
  quantity: '01 chiếc',
  saleType: 'Mua ngay',
  priceLabel: 'Giá niêm yết bán chốt:',
  price: '36.900.000 đ',
};

export const buyerInfo: OrderBuyerInfo = {
  shippingBadge: 'Nexus Express Priority (2h - 4h)',
  name: 'Nguyễn Minh Trí',
  phone: '0912 *** 889 (Đã mã hóa bảo mật Nexus Privacy)',
  rating: '5.0 ★ (48 đơn hoàn tất)',
  awb: 'NX-EXP-8829104',
  pickupMethod: 'Tài xế đến lấy tận nơi',
  address: 'Tầng 8, Tòa nhà Keangnam Landmark 72, Đường Phạm Hùng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội',
  noteLabel: 'Ghi chú từ người mua:',
  note: '"Nhờ shop bọc màng bóng khí dày 3-4 lớp giúp mình vì là máy ảnh giá trị cao, gọi trước khi giao 15 phút. Cảm ơn shop!"',
};

export const packingIntro =
  'Vui lòng hoàn thành danh sách kiểm tra an toàn trước khi chuyển giao cho đơn vị vận chuyển để đảm bảo quyền lợi bảo hiểm 100%.';

export const packingChecklist: PackingChecklistItem[] = [
  {
    id: 'record',
    title: 'Quay video/chụp ảnh lúc đóng gói',
    caption: 'Lưu lại tình trạng máy và rõ nét số Serial #88204192.',
  },
  {
    id: 'seal',
    title: 'Dán tem niêm phong Nexus Seal Protect',
    caption: 'Dán mép mở hộp, chống mở trái phép và rạch rách.',
  },
  {
    id: 'carton',
    title: 'Thùng carton 3 lớp & chèn bóng khí',
    caption: 'Độ dày bóng khí tối thiểu 3-4 lớp theo yêu cầu khách.',
  },
  {
    id: 'awb',
    title: 'In & Dán phiếu gửi hàng AWB mặt trên',
    caption: 'Mã vạch và mã QR rõ nét, không bị gấp mép hay ẩm ướt.',
  },
];

export const packingShield = {
  title: 'Cam kết bảo vệ người bán:',
  description:
    'Đơn hàng được Nexus bảo hiểm 100% giá trị hàng hóa chống mất mát, hư hỏng hoặc tráo hàng trong quá trình vận chuyển.',
};

export const stockAlert = {
  message: 'SKU này hiện đã hết hàng trong kho (0 / 1 máy)',
  badge: 'Hết hàng',
  caption:
    'Sản phẩm của bạn có lượt tương tác và mua rất nhanh. Đăng tiếp để duy trì thứ hạng gian hàng trên Nexus:',
};

export const inventoryActions: InventoryAction[] = [
  { id: 'restock', icon: 'bi-plus-square', label: 'Nhập thêm số lượng sản phẩm này' },
  { id: 'relist', icon: 'bi-plus-circle', label: 'Đăng bán sản phẩm tương tự' },
  { id: 'back', icon: 'bi-list-ul', label: 'Quay về Danh sách Sản phẩm' },
];

export const hotline = {
  label: 'Tổng đài CSKH Người bán Nexus:',
  phone: '1800 6899 (24/7)',
  href: 'tel:18006899',
};

export const escrowBanner: EscrowBanner = {
  title: 'Cần tìm hiểu về chu kỳ thanh toán & Giải ngân ký quỹ?',
  description:
    'Khoản thanh toán 35.793.000 đ sẽ tự động ghi nhận vào tài khoản người bán ngay khi khách hàng xác nhận nhận hàng hoặc sau 24h kể từ khi giao hàng thành công.',
  secondaryLabel: 'Xem Chi Tiết Dòng Tiền',
  primaryLabel: 'Chính Sách Escrow',
};

export const toastMessages: OrderSuccessToastMessages = {
  print: 'Đang kết nối máy in và tạo phiếu đóng gói bưu kiện...',
  packed: 'Đã cập nhật trạng thái: Đã đóng gói! Bưu tá đang di chuyển lấy hàng.',
  copied: 'Đã sao chép mã vận đơn: NX-EXP-8829104',
};
