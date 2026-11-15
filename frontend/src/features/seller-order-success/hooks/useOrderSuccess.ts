import { useState } from 'react';
import { notify } from '../../../shared/components/Toast';
import { packingChecklist, toastMessages } from '../mocks/orderSuccess.mock';

function buildChecklistState() {
  return packingChecklist.reduce<Record<string, boolean>>((state, item) => {
    state[item.id] = true;
    return state;
  }, {});
}

export function useOrderSuccess() {
  const [packed, setPacked] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>(buildChecklistState);

  // TODO(seller-order-success): Toàn bộ state dưới đây chỉ phục vụ UI demo, chưa có API và chưa lưu trữ thật.
  const mockAction = (label: string) => {
    notify.info(`${label} — thao tác mô phỏng, chưa kết nối Backend.`);
  };

  function toggleChecklist(id: string) {
    setChecklist(previous => ({ ...previous, [id]: !previous[id] }));
  }

  function printAwb() {
    notify.info(toastMessages.print);
  }

  function confirmPacking() {
    setPacked(true);
    notify.success(toastMessages.packed);
  }

  async function copyAwb(awb: string) {
    if (!awb.trim()) { notify.warning('Chưa có mã vận đơn để sao chép.'); return; }
    if (!navigator.clipboard?.writeText) { notify.warning('Trình duyệt không hỗ trợ sao chép mã vận đơn.'); return; }
    try { await navigator.clipboard.writeText(awb); notify.success(toastMessages.copied); }
    catch { notify.warning('Không thể sao chép mã vận đơn. Vui lòng thử lại.'); }
  }

  return {
    packed,
    confirmPacking,
    checklist,
    toggleChecklist,
    copyAwb,
    printAwb,
    mockAction,
  };
}

export type OrderSuccessState = ReturnType<typeof useOrderSuccess>;
