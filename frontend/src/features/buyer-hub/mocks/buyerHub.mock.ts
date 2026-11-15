// TODO(buyer-hub): UI-only fixtures. Replace with the buyer hub REST API once
// backend integration is explicitly requested.
import type {
  AuctionFilterId,
  AuctionWinNotice,
  BuyerBid,
  BuyerKpi,
  BuyerOrder,
  BuyerProfile,
  C2cAuction,
  C2cDraft,
  C2cOption,
  FilterChipOption,
  GuaranteeItem,
  HubTab,
  LiveFeedItem,
  OrderFilterId,
  SavedItem,
} from '../types/buyerHub';

export const buyerProfile: BuyerProfile = {
  name: 'Alex Nguyen',
  initial: 'A',
  verified: true,
  memberTier: 'Thành viên Vàng Nexus',
  memberId: '#NX-880941',
  rating: '4.9/5',
  reviewCount: 48,
  winPaymentRate: '100%',
  joinedAt: '10/2022',
  walletBalance: 12450000,
  voucherCount: 3,
};

export const buyerKpis: BuyerKpi[] = [
  {
    id: 'shipping',
    label: 'Đơn hàng đang giao',
    value: '03',
    unit: 'đơn',
    icon: 'bi-truck',
    iconTone: 'primary',
    valueTone: 'default',
    pill: { text: '1 đơn Hỏa tốc 24h', icon: 'bi-lightning-charge-fill' },
    pillTone: 'primary',
  },
  {
    id: 'active-bids',
    label: 'Đang theo đuổi (Active Bids)',
    value: '04',
    unit: 'phiên',
    icon: 'bi-stopwatch',
    iconTone: 'secondary',
    valueTone: 'default',
    pill: { text: '2 phiên bị vượt giá', pulse: true },
    pillTone: 'secondary',
  },
  {
    id: 'won-pending',
    label: 'Thắng chờ thanh toán',
    value: '01',
    unit: 'phiên',
    icon: 'bi-trophy-fill',
    iconTone: 'highlight',
    valueTone: 'secondary',
    emphasis: true,
    timer: { icon: 'bi-clock', prefix: 'Còn' },
  },
  {
    id: 'saved-cart',
    label: 'Sản phẩm yêu thích & Giỏ',
    value: '06',
    unit: 'mục',
    icon: 'bi-bookmark',
    iconTone: 'accent',
    valueTone: 'default',
    caption: { label: 'Tổng:', value: 24500000 },
  },
];

export const auctionWinNotice: AuctionWinNotice = {
  code: '#AUC-902',
  productName: 'Ống kính Vintage Leica Summicron 35mm F/2',
  finalPrice: 18500000,
  payLabel: 'Thanh toán ngay (18.5M)',
  remainingSeconds: 23 * 3600 + 42 * 60 + 15,
};

export const hubTabs: HubTab[] = [
  { id: 'auctions', label: 'Đấu Giá Của Tôi', icon: 'bi-hammer', count: 4 },
  { id: 'orders', label: 'Quản Lý Đơn Hàng', icon: 'bi-box-seam', count: 3 },
  { id: 'cart', label: 'Đã Lưu DEMO', icon: 'bi-heart', count: 6 },
  {
    id: 'c2c',
    label: 'Phiên Tôi Tự Mở (C2C)',
    icon: 'bi-megaphone',
    count: 1,
    countTone: 'alert',
  },
];

export const auctionFilters: FilterChipOption<AuctionFilterId>[] = [
  { id: 'all', label: 'Tất cả', count: 4 },
  { id: 'leading', label: 'Đang dẫn đầu', count: 1 },
  { id: 'outbid', label: 'Bị vượt giá', count: 2 },
  { id: 'won', label: 'Thắng thầu', count: 0 },
];

export const buyerBids: BuyerBid[] = [
  {
    id: 'bid-984',
    code: '#AUC-984',
    title: 'Máy ảnh Canon EOS R6 Mark II (Fullbox 99%)',
    status: 'outbid',
    thumbIcon: 'bi-camera',
    myBid: 36200000,
    topBid: 37600000,
    topBidder: 'm***8',
    countdownSeconds: 1 * 3600 + 14 * 60 + 22,
    actionLabel: 'Đặt giá thầu 37.8M',
    iconAction: { icon: 'bi-clock-history', label: 'Lịch sử đấu giá' },
  },
  {
    id: 'bid-980',
    code: '#AUC-980',
    title: 'Máy nghe nhạc Cassette Sony Walkman TPS-L2 Nguyên Bản',
    status: 'leading',
    thumbIcon: 'bi-cassette',
    myBid: 8200000,
    bidCount: 19,
    countdownSeconds: 8 * 3600 + 24 * 60 + 50,
    actionLabel: 'Điều chỉnh giá tối đa',
    iconAction: { icon: 'bi-clock-history', label: 'Xem lịch sử' },
  },
  {
    id: 'bid-975',
    code: '#AUC-975',
    title: 'Đồng hồ Tissot Seastar 1000 Powermatic 80',
    status: 'outbid',
    thumbIcon: 'bi-smartwatch',
    myBid: 11500000,
    topBid: 12100000,
    countdownSeconds: 41 * 60 + 10,
    actionLabel: 'Tăng giá (+200k)',
    iconAction: { icon: 'bi-bell-slash', label: 'Bỏ theo dõi' },
  },
  {
    id: 'bid-912',
    code: '#AUC-912',
    title: 'Apple iPhone 14 Pro Max 256GB Deep Purple',
    status: 'lost',
    thumbIcon: 'bi-phone',
    myBid: 18000000,
    finalPrice: 19800000,
    endedLabel: 'Kết thúc hôm qua',
    countdownSeconds: 0,
    actionLabel: 'Tìm sản phẩm tương tự',
  },
];

export const orderFilters: FilterChipOption<OrderFilterId>[] = [
  { id: 'all', label: 'Tất cả', count: 3 },
  { id: 'shipping', label: 'Đang giao', count: 2 },
  { id: 'completed', label: 'Hoàn thành', count: 1 },
  { id: 'cancelled', label: 'Đã hủy', count: 0 },
];

export const buyerOrders: BuyerOrder[] = [
  {
    id: 'order-88310',
    code: 'Đơn hàng #NX-88310',
    tag: { text: 'Giao hỏa tốc 24h', tone: 'primary' },
    placedNote: '| Đặt lúc 14:30, Hôm nay',
    status: {
      text: 'Đang vận chuyển (Dự kiến nhận: 18:00 hôm nay)',
      icon: 'bi-truck',
      tone: 'primary',
    },
    state: 'shipping',
    title: 'Bàn phím cơ Leopold FC980M Bluetooth',
    meta: 'Phân loại: Mua trực tiếp (Buy It Now) • SL: 1 • Người bán: Nexus Flagship',
    price: 3450000,
    thumbIcon: 'bi-keyboard',
    thumbTone: 'primary',
  },
  {
    id: 'order-87992',
    code: 'Đơn hàng #NX-87992',
    tag: { text: 'Thắng đấu giá', tone: 'tertiary' },
    placedNote: '| Đã giao ngày 12/03/2025',
    status: { text: 'Giao hàng thành công', icon: 'bi-check-circle', tone: 'muted' },
    state: 'completed',
    title: 'Tai nghe Sony WH-1000XM5 Chống ồn',
    meta: 'Đấu giá thành công #AUC-832 • Người bán: TokyoTech VN',
    price: 6850000,
    thumbIcon: 'bi-headphones',
    thumbTone: 'accent',
  },
];

export const savedItems: SavedItem[] = [
  {
    id: 'saved-macbook',
    name: 'MacBook Pro 14 M2 Pro 16GB / 512GB Space Gray',
    seller: 'Apple Authorized Reseller',
    condition: 'Mới 100%',
    unitPrice: 34900000,
    quantity: 1,
    maxQuantity: 5,
    icon: 'bi-laptop',
    selected: true,
  },
];

export const c2cAuction: C2cAuction = {
  code: '#C2C-AUCT-409',
  title: 'Đồng hồ Rolex Submariner Date 116610LN (Bộ phụ kiện nguyên hộp)',
  startPrice: 180000000,
  stepPrice: 2000000,
  topBid: 242000000,
  bidCount: 12,
  remainingLabel: 'Còn 1 ngày 14 giờ',
  thumbIcon: 'bi-smartwatch',
};

export const c2cCategories: C2cOption[] = [
  { value: 'collectibles', label: 'Đồ sưu tầm & Nghệ thuật' },
  { value: 'electronics', label: 'Đồ điện tử & Công nghệ' },
  { value: 'fashion', label: 'Thời trang cao cấp' },
  { value: 'vehicles', label: 'Xe cộ & Phụ tùng' },
];

export const c2cDurations: C2cOption[] = [
  { value: '24h', label: '24 Giờ (Flash Auction)' },
  { value: '48h', label: '48 Giờ (Khuyên dùng)' },
  { value: '3d', label: '3 Ngày' },
  { value: '7d', label: '7 Ngày' },
];

export const c2cInitialDraft: C2cDraft = {
  name: '',
  category: 'collectibles',
  duration: '48h',
  startPrice: '',
  stepPrice: '',
  escrow: true,
};

export const liveFeedItems: LiveFeedItem[] = [
  {
    id: 'feed-outbid',
    kind: 'outbid',
    label: 'VỪA BỊ VƯỢT GIÁ!',
    timeAgo: '2 phút trước',
    parts: [
      { text: 'Bidder ' },
      { text: 'm***8', strong: true },
      { text: ' đã đặt ' },
      { text: '37.600.000 đ', strong: true },
      { text: ' (+1.4M) ở phiên Canon R6 Mark II.' },
    ],
    actionLabel: 'Đấu lại ngay',
  },
  {
    id: 'feed-shipping',
    kind: 'shipping',
    label: 'TIẾN ĐỘ GIAO HÀNG',
    timeAgo: '25 phút trước',
    parts: [
      { text: 'Đơn hàng ' },
      { text: 'Bàn phím Leopold', strong: true },
      { text: ' đã được trung tâm Nexus Express điều phối shipper giao trong chiều nay.' },
    ],
  },
  {
    id: 'feed-seller',
    kind: 'seller',
    label: 'PHIÊN CỦA BẠN',
    timeAgo: '1 giờ trước',
    parts: [
      { text: 'Phiên đấu giá Rolex Submariner của bạn vừa ghi nhận thêm ' },
      { text: '3 lượt bids mới', strong: true },
      { text: ' đạt mức 242.000.000 đ.' },
    ],
  },
];

export const guaranteeItems: GuaranteeItem[] = [
  {
    id: 'escrow',
    icon: 'bi-patch-check',
    title: 'Ký quỹ an toàn (Escrow):',
    body: ' Tiền thanh toán của bạn chỉ được chuyển cho người bán sau khi bạn kiểm tra và xác nhận hài lòng.',
  },
  {
    id: 'refund',
    icon: 'bi-arrow-repeat',
    title: 'Hoàn tiền 100%:',
    body: ' Bồi thường nhanh trong 48h nếu sản phẩm không đúng mô tả hoặc thất lạc khi vận chuyển.',
  },
  {
    id: 'authenticity',
    icon: 'bi-shield-check',
    title: 'Giám định hàng hiệu:',
    body: ' Phiên đấu giá trên 10 triệu đồng được Nexus kiểm định tem chống hàng giả trước khi gửi đi.',
  },
];

/** Static copy that has no server-side equivalent in the exported design. */
export const hubCopy = {
  auctionFilterLabel: 'Lọc theo trạng thái:',
  auctionSearchPlaceholder: 'Tìm tên phiên...',
  ordersSummary: '3 đơn hàng trong 30 ngày qua',
  savedCartTitle: 'Sản phẩm Đã lưu & Giỏ hàng cá nhân',
  savedCartSummary: '6 mục sản phẩm bạn đang theo dõi sát sao',
  savedCartSelectAll: 'Chọn tất cả để thanh toán',
  c2cTitle: 'Phiên đấu giá do bạn tự mở (C2C Personal Auctions)',
  c2cSubtitle:
    'Dành cho người dùng cá nhân muốn thanh lý hoặc bán đấu giá đồ cũ/đồ sưu tầm an toàn với cơ chế ký quỹ.',
  c2cActiveLabel: 'Đang mở thầu sôi động',
  c2cFormTitle: 'Tạo phiên đấu giá C2C mới nhanh chóng',
  liveFeedTitle: 'Thông báo phiên trực tiếp',
  guaranteeTitle: 'Nexus Guarantee',
  guaranteeSubtitle: 'Bảo vệ Người Mua Toàn Diện',
  guaranteeLink: 'Đọc điều khoản bảo vệ người mua',
  supportTitle: 'Cần trợ giúp giải quyết tranh chấp?',
  supportBody:
    'Đội ngũ trọng tài thương mại điện tử Nexus hỗ trợ bảo vệ quyền lợi giao dịch 24/7.',
};
