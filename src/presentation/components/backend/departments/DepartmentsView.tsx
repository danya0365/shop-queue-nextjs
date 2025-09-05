'use client';

import { DepartmentsViewModel, DepartmentData } from '@/src/presentation/presenters/backend/departments/DepartmentsPresenter';
import { useDepartmentsPresenter } from '@/src/presentation/presenters/backend/departments/useDepartmentsPresenter';

interface DepartmentsViewProps {
  viewModel: DepartmentsViewModel;
}

export function DepartmentsView({ viewModel }: DepartmentsViewProps) {
  const [state, actions] = useDepartmentsPresenter();
  const { departments, stats, totalCount, error } = viewModel;

  const handleCreateDepartment = async () => {
    // In a real app, this would open a modal or form
    const success = await actions.createDepartment({
      name: 'แผนกใหม่',
      slug: 'new-department',
      description: 'คำอธิบายแผนกใหม่'
    });
    if (success) {
      window.location.reload();
    }
  };

  const handleUpdateDepartment = async (departmentId: string) => {
    actions.selectDepartment(departmentId);
    // In a real app, this would open a modal with pre-filled data
    const success = await actions.updateDepartment({
      id: departmentId,
      name: 'ชื่อแผนกที่แก้ไข'
    });
    if (success) {
      window.location.reload();
    }
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบแผนกนี้?')) {
      const success = await actions.deleteDepartment({ id: departmentId });
      if (success) {
        window.location.reload();
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold backend-text">จัดการแผนก</h1>
          <p className="backend-text-muted mt-2">จัดการแผนกและพนักงานในองค์กร</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            ส่งออกรายงาน
          </button>
          <button 
            onClick={handleCreateDepartment}
            disabled={state.isCreating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            เพิ่มแผนกใหม่
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">แผนกทั้งหมด</h3>
          <p className="text-2xl font-bold backend-text mt-2">{stats.totalDepartments}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">พนักงานทั้งหมด</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{stats.totalEmployees}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">แผนกที่มีพนักงาน</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{stats.activeDepartments}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">เฉลี่ยพนักงานต่อแผนก</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">{stats.averageEmployeesPerDepartment}</p>
        </div>
      </div>

      {/* Department Size Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">แผนกขนาดเล็ก</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {departments.filter((d: DepartmentData) => d.employeeCount <= 5).length}
              </p>
              <p className="text-xs backend-text-muted">1-5 คน</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">แผนกขนาดกลาง</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {departments.filter((d: DepartmentData) => d.employeeCount > 5 && d.employeeCount <= 10).length}
              </p>
              <p className="text-xs backend-text-muted">6-10 คน</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">👨‍👩‍👧‍👦</span>
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">แผนกขนาดใหญ่</h3>
              <p className="text-2xl font-bold text-orange-600 mt-2">
                {departments.filter((d: DepartmentData) => d.employeeCount > 10).length}
              </p>
              <p className="text-xs backend-text-muted">มากกว่า 10 คน</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-xl">🏢</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อแผนก, รหัสแผนก, หรือคำอธิบาย..."
              className="w-full px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
            />
          </div>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">ขนาดแผนก</option>
            <option value="small">เล็ก (1-5 คน)</option>
            <option value="medium">กลาง (6-10 คน)</option>
            <option value="large">ใหญ่ (มากกว่า 10 คน)</option>
          </select>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">เรียงตาม</option>
            <option value="name">ชื่อแผนก</option>
            <option value="employee_count">จำนวนพนักงาน</option>
            <option value="created_at">วันที่สร้าง</option>
            <option value="updated_at">วันที่แก้ไข</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {(error || state.error) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || state.error}
        </div>
      )}

      {/* Departments Table */}
      <div className="backend-sidebar-bg rounded-lg backend-sidebar-border border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold backend-text">รายการแผนก</h2>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm">รีเฟรช</button>
              <button className="text-green-600 hover:text-green-800 text-sm">ส่งออก Excel</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b backend-sidebar-border">
                  <th className="text-left py-3 px-4 backend-text font-medium">ชื่อแผนก</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">รหัสแผนก</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">คำอธิบาย</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">จำนวนพนักงาน</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">วันที่สร้าง</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">วันที่แก้ไข</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department: DepartmentData) => (
                  <tr key={department.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <span className="backend-text font-medium">{department.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="backend-text-muted font-mono text-sm">{department.slug}</span>
                    </td>
                    <td className="py-3 px-4 backend-text-muted max-w-xs truncate">
                      {department.description || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="backend-text font-medium">{department.employeeCount}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          department.employeeCount === 0 
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                            : department.employeeCount <= 5
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : department.employeeCount <= 10
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                        }`}>
                          {department.employeeCount === 0 
                            ? 'ว่าง'
                            : department.employeeCount <= 5
                            ? 'เล็ก'
                            : department.employeeCount <= 10
                            ? 'กลาง'
                            : 'ใหญ่'
                          }
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 backend-text-muted">
                      {formatDate(department.createdAt)}
                    </td>
                    <td className="py-3 px-4 backend-text-muted">
                      {formatDate(department.updatedAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleUpdateDepartment(department.id)}
                          disabled={state.isUpdating}
                          className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                        >
                          แก้ไข
                        </button>
                        <button className="text-green-600 hover:text-green-800 text-sm">
                          ดูพนักงาน
                        </button>
                        <button 
                          onClick={() => handleDeleteDepartment(department.id)}
                          disabled={state.isDeleting}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
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

      {/* Department Distribution Chart */}
      <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
        <h2 className="text-xl font-semibold backend-text mb-4">การกระจายตัวของแผนก</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {departments.slice(0, 8).map((department: DepartmentData) => (
            <div key={department.id} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg">
              <div className="text-2xl mb-2">
                {department.employeeCount === 0 
                  ? '📋'
                  : department.employeeCount <= 5
                  ? '👥'
                  : department.employeeCount <= 10
                  ? '👨‍👩‍👧‍👦'
                  : '🏢'
                }
              </div>
              <p className="text-sm backend-text-muted font-medium truncate">{department.name}</p>
              <p className="text-lg font-bold backend-text">{department.employeeCount}</p>
              <p className="text-xs backend-text-muted">พนักงาน</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm backend-text-muted">
            แสดง {Math.min(8, departments.length)} จาก {totalCount} แผนก
          </p>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="backend-text-muted text-sm">
          แสดง 1-{departments.length} จาก {totalCount} รายการ
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
