import ListingBreadcrumb from '../../../features/seller-listing/components/ListingBreadcrumb';
import ListingHeader from '../../../features/seller-listing/components/ListingHeader';
import ListingSection from '../../../features/seller-listing/components/ListingSection';
import ListingBasicInfo from '../../../features/seller-listing/components/ListingBasicInfo';
import ListingMedia from '../../../features/seller-listing/components/ListingMedia';
import ListingCondition from '../../../features/seller-listing/components/ListingCondition';
import ListingPricing from '../../../features/seller-listing/components/ListingPricing';
import ListingShipping from '../../../features/seller-listing/components/ListingShipping';
import ListingActionBar from '../../../features/seller-listing/components/ListingActionBar';
import ListingQualityCard from '../../../features/seller-listing/components/ListingQualityCard';
import ListingPreviewCard from '../../../features/seller-listing/components/ListingPreviewCard';
import ListingEarningsCard from '../../../features/seller-listing/components/ListingEarningsCard';
import ListingAuctionCard from '../../../features/seller-listing/components/ListingAuctionCard';
import { useCreateListing } from '../../../features/seller-listing/hooks/useCreateListing';
import { listingWallet } from '../../../features/seller-listing/mocks/createListing.mock';
import '../../../features/seller-listing/styles/create-listing.css';

export default function CreateListingPage() {
  const hub = useCreateListing();

  return (
    <main className="nx-listing-page">
      <span className="nx-listing-glow is-top" aria-hidden="true" />
      <span className="nx-listing-glow is-left" aria-hidden="true" />
      <div className="nx-container">
        <ListingBreadcrumb />
        <ListingHeader hub={hub} />
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
              title="Hình ảnh & Video kiểm định (5/9)"
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
              title="Phương thức bán & Định giá niêm yết"
              caption="Linh hoạt kết hợp bán giá cố định, nhận trả giá hoặc chuyển đấu giá"
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
            <ListingQualityCard score={listingWallet.score} label={listingWallet.scoreLabel} />
            <ListingPreviewCard hub={hub} />
            <ListingEarningsCard hub={hub} />
            <ListingAuctionCard hub={hub} />
          </aside>
        </div>
      </div>
    </main>
  );
}
