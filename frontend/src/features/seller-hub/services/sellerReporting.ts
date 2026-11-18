import { sellerReportKpis as templates } from './sellerReports.mock';
import type { RevenuePoint, ShopReview, TopSku } from '../types/sellerHub';
// Explicit unavailable-API view data; these placeholders do not claim real revenue.
export const sellerReportKpis=templates.map(k=>({...k,value:'N/A',caption:'Báo cáo chưa được hỗ trợ.'}));
export const sellerRevenueSeries:RevenuePoint[]=Array.from({length:6},(_,i)=>({label:'T'+(i+1),value:0,growth:'N/A'}));export const sellerReviews:ShopReview[]=[];export const sellerTopSkus:TopSku[]=[];
export const shopRating={score:'N/A',total:'Đánh giá chưa được hỗ trợ.',stars:[5,4,3,2,1].map(star=>({star,percent:0}))};
export const sellerReviewKpis={replyRate:'N/A',replyNote:'Chưa có dữ liệu',responseNote:'Thống kê thời gian phản hồi chưa được hỗ trợ.'};

