import { Link } from 'react-router-dom';
import AuctionTab from '../components/AuctionTab';
import AuctionWinAlert from '../components/AuctionWinAlert';
import BuyerKpiGrid from '../components/BuyerKpiGrid';
import BuyerProfileCard from '../components/BuyerProfileCard';
import C2cTab from '../components/C2cTab';
import GuaranteeWidget from '../components/GuaranteeWidget';
import HubTabs from '../components/HubTabs';
import LiveFeedWidget from '../components/LiveFeedWidget';
import OrdersTab from '../components/OrdersTab';
import DemoOrders from '../components/DemoOrders';
import SavedCartTab from '../components/SavedCartTab';
import SupportWidget from '../components/SupportWidget';
import { useBuyerHub } from '../hooks/useBuyerHub';
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
} from '../mocks/buyerHub.mock';

/**
 * Buyer Hub — "Trung tâm Mua hàng & Quản lý Đấu giá".
 * Shared demo saved items and orders; legacy fixture sections remain labeled sample data.
 */
export default function BuyerHubPage() {
  const {
    demoOrderCount,
    savedCount,
    handleMoveToCart,
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
    selectedItemCount,
    savedSubtotal,
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
    handleCheckoutSelected,
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

        <p className="nx-hub-empty">DEMO · Đấu giá, hồ sơ, số dư, chỉ số và thông báo bên dưới là dữ liệu mẫu. Không có giao dịch thật.</p>
        <BuyerProfileCard profile={buyerProfile} onCreateAuction={handleOpenC2c} />

        <BuyerKpiGrid kpis={buyerKpis} timerSeconds={winRemaining} />

        <AuctionWinAlert
          notice={auctionWinNotice}
          onViewDetail={handleWinDetail}
          onPay={handlePayment}
        />

        <div className="nx-hub-layout">
          <div className="nx-hub-main">
            <HubTabs tabs={hubTabs.map((tab) => tab.id === 'cart' ? { ...tab, count: savedCount } : tab.id === 'orders' ? { ...tab, count: demoOrderCount } : tab)} activeTab={activeTab} onChange={setActiveTab} />

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
              <>
              <DemoOrders />
              <p className="nx-hub-empty">Đơn hàng mẫu thiết kế bên dưới — không phải đơn hàng DEMO của bạn.</p>
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
              </>
            )}

            {activeTab === 'cart' && (
              <SavedCartTab
                title="Sản phẩm đã lưu DEMO"
                summary={`${savedCount} sản phẩm đã lưu từ danh mục dùng chung trên trình duyệt này.`}
                selectAllLabel="Chọn tất cả để chuyển vào giỏ"
                items={items}
                selectedCount={selectedItemCount}
                subtotal={savedSubtotal}
                onToggle={handleToggleItem}
                onSelectAll={handleSelectAllItems}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                onMoveToCart={handleMoveToCart}
                onCheckout={handleCheckoutSelected}
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
