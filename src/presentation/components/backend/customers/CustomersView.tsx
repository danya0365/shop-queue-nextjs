'use client';

import { CustomersViewModel } from '@/src/presentation/presenters/backend/customers/CustomersPresenter';
import { useCustomersPresenter } from '@/src/presentation/presenters/backend/customers/useCustomersPresenter';
import {
  Users,
  UserPlus,
  Activity,
  Crown,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Award
} from 'lucide-react';

interface CustomersViewProps {
  viewModel: CustomersViewModel;
}

export function CustomersView({ viewModel }: CustomersViewProps) {
  const [state, actions] = useCustomersPresenter();
  const { customersData } = viewModel;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'regular': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTierText = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'แพลทินัม';
      case 'gold': return 'ทอง';
      case 'silver': return 'เงิน';
      case 'bronze': return 'ทองแดง';
      case 'regular': return 'ทั่วไป';
      default: return 'ทั่วไป';
    }
  };

  const handleAddPoints = async (id: string) => {
    const points = prompt('กรุณาระบุจำนวนคะแนนที่ต้องการเพิ่ม:');
    if (points && !isNaN(Number(points))) {
      const success = await actions.addPoints(id, Number(points));
      if (success) {
        window.location.reload();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบลูกค้านี้?')) {
      const success = await actions.deleteCustomer(id);
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
          <h1 className="text-3xl font-bold backend-text">จัดการลูกค้า</h1>
          <p className="backend-text-muted mt-2">จัดการข้อมูลลูกค้าและสมาชิกในระบบ</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Download size={16} />
            <span>ส่งออกข้อมูล</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>เพิ่มลูกค้าใหม่</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">ลูกค้าทั้งหมด</h3>
              <p className="text-2xl font-bold backend-text mt-2">{customersData.stats.totalCustomers}</p>
            </div>
            <div className="p-3 rounded-full text-blue-600 bg-blue-50">
              <Users size={24} />
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">สมาชิกใหม่เดือนนี้</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{customersData.stats.newCustomersThisMonth}</p>
            </div>
            <div className="p-3 rounded-full text-green-600 bg-green-50">
              <UserPlus size={24} />
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">ลูกค้าที่ใช้บริการวันนี้</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{customersData.stats.activeCustomersToday}</p>
            </div>
            <div className="p-3 rounded-full text-blue-600 bg-blue-50">
              <Activity size={24} />
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">สมาชิกระดับทอง</h3>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{customersData.stats.goldMembers}</p>
            </div>
            <div className="p-3 rounded-full text-yellow-600 bg-yellow-50">
              <Crown size={24} />
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
              placeholder="ค้นหาด้วยชื่อ, เบอร์โทร หรืออีเมล..."
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
            />
          </div>
          <select
            value={state.membershipFilter}
            onChange={(e) => actions.setMembershipFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกระดับสมาชิก</option>
            <option value="platinum">แพลทินัม</option>
            <option value="gold">ทอง</option>
            <option value="silver">เงิน</option>
            <option value="bronze">ทองแดง</option>
            <option value="regular">ทั่วไป</option>
          </select>
          <select
            value={state.genderFilter}
            onChange={(e) => actions.setGenderFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกเพศ</option>
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
            <option value="other">อื่นๆ</option>
          </select>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">เรียงตาม</option>
            <option value="name">ชื่อ</option>
            <option value="points">คะแนน</option>
            <option value="last_visit">เข้าใช้ล่าสุด</option>
            <option value="created_at">วันที่สมัคร</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* Customers Table */}
      <div className="backend-sidebar-bg rounded-lg backend-sidebar-border border">
        <div className="p-6">
          <h2 className="text-xl font-semibold backend-text mb-4">รายการลูกค้า</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b backend-sidebar-border">
                  <th className="text-left py-3 px-4 backend-text font-medium">ชื่อลูกค้า</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ติดต่อ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">จำนวนคิว</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">คะแนน</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ระดับสมาชิก</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">เข้าใช้ล่าสุด</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {customersData.customers.map((customer) => (
                  <tr key={customer.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <div className="backend-text font-medium">{customer.name}</div>
                        {customer.notes && (
                          <div className="backend-text-muted text-sm">{customer.notes}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="backend-text-muted text-sm">{customer.phone}</div>
                        <div className="backend-text-muted text-sm">{customer.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 backend-text text-center">{customer.totalQueues}</td>
                    <td className="py-3 px-4 backend-text text-center font-medium">{customer.totalPoints}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTierColor(customer.membershipTier)}`}>
                        {getTierText(customer.membershipTier)}
                      </span>
                    </td>
                    <td className="py-3 px-4 backend-text-muted">
                      {customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString('th-TH') : 'ไม่เคยใช้บริการ'}
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
                        <button
                          onClick={() => handleAddPoints(customer.id)}
                          disabled={state.isLoading}
                          className="text-purple-600 hover:text-purple-800 text-sm disabled:opacity-50 flex items-center space-x-1"
                        >
                          <Award size={14} />
                          <span>เพิ่มคะแนน</span>
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
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
          แสดง 1-{customersData.customers.length} จาก {customersData.totalCount} รายการ
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
