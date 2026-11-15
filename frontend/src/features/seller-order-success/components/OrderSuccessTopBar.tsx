import { Link } from 'react-router-dom';
import { breadcrumbItems, escrowStatus } from '../mocks/orderSuccess.mock';

export default function OrderSuccessTopBar() {
  return (
    <div className="nx-success-topbar">
      <nav className="nx-success-crumbs" aria-label="Breadcrumb">
        {breadcrumbItems.map((item, index) => (
          <span className="nx-success-crumb" key={item.label}>
            {index > 0 ? (
              <span className="nx-success-crumb-sep" aria-hidden="true">
                /
              </span>
            ) : null}
            {item.icon ? <i className={`bi ${item.icon}`} aria-hidden="true" /> : null}
            {item.to ? <Link to={item.to}>{item.label}</Link> : <strong>{item.label}</strong>}
          </span>
        ))}
      </nav>
      <span className="nx-success-status">
        <span className="nx-success-status-dot" aria-hidden="true" />
        {escrowStatus}
      </span>
    </div>
  );
}
