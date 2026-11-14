import type { AuctionWinNotice } from '../types/buyerHub';
import { formatVnd } from '../utils/buyerHub.format';

interface AuctionWinAlertProps {
  notice: AuctionWinNotice;
  onViewDetail: () => void;
  onPay: () => void;
}

export default function AuctionWinAlert({ notice, onViewDetail, onPay }: AuctionWinAlertProps) {
  return (
    <section className="nx-hub-win" aria-labelledby="hub-win-title">
      <div className="nx-hub-win-main">
        <span className="nx-hub-win-icon" aria-hidden="true">
          <i className="bi bi-stars"></i>
        </span>

        <div className="nx-hub-win-text">
          <div className="nx-hub-win-heading">
            <h2 id="hub-win-title" className="nx-hub-win-title">
              Chúc mừng! Bạn đã thắng phiên đấu giá {notice.code}
            </h2>
            <span className="nx-hub-win-tag">Cần thanh toán</span>
          </div>
          <p className="nx-hub-win-desc">
            Sản phẩm: <strong>{notice.productName}</strong> với giá chốt{' '}
            <strong>{formatVnd(notice.finalPrice)}</strong>. Vui lòng thanh toán trong 24h để người
            bán bàn giao hàng vận chuyển.
          </p>
        </div>
      </div>

      <div className="nx-hub-win-actions">
        <button type="button" className="nx-hub-btn nx-hub-btn--white" onClick={onViewDetail}>
          Chi tiết phiên
        </button>
        <button type="button" className="nx-hub-btn nx-hub-btn--pay" onClick={onPay}>
          {notice.payLabel}
        </button>
      </div>
    </section>
  );
}
