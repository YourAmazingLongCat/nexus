import { moneyRows } from '../mocks/orderSuccess.mock';

export default function OrderEarningsRibbon() {
  return (
    <section className="nx-success-ribbon" aria-label="Chi tiết dòng tiền đơn hàng">
      {moneyRows.map(row => (
        <div className={`nx-success-money${row.highlight ? ' is-highlight' : ''}`} key={row.id}>
          {row.highlight ? (
            <div className="nx-success-money-top">
              <span className="nx-success-money-top-label">{row.label}</span>
              {row.highlightIcon ? <i className={`bi ${row.highlightIcon}`} aria-hidden="true" /> : null}
            </div>
          ) : (
            <span className="nx-success-money-label">{row.label}</span>
          )}

          <span className={`nx-success-money-value is-${row.tone}`}>{row.value}</span>

          <span className={`nx-success-money-note${row.noteStrong ? ' is-strong' : ''}`}>{row.note}</span>
        </div>
      ))}
    </section>
  );
}
