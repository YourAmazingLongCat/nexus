import ListingHeader from '../components/ListingHeader';
import ListingSection from '../components/ListingSection';
import ListingBasicInfo from '../components/ListingBasicInfo';
import ListingMedia from '../components/ListingMedia';
import ListingCondition from '../components/ListingCondition';
import ListingPricing from '../components/ListingPricing';
import ListingShipping from '../components/ListingShipping';
import ListingActionBar from '../components/ListingActionBar';
import ListingQualityCard from '../components/ListingQualityCard';
import ListingPreviewCard from '../components/ListingPreviewCard';
import ListingEarningsCard from '../components/ListingEarningsCard';
import ListingAuctionCard from '../components/ListingAuctionCard';
import { useCreateListing } from '../hooks/useCreateListing';

import '../styles/create-listing.css';

export default function CreateListingPage() {
  const hub = useCreateListing();

  return (
    <main className="nx-listing-page">
      <span className="nx-listing-glow is-top" aria-hidden="true" />
      <span className="nx-listing-glow is-left" aria-hidden="true" />
      <div className="nx-container"><p role="note">Lưu thông tin tình trạng, thương hiệu, vận chuyển, bảo hành và cấu hình trả giá chưa được hỗ trợ.</p>
        <ListingHeader hub={hub} />
        {hub.errors.length > 0 && <div role="alert" className="nx-listing-guide"><ul>{hub.errors.map(error => <li key={error}>{error}</li>)}</ul></div>}
        <div className="nx-listing-layout">
          <div className="nx-listing-main">
            <ListingSection
              step={1}
              title="Thông tin cơ bản & Phân loại"
              caption="Tối ưu từ khóa giúp người mua tìm kiếm nhanh hơn"
              aside={<span className="nx-listing-tag is-neutral">Bắt buộc</span>}
            >
              <ListingBasicInfo hub={hub} />
            </ListingSection>

            <ListingSection
              step={2}
              title={`Hình ảnh xem trước (${hub.media.length}/9)`}
              caption="Chụp ảnh thật, góc sáng tốt, rõ nét số Seri để được cấp huy hiệu Tín Nhiệm"
              aside={(
                <span className="nx-listing-tag is-primary nx-listing-tag--pill">
                  <i className="bi bi-patch-check-fill" aria-hidden="true" />
                  Nexus Fast-Track Inspector
                </span>
              )}
            >
              <ListingMedia hub={hub} />
            </ListingSection>

            <ListingSection
              step={3}
              title="Tình trạng thực tế & Thông số"
              caption="Cam kết trung thực về ngoại hình để bảo vệ quyền lợi người bán"
            >
              <ListingCondition hub={hub} />
            </ListingSection>

            <ListingSection
              step={4}
              title="Giá bán & Số lượng tồn kho"
              caption="Nhập giá bán cố định để lưu sản phẩm và SKU"
            >
              <ListingPricing hub={hub} />
            </ListingSection>

            <ListingSection
              step={5}
              title="Vận chuyển, Kho gửi & Bảo đảm Escrow"
              caption="Bảo hiểm 100% giá trị khai báo, bưu tá nhận hàng tận nơi"
            >
              <ListingShipping hub={hub} />
            </ListingSection>

            <ListingActionBar hub={hub} />
          </div>

          <aside className="nx-listing-aside">
            <ListingQualityCard score={0} label="Đánh giá chưa được hỗ trợ." />
            <ListingPreviewCard hub={hub} />
            <ListingEarningsCard hub={hub} />
            <ListingAuctionCard hub={hub} />
          </aside>
        </div>
      </div>
    </main>
  );
}
