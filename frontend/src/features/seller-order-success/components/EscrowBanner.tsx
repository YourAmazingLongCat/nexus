import { escrowBanner } from '../mocks/orderSuccess.mock';
import type { OrderSuccessState } from '../hooks/useOrderSuccess';

interface EscrowBannerProps {
  hub: OrderSuccessState;
}

export default function EscrowBanner({ hub }: EscrowBannerProps) {
  return (
    <section className="nx-success-banner">
      <div className="nx-success-banner-main">
        <span className="nx-success-banner-icon" aria-hidden="true">
          <i className="bi bi-wallet2" />
        </span>
        <div className="nx-success-banner-copy">
          <h2>{escrowBanner.title}</h2>
          <p>{escrowBanner.description}</p>
        </div>
      </div>
      <div className="nx-success-banner-actions">
        <button type="button" className="nx-success-banner-btn" onClick={() => hub.mockAction(escrowBanner.secondaryLabel)}>
          {escrowBanner.secondaryLabel}
        </button>
        <button
          type="button"
          className="nx-success-banner-btn is-primary"
          onClick={() => hub.mockAction(escrowBanner.primaryLabel)}
        >
          {escrowBanner.primaryLabel}
        </button>
      </div>
    </section>
  );
}
