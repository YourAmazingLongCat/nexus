import { useMemo, useState } from 'react';
import { notify } from '../../../../shared/components/Toast';
import { defaultVoucherCode, initialCartItems, shippingMethods, vouchers } from '../mocks/cart.mock';
import { calculateTotals } from '../services/cart.calculation';
import { findVoucher } from '../services/cart.voucher';
import { formatVnd } from '../utils/cart.format';
import type { CartItem, PaymentMethodId, ShippingMethodId, Voucher } from '../types/cart';

/** UI-only cart state. TODO: Replace mock data with REST API when assigned. */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
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

  // Mock confirmation only: no payment gateway / order API is wired up yet.
  const handleCheckout = () => {
    notify.info(
      `Đơn hàng ${formatVnd(totals.total)} chưa được gửi: hệ thống thanh toán chưa được kết nối.`,
    );
  };

  const shippingLabel = shippingMethod.freeLabel
    ? `Miễn phí (${formatVnd(0)})`
    : formatVnd(shippingMethod.fee);

  return {
    items, shippingId, setShippingId, paymentId, setPaymentId,
    voucherInput, setVoucherInput, voucher, hasAuctionItems, totals, itemCount,
    shippingLabel, handleQuantityChange, handleRemove, handleSaveForLater,
    handleApplyVoucher, handleClearVoucher, handleChangeAddress, handleSupport,
    handleCheckout,
  };
}
