import { useMemo, useState } from 'react';
import { notify } from '../../../shared/components/Toast';
import { initialListingDraft, listingSaleModes } from '../mocks/createListing.mock';
import type { ListingDraftForm } from '../types/createListing';

const TITLE_MAX = 120;

function formatVnd(value: number) {
  return `${value.toLocaleString('de-DE')} đ`;
}

export function useCreateListing() {
  const [draft, setDraft] = useState<ListingDraftForm>({ ...initialListingDraft });
  const [condition, setCondition] = useState('like-new');
  const [saleModes, setSaleModes] = useState<string[]>(
    listingSaleModes.filter(mode => mode.enabled).map(mode => mode.id),
  );
  const [shippingPayer, setShippingPayer] = useState<'buyer' | 'seller'>('buyer');
  const [accessories, setAccessories] = useState<string[]>([
    'Pin sạc zin (LP-E6NH)',
    'Dây đeo Canon EOS zin',
    'Hộp Box trùng Serial',
    'Thẻ nhớ SD Sandisk Extreme 64GB',
  ]);
  // TODO(seller-listing): Toàn bộ state chỉ phục vụ UI demo, chưa có API và chưa lưu trữ thật.
  const mockAction = (label: string) => {
    notify.info(`${label} — thao tác mô phỏng, chưa kết nối Backend.`);
  };

  function updateDraft<K extends keyof ListingDraftForm>(key: K, value: ListingDraftForm[K]) {
    setDraft(previous => ({ ...previous, [key]: value }));
  }

  function toggleSaleMode(id: string) {
    setSaleModes(previous =>
      previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id],
    );
  }

  function changeQuantity(delta: number) {
    setDraft(previous => ({ ...previous, quantity: Math.min(99, Math.max(1, previous.quantity + delta)) }));
  }

  function removeAccessory(name: string) {
    setAccessories(previous => previous.filter(item => item !== name));
  }

  const titleLength = draft.title.length;
  const titleOverLimit = titleLength > 100;
  const discountPercent = draft.price > 0
    ? Math.round(((draft.price - draft.dealPrice) / draft.price) * 100)
    : 0;
  const serviceFee = Math.round(draft.dealPrice * 0.03);
  const netEarnings = draft.dealPrice - serviceFee;

  const formatted = useMemo(() => ({
    dealPrice: formatVnd(draft.dealPrice),
    price: formatVnd(draft.price),
    minOffer: formatVnd(draft.minOffer),
    serviceFee: formatVnd(serviceFee),
    netEarnings: formatVnd(netEarnings),
  }), [draft.dealPrice, draft.price, draft.minOffer, serviceFee, netEarnings]);

  function submitListing() {
    if (!draft.title.trim()) {
      notify.warning('Vui lòng nhập tên sản phẩm niêm yết.');
      return;
    }
    mockAction(`Đăng bán “${draft.title.trim()}”`);
  }

  return {
    draft,
    updateDraft,
    condition,
    setCondition,
    saleModes,
    toggleSaleMode,
    shippingPayer,
    setShippingPayer,
    accessories,
    removeAccessory,
    changeQuantity,
    titleLength,
    titleMax: TITLE_MAX,
    titleOverLimit,
    discountPercent,
    formatted,
    submitListing,
    mockAction,
  };
}

export type CreateListingState = ReturnType<typeof useCreateListing>;
