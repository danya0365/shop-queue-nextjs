'use client';

import { ShopsViewModel } from '@/src/presentation/presenters/backend/shops/ShopsPresenter';
import { useShopsPresenter } from '@/src/presentation/presenters/backend/shops/useShopsPresenter';
import {
  Store,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Star
} from 'lucide-react';

interface ShopsViewProps {
  viewModel: ShopsViewModel;
}

export function ShopsView({ viewModel }: ShopsViewProps) {
  const [state, actions] = useShopsPresenter();
  const { shopsData } = viewModel;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'เปิดให้บริการ';
      case 'inactive': return 'ปิดให้บริการ';
      case 'pending': return 'รออนุมัติ';
      default: return 'ไม่ทราบ';
    }
  };

  const handleApprove = async (id: string) => {
    const success = await actions.approveShop(id);
    if (success) {
      // Refresh page or update state
      window.location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบร้านค้านี้?')) {
      const success = await actions.deleteShop(id);
      if (success) {
        // Refresh page or update state
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold backend-text">จัดการร้านค้า</h1>
          <p className="backend-text-muted mt-2">จัดการข้อมูลร้านค้าและการอนุมัติ</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Download size={16} />
            <span>ส่งออกข้อมูล</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>เพิ่มร้านค้าใหม่</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">ร้านค้าทั้งหมด</h3>
              <p className="text-2xl font-bold backend-text mt-2">{shopsData.stats.totalShops}</p>
            </div>
            <div className="p-3 rounded-full text-blue-600 bg-blue-50">
              <Store size={24} />
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">เปิดให้บริการ</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{shopsData.stats.activeShops}</p>
            </div>
            <div className="p-3 rounded-full text-green-600 bg-green-50">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">รออนุมัติ</h3>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{shopsData.stats.pendingApproval}</p>
            </div>
            <div className="p-3 rounded-full text-yellow-600 bg-yellow-50">
              <Clock size={24} />
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">ร้านค้าใหม่เดือนนี้</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{shopsData.stats.newThisMonth}</p>
            </div>
            <div className="p-3 rounded-full text-blue-600 bg-blue-50">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={20} className="backend-text-muted" />
          <h2 className="text-lg font-semibold backend-text">ค้นหาและกรองข้อมูล</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 backend-text-muted" />
            <input
              type="text"
              placeholder="ค้นหาร้านค้า..."
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
            />
          </div>
          <select
            value={state.statusFilter}
            onChange={(e) => actions.setStatusFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกสถานะ</option>
            <option value="active">เปิดให้บริการ</option>
            <option value="inactive">ปิดให้บริการ</option>
            <option value="pending">รออนุมัติ</option>
          </select>
          <select
            value={state.categoryFilter}
            onChange={(e) => actions.setCategoryFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกหมวดหมู่</option>
            <option value="1">ตัดผม</option>
            <option value="2">ความงาม</option>
            <option value="3">ซ่อมมือถือ</option>
          </select>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">เรียงตาม</option>
            <option value="name">ชื่อร้าน</option>
            <option value="rating">คะแนน</option>
            <option value="created_at">วันที่สร้าง</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* Shops Table */}
      <div className="backend-sidebar-bg rounded-lg backend-sidebar-border border">
        <div className="p-6">
          <h2 className="text-xl font-semibold backend-text mb-4">รายการร้านค้า</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b backend-sidebar-border">
                  <th className="text-left py-3 px-4 backend-text font-medium">ชื่อร้าน</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">หมวดหมู่</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">เจ้าของ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">เบอร์โทร</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">คิว</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">คะแนน</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">สถานะ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {shopsData.shops.map((shop) => (
                  <tr key={shop.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <div className="backend-text font-medium">{shop.name}</div>
                        <div className="backend-text-muted text-sm">{shop.description}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 backend-text">{shop.categories.map(category => category.name).join(', ')}</td>
                    <td className="py-3 px-4 backend-text-muted">{shop.ownerName}</td>
                    <td className="py-3 px-4 backend-text-muted">{shop.phone}</td>
                    <td className="py-3 px-4 backend-text text-center">{shop.queueCount}</td>
                    <td className="py-3 px-4 backend-text text-center">
                      <div className="flex items-center justify-center">
                        <Star size={16} className="text-yellow-500 fill-current" />
                        <span className="ml-1">{shop.rating}</span>
                        <span className="backend-text-muted text-sm ml-1">({shop.totalReviews})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(shop.status)}`}>
                        {getStatusText(shop.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
                          <Eye size={14} />
                          <span>ดูรายละเอียด</span>
                        </button>
                        <button className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1">
                          <Edit size={14} />
                          <span>แก้ไข</span>
                        </button>
                        {shop.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(shop.id)}
                            disabled={state.isLoading}
                            className="text-purple-600 hover:text-purple-800 text-sm disabled:opacity-50 flex items-center space-x-1"
                          >
                            <UserCheck size={14} />
                            <span>อนุมัติ</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(shop.id)}
                          disabled={state.isLoading}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50 flex items-center space-x-1"
                        >
                          <Trash2 size={14} />
                          <span>ลบ</span>
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
          แสดง 1-{shopsData.shops.length} จาก {shopsData.totalCount} รายการ
        </p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">ก่อนหน้า</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">2</button>
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">3</button>
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">ถัดไป</button>
        </div>
      </div>
    </div>
  );
}
