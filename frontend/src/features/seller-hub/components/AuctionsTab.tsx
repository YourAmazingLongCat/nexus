import type { SellerHubState } from '../hooks/useSellerHub';
import type { SellerAuction } from '../types/sellerHub';
import { auctionStates, formatSellerMoney, sellerAuctionKpis } from '../mocks/sellerHub.mock';

const stateLabels: Record<SellerAuction['state'], string> = { live: 'Đang diễn ra', closing: 'Sắp kết thúc' };

function AuctionRow({ auction, hub }: { auction: SellerAuction; hub: SellerHubState }) {
  const actions = [
    { icon: 'lightning-charge', label: 'Sàn bid' },
    { icon: 'flag', label: 'Kết thúc phiên' },
    { icon: 'pencil-square', label: 'Chỉnh sửa phiên' },
  ];
  const step = auction.currentBid - auction.startPrice;
  return <tr className={auction.state === 'closing' ? 'nx-seller-auction-row' : ''}>
    <td><div className="nx-seller-product"><div className="nx-seller-thumb"><img src={auction.image} alt={auction.product} /><span>LIVE</span></div>
      <div className="nx-seller-product-copy"><strong title={auction.product}>{auction.product}</strong>
        <div className="nx-seller-product-meta"><span className="nx-seller-sku nx-seller-sku--red">Auction {auction.roomCode}</span><small>Top bidder: <b>{auction.topBidder}</b></small></div></div></div></td>
    <td><div className="nx-seller-auction-time"><strong className="nx-seller-red-text"><i className="bi bi-clock" aria-hidden="true" /> {auction.endsIn}</strong><small className={`nx-seller-state nx-seller-state--${auction.state}`}>{stateLabels[auction.state]}</small></div></td>
    <td><strong className="nx-seller-price nx-seller-red-text">{formatSellerMoney(auction.currentBid)}</strong><small className="nx-seller-price-note">Khởi điểm {formatSellerMoney(auction.startPrice)}</small></td>
    <td><div className="nx-seller-auction-bids"><strong>{auction.bids}</strong><small>lượt bid · +{formatSellerMoney(step)}</small></div></td>
    <td><small className="nx-seller-auction-watchers"><i className="bi bi-eye" aria-hidden="true" /> {auction.watchers}</small></td>
    <td><div className="nx-seller-row-actions">{actions.map((action, index) => <button key={action.label} className={index === 1 ? 'nx-seller-red-text' : ''} title={action.label} aria-label={`${action.label}: ${auction.product}`} onClick={() => hub.mockAction(`${action.label}: ${auction.roomCode}`)}><i className={`bi bi-${action.icon}`} aria-hidden="true" /></button>)}</div></td>
  </tr>;
}

export default function AuctionsTab({ hub }: { hub: SellerHubState }) {
  return <section role="tabpanel" id="hub-panel-auctions" aria-labelledby="hub-tab-auctions" className="nx-seller-panel">
    <div className="nx-seller-panel-heading"><div><h2>Phiên Đấu Giá Đang Chạy (Active Auctions)</h2><p>5 phiên đang mở, cập nhật lượt bid theo thời gian thực trên sàn Nexus.</p></div>
      <button className="nx-seller-button nx-seller-button--red" onClick={() => hub.mockAction('Tạo phiên Đấu giá mới')}><i className="bi bi-hammer" aria-hidden="true" /> + Tạo phiên mới</button></div>
    <div className="nx-seller-panel-kpis" aria-label="Tổng quan phiên đấu giá">{sellerAuctionKpis.map(kpi => <article className={`nx-seller-panel-kpi nx-seller-panel-kpi--${kpi.tone}`} key={kpi.label}>
      <div><h3>{kpi.label}</h3><p>{kpi.value} <small>{kpi.unit}</small></p><span>{kpi.caption}</span></div><i className={`bi bi-${kpi.icon}`} aria-hidden="true" />
    </article>)}</div>
    <div className="nx-seller-inventory nx-seller-inventory--plain">
      <div className="nx-seller-chips" role="group" aria-label="Lọc phiên đấu giá">{Object.entries(auctionStates).map(([id, label]) =>
        <button key={id} type="button" className={`nx-seller-chip ${hub.auctionFilter === id ? 'is-active' : ''}`} aria-pressed={hub.auctionFilter === id} onClick={() => hub.setAuctionFilter(id)}>{label}</button>)}
        <span className="nx-seller-chips-note"><i className="bi bi-lightning-charge" aria-hidden="true" /> Bid tự động bật cho mọi phiên</span></div>
      <div className="nx-seller-table-wrap"><table className="nx-seller-table nx-seller-table--auctions"><thead><tr><th>Sản phẩm & Mã phòng</th><th>Thời gian còn lại</th><th>Giá hiện tại</th><th>Lượt bid</th><th>Quan tâm</th><th>Thao tác</th></tr></thead>
        <tbody>{hub.visibleAuctions.map(auction => <AuctionRow key={auction.id} auction={auction} hub={hub} />)}{!hub.visibleAuctions.length && <tr><td colSpan={6} className="nx-seller-empty">Không có phiên đấu giá nào ở trạng thái này.</td></tr>}</tbody></table></div>
      <div className="nx-seller-pagination"><span>Hiển thị {hub.visibleAuctions.length} trong tổng số 5 phiên đang chạy</span><nav aria-label="Phân trang phiên đấu giá"><button disabled>Trước</button><button className="is-active" aria-current="page">1</button><button disabled>Tiếp theo</button></nav></div>
    </div>
  </section>;
}
