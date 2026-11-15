import { Link } from 'react-router-dom';
import { useDemoStore } from '../../../shared/demo/demoStore';
import { formatVnd } from '../utils/buyerHub.format';

const statusLabels = { placed: 'Đã đặt · Chờ người bán xử lý', packing: 'Đang đóng gói', fulfilled: 'Đã hoàn tất' };

export default function DemoOrders() {
  const { orders } = useDemoStore();
  return <section className="nx-hub-panel nx-hub-panel--card" aria-label="Đơn hàng DEMO">
    <div className="nx-hub-saved-head"><div>
      <h3 className="nx-hub-saved-title">Đơn hàng DEMO của bạn ({orders.length})</h3>
      <p className="nx-hub-saved-summary">Dữ liệu dùng chung trên trình duyệt này. Không thanh toán hoặc giao hàng thật. Trạng thái cập nhật từ trang người bán DEMO.</p>
    </div></div>
    <div className="nx-hub-order-list" aria-live="polite">
      {orders.length === 0 ? <p className="nx-hub-empty">Chưa có đơn hàng DEMO. <Link to="/cart">Mở giỏ hàng</Link> để đặt thử.</p> : orders.map((order) =>
        <article className="nx-hub-order" key={order.id}>
          <div className="nx-hub-saved-head"><strong>{order.id}</strong><span className="nx-hub-badge nx-hub-badge--leading">{statusLabels[order.status]}</span></div>
          <p className="nx-hub-saved-meta">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
          {order.items.map((item) => <div className="nx-hub-saved-row" key={item.productId}>
            <div className="nx-hub-saved-main"><div className="nx-hub-saved-thumb"><img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            <div><h4 className="nx-hub-saved-name">{item.title}</h4><p className="nx-hub-saved-meta">Số lượng: {item.quantity} · {formatVnd(item.price)}</p></div></div>
          </div>)}
          <p className="nx-hub-saved-price">Tổng DEMO: {formatVnd(order.total)}</p>
        </article>)}
    </div>
  </section>;
}
