import { validateListing } from './listingValidation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notify } from '../../../shared/components/Toast';
import { demoActions, useDemoStore } from '../../../shared/demo/demoStore';
import { initialListingDraft, listingAccessories, listingMediaSlots, listingSaleModes } from '../mocks/createListing.mock';
import type { ListingDraftForm, ListingMediaSlot } from '../types/createListing';
const TITLE_MAX = 120;
const formatVnd = (value: number) => `${value.toLocaleString('vi-VN')} đ`;
export function useCreateListing() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const store = useDemoStore();
  const restored = store.drafts.find(item => item.id === params.get('draft'));
  const [draftId, setDraftId] = useState<string | undefined>(restored?.id);
  const [draft, setDraft] = useState<ListingDraftForm>(() => ({ ...initialListingDraft, ...restored?.listing?.form, ...(restored ? {title: restored.title, description: restored.description, price: restored.price, quantity: restored.quantity} : {}) }) as ListingDraftForm);
  const [category, setCategory] = useState(restored?.category ?? 'camera');
  const [condition, setCondition] = useState(restored?.condition ?? 'like-new');
  const [saleModes, setSaleModes] = useState<string[]>(restored?.listing?.saleModes ?? listingSaleModes.filter(mode => mode.enabled).map(mode => mode.id));
  const [shippingPayer, setShippingPayer] = useState<'buyer' | 'seller'>(restored?.listing?.shippingPayer ?? 'buyer');
  const [accessories, setAccessories] = useState<string[]>(restored?.listing?.accessories ?? listingAccessories);
  const [media, setMedia] = useState<ListingMediaSlot[]>(listingMediaSlots);
  const [saved, setSaved] = useState(!!restored);
  const [errors, setErrors] = useState<string[]>([]);
  const urls = useRef(new Set<string>());
  // Synchronize delayed localStorage hydration and draft navigation from the external store.
  // eslint-disable-next-line react/set-state-in-effect
  useEffect(() => {
    if (!restored || restored.id === draftId) return;
    setDraft({ ...initialListingDraft, ...restored.listing?.form, title: restored.title, description: restored.description, price: restored.price, quantity: restored.quantity } as ListingDraftForm);
    setCategory(restored.category); setCondition(restored.condition);
    setSaleModes(restored.listing?.saleModes ?? ['fixed']);
    setShippingPayer(restored.listing?.shippingPayer ?? 'buyer');
    setAccessories(restored.listing?.accessories ?? listingAccessories);
    setDraftId(restored.id); setSaved(true);
  }, [restored, draftId]);
  useEffect(() => () => { urls.current.forEach(url => URL.revokeObjectURL(url)); }, []);
  const mockAction = (label: string) => notify.info(`${label} — tính năng minh họa, chưa kết nối Backend.`);
  function updateDraft<K extends keyof ListingDraftForm>(key: K, value: ListingDraftForm[K]) { setSaved(false); setDraft(previous => ({ ...previous, [key]: value })); }
  function toggleSaleMode(id: string) { setSaved(false); setSaleModes(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]); }
  function changeQuantity(delta: number) { updateDraft('quantity', Math.min(99, Math.max(1, draft.quantity + delta))); }
  function removeAccessory(name: string) { setSaved(false); setAccessories(previous => previous.filter(item => item !== name)); }
  function addMedia(files: File[]) {
    if (files.some(file => !file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) || media.length + files.length > 9) { notify.warning('Chọn tối đa 9 ảnh, mỗi ảnh không quá 10 MB.'); return; }
    setMedia(previous => [...previous, ...files.map(file => { const image = URL.createObjectURL(file); urls.current.add(image); return { id: image, label: file.name, image }; })]);
  }
  function removeMedia(id: string) { const item = media.find(value => value.id === id); if (item && urls.current.delete(item.image)) URL.revokeObjectURL(item.image); setMedia(previous => previous.filter(value => value.id !== id)); }
  function saveDraft() {
    if (!Number.isFinite(draft.price) || draft.price < 0 || !Number.isInteger(draft.quantity) || draft.quantity < 1 || draft.quantity > 99) { notify.warning('Giá nháp không được âm, số lượng phải là số nguyên dương.'); return; }
    try {
    const id = demoActions.saveDraft({ title: draft.title, description: draft.description, price: draft.price, quantity: draft.quantity, category, condition, listing: { form: { ...draft }, saleModes, shippingPayer, accessories } }, draftId);
    setDraftId(id); setSaved(true); notify.success('Đã lưu bản nháp. Ảnh tải lên chỉ là bản xem trước tạm thời.');
    } catch { notify.warning('Không thể lưu bản nháp: kiểm tra các trường số và độ dài nội dung.'); }
  }
  function submitListing() {
    const next = validateListing(draft, category, saleModes);
    setErrors(next);
    if (next.length) { notify.warning(next[0]); return; }
    demoActions.publish({title: draft.title.trim(), description: draft.description.trim(), price: saleModes.includes('fixed') ? draft.dealPrice : draft.price, quantity: draft.quantity, category, condition, image: listingMediaSlots[0].image });
    if (draftId) demoActions.removeDraft(draftId);
    notify.success('Đăng bán sản phẩm thành công — đã thêm vào kho demo.');
    navigate('/seller/products', {state: {listingPublished: true}});
  }
  const titleLength = draft.title.length;
  const discountPercent = draft.price > 0 ? Math.round(((draft.price - draft.dealPrice) / draft.price) * 100) : 0;
  const serviceFee = Math.round(draft.dealPrice * 0.03);
  const netEarnings = draft.dealPrice - serviceFee;
  const formatted = useMemo(() => ({ dealPrice: formatVnd(draft.dealPrice), price: formatVnd(draft.price), minOffer: formatVnd(draft.minOffer), serviceFee: formatVnd(serviceFee), netEarnings: formatVnd(netEarnings) }), [draft.dealPrice, draft.price, draft.minOffer, serviceFee, netEarnings]);
  return { draft, updateDraft, category, setCategory, condition, setCondition, saleModes, toggleSaleMode, shippingPayer, setShippingPayer, accessories, removeAccessory, changeQuantity, titleLength, titleMax: TITLE_MAX, titleOverLimit: titleLength > TITLE_MAX, discountPercent, formatted, submitListing, mockAction, saveDraft, saved, errors, media, addMedia, removeMedia };
}
export type CreateListingState = ReturnType<typeof useCreateListing>;
