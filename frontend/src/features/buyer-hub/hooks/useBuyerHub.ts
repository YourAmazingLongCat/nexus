import { useEffect, useMemo, useState } from 'react';
import { notify } from '../../../shared/components/Toast';
import {
  auctionWinNotice,
  buyerBids,
  buyerOrders,
  c2cInitialDraft,
  savedItems as savedItemsMock,
} from '../mocks/buyerHub.mock';
import type {
  AuctionFilterId,
  BidStatus,
  BuyerBid,
  BuyerHubTabId,
  C2cDraft,
  OrderFilterId,
  SavedItem,
} from '../types/buyerHub';

/**
 * UI-only Buyer Hub state.
 * Every interactive handler stops at a toast — no buyer hub endpoint is called
 * while the project is still in the mock phase.
 */
export function useBuyerHub() {
  const [activeTab, setActiveTab] = useState<BuyerHubTabId>('auctions');
  const [auctionFilter, setAuctionFilter] = useState<AuctionFilterId>('all');
  const [orderFilter, setOrderFilter] = useState<OrderFilterId>('all');
  const [auctionSearch, setAuctionSearch] = useState('');
  const [bids, setBids] = useState<BuyerBid[]>(buyerBids);
  const [winRemaining, setWinRemaining] = useState(auctionWinNotice.remainingSeconds);
  const [items, setItems] = useState<SavedItem[]>(savedItemsMock);
  const [c2cDraft, setC2cDraft] = useState<C2cDraft>(c2cInitialDraft);

  // Client-side countdowns so the timers look alive while the page is open.
  useEffect(() => {
    if (activeTab !== 'auctions') return undefined;

    const timer = window.setInterval(() => {
      setBids((current) =>
        current.map((bid) =>
          bid.countdownSeconds > 0
            ? { ...bid, countdownSeconds: bid.countdownSeconds - 1 }
            : bid,
        ),
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeTab]);

  useEffect(() => {
    if (winRemaining <= 0) return undefined;

    const timer = window.setInterval(() => {
      setWinRemaining((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [winRemaining]);

  const visibleBids = useMemo(() => {
    const keyword = auctionSearch.trim().toLowerCase();

    return bids.filter((bid) => {
      const matchesFilter =
        auctionFilter === 'all' ||
        (auctionFilter === 'leading' && bid.status === 'leading') ||
        (auctionFilter === 'outbid' && bid.status === 'outbid') ||
        (auctionFilter === 'won' && bid.status === 'lost');

      if (!matchesFilter) return false;
      if (!keyword) return true;
      return (
        bid.title.toLowerCase().includes(keyword) ||
        bid.code.toLowerCase().includes(keyword)
      );
    });
  }, [bids, auctionFilter, auctionSearch]);

  const visibleOrders = useMemo(() => {
    if (orderFilter === 'all') return buyerOrders;
    if (orderFilter === 'shipping') return buyerOrders.filter((o) => o.state === 'shipping');
    if (orderFilter === 'completed') return buyerOrders.filter((o) => o.state === 'completed');
    return [];
  }, [orderFilter]);

  const selectedItemCount = items.filter((item) => item.selected).length;
  const savedSubtotal = items
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  /** CTA in the profile card: jump to the C2C tab and scroll it into view. */
  const handleOpenC2c = () => {
    setActiveTab('c2c');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleBidAction = (bid: BuyerBid) => {
    if (bid.status === 'outbid') {
      notify.info(`Đặt giá thầu cho phiên ${bid.code}: chức năng đấu giá chưa được kết nối.`);
      return;
    }

    if (bid.status === 'leading') {
      notify.info(`Điều chỉnh giá tối đa cho phiên ${bid.code}: chức năng chưa được kết nối.`);
      return;
    }

    notify.info('Danh sách sản phẩm tương tự sẽ có ở bước tích hợp API.');
  };

  const handleBidHistory = (label: string) => {
    notify.info(`${label}: lịch sử đấu giá sẽ có ở bước tích hợp API.`);
  };

  const handleSelectAuctionFilter = (id: AuctionFilterId) => {
    setAuctionFilter(id);
  };

  const handleSelectOrderFilter = (id: OrderFilterId) => {
    setOrderFilter(id);
  };

  const handlePayment = () => {
    notify.info('Cổng thanh toán chưa được kết nối trong giai đoạn giao diện.');
  };

  const handleWinDetail = () => {
    notify.info(`Chi tiết phiên ${auctionWinNotice.code} sẽ có ở bước tích hợp API.`);
  };

  const handleTrackShipment = (code: string) => {
    notify.info(`Tra cứu vận đơn ${code}: chưa kết nối đơn vị vận chuyển.`);
  };

  const handleCancelOrder = (code: string) => {
    notify.warning(`Hủy ${code} cần gọi API đơn hàng — chưa được phép ở giai đoạn UI.`);
  };

  const handleReviewOrder = (code: string) => {
    notify.info(`Đánh giá ${code}: form đánh giá sẽ có ở Task tiếp theo.`);
  };

  const handleRebuy = (code: string) => {
    notify.info(`Mua lại sản phẩm của ${code}: chưa được kết nối.`);
  };

  const handleToggleItem = (id: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)),
    );
  };

  const handleSelectAllItems = () => {
    const allSelected = items.every((item) => item.selected);
    setItems((current) => current.map((item) => ({ ...item, selected: !allSelected })));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(Math.max(1, quantity), item.maxQuantity) }
          : item,
      ),
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    notify.success('Đã xóa sản phẩm khỏi giỏ hàng.');
  };

  const handleCheckoutSelected = () => {
    if (selectedItemCount === 0) {
      notify.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }
    notify.info('Thanh toán giỏ hàng chưa được kết nối trong giai đoạn giao diện.');
  };

  const handleC2cViewBidders = (bidCount: number) => {
    notify.info(`Danh sách ${bidCount} người đặt giá sẽ có ở bước tích hợp API.`);
  };

  const handleC2cEndEarly = () => {
    notify.warning('Kết thúc sớm phiên đấu giá cần gọi API — chưa được phép ở giai đoạn UI.');
  };

  const handleC2cDraftChange = <K extends keyof C2cDraft>(field: K, value: C2cDraft[K]) => {
    setC2cDraft((current) => ({ ...current, [field]: value }));
  };

  const handleC2cReset = () => {
    setC2cDraft(c2cInitialDraft);
  };

  const handleC2cSubmit = () => {
    if (!c2cDraft.name.trim() || !c2cDraft.startPrice.trim() || !c2cDraft.stepPrice.trim()) {
      notify.warning('Vui lòng nhập tên sản phẩm, giá khởi điểm và bước giá.');
      return;
    }
    notify.info('Phiên đấu giá C2C chưa được tạo: API đấu giá chưa được kết nối.');
  };

  const handleLiveFeedAction = () => {
    notify.info('Đấu lại ngay: chức năng đấu giá chưa được kết nối.');
  };

  const handleGuaranteeLink = () => {
    notify.info('Điều khoản bảo vệ người mua sẽ có ở trang chính sách.');
  };

  const handleComplaint = () => {
    notify.info('Biểu mẫu khiếu nại sẽ có ở bước tích hợp API.');
  };

  const handleSupportChat = () => {
    notify.info('Kênh chat trực tuyến sẽ được kết nối ở bước tích hợp.');
  };

  return {
    activeTab,
    setActiveTab,
    auctionFilter,
    orderFilter,
    auctionSearch,
    setAuctionSearch,
    bids,
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
  };
}

export type UseBuyerHub = ReturnType<typeof useBuyerHub>;

/** Status helper kept next to the hook so components stay presentation-only. */
export function resolveBidStatusLabel(status: BidStatus): string {
  if (status === 'outbid') return 'Bị vượt giá';
  if (status === 'leading') return 'Bạn đang dẫn đầu';
  return 'Đã kết thúc (Thua thầu)';
}
