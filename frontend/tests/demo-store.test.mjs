import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
const product={id:'seed',title:'Demo seed',price:100,image:'/demo.webp',description:'Demo',quantity:4,category:'demo',condition:'used'};
function memory(initial) { const map=new Map(initial);return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k),map}; }
test('versioned demo persistence, validation and safe fallback',async()=>{
 const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
 try {const {createDemoStore,DEMO_STORAGE_KEY,validateDemoState}=await server.ssrLoadModule('/src/shared/demo/demoStore.ts');
 const storage=memory();const store=createDemoStore(storage,[product]);
 assert.equal(store.getSnapshot(),store.getSnapshot());assert.equal(store.getServerSnapshot(),store.getServerSnapshot());
 let notices=0;const unsubscribe=store.subscribe(()=>notices++);store.actions.addToCart('seed',2);assert.equal(notices,1);unsubscribe();
 const loaded=createDemoStore(storage,[product]);assert.deepEqual(loaded.getSnapshot().cart,[{productId:'seed',quantity:2}]);
 assert.equal(validateDemoState({...loaded.getSnapshot(),version:2}),false);
 assert.equal(validateDemoState({...loaded.getSnapshot(),products:[{...product,image:'data:image/png;base64,abc'}]}),false);
 assert.equal(validateDemoState({...loaded.getSnapshot(),cart:[{productId:'missing',quantity:1}]}),false);
 assert.equal(validateDemoState({...loaded.getSnapshot(),cart:[{productId:'seed',quantity:Infinity}]}),false);
 storage.setItem(DEMO_STORAGE_KEY,'{broken');assert.doesNotThrow(()=>createDemoStore(storage,[product]));
 storage.setItem(DEMO_STORAGE_KEY,JSON.stringify({version:5}));assert.equal(createDemoStore(storage,[product]).getSnapshot().cart.length,0);
 const throwing={getItem(){throw new Error('denied')},setItem(){throw new Error('quota')},removeItem(){throw new Error('denied')}};const fallback=createDemoStore(throwing,[product]);assert.equal(fallback.actions.addToCart('seed',1),true);
 const dirty={...loaded.getSnapshot(),secret:'never',products:[{...product,cardNumber:'never'}]};storage.setItem(DEMO_STORAGE_KEY,JSON.stringify(dirty));const clean=createDemoStore(storage,[product]);clean.actions.toggleSaved('seed');assert.doesNotMatch(storage.getItem(DEMO_STORAGE_KEY),/never|cardNumber|secret/);
 clean.actions.reset();assert.equal(clean.getSnapshot().saved.length,0);
 }finally{await server.close();}
});
test('publish -> cart -> DEMO checkout -> packing -> fulfilled survives reload',async()=>{
 const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
 try {const {createDemoStore}=await server.ssrLoadModule('/src/shared/demo/demoStore.ts');const storage=memory();const store=createDemoStore(storage,[]);const {id:_,...draft}=product;const id=store.actions.publish(draft);
 assert.equal(store.actions.addToCart(id,2),true);assert.equal(store.actions.addToCart(id,3),false);assert.equal(store.getSnapshot().cart[0].quantity,2);
 store.actions.toggleSaved(id);const order=store.actions.checkout();assert.match(order,/^DEMO-/);assert.equal(store.getSnapshot().cart.length,0);assert.equal(store.getSnapshot().orders[0].total,200);assert.equal(store.getSnapshot().products[0].quantity,2);assert.equal(store.actions.updateOrderStatus(order,'fulfilled'),false);assert.equal(store.actions.updateOrderStatus(order,'packing'),true);assert.equal(store.actions.updateOrderStatus(order,'fulfilled'),true);
 const loaded=createDemoStore(storage,[]);assert.equal(loaded.getSnapshot().orders[0].status,'fulfilled');assert.equal(loaded.getSnapshot().saved[0],id);assert.throws(()=>loaded.actions.checkout(),/empty/);
 }finally{await server.close();}
});
test('SSR demo routes remain safe and unknown operations are not success',async()=>{
 const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
 try {const {default:AppRoutes}=await server.ssrLoadModule('/src/app/routes/AppRoutes.tsx');for(const path of ['/products','/products/missing-demo-product','/cart','/buyer-hub','/seller-hub','/seller/products','/seller/products/new','/seller/orders/success?orderId=missing']) {const html=renderToStaticMarkup(createElement(MemoryRouter,{initialEntries:[path]},createElement(AppRoutes)));assert.ok(html.length>0,path);assert.doesNotMatch(html,/NaN|undefined/);}}
 finally{await server.close();}
});
