import { useState, useEffect, useCallback } from 'react';
import { adminAuctionApi } from '../services/admin.service';
import type {
  AdminAuction,
} from '../types/admin.types';


export function useAdminAuctions() {
  const [auctions, setAuctions] = useState<AdminAuction[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAuction, setSelectedAuction] = useState<AdminAuction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUsingRealApi, setIsUsingRealApi] = useState(false);

  const loadAuctions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAuctionApi.list({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });
      if (res && Array.isArray(res.content)) {
        setAuctions(res.content);
        setIsUsingRealApi(true);
      } else {
        setAuctions([]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Không thể tải dữ liệu.');
      setIsUsingRealApi(false);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadAuctions();
  }, [loadAuctions]);

  const handleCancelAuction = async (id: string, title?: string) => {
    if (confirm(`Bạn có chắc chắn muốn hủy phiên đấu giá "${title || id}" theo quyền Admin (FR-37)?`)) {
      try {
        await adminAuctionApi.cancel(id);
        alert('Đã hủy phiên đấu giá thành công qua REST API!');
        setSelectedAuction(null);
        loadAuctions();
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Lỗi từ Backend';
        alert(`Không thể hủy phiên đấu giá:\n${errorMsg}`);
      }
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const filteredAuctions = auctions.filter((a) =>
    statusFilter === 'ALL' ? true : a.status === statusFilter,
  );

  return { auctions, setAuctions, statusFilter, setStatusFilter, selectedAuction, setSelectedAuction, error, setError, loading, setLoading, isUsingRealApi, setIsUsingRealApi, loadAuctions, handleCancelAuction, formatCurrency, filteredAuctions };
}
