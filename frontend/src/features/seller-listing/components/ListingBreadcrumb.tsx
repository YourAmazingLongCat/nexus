import { Link } from 'react-router-dom';
import { listingBreadcrumb } from '../mocks/createListing.mock';

export default function ListingBreadcrumb() {
  return (
    <nav className="nx-listing-crumbs" aria-label="Đường dẫn">
      {listingBreadcrumb.map(item => (
        <span key={item.label} className="nx-listing-crumb">
          <Link to={item.to}>{item.label}</Link>
          <i className="bi bi-chevron-right" aria-hidden="true" />
        </span>
      ))}
      <strong>Thêm Sản Phẩm Mới</strong>
    </nav>
  );
}
