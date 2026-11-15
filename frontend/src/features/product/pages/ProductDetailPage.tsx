import RichTextContent from '../../../shared/components/RichText/RichTextContent';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getCatalogProduct, getReviews, getAuction, getBids, placeBid, type CatalogProductDetail, type Auction, type Review, type Bid } from '../../../services/api/catalog';
import { apiErrorMessage, type PageResponse } from '../../../services/api/client';
import { notify } from '../../../shared/components/Toast';
import { formatPrice } from '../services/productService';
import { CatalogImage } from '../components/CatalogProductCard';
import AddToCartButton from '../components/AddToCartButton';
import ProductAssurance from '../components/ProductAssurance';
import QuantityStepper from '../../../shared/components/QuantityStepper/QuantityStepper';
import useAddToCartAnimation from '../hooks/useAddToCartAnimation';
import HeartBurstButton from '../../../shared/components/Button/HeartBurstButton';
import '../styles/product-detail-animation.css';
function ProductDetailPage() {
 const { productId } = useParams(); const [params] = useSearchParams(); const auctionId = params.get('auctionId');
 const [product, setProduct] = useState<CatalogProductDetail | null>(null);
 const [auction, setAuction] = useState<Auction | null>(null);
 const [error, setError] = useState(''); const [loading, setLoading] = useState(true); const [retry, setRetry] = useState(0);
 useEffect(() => { const controller = new AbortController(); setLoading(true); setProduct(null); setAuction(null); setError('');
  if (!productId) { setError('Không tìm thấy sản phẩm.'); setLoading(false); return; }
  Promise.all([getCatalogProduct(productId, controller.signal), auctionId ? getAuction(auctionId, controller.signal) : Promise.resolve(null)]).then(([item, sale]) => {
   if (sale && sale.productId !== item.id) throw new Error('Phiên đấu giá không thuộc sản phẩm này.'); setProduct(item); setAuction(sale);
  }).catch(error => { if (!controller.signal.aborted) { setError(apiErrorMessage(error)); notify.error(apiErrorMessage(error)); } }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
  return () => controller.abort();
 }, [productId, auctionId, retry]);
 if (loading) return <main className="nx-container nx-empty" role="status">Đang tải sản phẩm…</main>;
 if (error || !product) return <main className="nx-container nx-empty" role="alert"><h1>Không thể tải sản phẩm</h1><p>{error}</p><button className="nx-button nx-button-soft" onClick={() => setRetry(value => value + 1)}>Thử lại</button><Link to="/categories/all">Khám phá sản phẩm →</Link></main>;
 return <ProductDetail key={product.id + (auction?.id || '')} product={product} initialAuction={auction} />;
}
export function ProductDetail({ product, initialAuction = null }: { product: CatalogProductDetail; initialAuction?: Auction | null }) {
 const navigate = useNavigate(); const [auction, setAuction] = useState(initialAuction);
 const [quantity, setQuantity] = useState(1); const [image, setImage] = useState(0); const [bid, setBid] = useState(initialAuction?.currentPrice ?? product.basePrice);
 const bidLock = useRef(false);
 const [pending, setPending] = useState(false); const [notice, setNotice] = useState('');
 const { added, stageRef, imageRef, cartRef, badgeRef, addToCart } = useAddToCartAnimation(() => setNotice('Đã thêm sản phẩm vào giỏ hàng.'));
 const [reviewPage, setReviewPage] = useState(0); const [reviews, setReviews] = useState<PageResponse<Review> | null>(null); const [reviewError, setReviewError] = useState('');
 const [bidPage, setBidPage] = useState(0); const [bids, setBids] = useState<PageResponse<Bid> | null>(null); const [bidError, setBidError] = useState(''); const [refresh, setRefresh] = useState(0);
 const [clock, setClock] = useState(() => Date.now());
 const unsupported = (feature: string) => notify.error(feature + ' chưa được máy chủ hỗ trợ.');
 const images = product.images.length ? product.images : product.primaryImageUrl ? [product.primaryImageUrl] : [];
 useEffect(() => { const timer = window.setInterval(() => setClock(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
 useEffect(() => { const controller = new AbortController(); setReviewError(''); setReviews(null);
  getReviews(product.id, reviewPage, controller.signal).then(setReviews).catch(error => { if (!controller.signal.aborted) { setReviewError(apiErrorMessage(error)); notify.error(apiErrorMessage(error)); } }); return () => controller.abort();
 }, [product.id, reviewPage]);
 useEffect(() => { if (!initialAuction) return; const controller = new AbortController(); setBidError(''); setBids(null);
  getBids(initialAuction.id, bidPage, controller.signal).then(setBids).catch(error => { if (!controller.signal.aborted) { setBidError(apiErrorMessage(error)); notify.error(apiErrorMessage(error)); } }); return () => controller.abort();
 }, [initialAuction, bidPage, refresh]);
 async function submitBid() {
  if (!auction || bidLock.current) return;
  if (!Number.isFinite(bid) || bid <= auction.currentPrice) { notify.error('Giá đặt phải lớn hơn giá hiện tại.'); return; }
  bidLock.current = true; setPending(true);
  try {
   await placeBid(auction.id, bid);
   setNotice('Giá thầu đã được máy chủ ghi nhận.'); notify.success('Đặt giá thành công.');
   setBidPage(0); setRefresh(value => value + 1);
   try { const updated = await getAuction(auction.id); setAuction(updated); setBid(updated.currentPrice); }
   catch { const message = 'Giá thầu đã được ghi nhận nhưng tải lại phiên đấu giá thất bại. Vui lòng tải lại trang trước khi đặt tiếp.'; setNotice(message); notify.warning(message); }
  } catch (error) { setNotice(apiErrorMessage(error)); notify.error(apiErrorMessage(error)); }
  finally { bidLock.current = false; setPending(false); }
 }
 async function share() { try { await navigator.clipboard.writeText(window.location.href); notify.success('Đã sao chép liên kết sản phẩm.'); } catch { notify.error('Không thể sao chép liên kết.'); } }
 const remaining = auction ? Math.max(0, new Date(auction.endTime).getTime() - clock) : 0;
 const active = auction?.status === 'ACTIVE' && clock >= new Date(auction.startTime).getTime() && remaining > 0;
 return <main ref={stageRef} className="nx-container nx-detail-page u051-detail">
  <div className="nx-detail-actions">{!auction && <button ref={cartRef} type="button" className="u051-detail-cart" onClick={() => navigate('/cart')}>🛒 Giỏ hàng <b ref={badgeRef}>{added ? '✓' : '→'}</b></button>}
   <HeartBurstButton pressed={false} onToggle={() => unsupported('Watchlist')} label="Lưu vào Watchlist" text="Lưu vào Watchlist" /><button onClick={share}>↗ Chia sẻ</button></div>
  <div className="nx-detail-grid"><section className="nx-gallery"><div className="nx-gallery-main"><div className="nx-gallery-badges"><b>{auction ? auction.status : product.status}</b><span>Ảnh sản phẩm</span></div>
   <div ref={imageRef}><CatalogImage url={images[image] ?? null} name={product.name} /></div><div className="nx-authenticated"><strong>Thông tin từ người bán</strong><small>Máy chủ chưa cung cấp kết quả kiểm định.</small></div></div>
   <div className="nx-thumbnails">{images.map((url, index) => <button key={url + index} className={image === index ? 'is-active' : ''} onClick={() => setImage(index)} aria-label={'Xem ảnh ' + (index + 1)} aria-pressed={image === index}><CatalogImage url={url} name={product.name} /></button>)}</div>
   <div className="nx-panel nx-condition"><h3>THÔNG TIN KIỂM ĐỊNH</h3><div>Thân vỏ: Chưa có dữ liệu <span>Vòng xoay: Chưa có dữ liệu</span></div><div>Lá khẩu: Chưa có dữ liệu <span>Ngoại hình: Chưa có dữ liệu</span></div></div></section>
   <section className="nx-panel nx-purchase"><span className="nx-eyebrow">Mã sản phẩm: {product.id}</span><h1>{product.name}</h1><RichTextContent className="nx-muted" value={product.description} fallback="Người bán chưa cung cấp mô tả." />
    <div className="nx-seller"><span className="nx-avatar">ID</span><div><b>Người bán</b><small>{product.sellerId}</small><small>Chưa có dữ liệu hồ sơ hoặc xếp hạng người bán.</small></div><button onClick={() => unsupported('Nhắn tin')}>✉ Nhắn tin</button></div>
    <div className="nx-bid-warning">⚠ Thông tin tồn kho, phí vận chuyển và kiểm định chưa có trong dữ liệu catalog. Kiểm tra đơn hàng trước khi xác nhận.</div>
    {auction && <div className="nx-auction-clock"><strong>{active ? '● PHIÊN ĐẤU ĐANG DIỄN RA' : auction.status}</strong><span>{auction.acceptedBidCount ?? '—'} lượt đấu được chấp nhận</span><p>THỜI GIAN CÒN LẠI</p><b>{Math.floor(remaining / 3600000)} <small>giờ</small> : {Math.floor(remaining / 60000) % 60} <small>phút</small> : {Math.floor(remaining / 1000) % 60} <small>giây</small></b></div>}
    <div className="nx-detail-price"><div><small>{auction ? 'Giá khởi điểm:' : 'Giá gốc:'}</small><b>{auction ? formatPrice(auction.startingPrice) : '—'}</b></div><div><small>{auction ? 'Giá cao nhất hiện tại:' : 'Giá mua ngay:'}</small><strong>{formatPrice(auction?.currentPrice ?? product.basePrice)}</strong><small>Chưa bao gồm phí vận chuyển</small></div></div>
    {auction ? <><label className="nx-bid-label" htmlFor="bid-price">Giá thầu của bạn</label><input className="nx-bid-input" id="bid-price" type="number" min={auction.currentPrice} value={bid} onChange={event => setBid(Number(event.target.value))} /><div className="nx-bid-increments">{[10000, 50000, 100000].map(value => <button key={value} onClick={() => setBid(Math.max(bid, auction.currentPrice) + value)}>+{formatPrice(value)}</button>)}</div></> : <div className="nx-bid-label nx-purchase-quantity"><span>Số lượng</span><QuantityStepper value={quantity} label={product.name} onChange={setQuantity} /></div>}
    {auction ? <button className="nx-button nx-button-primary nx-purchase-button" disabled={pending || !active} onClick={submitBid}>{pending ? 'Đang gửi…' : 'Đặt giá thầu'}</button> : <AddToCartButton product={product} quantity={quantity} onAdded={addToCart} className="nx-button nx-button-primary nx-purchase-button" />}
    {notice && <p className="nx-notice" role="status">{notice}</p>}
    {auction && <details className="nx-history"><summary>Lịch sử đặt giá</summary>{bidError ? <p role="alert">{bidError}</p> : !bids ? <p role="status">Đang tải…</p> : <>{bids.content.length ? bids.content.map(item => <p key={item.id}>{item.bidderId}: <b>{formatPrice(item.amount)}</b> · {new Date(item.placedAt).toLocaleString('vi-VN')}</p>) : <p>Chưa có giá thầu.</p>}<button disabled={bidPage === 0} onClick={() => setBidPage(value => value - 1)}>Trước</button><button disabled={bidPage + 1 >= bids.totalPages} onClick={() => setBidPage(value => value + 1)}>Tiếp</button></>}</details>}
   </section><ProductAssurance /></div>
  <div className="nx-detail-bottom"><div><section className="nx-panel nx-description"><h2>Mô tả sản phẩm</h2><RichTextContent className="nx-description-content" value={product.description} fallback="Chưa có mô tả." /><div className="nx-description-highlights"><div><h3>Danh mục</h3><p>{product.categoryName || 'Chưa có dữ liệu'}</p></div><div><h3>Phụ kiện và bảo hành</h3><p>Chưa có dữ liệu từ máy chủ.</p></div></div></section>
   <section className="nx-panel nx-specs"><h2>Thông tin sản phẩm</h2><table><tbody>{[['Danh mục', product.categoryName || '—'], ['Trạng thái', product.status], ['Ngày tạo', new Date(product.createdAt).toLocaleString('vi-VN')], ['Cập nhật', new Date(product.updatedAt).toLocaleString('vi-VN')]].map(([key,value]) => <tr key={key}><th>{key}</th><td>{value}</td></tr>)}</tbody></table></section></div>
   <aside className="nx-panel nx-reviews"><div className="nx-section-heading"><h2>Đánh giá từ người mua</h2><strong>— <small>Chưa có tổng hợp</small></strong></div><p className="nx-muted">Máy chủ chưa cung cấp điểm trung bình hoặc phân bố đánh giá.</p>{[5, 4, 3].map(score => <div className="nx-rating-bar" key={score}><span>{score} sao</span><div><span style={{ width: '0%' }} /></div><span>—</span></div>)}{reviewError ? <p role="alert">{reviewError}</p> : !reviews ? <p role="status">Đang tải đánh giá…</p> : <><p className="nx-muted">{reviews.totalElements} đánh giá</p>{reviews.content.length ? reviews.content.map(item => <article className="nx-review" key={item.id}><b>{item.buyerId}</b><small>{new Date(item.createdAt).toLocaleString('vi-VN')}</small><div className="nx-stars">{item.score}/5 ★</div><p>{item.comment || 'Không có nhận xét.'}</p></article>) : <p>Chưa có đánh giá.</p>}<button className="nx-button nx-button-soft" disabled={reviewPage === 0} onClick={() => setReviewPage(value => value - 1)}>Trước</button><button className="nx-button nx-button-soft" disabled={reviewPage + 1 >= reviews.totalPages} onClick={() => setReviewPage(value => value + 1)}>Tiếp</button></>}</aside></div>
 </main>;
}
export default ProductDetailPage;
