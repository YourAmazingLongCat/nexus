import { useEffect, useState } from 'react';
import { auctionDeadlineSeconds, formatCountdown } from '../services/cartService';

/**
 * Auction-win notice. The countdown is client-side only; the real deadline
 * must come from the auction service once the API layer exists.
 */
export default function AuctionWinBanner({
  seconds = auctionDeadlineSeconds,
}: {
  seconds?: number;
}) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(
      () => setRemaining((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [seconds]);

  return (
    <section className="nx-cart-banner" aria-label="Thông báo trúng đấu giá">
      <i
        className="bi bi-hammer nx-cart-banner-icon"
        aria-hidden="true"
      ></i>
      <div className="nx-cart-banner-body">
        <div className="nx-cart-banner-head">
          <h2 className="nx-cart-banner-title">
            Bạn có 1 sản phẩm đấu giá thành công cần hoàn tất!
          </h2>
          <span className="nx-cart-banner-pill">
            Thời hạn còn {formatCountdown(remaining)}
          </span>
        </div>
        <p className="nx-cart-banner-text">
          Quy chuẩn FR-36: Phiên đấu giá đã chốt giá sàn cuối cùng. Đơn hàng sẽ
          tự động bảo lưu phiên đấu giá độc quyền cho tài khoản của bạn trong 24
          giờ.
        </p>
      </div>
    </section>
  );
}
