import { sellerKpis as templates } from '../services/sellerOverview.mock';
import { sellerTabs as tabs } from '../constants/sellerHub.constants';
import type { SellerTabId } from '../types/sellerHub';

interface Props {
  activeTab: SellerTabId;
  onTabChange: (tab: SellerTabId) => void;
  onCreateProduct: () => void;
  onAction: (label: string) => void;
}
export default function SellerOverview({ activeTab, onTabChange, onCreateProduct, onAction }: Props) {
  const sellerKpis = templates.map(k => ({ ...k, value: 'N/A', caption: 'Thống kê chưa được hỗ trợ.' }));
  const sellerTabs = tabs.map(t => ({ ...t, badge: '' }));
  return <>
    <section className="nx-seller-heading" aria-labelledby="seller-title">
      <span className="nx-seller-shop-icon"><i className="bi bi-shop" aria-hidden="true" /></span>
      <div className="nx-seller-heading-copy"><div className="nx-seller-title-line"><h1 id="seller-title">Trung tâm Quản lý Bán hàng (Seller Hub)</h1><span className="nx-seller-pro">Kênh người bán</span></div>
        <p>Mã đại lý: <strong>N/A</strong></p></div>
    </section>

    <section className="nx-seller-kpis" aria-label="Tổng quan bán hàng">{sellerKpis.map((kpi, index) => <article className={`nx-seller-kpi nx-seller-kpi--${kpi.tone}`} key={kpi.label}>
      <div><h2>{kpi.label}</h2><p className={`nx-seller-kpi-value ${index === 0 ? 'nx-seller-revenue' : ''}`}>{kpi.value} <small>{kpi.unit}</small></p><p className={`nx-seller-kpi-caption ${index === 0 || index === 3 ? 'nx-seller-red-text' : ''}`}>{index === 0 && <i className="bi bi-graph-up-arrow" aria-hidden="true" />} {kpi.caption}</p></div><span className="nx-seller-kpi-icon"><i className={`bi bi-${kpi.icon}`} aria-hidden="true" /></span>
    </article>)}</section>
    <div className="nx-seller-tabs" role="tablist" aria-label="Chức năng Seller Hub">{sellerTabs.map(tab => <button key={tab.id} type="button" role="tab" id={`hub-tab-${tab.id}`} aria-controls={`hub-panel-${tab.id}`}
      aria-selected={activeTab === tab.id} className={`nx-seller-tab ${activeTab === tab.id ? 'is-active' : ''}`} onClick={() => onTabChange(tab.id)}>
      <i className={`bi bi-${tab.icon}`} aria-hidden="true" />{tab.label}{tab.badge && <span className={tab.id === 'auctions' ? 'nx-seller-live-badge' : ''}>{tab.badge}</span>}
    </button>)}</div>
  </>;
}
