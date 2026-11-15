import { useSyncExternalStore } from 'react';
import { products as fixtures } from '../../features/product/services/productService';

export interface DemoProduct { id: string; title: string; price: number; image: string; description: string; quantity: number; category: string; condition: string }
export interface DemoDraft extends Omit<DemoProduct, 'image'> { saleModes?: string[]; shippingPayer?: 'buyer' | 'seller'; accessories?: string[]; listing?: {form: Record<string,string|number>;saleModes:string[];shippingPayer:'buyer'|'seller';accessories:string[]} }
export interface DemoOrder { id: string; items: {productId: string; title: string; price: number; image: string; quantity: number}[]; total: number; status: 'placed' | 'packing' | 'fulfilled'; createdAt: string }
export interface DemoState { version: 1; products: DemoProduct[]; cart: {productId: string; quantity: number}[]; saved: string[]; drafts: DemoDraft[]; orders: DemoOrder[] }
export const DEMO_STORAGE_KEY = 'nexus.demo.v1';
type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const positive = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;
const quantity = (n: unknown): n is number => positive(n) && Number.isInteger(n) && n <= 999;
const text = (v: unknown): v is string => typeof v === 'string' && v.length <= 10000;
const image = (v: unknown): v is string => text(v) && (v === '' || /^(\/|https?:\/\/)/.test(v)) && !v.startsWith('//');
const product = (v: any) => v && text(v.id) && !!v.id && text(v.title) && !!v.title.trim() && positive(v.price) && Number.isInteger(v.quantity) && v.quantity >= 0 && v.quantity <= 999 && image(v.image) && text(v.description) && text(v.category) && text(v.condition);
export function validateDemoState(v: any): v is DemoState {
  if (!v || v.version !== 1 || !['products', 'cart', 'saved', 'drafts', 'orders'].every(k => Array.isArray(v[k]) && v[k].length <= 1000)) return false;
  if (!v.products.every(product) || new Set(v.products.map((p: DemoProduct) => p.id)).size !== v.products.length) return false;
  const ids = new Set(v.products.map((p: DemoProduct) => p.id));
  return v.cart.every((c: any) => c && ids.has(c.productId) && quantity(c.quantity) && c.quantity <= v.products.find((p: DemoProduct) => p.id === c.productId).quantity)
    && new Set(v.cart.map((c: any) => c.productId)).size === v.cart.length
    && v.saved.every((id: unknown) => typeof id === 'string' && ids.has(id)) && new Set(v.saved).size === v.saved.length
    && v.drafts.every((d: any) => d && text(d.id) && text(d.title) && typeof d.price === 'number' && Number.isFinite(d.price) && d.price >= 0 && quantity(d.quantity) && text(d.description) && text(d.category) && text(d.condition) && (d.saleModes === undefined || (Array.isArray(d.saleModes) && d.saleModes.every(text))) && (d.accessories === undefined || (Array.isArray(d.accessories) && d.accessories.every(text))) && (d.listing === undefined || (d.listing && typeof d.listing.form === 'object' && d.listing.form !== null && Object.values(d.listing.form).every((v: unknown)=>text(v) || (typeof v === 'number' && Number.isFinite(v))) && Array.isArray(d.listing.saleModes) && d.listing.saleModes.every(text) && Array.isArray(d.listing.accessories) && d.listing.accessories.every(text) && ['buyer','seller'].includes(d.listing.shippingPayer))))
    && v.orders.every((o: any) => o && text(o.id) && ['placed','packing','fulfilled'].includes(o.status) && positive(o.total) && text(o.createdAt) && Number.isFinite(Date.parse(o.createdAt)) && Array.isArray(o.items) && o.items.length > 0 && o.items.length <= 1000 && o.items.every((i: any) => i && text(i.productId) && text(i.title) && positive(i.price) && quantity(i.quantity) && image(i.image)));
}
// Explicit allowlist: never retain extra persisted fields, payment data or media blobs.
const cleanProduct = (p: DemoProduct): DemoProduct => ({id:p.id,title:p.title,price:p.price,image:p.image,description:p.description,quantity:p.quantity,category:p.category,condition:p.condition});
const cleanState = (s: DemoState): DemoState => ({version:1,products:s.products.map(cleanProduct),cart:s.cart.map(c=>({productId:c.productId,quantity:c.quantity})),saved:[...s.saved],drafts:s.drafts.map(d=>({id:d.id,title:d.title,price:d.price,description:d.description,quantity:d.quantity,category:d.category,condition:d.condition,saleModes:d.saleModes?.filter(m=>typeof m==='string'),shippingPayer:d.shippingPayer === 'seller' ? 'seller' : 'buyer',accessories:d.accessories?.filter(a=>typeof a==='string'),listing:d.listing ? {form:Object.fromEntries(Object.entries(d.listing.form).filter(([key])=>['brand','sku','shutter','warranty','origin','title','description','category','price','dealPrice','minOffer','quantity','weight','length','width','height'].includes(key))),saleModes:[...d.listing.saleModes],shippingPayer:d.listing.shippingPayer,accessories:[...d.listing.accessories]} : undefined})),orders:s.orders.map(o=>({id:o.id,total:o.total,status:o.status,createdAt:o.createdAt,items:o.items.map(i=>({productId:i.productId,title:i.title,price:i.price,image:i.image,quantity:i.quantity}))}))});
const seeded: DemoProduct[] = fixtures.map(p => ({id:p.id,title:p.name,price:p.price,image:p.image,description:'DEMO fixture — not a real auction or transaction.',quantity:10,category:p.categoryId,condition:p.condition}));
export function createDemoStore(storage?: StorageLike, initialProducts: DemoProduct[] = seeded) {
  const initial: DemoState = {version:1,products:initialProducts.map(cleanProduct),cart:[],saved:[],drafts:[],orders:[]};
  let state = initial;
  let persistent = storage;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach(fn => fn());
  const persist = () => { try { persistent?.setItem(DEMO_STORAGE_KEY, JSON.stringify(state)); } catch { persistent = undefined; } };
  const hydrate = (nextStorage?: StorageLike) => {
    persistent = nextStorage;
    try { const raw = persistent?.getItem(DEMO_STORAGE_KEY); if(!raw) state=initial; if(raw) { const next = JSON.parse(raw); if(validateDemoState(next)) state = cleanState(next); else { persistent?.removeItem(DEMO_STORAGE_KEY); state=initial; } } } catch { persistent=undefined; }
    emit();
  };
  if(storage) hydrate(storage);
  const commit = (next: DemoState) => { state=cleanState(next); persist(); emit(); };
  const id = (prefix: string) => `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
  const actions = {
    reset() { commit({...initial,products:initial.products.map(cleanProduct),cart:[],saved:[],drafts:[],orders:[]}); },
    addToCart(productId: string, amount=1) { const p=state.products.find(p=>p.id===productId); if(!p || !quantity(amount)) return false; const old=state.cart.find(c=>c.productId===productId); const count=(old?.quantity??0)+amount; if(count>p.quantity) return false; commit({...state,cart:[...state.cart.filter(c=>c.productId!==productId),{productId,quantity:count}]}); return true; },
    setQuantity(productId:string,count:number) { const p=state.products.find(p=>p.id===productId); if(!p || !quantity(count) || count>p.quantity) return; commit({...state,cart:state.cart.map(c=>c.productId===productId?{...c,quantity:count}:c)}); },
    removeFromCart(productId:string) { commit({...state,cart:state.cart.filter(c=>c.productId!==productId)}); },
    toggleSaved(productId:string) { if(!state.products.some(p=>p.id===productId))return; commit({...state,saved:state.saved.includes(productId)?state.saved.filter(i=>i!==productId):[...state.saved,productId]}); },
    saveDraft(draft: Omit<DemoDraft,'id'>, draftId?:string) { const next={...draft,id:draftId??id('draft')}; if(!validateDemoState({...state,drafts:[next]})) throw new Error('Invalid demo draft'); commit({...state,drafts:[...state.drafts.filter(d=>d.id!==next.id),next]}); return next.id; },
    removeDraft(draftId:string) { commit({...state,drafts:state.drafts.filter(d=>d.id!==draftId)}); },
    publish(draft: Omit<DemoProduct,'id'>) { const next=cleanProduct({...draft,id:id('demo')}); if(!product(next) || !quantity(next.quantity)) throw new Error('Invalid demo product'); commit({...state,products:[...state.products,next]}); return next.id; },
    checkout(total?:number) { if(!state.cart.length) throw new Error('Cart is empty'); const items=state.cart.map(c=>{const p=state.products.find(p=>p.id===c.productId);if(!p || c.quantity>p.quantity) throw new Error('Demo stock unavailable');return {productId:p.id,title:p.title,price:p.price,image:p.image,quantity:c.quantity};}); const subtotal=items.reduce((s,i)=>s+i.price*i.quantity,0); if(total!==undefined && (!positive(total))) throw new Error('Invalid total'); const order:DemoOrder={id:id('DEMO'),items,total:total??subtotal,status:'placed',createdAt:new Date().toISOString()}; commit({...state,products:state.products.map(p=>({...p,quantity:p.quantity-(state.cart.find(c=>c.productId===p.id)?.quantity??0)})),cart:[],orders:[order,...state.orders]}); return order.id; },
    updateOrderStatus(orderId:string,status:DemoOrder['status']) { const order=state.orders.find(o=>o.id===orderId); if(!order || !((order.status==='placed' && status==='packing') || (order.status==='packing' && status==='fulfilled'))) return false; commit({...state,orders:state.orders.map(o=>o.id===orderId?{...o,status}:o)}); return true; },
  };
  return {getSnapshot:()=>state,getServerSnapshot:()=>initial,subscribe:(fn:()=>void)=>{listeners.add(fn);return()=>{listeners.delete(fn);};},hydrate,actions};
}
const store = createDemoStore();
let initialized=false;
function subscribe(fn:()=>void) {
  const unsubscribe=store.subscribe(fn);
  if(!initialized && typeof window!=='undefined') { initialized=true; try {store.hydrate(window.localStorage);}catch{store.hydrate();} window.addEventListener('storage',event=>{if(event.key===DEMO_STORAGE_KEY || event.key===null){try{store.hydrate(window.localStorage);}catch{store.hydrate();}}}); }
  return unsubscribe;
}
export const demoActions = store.actions;
export function useDemoStore() { return useSyncExternalStore(subscribe,store.getSnapshot,store.getServerSnapshot); }
