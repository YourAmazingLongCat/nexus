import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { notify } from '../../../shared/components/Toast';
import AuctionWinBanner from '../components/AuctionWinBanner';
import CartEmptyState from '../components/CartEmptyState';
import CartItemRow from '../components/CartItemRow';
import CartStepper from '../components/CartStepper';
import OrderSummary from '../components/OrderSummary';
import PaymentMethods from '../components/PaymentMethods';
import ShippingAddressCard from '../components/ShippingAddressCard';
import ShippingOptions from '../components/ShippingOptions';
import {
  calculateTotals,
  cartSessionCode,
  defaultVoucherCode,
  deliveryAddress,
  findVoucher,
  formatVnd,
  initialCartItems,
  paymentMethods,
  shippingMethods,
} from '../services/cartService';
import type {
  CartItem,
  PaymentMethodId,
  ShippingMethodId,
  Voucher,
} from '../types/cart';

/**
 * Cart + checkout in a single screen (FR-15 → FR-21).
 * UI-only phase: no cart/checkout API is called, all data comes from
 * cartService fixtures and every total is computed on the client.
 */
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const [shippingId, setShippingId] = useState<ShippingMethodId>('standard');
  const [paymentId, setPaymentId] = useState<PaymentMethodId>('vnpay');
  const [voucherInput, setVoucherInput] = useState(defaultVoucherCode);
  const [voucher, setVoucher] = useState<Voucher | null>(
    findVoucher(defaultVoucherCode) ?? null,
  );

  const shippingMethod =
    shippingMethods.find((method) => method.id === shippingId) ??
    shippingMethods[0];

  const hasAuctionItems = items.some((item) => item.mode === 'auction');

  const totals = useMemo(
    () => calculateTotals(items, { shippingFee: shippingMethod.fee, voucher }),
    [items, shippingMethod.fee, voucher],
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (id: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(Math.max(1, quantity), item.maxQuantity) }
          : item,
      ),
    );
  };

  const handleRemove = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    notify.success('Đã xóa sản phẩm khỏi giỏ hàng.');
  };

  const handleSaveForLater = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    notify.info('Đã chuyển sản phẩm vào danh sách "Lưu lại sau".');
  };

  const handleApplyVoucher = () => {
    const code = voucherInput.trim().toUpperCase();

    if (!code) {
      notify.warning('Vui lòng nhập mã giảm giá.');
      return;
    }

    const found = findVoucher(code);
    if (!found) {
      notify.error('Mã giảm giá không tồn tại hoặc đã hết hạn.');
      return;
    }

    if (totals.directSubtotal <= 0) {
      notify.warning(
        'Mã này chỉ áp dụng cho sản phẩm Mua trực tiếp, không áp dụng cho hàng đấu giá.',
      );
      return;
    }

    setVoucher(found);
    notify.success(`Đã áp dụng mã ${found.code}, giảm ${formatVnd(found.discount)}.`);
  };

  const handleClearVoucher = () => {
    setVoucher(null);
    setVoucherInput('');
    notify.info('Đã bỏ mã giảm giá.');
  };

  const handleChangeAddress = () => {
    notify.info('Chức năng quản lý địa chỉ sẽ có ở bước tích hợp API.');
  };

  const handleSupport = () => {
    notify.info('Kênh chat trực tuyến sẽ được kết nối ở bước tích hợp.');
  };

  // Mock confirmation only: no payment gateway / order API is wired up yet.
  const handleCheckout = () => {
    notify.info(
      `Đơn hàng ${formatVnd(totals.total)} chưa được gửi: hệ thống thanh toán chưa được kết nối.`,
    );
  };

  const shippingLabel = shippingMethod.freeLabel
    ? `Miễn phí (${formatVnd(0)})`
    : formatVnd(shippingMethod.fee);

  return (
    <main className="nx-cart-page">
      <div className="nx-container">
        {/* Breadcrumb + flow progress */}
        <div className="nx-cart-topbar">
          <nav className="nx-cart-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link>
            <i className="bi bi-chevron-right" aria-hidden="true"></i>
            <span>Giỏ hàng &amp; Thanh toán</span>
          </nav>
          <CartStepper current={1} />
        </div>

        {hasAuctionItems && <AuctionWinBanner />}

        {items.length === 0 ? (
          <CartEmptyState />
        ) : (
          <div className="nx-cart-layout">
            {/* LEFT: cart → address → payment */}
            <div className="nx-cart-main">
              <section className="nx-cart-section">
                <header className="nx-cart-section-head">
                  <div className="nx-cart-section-title">
                    <span
                      className="nx-cart-section-mark"
                      aria-hidden="true"
                    ></span>
                    <h1>1. Giỏ hàng của bạn</h1>
                    <span className="nx-cart-section-count">
                      {itemCount} sản phẩm
                    </span>
                  </div>
                  <span className="nx-cart-session">
                    Mã phiên: {cartSessionCode}
                  </span>
                </header>

                <div className="nx-cart-items">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                      onSaveForLater={handleSaveForLater}
                    />
                  ))}
                </div>
              </section>

              <section className="nx-cart-section">
                <header className="nx-cart-section-head">
                  <div className="nx-cart-section-title">
                    <span
                      className="nx-cart-section-mark"
                      aria-hidden="true"
                    ></span>
                    <h2>2. Địa chỉ nhận hàng &amp; Giao vận</h2>
                  </div>
                  <button
                    type="button"
                    className="nx-cart-section-action"
                    onClick={handleChangeAddress}
                  >
                    <i className="bi bi-geo-alt" aria-hidden="true"></i>
                    <span>Thay đổi địa chỉ</span>
                  </button>
                </header>

                <ShippingAddressCard address={deliveryAddress} />
                <ShippingOptions
                  methods={shippingMethods}
                  value={shippingId}
                  onChange={setShippingId}
                />
              </section>

              <section className="nx-cart-section">
                <header className="nx-cart-section-head">
                  <div className="nx-cart-section-title">
                    <span
                      className="nx-cart-section-mark"
                      aria-hidden="true"
                    ></span>
                    <h2>3. Phương thức thanh toán an toàn</h2>
                  </div>
                  <span className="nx-cart-section-note">
                    <i className="bi bi-shield-check" aria-hidden="true"></i>
                    <span>Bảo mật chuẩn PCI-DSS Level 1</span>
                  </span>
                </header>

                <PaymentMethods
                  methods={paymentMethods}
                  value={paymentId}
                  onChange={setPaymentId}
                  hasAuctionItems={hasAuctionItems}
                />
              </section>
            </div>

            {/* RIGHT: sticky summary */}
            <aside className="nx-cart-summary-col">
              <OrderSummary
                totals={totals}
                voucher={voucher}
                voucherInput={voucherInput}
                shippingLabel={shippingLabel}
                hasItems={items.length > 0}
                onVoucherInput={setVoucherInput}
                onApplyVoucher={handleApplyVoucher}
                onClearVoucher={handleClearVoucher}
                onCheckout={handleCheckout}
                onSupport={handleSupport}
              />
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
