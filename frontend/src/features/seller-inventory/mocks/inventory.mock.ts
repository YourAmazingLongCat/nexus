import type { InventoryProduct } from '../types/inventory';
import photo0 from '../../../assets/images/seller-inventory/product-0.jpg';
import photo1 from '../../../assets/images/seller-inventory/product-1.jpg';
import photo2 from '../../../assets/images/seller-inventory/product-2.jpg';
import photo3 from '../../../assets/images/seller-inventory/product-3.jpg';
import photo4 from '../../../assets/images/seller-inventory/product-4.jpg';
import photo5 from '../../../assets/images/seller-inventory/product-5.jpg';
// TODO(seller-inventory): Static design fixtures; replace only in an approved API task.
export const inventoryProducts: InventoryProduct[] = [
  { id: 'r6', name: 'Máy ảnh Canon EOS R6 Mark II Body Fullbox', sku: 'CAM-CANON-R6M2-089', category: 'Thiết bị số > Máy ảnh Mirrorless', categoryId: 'camera', image: photo0, condition: 'Like New 99%', conditionId: 'like-new', verified: 'Serial #88204192', photoLabel: '8 ảnh', price: 36900000, oldPrice: '38.500.000 đ (-4%)', priceNote: 'Cho trả giá (Min 35M)', stock: 'Còn 01 máy', sold: 'Đã bán: 4', views: '2.4k', likes: '142', engagement: 'CR: 4.8% (Tốt)', status: 'listed', visible: true },
  { id: 'sony', name: 'Ống kính Sony FE 24-70mm f/2.8 GM II Mới Fullbox', sku: 'LENS-SONY-2470', category: 'Ống kính > Ống kính Sony E-Mount', categoryId: 'lens', image: photo1, condition: 'Mới 100%', conditionId: 'new', verified: 'Bảo hành Sony VN', photoLabel: 'LIVE', price: 28500000, priceNote: 'Khởi điểm: 15.000.000 đ', priceBadge: '35 lượt bid', stock: 'Còn 01 chiếc', sold: 'Đấu giá độc quyền', views: '4.8k', likes: '318', engagement: 'Đang sôi động', status: 'auction', visible: true },
  { id: 'r5', name: 'Thân máy ảnh Canon EOS R5 45MP 8K Raw Cinema', sku: 'CAM-CANON-R5-012', category: 'Thiết bị số > Máy ảnh Fullframe', categoryId: 'camera', image: photo2, condition: 'Like New 99%', conditionId: 'like-new', verified: 'Chụp 3.200 Shot', photoLabel: '12 ảnh', price: 52800000, priceNote: 'Giá niêm yết chuẩn', priceBadge: 'Giá cố định không mặc cả', stock: 'Còn 02 máy', sold: 'Đã bán: 8', views: '1.8k', likes: '96', engagement: 'CR: 3.2%', status: 'listed', visible: true },
  { id: 'rf', name: 'Ống kính Canon RF 70-200mm f/2.8L IS USM', sku: 'LENS-RF-70200', category: 'Ống kính > Canon RF Mount', categoryId: 'lens', image: photo3, condition: 'Mới 100% Fullbox', conditionId: 'new', photoLabel: 'HẾT HÀNG', price: 48000000, priceNote: 'Tạm dừng giao dịch', stock: 'Hết hàng (0)', sold: 'Đã bán: 15', views: '950', likes: '64', engagement: '21 khách đặt chuông báo', status: 'out', visible: false },
  { id: 'fuji', name: 'Fujifilm X-T5 Silver Body Fullbox Đẹp Keng', sku: 'CAM-FUJI-XT5', category: 'Thiếu: Mô tả bảo hành & Video test cảm biến', categoryId: 'camera', image: photo4, condition: 'Đã dùng 98%', conditionId: 'used', photoLabel: '4 ảnh', price: 37500000, priceNote: 'Chưa niêm yết lên sàn', stock: 'Kho sẵn: 1', sold: 'Đã bán: 0', views: 'Chưa có dữ liệu', engagement: 'Bản lưu nội bộ', status: 'draft', visible: false },
  { id: 'leica', name: 'Máy ảnh Leica Q2 Monochrom Matte Black Special', sku: 'CAM-LEICA-Q2M', category: 'Đồ sưu tầm > Máy ảnh Luxury', categoryId: 'collectible', image: photo5, condition: 'Like New 99.9%', conditionId: 'like-new', verified: 'Đang check Nexus Verified Seri', photoLabel: '15 ảnh', price: 118000000, priceNote: 'Giá niêm yết thẩm định', stock: 'Còn 01 chiếc', sold: 'Hàng hiếm', views: 'Chờ duyệt', engagement: 'Dự kiến: 2h nữa', status: 'serial', visible: false },
];
export const inventoryTabs = [
  { id: 'all', label: 'Tất cả', count: 128 }, { id: 'listed', label: 'Đang bán (Giá cố định)', count: 86 },
  { id: 'auction', label: 'Đang đấu giá', count: 8 }, { id: 'draft', label: 'Bản nháp', count: 14 },
  { id: 'serial', label: 'Chờ kiểm định serial', count: 12 }, { id: 'out', label: 'Hết hàng', count: 8 },
];
export const inventoryKpis = [
  { label: 'Tổng sản phẩm trong kho', value: '128', unit: 'SKU', icon: 'archive', tone: 'blue', left: '+12 SKU', right: 'so với tháng trước' },
  { label: 'Đang niêm yết cố định', value: '94', unit: 'Mục', icon: 'shop', tone: 'blue', left: 'Tỷ lệ hiển thị 98.4%', right: '2.4k lượt xem/ngày' },
  { label: 'Đang đấu giá trực tiếp', value: '8', unit: 'Phiên', icon: 'hammer', tone: 'red', left: 'Bid cao nhất: 42.500.000 đ', right: '●' },
  { label: 'Cần xử lý & Cảnh báo', value: '6', unit: 'SKU', icon: 'bell', tone: 'amber', left: '2 sắp hết hàng', right: '4 chờ kiểm định' },
];
export const inventoryTips = [
  { icon: 'graph-up-arrow', tone: 'blue', title: 'Đề xuất Giá Đấu AI', text: 'Các sản phẩm ống kính telephoto đang có nhu cầu cao. Chuyển sản phẩm sang phiên đấu giá tối đa 2 để tăng thanh khoản lên 35%.' },
  { icon: 'patch-check', tone: 'amber', title: 'Quy chuẩn Serial Check', text: 'Máy ảnh có ảnh chụp rõ ràng số Serial đáy máy và số shot sẽ luôn được hệ thống phê duyệt nhanh hơn gấp 4 lần.' },
  { icon: 'truck', tone: 'red', title: 'Nexus Express Fulfillment', text: 'Ký gửi trực tiếp kho tại Bắc Ninh / Hà Nội để hưởng chính sách miễn phí lưu kho và giao hàng hỏa tốc trong 2 giờ.' },
];
