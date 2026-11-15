import type {
  ListingConditionOption,
  ListingDraftForm,
  ListingMediaSlot,
  ListingQualityItem,
  ListingSaleMode,
  ListingShippingMethod,
} from '../types/createListing';
import photo0 from '../../../assets/images/seller-inventory/product-0.jpg';
import photo1 from '../../../assets/images/seller-inventory/product-1.jpg';
import photo2 from '../../../assets/images/seller-inventory/product-2.jpg';
import photo3 from '../../../assets/images/seller-inventory/product-3.jpg';
import photo4 from '../../../assets/images/seller-inventory/product-4.jpg';

// TODO(seller-listing): Dữ liệu tĩnh theo ảnh export từ Figma.
// Chỉ thay bằng REST API khi có Task tích hợp Backend riêng.

export const listingCategoryPath = [
  'Thiết bị số & Công nghệ',
  'Máy ảnh & Ống kính',
];

export const listingCategoryLeaf = 'Thân máy ảnh Mirrorless';

export const listingBrands = ['Canon', 'Sony', 'Nikon', 'Fujifilm', 'Leica', 'Panasonic Lumix'];

export const listingMediaSlots: ListingMediaSlot[] = [
  { id: 'cover', label: 'Ảnh bìa', image: photo0, cover: true },
  { id: 'sensor', label: 'Cảm biến', image: photo1 },
  { id: 'serial', label: 'Tem & Seri', image: photo2, serialVerified: true },
  { id: 'lcd', label: 'Màn hình lật', image: photo3 },
  { id: 'box', label: 'Fullbox & Phụ kiện', image: photo4 },
];

export const listingConditions: ListingConditionOption[] = [
  { id: 'new', title: 'Mới 100% Nguyên Seal', caption: 'Chưa kích hoạt, nguyên hộp' },
  { id: 'like-new', title: 'Like New 99%', caption: 'Rất ít dùng, không vết xước' },
  { id: 'used', title: 'Đã qua sử dụng (95-98%)', caption: 'Ngoại hình đẹp, sử dụng tốt' },
  { id: 'fair', title: 'Trầy xước nhẹ (Fair)', caption: 'Hoạt động chuẩn, xước dăm' },
];

export const listingAccessories = [
  'Pin sạc zin (LP-E6NH)',
  'Dây đeo Canon EOS zin',
  'Hộp Box trùng Serial',
  'Thẻ nhớ SD Sandisk Extreme 64GB',
];

export const listingDescription = `- Thân máy Canon EOS R6 Mark II mua mới đập hộp tại Digiworld Hà Nội, bảo hành chính hãng Lê Bảo Minh đến 11/2026.
- Máy chụp rất ít (khoảng 2.140 shots), chủ yếu chụp gia đình cuối tuần. Luôn để tủ chống ẩm 45% khi không sử dụng.
- Cảm biến sạch bóng không hạt bụi, không quay phim nhiều nên sensor hoàn hảo. Các phím bấm nảy, màn hình đã dán cường lực từ ngày đầu.
- Đi kèm đầy đủ phụ kiện theo máy: Pin LP-E6NH zin, sạc zin LC-E6, dây đeo chưa dùng, hộp sách trùng serial máy.`;

export const listingSaleModes: ListingSaleMode[] = [
  {
    id: 'fixed',
    title: 'Bán giá cố định',
    badge: 'Mua ngay',
    badgeTone: 'primary',
    caption: 'Khách có thể đặt mua thanh toán trực tiếp',
    enabled: true,
  },
  {
    id: 'offer',
    title: 'Cho phép Trả giá',
    badge: 'Make Offer',
    badgeTone: 'tertiary',
    caption: 'Nhận đề nghị giá từ người mua uy tín',
    enabled: true,
  },
  {
    id: 'auction',
    title: 'Đấu giá trực tiếp',
    badge: 'Live Auction',
    badgeTone: 'secondary',
    caption: 'Tạo phiên đấu giá đếm ngược 24h - 7 ngày',
    enabled: false,
  },
];

export const listingShippingMethods: ListingShippingMethod[] = [
  {
    id: 'nexus-express',
    title: 'Nexus Express Priority (Nội thành hỏa tốc 2h - 4h)',
    badge: 'Được đề xuất',
    caption: 'Được đối soát bưu tá tận tay và chụp ảnh niêm phong',
    fee: '35.000 đ',
    enabled: true,
  },
  {
    id: 'vnpost',
    title: 'VNPost Hàng Giá Trị Cao (Toàn quốc 24-48h)',
    caption: 'Bảo hiểm hàng công nghệ điện tử 100% khai giá',
    fee: '65.000 đ',
    enabled: true,
  },
];

export const listingQualityItems: ListingQualityItem[] = [
  { id: 'seo', label: 'Tiêu đề chuẩn công thức SEO (+25đ)', points: '+25đ', done: true },
  { id: 'photos', label: 'Đã có 5+ ảnh chụp góc thực tế (+25đ)', points: '+25đ', done: true },
  { id: 'serial', label: 'Xác thực số Serial máy & Bảo hành (+25đ)', points: '+25đ', done: true },
  { id: 'desc', label: 'Mô tả chi tiết trên 100 ký tự (+17đ)', points: '+17đ', done: true },
  { id: 'video', label: 'Thêm video 360 để đạt 100/100 (+8đ)', points: '+8đ', done: false },
];

export const initialListingDraft: ListingDraftForm = {
  title: 'Máy ảnh Canon EOS R6 Mark II Fullbox Like New 99% Chính Hãng Lê Bảo Minh',
  brand: 'Canon',
  sku: 'CAM-CANON-R6M2-089',
  shutter: '2.140 shots',
  warranty: 'Bảo hành Lê Bảo Minh 18 tháng',
  origin: 'Chính hãng Việt Nam (LBM)',
  description: listingDescription,
  quantity: 1,
  weight: '1.200 gram',
  length: '25 cm',
  width: '20 cm',
  height: '15 cm',
  price: 38500000,
  dealPrice: 36900000,
  minOffer: 35000000,
};

export const listingWallet = {
  serviceFeeRate: 0.03,
  score: 92,
  scoreLabel: 'Rất Tốt',
};
