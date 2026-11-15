import { fulfillmentDeadline, fulfillmentSteps } from '../mocks/orderSuccess.mock';

export default function OrderFulfillmentTimeline() {
  return (
    <section className="nx-success-timeline">
      <header className="nx-success-timeline-head">
        <div className="nx-success-timeline-title">
          <i className="bi bi-bar-chart-steps" aria-hidden="true" />
          <h2>Tiến Trình Xử Lý Đơn Hàng</h2>
        </div>
        <p className="nx-success-timeline-deadline">
          <i className="bi bi-stopwatch" aria-hidden="true" />
          {fulfillmentDeadline}
        </p>
      </header>

      <ol className="nx-success-steps">
        {fulfillmentSteps.map(step => (
          <li className={`nx-success-step is-${step.state}`} key={step.id}>
            <div className="nx-success-step-top">
              <span className="nx-success-step-badge">
                {step.badgeIcon ? <i className={`bi ${step.badgeIcon}`} aria-hidden="true" /> : step.index}
              </span>
              <span className="nx-success-step-state">{step.stateLabel}</span>
            </div>
            <h3>{`${step.index}. ${step.title}`}</h3>
            <p className="nx-success-step-caption">{step.caption}</p>
            <p className={`nx-success-step-time is-${step.timeTone}`}>{step.timestamp}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
