import { heroActions, heroInfo } from '../mocks/orderSuccess.mock';
import type { OrderSuccessState } from '../hooks/useOrderSuccess';

interface OrderSuccessHeroProps {
  hub: OrderSuccessState;
}

export default function OrderSuccessHero({ hub }: OrderSuccessHeroProps) {
  return (
    <section className="nx-success-hero">
      <span className="nx-success-hero-blob" aria-hidden="true" />
      <div className="nx-success-hero-inner">
        <div className="nx-success-hero-copy">
          <span className="nx-success-hero-icon" aria-hidden="true">
            <i className="bi bi-patch-check-fill" />
          </span>
          <div className="nx-success-hero-text">
            <div className="nx-success-hero-meta">
              <span className="nx-success-hero-type">{heroInfo.orderType}</span>
              <span className="nx-success-hero-time">
                <i className="bi bi-clock" aria-hidden="true" />
                {heroInfo.paidAt}
              </span>
              <span className="nx-success-hero-sep" aria-hidden="true">
                •
              </span>
              <span className="nx-success-hero-code">
                Mã đơn: <strong>{heroInfo.orderCode}</strong>
              </span>
            </div>
            <h1>{heroInfo.title}</h1>
            <p className="nx-success-hero-buyer">
              Người mua: <strong>{heroInfo.buyerName}</strong> {heroInfo.buyerHandle}
              <span className="nx-success-hero-badge">{heroInfo.buyerBadge}</span>
              <span className="nx-success-hero-sep" aria-hidden="true">
                •
              </span>
              <span className="nx-success-hero-escrow">{heroInfo.escrowNote}</span>
            </p>
          </div>
        </div>

        <div className="nx-success-hero-actions">
          <button type="button" className="nx-success-btn is-primary" onClick={hub.printAwb}>
            <i className="bi bi-printer" aria-hidden="true" />
            {heroActions.print}
          </button>
          <div className="nx-success-hero-actions-row">
            <button
              type="button"
              className={`nx-success-btn${hub.packed ? ' is-packed' : ''}`}
              onClick={hub.confirmPacking}
              aria-pressed={hub.packed}
            >
              <i className={`bi ${hub.packed ? 'bi-check2-all' : 'bi-box-seam'}`} aria-hidden="true" />
              {hub.packed ? heroActions.packed : heroActions.pack}
            </button>
            <button type="button" className="nx-success-btn" onClick={() => hub.mockAction(heroActions.chat)}>
              <i className="bi bi-chat-dots" aria-hidden="true" />
              {heroActions.chat}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
