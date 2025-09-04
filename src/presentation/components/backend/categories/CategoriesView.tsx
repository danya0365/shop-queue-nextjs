'use client';

import { CategoriesViewModel } from '@/src/presentation/presenters/backend/categories/CategoriesPresenter';
import { useCategoriesPresenter } from '@/src/presentation/presenters/backend/categories/useCategoriesPresenter';
import {
  FolderOpen,
  CheckCircle,
  Store,
  Wrench,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Power,
  Trash2
} from 'lucide-react';

interface CategoriesViewProps {
  viewModel: CategoriesViewModel;
}

export function CategoriesView({ viewModel }: CategoriesViewProps) {
  const [state, actions] = useCategoriesPresenter();
  const { categoriesData } = viewModel;

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'ใช้งาน' : 'ไม่ใช้งาน';
  };

  const handleToggleStatus = async (id: string) => {
    const success = await actions.toggleStatus(id);
    if (success) {
      window.location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?')) {
      const success = await actions.deleteCategory(id);
      if (success) {
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold backend-text">จัดการหมวดหมู่</h1>
          <p className="backend-text-muted mt-2">จัดการหมวดหมู่บริการและการจัดกลุ่มร้านค้า</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Download size={16} />
            <span>ส่งออกข้อมูล</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>เพิ่มหมวดหมู่ใหม่</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">หมวดหมู่ทั้งหมด</h3>
              <p className="text-2xl font-bold backend-text mt-2">{categoriesData.stats.totalCategories}</p>
            </div>
            <div className="p-3 rounded-full text-blue-600 bg-blue-50">
              <FolderOpen size={24} />
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">หมวดหมู่ที่ใช้งาน</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{categoriesData.stats.activeCategories}</p>
            </div>
            <div className="p-3 rounded-full text-green-600 bg-green-50">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">ร้านค้าทั้งหมด</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{categoriesData.stats.totalShops}</p>
            </div>
            <div className="p-3 rounded-full text-blue-600 bg-blue-50">
              <Store size={24} />
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">บริการทั้งหมด</h3>
              <p className="text-2xl font-bold text-purple-600 mt-2">{categoriesData.stats.totalServices}</p>
            </div>
            <div className="p-3 rounded-full text-purple-600 bg-purple-50">
              <Wrench size={24} />
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
              placeholder="ค้นหาหมวดหมู่..."
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
            <option value="active">ใช้งาน</option>
            <option value="inactive">ไม่ใช้งาน</option>
          </select>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">เรียงตาม</option>
            <option value="name">ชื่อหมวดหมู่</option>
            <option value="shops_count">จำนวนร้านค้า</option>
            <option value="services_count">จำนวนบริการ</option>
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesData.categories.map((category) => (
          <div key={category.id} className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold backend-text">{category.name}</h3>
                  <p className="backend-text-muted text-sm">{category.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(category.isActive)}`}>
                {getStatusText(category.isActive)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold backend-text">{category.shopsCount}</p>
                <p className="backend-text-muted text-sm">ร้านค้า</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold backend-text">{category.servicesCount}</p>
                <p className="backend-text-muted text-sm">บริการ</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t backend-sidebar-border">
              <p className="backend-text-muted text-sm">
                สร้างเมื่อ {new Date(category.createdAt).toLocaleDateString('th-TH')}
              </p>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
                  <Edit size={14} />
                  <span>แก้ไข</span>
                </button>
                <button
                  onClick={() => handleToggleStatus(category.id)}
                  disabled={state.isLoading}
                  className="text-green-600 hover:text-green-800 text-sm disabled:opacity-50 flex items-center space-x-1"
                >
                  <Power size={14} />
                  <span>{category.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}</span>
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  disabled={state.isLoading}
                  className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50 flex items-center space-x-1"
                >
                  <Trash2 size={14} />
                  <span>ลบ</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Table (Alternative View) */}
      <div className="backend-sidebar-bg rounded-lg backend-sidebar-border border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold backend-text">รายการหมวดหมู่</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">สลับมุมมอง</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b backend-sidebar-border">
                  <th className="text-left py-3 px-4 backend-text font-medium">หมวดหมู่</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">คำอธิบาย</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ร้านค้า</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">บริการ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">สถานะ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">วันที่สร้าง</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {categoriesData.categories.map((category) => (
                  <tr key={category.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          {category.icon}
                        </div>
                        <span className="backend-text font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 backend-text-muted">{category.description}</td>
                    <td className="py-3 px-4 backend-text text-center">{category.shopsCount}</td>
                    <td className="py-3 px-4 backend-text text-center">{category.servicesCount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(category.isActive)}`}>
                        {getStatusText(category.isActive)}
                      </span>
                    </td>
                    <td className="py-3 px-4 backend-text-muted">
                      {new Date(category.createdAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
                          <Edit size={14} />
                          <span>แก้ไข</span>
                        </button>
                        <button className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1">
                          <Eye size={14} />
                          <span>ดูร้านค้า</span>
                        </button>
                        <button className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1">
                          <Power size={14} />
                          <span>สถิติ</span>
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
          แสดง 1-{categoriesData.categories.length} จาก {categoriesData.totalCount} รายการ
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
