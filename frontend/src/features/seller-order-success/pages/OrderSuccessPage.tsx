import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDemoStore, demoActions } from '../../../shared/demo/demoStore';
import { notify } from '../../../shared/components/Toast';
import OrderCard from '../components/OrderCard';
import '../styles/order-success.css';

const statusLabels = { placed: 'Đã đặt', packing: 'Đang đóng gói', fulfilled: 'Đã hoàn tất' };
const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const { orders } = useDemoStore();
  const order = orders.find(row => row.id === params.get('orderId'));
  const [checkedOrderId, setCheckedOrderId] = useState('');
  const checked = Boolean(order && checkedOrderId === order.id);
  const transition = (status: 'packing' | 'fulfilled') => {
    if (!order) return;
    if (status === 'packing' && !checked) { notify.warning('Vui lòng xác nhận kiểm tra hàng trước khi đóng gói.'); return; }
    if (!demoActions.updateOrderStatus(order.id, status)) { notify.warning('Không thể cập nhật đơn DEMO. Vui lòng kiểm tra trạng thái mới nhất.'); return; }
    notify.success(status === 'packing' ? 'Đã cập nhật đóng gói cho đơn DEMO.' : 'Đơn DEMO đã hoàn tất.');
  };
  return <main className="nx-success-page"><div className="nx-container">
    <nav className="nx-success-topbar" aria-label="Điều hướng đơn hàng"><Link to="/seller-hub">← Seller Hub</Link><span className="nx-success-status">DEMO • Không có giao dịch thật</span></nav>
    {!order ? <section className="nx-success-hero"><div className="nx-success-hero-inner"><div className="nx-success-hero-text">
      <h1>Không tìm thấy đơn DEMO</h1><p>{params.get('orderId') ? 'Đơn này không tồn tại hoặc đã bị xóa khỏi dữ liệu demo.' : 'Chọn một đơn từ Seller Hub để xem chi tiết.'}</p>
      <Link className="nx-success-btn is-primary" to="/seller-hub">Về Seller Hub</Link>
    </div></div></section> : <>
      <section className="nx-success-hero"><div className="nx-success-hero-inner">
        <div className="nx-success-hero-copy"><span className="nx-success-hero-icon" aria-hidden="true"><i className="bi bi-box-seam" /></span><div className="nx-success-hero-text">
          <div className="nx-success-hero-meta"><span className="nx-success-hero-type">Đơn hàng DEMO</span><span className="nx-success-hero-code">{order.id}</span></div>
          <h1>{statusLabels[order.status]}</h1><p className="nx-success-hero-buyer">Đặt lúc {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
          <p className="nx-success-hero-escrow">Chỉ mô phỏng trên thiết bị này. Không thanh toán, ký quỹ hay giao hàng thật.</p>
        </div></div>
        <div className="nx-success-hero-actions">
          {order.status === 'placed' && <button type="button" className="nx-success-btn is-primary" onClick={() => transition('packing')}>Xác nhận đóng gói DEMO</button>}
          {order.status === 'packing' && <button type="button" className="nx-success-btn is-primary" onClick={() => transition('fulfilled')}>Hoàn tất đơn DEMO</button>}
          {order.status === 'fulfilled' && <span className="nx-success-btn is-packed">Đơn DEMO đã hoàn tất</span>}
        </div>
      </div></section>
      <section className="nx-success-ribbon"><div className="nx-success-money"><span className="nx-success-money-label">Tổng đơn DEMO</span><strong className="nx-success-money-value is-net">{money(order.total)}</strong><span className="nx-success-money-note">Không phải khoản tiền đã thu</span></div></section>
      <div className="nx-success-layout"><div className="nx-success-main"><OrderCard icon="bi-bag-check" title="Sản phẩm trong đơn">
        {order.items.map((item, index) => <div key={`${item.productId}-${index}`} className="nx-success-demo-item">
          <img src={item.image} alt={item.title} width="80" height="80" /><div><strong>{item.title}</strong><p>{item.quantity} × {money(item.price)}</p><p>{money(item.price * item.quantity)}</p></div>
        </div>)}
      </OrderCard><OrderCard icon="bi-truck" title="Vận chuyển DEMO"><p>Chưa tạo vận đơn. Không có mã AWB, địa chỉ người mua hoặc nhãn vận chuyển thật trong bản demo.</p><button type="button" className="nx-success-btn" onClick={() => notify.info('Bản demo chưa hỗ trợ tạo hoặc in vận đơn thật.')}>Thông tin vận đơn</button></OrderCard></div>
      <aside className="nx-success-aside"><OrderCard icon="bi-shield-check" title="Kiểm tra đóng gói"><label className="nx-success-check"><input type="checkbox" checked={checked || order.status !== 'placed'} disabled={order.status !== 'placed'} onChange={event => setCheckedOrderId(event.target.checked ? order.id : '')} /><span><strong>Đã kiểm tra sản phẩm và đóng gói (DEMO)</strong><em>Chỉ cập nhật trạng thái mô phỏng, không gọi hãng vận chuyển.</em></span></label></OrderCard></aside></div>
    </>}
  </div></main>;
}