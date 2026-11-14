import { Link } from 'react-router-dom';
import AuctionTab from '../../../features/buyer-hub/components/AuctionTab';
import AuctionWinAlert from '../../../features/buyer-hub/components/AuctionWinAlert';
import BuyerKpiGrid from '../../../features/buyer-hub/components/BuyerKpiGrid';
import BuyerProfileCard from '../../../features/buyer-hub/components/BuyerProfileCard';
import C2cTab from '../../../features/buyer-hub/components/C2cTab';
import GuaranteeWidget from '../../../features/buyer-hub/components/GuaranteeWidget';
import HubTabs from '../../../features/buyer-hub/components/HubTabs';
import LiveFeedWidget from '../../../features/buyer-hub/components/LiveFeedWidget';
import OrdersTab from '../../../features/buyer-hub/components/OrdersTab';
import SavedCartTab from '../../../features/buyer-hub/components/SavedCartTab';
import SupportWidget from '../../../features/buyer-hub/components/SupportWidget';
import { useBuyerHub } from '../../../features/buyer-hub/hooks/useBuyerHub';
import {
  auctionFilters,
  auctionWinNotice,
  buyerKpis,
  buyerProfile,
  c2cAuction,
  c2cCategories,
  c2cDurations,
  guaranteeItems,
  hubCopy,
  hubTabs,
  liveFeedItems,
  orderFilters,
} from '../../../features/buyer-hub/mocks/buyerHub.mock';

/**
 * Buyer Hub — "Trung tâm Mua hàng & Quản lý Đấu giá".
 * UI-only screen: layout + client-side tab switching, every action stops at a toast.
 */
export default function BuyerHubPage() {
  const {
    activeTab,
    setActiveTab,
    auctionFilter,
    orderFilter,
    auctionSearch,
    setAuctionSearch,
    visibleBids,
    visibleOrders,
    winRemaining,
    items,
    c2cDraft,
    handleOpenC2c,
    handleBidAction,
    handleBidHistory,
    handleSelectAuctionFilter,
    handleSelectOrderFilter,
    handlePayment,
    handleWinDetail,
    handleTrackShipment,
    handleCancelOrder,
    handleReviewOrder,
    handleRebuy,
    handleToggleItem,
    handleSelectAllItems,
    handleQuantityChange,
    handleRemoveItem,
    handleC2cViewBidders,
    handleC2cEndEarly,
    handleC2cDraftChange,
    handleC2cReset,
    handleC2cSubmit,
    handleLiveFeedAction,
    handleGuaranteeLink,
    handleComplaint,
    handleSupportChat,
  } = useBuyerHub();

  return (
    <main className="nx-hub-page">
      <div className="nx-container">
        <nav className="nx-hub-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link>
          <i className="bi bi-chevron-right" aria-hidden="true"></i>
          <Link to="/account">{hubCopy.breadcrumbAccount}</Link>
          <i className="bi bi-chevron-right" aria-hidden="true"></i>
          <span className="nx-hub-breadcrumb-current">{hubCopy.breadcrumbCurrent}</span>
        </nav>

        <BuyerProfileCard profile={buyerProfile} onCreateAuction={handleOpenC2c} />

        <BuyerKpiGrid kpis={buyerKpis} timerSeconds={winRemaining} />

        <AuctionWinAlert
          notice={auctionWinNotice}
          onViewDetail={handleWinDetail}
          onPay={handlePayment}
        />

        <div className="nx-hub-layout">
          <div className="nx-hub-main">
            <HubTabs tabs={hubTabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'auctions' && (
              <AuctionTab
                filters={auctionFilters}
                activeFilter={auctionFilter}
                search={auctionSearch}
                filterLabel={hubCopy.auctionFilterLabel}
                searchPlaceholder={hubCopy.auctionSearchPlaceholder}
                bids={visibleBids}
                onFilterChange={handleSelectAuctionFilter}
                onSearchChange={setAuctionSearch}
                onBidAction={handleBidAction}
                onBidHistory={handleBidHistory}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersTab
                filters={orderFilters}
                activeFilter={orderFilter}
                summary={hubCopy.ordersSummary}
                orders={visibleOrders}
                onFilterChange={handleSelectOrderFilter}
                onTrack={handleTrackShipment}
                onCancel={handleCancelOrder}
                onReview={handleReviewOrder}
                onRebuy={handleRebuy}
              />
            )}

            {activeTab === 'cart' && (
              <SavedCartTab
                title={hubCopy.savedCartTitle}
                summary={hubCopy.savedCartSummary}
                selectAllLabel={hubCopy.savedCartSelectAll}
                items={items}
                onToggle={handleToggleItem}
                onSelectAll={handleSelectAllItems}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            )}

            {activeTab === 'c2c' && (
              <C2cTab
                title={hubCopy.c2cTitle}
                subtitle={hubCopy.c2cSubtitle}
                activeLabel={hubCopy.c2cActiveLabel}
                formTitle={hubCopy.c2cFormTitle}
                auction={c2cAuction}
                categories={c2cCategories}
                durations={c2cDurations}
                draft={c2cDraft}
                onViewBidders={handleC2cViewBidders}
                onEndEarly={handleC2cEndEarly}
                onDraftChange={handleC2cDraftChange}
                onReset={handleC2cReset}
                onSubmit={handleC2cSubmit}
              />
            )}
          </div>

          <aside className="nx-hub-aside">
            <LiveFeedWidget
              title={hubCopy.liveFeedTitle}
              items={liveFeedItems}
              onAction={handleLiveFeedAction}
            />
            <GuaranteeWidget
              title={hubCopy.guaranteeTitle}
              subtitle={hubCopy.guaranteeSubtitle}
              items={guaranteeItems}
              linkLabel={hubCopy.guaranteeLink}
              onLink={handleGuaranteeLink}
            />
            <SupportWidget
              title={hubCopy.supportTitle}
              body={hubCopy.supportBody}
              onComplaint={handleComplaint}
              onChat={handleSupportChat}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
