import type { SellerHubState } from '../hooks/useSellerHub';
import type { OrderStatus, SellerOrder } from '../types/sellerHub';
import { formatSellerMoney, orderStatusLabels, sellerOrderFilters } from '../mocks/sellerHub.mock';

const orderActions: Record<OrderStatus, { icon: string; label: string; danger?: boolean }[]> = {
  pending: [{ icon: 'check2-circle', label: 'Xác nhận đơn' }, { icon: 'printer', label: 'In nhãn vận chuyển' }, { icon: 'x-circle', label: 'Hủy đơn', danger: true }],
  packing: [{ icon: 'box-seam', label: 'Đánh dấu đã đóng gói' }, { icon: 'printer', label: 'In nhãn vận chuyển' }],
  shipping: [{ icon: 'geo-alt', label: 'Theo dõi vận chuyển' }, { icon: 'chat-dots', label: 'Nhắn người mua' }],
  done: [{ icon: 'receipt', label: 'Xem hoá đơn' }, { icon: 'arrow-repeat', label: 'Mua lại' }],
  cancelled: [{ icon: 'receipt', label: 'Xem lý do hủy' }],
};

function OrderRow({ order, hub }: { order: SellerOrder; hub: SellerHubState }) {
  return <tr className={order.express && order.status === 'pending' ? 'nx-seller-auction-row' : ''}>
    <td><div className="nx-seller-order-cell"><strong>{order.code}</strong><small>{order.placedAt}</small></div></td>
    <td><div className="nx-seller-order-cell"><strong>{order.buyer}</strong><small>{order.contact}</small></div></td>
    <td><div className="nx-seller-order-items"><strong title={order.items}>{order.items}</strong><small>{order.itemCount}</small></div></td>
    <td><strong className="nx-seller-price">{formatSellerMoney(order.total)}</strong></td>
    <td><span className={`nx-seller-method ${order.express ? 'nx-seller-method--auction' : ''}`}><i className={`bi bi-${order.express ? 'lightning-charge' : 'truck'}`} aria-hidden="true" />{order.method}</span></td>
    <td><div className="nx-seller-order-cell"><span className={`nx-seller-status nx-seller-status--${order.status}`}>{orderStatusLabels[order.status]}</span><small className={order.status === 'pending' ? 'nx-seller-red-text' : ''}>{order.deadline}</small></div></td>
    <td><div className="nx-seller-row-actions">{orderActions[order.status].map(action => <button key={action.label} className={action.danger ? 'nx-seller-red-text' : ''} title={action.label} aria-label={`${action.label}: ${order.code}`} onClick={() => hub.mockAction(`${action.label}: ${order.code}`)}><i className={`bi bi-${action.icon}`} aria-hidden="true" /></button>)}</div></td>
  </tr>;
}

export default function OrdersTab({ hub }: { hub: SellerHubState }) {
  const expressCount = hub.visibleOrders.filter(order => order.express).length;
  return <section role="tabpanel" id="hub-panel-orders" aria-labelledby="hub-tab-orders" className="nx-seller-panel">
    <div className="nx-seller-panel-heading"><div><h2>Đơn Hàng & Vận Chuyển (Fulfillment)</h2><p>{hub.pendingOrders} đơn chờ duyệt, trong đó {expressCount} đơn giao gấp Hỏa Tốc cần xác nhận trong 60 phút.</p></div>
      <button className="nx-seller-button" onClick={() => hub.mockAction('In toàn bộ nhãn vận chuyển')}><i className="bi bi-printer" aria-hidden="true" /> In nhãn hàng loạt</button></div>
    <div className="nx-seller-chips" role="group" aria-label="Lọc đơn hàng">{sellerOrderFilters.map(filter =>
      <button key={filter.id} type="button" className={`nx-seller-chip ${hub.orderFilter === filter.id ? 'is-active' : ''}`} aria-pressed={hub.orderFilter === filter.id} onClick={() => hub.setOrderFilter(filter.id)}>{filter.label} <span>{filter.count}</span></button>)}
      <span className="nx-seller-chips-note"><i className="bi bi-lightning-charge nx-seller-red-text" aria-hidden="true" /> Hỏa Tốc = giao trong 2 giờ</span></div>
    <div className="nx-seller-inventory nx-seller-inventory--plain">
      <div className="nx-seller-table-wrap"><table className="nx-seller-table nx-seller-table--orders"><thead><tr><th>Mã đơn</th><th>Người mua</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Vận chuyển</th><th>Trạng thái / Hạn xử lý</th><th>Thao tác</th></tr></thead>
        <tbody>{hub.visibleOrders.map(order => <OrderRow key={order.id} order={order} hub={hub} />)}{!hub.visibleOrders.length && <tr><td colSpan={7} className="nx-seller-empty">Không có đơn hàng ở trạng thái này.</td></tr>}</tbody></table></div>
      <div className="nx-seller-pagination"><span>Hiển thị {hub.visibleOrders.length} trong tổng số 8 đơn hàng gần nhất</span><nav aria-label="Phân trang đơn hàng"><button disabled>Trước</button><button className="is-active" aria-current="page">1</button><button onClick={() => hub.mockAction('Trang 2: chưa có dữ liệu mẫu')}>2</button><button onClick={() => hub.mockAction('Trang tiếp theo: chưa có dữ liệu mẫu')}>Tiếp theo</button></nav></div>
    </div>
  </section>;
}
