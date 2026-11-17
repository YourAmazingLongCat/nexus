import { useState, useEffect, useCallback } from 'react';
import { adminFulfillmentApi } from '../services/admin.service';
import type {
  AdminInventoryItem,
  AdminWarehouse,
} from '../types/admin.types';


export function useAdminFulfillment() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'warehouses'>('inventory');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUsingRealApi, setIsUsingRealApi] = useState(false);

  // Inventory State (1 task)
  const [inventory, setInventory] = useState<AdminInventoryItem[]>([]);
  const [warehouseFilter, setWarehouseFilter] = useState('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState('ALL');

  // Warehouse State (4 tasks)
  const [warehouses, setWarehouses] = useState<AdminWarehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<AdminWarehouse | null>(null);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [warehouseForm, setWarehouseForm] = useState({
    name: '',
    code: '',
    address: '',
  });

  // FETCH DATA
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'inventory') {
        const warehousePage = await adminFulfillmentApi.listWarehouses({ size: 100 });
        setWarehouses(warehousePage.content);
        const res = await adminFulfillmentApi.listInventories({
          warehouseId: warehouseFilter === 'ALL' ? undefined : warehouseFilter,
          status: stockStatusFilter === 'ALL' ? undefined : stockStatusFilter,
        });
        if (res && Array.isArray(res.content)) {
          setInventory(res.content);
          setIsUsingRealApi(true);
        } else {
          setInventory([]);
        }
      } else if (activeTab === 'warehouses') {
        const res = await adminFulfillmentApi.listWarehouses();
        if (res && Array.isArray(res.content)) {
          setWarehouses(res.content);
          setIsUsingRealApi(true);
        } else {
          setWarehouses([]);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Không thể tải dữ liệu.');
      setIsUsingRealApi(false);
      if (activeTab === 'inventory') setInventory([]);
      else if (activeTab === 'warehouses') setWarehouses([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, warehouseFilter, stockStatusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // WAREHOUSE HANDLERS
  const handleOpenCreateWarehouse = () => {
    setSelectedWarehouse(null);
    setWarehouseForm({
      name: '',
      code: '',
      address: '',
    });
    setShowWarehouseModal(true);
  };

  const handleOpenEditWarehouse = async (wh: AdminWarehouse) => {
    setSelectedWarehouse(wh);
    setWarehouseForm({
      name: wh.name,
      code: wh.code,
      address: wh.address || '',
    });
    setShowWarehouseModal(true);
    try {
      const freshWh = await adminFulfillmentApi.getWarehouse(wh.id);
      if (freshWh) {
        setSelectedWarehouse(freshWh);
        setWarehouseForm({
          name: freshWh.name,
          code: freshWh.code,
          address: freshWh.address || '',
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Không thể tải chi tiết.');
    }
  };

  const handleSaveWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseForm.name.trim() || !warehouseForm.address.trim()) return;

    try {
      if (selectedWarehouse) {
        await adminFulfillmentApi.updateWarehouse(selectedWarehouse.id, {
          name: warehouseForm.name.trim(),
          address: warehouseForm.address.trim(),
          status: (selectedWarehouse.status || 'ACTIVE') as any,
        });
        alert('Đã cập nhật thông tin kho hàng qua REST API!');
      } else {
        if (!warehouseForm.code.trim()) return;
        await adminFulfillmentApi.createWarehouse({
          name: warehouseForm.name.trim(),
          code: warehouseForm.code.trim().toUpperCase(),
          address: warehouseForm.address.trim(),
        });
        alert('Đã tạo mới kho hàng trong hệ thống qua REST API!');
      }
      setShowWarehouseModal(false);
      loadData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi từ Backend';
      alert(`Không thể lưu kho hàng:\n${errorMsg}`);
    }
  };

  const handleToggleWarehouseStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const wh = warehouses.find((w) => w.id === id);
      if (!wh) throw new Error('Warehouse is not loaded. Reload before changing its status.');
      await adminFulfillmentApi.updateWarehouse(id, {
        name: wh.name,
        address: wh.address,
        status: nextStatus as any,
      });
      alert(`Đã đổi trạng thái kho hàng sang ${nextStatus} qua REST API!`);
      loadData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi từ Backend';
      alert(`Không thể đổi trạng thái kho hàng:\n${errorMsg}`);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchWh = warehouseFilter === 'ALL' || item.warehouseId === warehouseFilter;
    const matchStatus = stockStatusFilter === 'ALL' || item.status === stockStatusFilter;
    return matchWh && matchStatus;
  });

  return { activeTab, setActiveTab, error, setError, loading, setLoading, isUsingRealApi, setIsUsingRealApi, inventory, setInventory, warehouseFilter, setWarehouseFilter, stockStatusFilter, setStockStatusFilter, warehouses, setWarehouses, selectedWarehouse, setSelectedWarehouse, showWarehouseModal, setShowWarehouseModal, warehouseForm, setWarehouseForm, loadData, handleOpenCreateWarehouse, handleOpenEditWarehouse, handleSaveWarehouse, handleToggleWarehouseStatus, filteredInventory };
}
