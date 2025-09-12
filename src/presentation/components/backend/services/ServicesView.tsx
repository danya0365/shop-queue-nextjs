'use client';

import { ServicesViewModel } from '@/src/presentation/presenters/backend/services/ServicesPresenter';
import { useServicesPresenter } from '@/src/presentation/presenters/backend/services/useServicesPresenter';
import {
  Wrench,
  CheckCircle,
  XCircle,
  DollarSign,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Power,
  TrendingUp
} from 'lucide-react';

interface ServicesViewProps {
  viewModel: ServicesViewModel;
}

export function ServicesView({ viewModel }: ServicesViewProps) {
  const [state, actions] = useServicesPresenter();
  const { servicesData } = viewModel;

  const getAvailabilityColor = (isAvailable?: boolean) => {
    return isAvailable 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getAvailabilityText = (isAvailable?: boolean) => {
    return isAvailable ? 'พร้อมให้บริการ' : 'ไม่พร้อมให้บริการ';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'ไม่ระบุ';
    return `${duration} นาที`;
  };

  const handleToggleAvailability = async (id: string, currentAvailability: boolean) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะ${currentAvailability ? 'ปิด' : 'เปิด'}การให้บริการนี้?`)) {
      const success = await actions.toggleServiceAvailability(id, !currentAvailability);
      if (success) {
        window.location.reload();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบบริการนี้? การกระทำนี้ไม่สามารถยกเลิกได้')) {
      const success = await actions.deleteService(id);
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
          <h1 className="text-3xl font-bold backend-text">จัดการบริการ</h1>
          <p className="backend-text-muted mt-2">จัดการข้อมูลบริการและราคาสำหรับร้านค้า</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>เพิ่มบริการใหม่</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download size={16} />
            <span>ส่งออกข้อมูล</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {servicesData.stats.totalServices === 0 ? (
        <div className="backend-sidebar-bg rounded-lg p-12 backend-sidebar-border border text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium backend-text mb-2">ยังไม่มีข้อมูลสถิติบริการ</h3>
          <p className="backend-text-muted">ข้อมูลสถิติบริการจะแสดงเมื่อมีการสร้างบริการ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="backend-text-muted text-sm font-medium">บริการทั้งหมด</h3>
                <p className="text-2xl font-bold backend-text mt-2">{servicesData.stats.totalServices}</p>
              </div>
              <div className="p-3 rounded-full text-blue-600 bg-blue-50">
                <Wrench size={24} />
              </div>
            </div>
          </div>
          <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="backend-text-muted text-sm font-medium">พร้อมให้บริการ</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">{servicesData.stats.availableServices}</p>
              </div>
              <div className="p-3 rounded-full text-green-600 bg-green-50">
                <CheckCircle size={24} />
              </div>
            </div>
          </div>
          <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="backend-text-muted text-sm font-medium">ไม่พร้อมให้บริการ</h3>
                <p className="text-2xl font-bold text-red-600 mt-2">{servicesData.stats.unavailableServices}</p>
              </div>
              <div className="p-3 rounded-full text-red-600 bg-red-50">
                <XCircle size={24} />
              </div>
            </div>
          </div>
          <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="backend-text-muted text-sm font-medium">ราคาเฉลี่ย</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">{formatPrice(servicesData.stats.averagePrice)}</p>
              </div>
              <div className="p-3 rounded-full text-blue-600 bg-blue-50">
                <DollarSign size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {servicesData.stats.totalServices === 0 ? (
        <div className="backend-sidebar-bg rounded-lg p-12 backend-sidebar-border border text-center">
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-lg font-medium backend-text mb-2">ยังไม่มีข้อมูลการกระจายตามหมวดหมู่</h3>
          <p className="backend-text-muted">ข้อมูลการกระจายตามหมวดหมู่จะแสดงเมื่อมีการสร้างบริการ</p>
        </div>
      ) : (
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp size={20} className="backend-text-muted" />
            <h3 className="text-lg font-semibold backend-text">การกระจายตามหมวดหมู่</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(servicesData.stats.servicesByCategory).map(([category, count]) => (
              <div key={category} className="text-center">
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="backend-text-muted text-sm">{category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Services */}
      {servicesData.stats.totalServices === 0 ? (
        <div className="backend-sidebar-bg rounded-lg p-12 backend-sidebar-border border text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-lg font-medium backend-text mb-2">ยังไม่มีข้อมูลบริการยอดนิยม</h3>
          <p className="backend-text-muted">ข้อมูลบริการยอดนิยมจะแสดงเมื่อมีการสร้างบริการ</p>
        </div>
      ) : (
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="text-lg font-semibold backend-text mb-4">บริการยอดนิยม</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {servicesData.stats.popularServices.map((service) => (
              <div key={service.id} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium backend-text">{service.name}</p>
                <p className="text-sm backend-text-muted">{service.bookingCount} การจอง</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
              placeholder="ค้นหาด้วยชื่อบริการ หรือคำอธิบาย..."
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
            />
          </div>
          <select
            value={state.categoryFilter}
            onChange={(e) => actions.setCategoryFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกหมวดหมู่</option>
            {Object.keys(servicesData.stats.servicesByCategory).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={state.availabilityFilter}
            onChange={(e) => actions.setAvailabilityFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกสถานะ</option>
            <option value="available">พร้อมให้บริการ</option>
            <option value="unavailable">ไม่พร้อมให้บริการ</option>
          </select>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">เรียงตาม</option>
            <option value="name">ชื่อบริการ</option>
            <option value="price">ราคา</option>
            <option value="popularity">ความนิยม</option>
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

      {/* Services Table */}
      <div className="backend-sidebar-bg rounded-lg backend-sidebar-border border">
        <div className="p-6">
          <h2 className="text-xl font-semibold backend-text mb-4">รายการบริการ</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b backend-sidebar-border">
                  <th className="text-left py-3 px-4 backend-text font-medium">บริการ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">หมวดหมู่</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ราคา</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ระยะเวลา</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ความนิยม</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">สถานะ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {servicesData.services.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-6xl mb-4">🔧</div>
                        <h3>ยังไม่มีข้อมูลบริการ</h3>
                        <p>ข้อมูลบริการจะแสดงที่นี่เมื่อมีการสร้างบริการ</p>
                      </div>
                    </td>
                  </tr>
                ) : servicesData.services.map((service) => (
                  <tr key={service.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        {service.icon && (
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-300">{service.icon}</span>
                          </div>
                        )}
                        <div>
                          <div className="backend-text font-medium">{service.name}</div>
                          {service.description && (
                            <div className="backend-text-muted text-sm truncate max-w-xs">{service.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 backend-text">{service.category || 'ไม่มีหมวดหมู่'}</td>
                    <td className="py-3 px-4 backend-text font-medium">{formatPrice(service.price)}</td>
                    <td className="py-3 px-4 backend-text">{formatDuration(service.estimatedDuration)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="backend-text">{service.popularityRank || 0}</span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((service.popularityRank || 0) * 10, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getAvailabilityColor(service.isAvailable)}`}>
                        {getAvailabilityText(service.isAvailable)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
                          <Eye size={14} />
                          <span>ดูรายละเอียด</span>
                        </button>
                        <button className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1">
                          <Edit size={14} />
                          <span>แก้ไข</span>
                        </button>

                        {/* Availability Toggle */}
                        <button
                          onClick={() => handleToggleAvailability(service.id, service.isAvailable ?? true)}
                          disabled={state.isLoading}
                          className={`text-sm disabled:opacity-50 flex items-center space-x-1 ${service.isAvailable
                            ? 'text-red-600 hover:text-red-800'
                            : 'text-green-600 hover:text-green-800'
                            }`}
                        >
                          <Power size={14} />
                          <span>{service.isAvailable ? 'ปิดบริการ' : 'เปิดบริการ'}</span>
                        </button>

                        <button
                          onClick={() => handleDelete(service.id)}
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
          แสดง 1-{servicesData.services.length} จาก {servicesData.totalCount} รายการ
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
