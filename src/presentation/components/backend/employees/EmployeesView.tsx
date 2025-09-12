'use client';

import { EmployeesViewModel } from '@/src/presentation/presenters/backend/employees/EmployeesPresenter';
import { useEmployeesPresenter } from '@/src/presentation/presenters/backend/employees/useEmployeesPresenter';
import {
  Users,
  UserCheck,
  Activity,
  TrendingUp,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Shield,
  Pause,
  Trash2
} from 'lucide-react';

interface EmployeesViewProps {
  viewModel: EmployeesViewModel;
}

export function EmployeesView({ viewModel }: EmployeesViewProps) {
  const [state, actions] = useEmployeesPresenter();
  const { employeesData } = viewModel;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'ใช้งาน';
      case 'inactive': return 'ไม่ใช้งาน';
      case 'suspended': return 'ระงับ';
      default: return 'ไม่ทราบ';
    }
  };

  const getDepartmentText = (department: string) => {
    switch (department) {
      case 'management': return 'จัดการ';
      case 'customer_service': return 'บริการลูกค้า';
      case 'technical': return 'เทคนิค';
      case 'sales': return 'ขาย';
      case 'other': return 'อื่นๆ';
      default: return department;
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const success = await actions.updateStatus(id, status);
    if (success) {
      window.location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบพนักงานนี้?')) {
      const success = await actions.deleteEmployee(id);
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
          <h1 className="text-3xl font-bold backend-text">จัดการพนักงาน</h1>
          <p className="backend-text-muted mt-2">จัดการข้อมูลพนักงานและสิทธิ์การเข้าถึงระบบ</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Download size={16} />
            <span>ส่งออกข้อมูล</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>เพิ่มพนักงานใหม่</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">พนักงานทั้งหมด</h3>
              <p className="text-2xl font-bold backend-text mt-2">{employeesData.stats.totalEmployees}</p>
            </div>
            <div className="p-3 rounded-full text-blue-600 bg-blue-50">
              <Users size={24} />
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">ใช้งานอยู่</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{employeesData.stats.activeEmployees}</p>
            </div>
            <div className="p-3 rounded-full text-green-600 bg-green-50">
              <UserCheck size={24} />
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">เข้าใช้งานวันนี้</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{employeesData.stats.loggedInToday}</p>
            </div>
            <div className="p-3 rounded-full text-blue-600 bg-blue-50">
              <Activity size={24} />
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">พนักงานใหม่เดือนนี้</h3>
              <p className="text-2xl font-bold text-purple-600 mt-2">{employeesData.stats.newEmployeesThisMonth}</p>
            </div>
            <div className="p-3 rounded-full text-purple-600 bg-purple-50">
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
              placeholder="ค้นหาด้วยชื่อ, อีเมล หรือเบอร์โทร..."
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
            />
          </div>
          <select
            value={state.departmentFilter}
            onChange={(e) => actions.setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกแผนก</option>
            <option value="management">จัดการ</option>
            <option value="customer_service">บริการลูกค้า</option>
            <option value="technical">เทคนิค</option>
            <option value="sales">ขาย</option>
            <option value="other">อื่นๆ</option>
          </select>
          <select
            value={state.statusFilter}
            onChange={(e) => actions.setStatusFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกสถานะ</option>
            <option value="active">ใช้งาน</option>
            <option value="inactive">ไม่ใช้งาน</option>
            <option value="suspended">ระงับ</option>
          </select>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">เรียงตาม</option>
            <option value="name">ชื่อ</option>
            <option value="department">แผนก</option>
            <option value="hire_date">วันที่เข้าทำงาน</option>
            <option value="last_login">เข้าใช้ล่าสุด</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* Employees Table */}
      <div className="backend-sidebar-bg rounded-lg backend-sidebar-border border">
        <div className="p-6">
          <h2 className="text-xl font-semibold backend-text mb-4">รายการพนักงาน</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b backend-sidebar-border">
                  <th className="text-left py-3 px-4 backend-text font-medium">ชื่อพนักงาน</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ติดต่อ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">แผนก</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ตำแหน่ง</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ร้านค้า</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">สถานะ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">เข้าใช้ล่าสุด</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {employeesData.employees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-6xl mb-4">👤</div>
                        <h3>{state.searchQuery || state.departmentFilter || state.statusFilter ? 'ไม่พบพนักงานที่ตรงกับเงื่อนไขการค้นหา' : 'ยังไม่มีพนักงานในระบบ'}</h3>
                        <p>{state.searchQuery || state.departmentFilter || state.statusFilter ? 'ลองปรับเงื่อนไขการค้นหาหรือเพิ่มพนักงานใหม่' : 'คลิกปุ่ม &quot;เพิ่มพนักงานใหม่&quot; เพื่อเริ่มเพิ่มพนักงานแรกของคุณ'}</p>
                      </div>
                    </td>
                  </tr>
                ) : employeesData.employees.map((employee) => (
                  <tr key={employee.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <div className="backend-text font-medium">{employee.name}</div>
                        {employee.notes && (
                          <div className="backend-text-muted text-sm">{employee.notes}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="backend-text-muted text-sm">{employee.email}</div>
                        <div className="backend-text-muted text-sm">{employee.phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 backend-text">{getDepartmentText(employee.departmentName || '')}</td>
                    <td className="py-3 px-4 backend-text">{employee.position}</td>
                    <td className="py-3 px-4 backend-text-muted">{employee.shopName || 'ไม่ได้กำหนด'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(employee.status)}`}>
                        {getStatusText(employee.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 backend-text-muted">
                      {employee.lastLogin ? new Date(employee.lastLogin).toLocaleDateString('th-TH') : 'ไม่เคยเข้าใช้'}
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
                        <button className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1">
                          <Shield size={14} />
                          <span>สิทธิ์</span>
                        </button>
                        {employee.status === 'suspended' && (
                          <button
                            onClick={() => handleUpdateStatus(employee.id, 'active')}
                            disabled={state.isLoading}
                            className="text-orange-600 hover:text-orange-800 text-sm disabled:opacity-50 flex items-center space-x-1"
                          >
                            <UserCheck size={14} />
                            <span>ยกเลิกระงับ</span>
                          </button>
                        )}
                        {employee.status === 'active' && (
                          <button
                            onClick={() => handleUpdateStatus(employee.id, 'suspended')}
                            disabled={state.isLoading}
                            className="text-yellow-600 hover:text-yellow-800 text-sm disabled:opacity-50 flex items-center space-x-1"
                          >
                            <Pause size={14} />
                            <span>ระงับ</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(employee.id)}
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
          แสดง 1-{employeesData.employees.length} จาก {employeesData.totalCount} รายการ
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
