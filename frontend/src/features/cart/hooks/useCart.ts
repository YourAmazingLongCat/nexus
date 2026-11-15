import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoActions, useDemoStore } from '../../../shared/demo/demoStore';
import { notify } from '../../../shared/components/Toast';
import { defaultVoucherCode, shippingMethods, vouchers } from '../mocks/cart.mock';
import { calculateTotals } from '../services/cart.calculation';
import { findVoucher } from '../services/cart.voucher';
import { formatVnd } from '../utils/cart.format';
import type { CartItem, PaymentMethodId, ShippingMethodId, Voucher } from '../types/cart';

/** UI-only cart state. TODO: Replace mock data with REST API when assigned. */
export function useCart() {
  const state = useDemoStore();
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const checkoutLock = useRef(false);
  const items: CartItem[] = state.cart.flatMap(line => {
    const p = state.products.find(p => p.id === line.productId);
    return p ? [{id:p.id, name:p.title, image:p.image, unitPrice:p.price, quantity:line.quantity, maxQuantity:p.quantity, mode:'direct' as const, variant:p.condition, sellerName:'DEMO seller'}] : [];
  });
  const [shippingId, setShippingId] = useState<ShippingMethodId>('standard');
  const [paymentId, setPaymentId] = useState<PaymentMethodId>('vnpay');
  const [voucherInput, setVoucherInput] = useState(defaultVoucherCode);
  const [voucher, setVoucher] = useState<Voucher | null>(
    findVoucher(defaultVoucherCode, vouchers) ?? null,
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
    demoActions.setQuantity(id, quantity);
  };

  const handleRemove = (id: string) => {
    demoActions.removeFromCart(id);
    notify.success('Đã xóa sản phẩm khỏi giỏ hàng.');
  };

  const handleSaveForLater = (id: string) => {
    if (!state.saved.includes(id)) demoActions.toggleSaved(id);
    demoActions.removeFromCart(id);
    notify.info('Đã chuyển sản phẩm vào danh sách "Lưu lại sau".');
  };

  const handleApplyVoucher = () => {
    const code = voucherInput.trim().toUpperCase();

    if (!code) {
      notify.warning('Vui lòng nhập mã giảm giá.');
      return;
    }

    const found = findVoucher(code, vouchers);
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

  // Local-only demo order: selected payment UI is never sent or persisted.
  const handleCheckout = () => {
    if (!items.length) {
      notify.warning('Giỏ hàng đang trống.');
      return;
    }
    setCheckoutOpen(true);
  };

  const cancelCheckout = () => setCheckoutOpen(false);
  const confirmCheckout = () => {
    if (checkoutLock.current) return;
    checkoutLock.current = true;
    try {
      const id = demoActions.checkout(totals.total);
      notify.success('DEMO order ' + id + ' created. No payment was made.');
      setCheckoutOpen(false);
      navigate('/buyer-hub');
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Unable to create demo order.');
    } finally {
      checkoutLock.current = false;
    }
  };

  const shippingLabel = shippingMethod.freeLabel
    ? `Miễn phí (${formatVnd(0)})`
    : formatVnd(shippingMethod.fee);

  return {
    items, shippingId, setShippingId, paymentId, setPaymentId,
    voucherInput, setVoucherInput, voucher, hasAuctionItems, totals, itemCount,
    shippingLabel, handleQuantityChange, handleRemove, handleSaveForLater,
    handleApplyVoucher, handleClearVoucher, handleChangeAddress, handleSupport,
    handleCheckout, checkoutOpen, cancelCheckout, confirmCheckout,
  };
}
