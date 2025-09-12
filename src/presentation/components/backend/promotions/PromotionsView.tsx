'use client';

import { PromotionDTO } from '@/src/application/dtos/backend/promotions-dto';
import { PromotionsViewModel } from '@/src/presentation/presenters/backend/promotions/PromotionsPresenter';
import { usePromotionsPresenter } from '@/src/presentation/presenters/backend/promotions/usePromotionsPresenter';
import { useState } from 'react';

interface PromotionsViewProps {
  viewModel: PromotionsViewModel;
}

export function PromotionsView({ viewModel }: PromotionsViewProps) {
  const [state, actions] = usePromotionsPresenter();
  const { promotionsData } = viewModel;
  const { promotions, stats } = promotionsData;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionDTO | null>(null);

  const getStatusColor = (status: 'active' | 'inactive' | 'expired' | 'scheduled') => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: 'active' | 'inactive' | 'expired' | 'scheduled') => {
    switch (status) {
      case 'active':
        return 'ใช้งานอยู่';
      case 'scheduled':
        return 'กำหนดการ';
      case 'inactive':
        return 'ปิดใช้งาน';
      case 'expired':
        return 'หมดอายุ';
      default:
        return 'ไม่ทราบสถานะ';
    }
  };

  const getTypeText = (type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_item') => {
    switch (type) {
      case 'percentage':
        return 'ลดเปอร์เซ็นต์';
      case 'fixed_amount':
        return 'ลดจำนวนเงิน';
      case 'buy_x_get_y':
        return 'ซื้อ X แถม Y';
      case 'free_item':
        return 'ของแถม';
      default:
        return 'ไม่ทราบประเภท';
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatValue = (type: string, value: number) => {
    switch (type) {
      case 'percentage':
        return `${value}%`;
      case 'fixed_amount':
        return formatCurrency(value);
      case 'buy_x_get_y':
        return `แถม ${value} ชิ้น`;
      case 'free_item':
        return `${value} ชิ้น`;
      default:
        return value.toString();
    }
  };

  const handleEditPromotion = (promotion: PromotionDTO) => {
    setSelectedPromotion(promotion);
    setShowEditModal(true);
  };

  const handleDeletePromotion = async (promotionId: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบโปรโมชั่นนี้?')) {
      const success = await actions.deletePromotion(promotionId);
      if (success) {
        window.location.reload();
      }
    }
  };

  const handleToggleStatus = async (promotionId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const success = await actions.updatePromotion({
      id: promotionId,
      status: newStatus as 'active' | 'inactive'
    });
    if (success) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold backend-text">จัดการโปรโมชั่น</h1>
          <p className="backend-text-muted mt-2">ติดตามและจัดการโปรโมชั่นของร้านค้า</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            ส่งออกรายงาน
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            เพิ่มโปรโมชั่น
          </button>
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* Statistics Cards */}
      {stats.totalPromotions === 0 ? (
        <div className="backend-sidebar-bg rounded-lg p-12 backend-sidebar-border border text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium backend-text mb-2">ยังไม่มีข้อมูลสถิติโปรโมชั่น</h3>
          <p className="backend-text-muted">ข้อมูลสถิติโปรโมชั่นจะแสดงเมื่อมีการสร้างโปรโมชั่น</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
            <h3 className="backend-text-muted text-sm font-medium">โปรโมชั่นทั้งหมด</h3>
            <p className="text-2xl font-bold backend-text mt-2">{stats.totalPromotions}</p>
          </div>

          <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
            <h3 className="backend-text-muted text-sm font-medium">ใช้งานอยู่</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">{stats.activePromotions}</p>
          </div>
          <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
            <h3 className="backend-text-muted text-sm font-medium">การใช้งานทั้งหมด</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">{stats.totalUsage.toLocaleString()}</p>
          </div>
          <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
            <h3 className="backend-text-muted text-sm font-medium">ส่วนลดรวม</h3>
            <p className="text-2xl font-bold text-orange-600 mt-2">{formatCurrency(stats.totalDiscountGiven)}</p>
          </div>
        </div>
      )}

      {/* Promotions Table */}
      <div className="backend-sidebar-bg rounded-lg backend-sidebar-border border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold backend-text">รายการโปรโมชั่น</h2>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm">รีเฟรช</button>
              <button className="text-green-600 hover:text-green-800 text-sm">ส่งออก Excel</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b backend-sidebar-border">
                  <th className="text-left py-3 px-4 backend-text font-medium">โปรโมชั่น</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ร้านค้า</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ประเภท</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ค่าส่วนลด</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ระยะเวลา</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">สถานะ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-6xl mb-4">🏷️</div>
                        <h3>ยังไม่มีข้อมูลโปรโมชั่น</h3>
                        <p>ข้อมูลโปรโมชั่นจะแสดงที่นี่เมื่อมีการสร้างโปรโมชั่น</p>
                      </div>
                    </td>
                  </tr>
                ) : promotions.map((promotion) => (
                  <tr key={promotion.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div className="backend-text font-medium">{promotion.name}</div>
                      {promotion.description && (
                        <div className="text-sm backend-text-muted">{promotion.description}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 backend-text">{promotion.shopName}</td>
                    <td className="py-3 px-4 backend-text">{getTypeText(promotion.type)}</td>
                    <td className="py-3 px-4">
                      <div className="backend-text font-medium">
                        {formatValue(promotion.type, promotion.value)}
                      </div>
                      {promotion.minPurchaseAmount && (
                        <div className="text-xs backend-text-muted">
                          ขั้นต่ำ {formatCurrency(promotion.minPurchaseAmount)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="backend-text">
                        <div>{formatDate(promotion.startAt)}</div>
                        <div className="text-xs backend-text-muted">ถึง {formatDate(promotion.endAt)}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(promotion.status)}`}>
                        {getStatusText(promotion.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPromotion(promotion)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          disabled={state.isUpdating}
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleToggleStatus(promotion.id, promotion.status)}
                          className="text-yellow-600 hover:text-yellow-800 text-sm"
                          disabled={state.isUpdating}
                        >
                          {promotion.status === 'active' ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                        </button>
                        <button
                          onClick={() => handleDeletePromotion(promotion.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          disabled={state.isDeleting}
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="backend-text-muted text-sm">
          แสดง 1-{promotions.length} จาก {stats.totalPromotions} รายการ
        </p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">ก่อนหน้า</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">2</button>
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">3</button>
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">ถัดไป</button>
        </div>
      </div>

      {/* Loading States */}
      {(state.isCreating || state.isUpdating || state.isDeleting) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="backend-text">
                {state.isCreating && 'กำลังสร้างโปรโมชั่น...'}
                {state.isUpdating && 'กำลังอัปเดตโปรโมชั่น...'}
                {state.isDeleting && 'กำลังลบโปรโมชั่น...'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
