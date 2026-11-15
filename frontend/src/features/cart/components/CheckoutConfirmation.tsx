import Modal from 'react-bootstrap/Modal';
import { formatVnd } from '../utils/cart.format';

interface CheckoutConfirmationProps {
  open: boolean;
  itemCount: number;
  total: number;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Confirmation only: submitting creates a local DEMO order, never a payment. */
export default function CheckoutConfirmation({ open, itemCount, total, onCancel, onConfirm }: CheckoutConfirmationProps) {
  return (
    <Modal show={open} onHide={onCancel} centered aria-labelledby="checkout-confirm-title">
      <Modal.Header closeButton closeLabel="Đóng xác nhận đơn hàng">
        <Modal.Title id="checkout-confirm-title" as="h2" className="fs-5">Xác nhận đơn hàng demo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Vui lòng kiểm tra trước khi xác nhận đặt hàng.</p>
        <dl className="d-flex justify-content-between mb-2">
          <dt>Số lượng sản phẩm</dt><dd className="mb-0">{itemCount}</dd>
        </dl>
        <dl className="d-flex justify-content-between mb-3">
          <dt>Tổng thanh toán demo</dt><dd className="mb-0 fw-bold text-primary">{formatVnd(total)}</dd>
        </dl>
        <p className="alert alert-info small mb-0">Đây là đơn hàng DEMO lưu trên trình duyệt. Không thu tiền và không gửi yêu cầu thanh toán thật.</p>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-light rounded-pill" onClick={onCancel}>Quay lại</button>
        <button type="button" className="btn btn-primary rounded-pill" disabled={itemCount === 0} onClick={onConfirm}>Xác nhận đặt đơn demo</button>
      </Modal.Footer>
    </Modal>
  );
}
