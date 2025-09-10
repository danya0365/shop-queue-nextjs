'use client';

import { QueueServicesViewModel } from '@/src/presentation/presenters/shop/backend/QueueServicesPresenter';
import { useState } from 'react';

interface QueueServicesViewProps {
  viewModel: QueueServicesViewModel;
}

export function QueueServicesView({ viewModel }: QueueServicesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'serviceName' | 'currentQueue' | 'estimatedDuration' | 'priority'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  // Filter and sort queue services
  const filteredServices = viewModel.queueServices
    .filter(service => {
      const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || service.departmentId === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'active' && service.isActive) ||
                           (selectedStatus === 'inactive' && !service.isActive);
      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;
      
      switch (sortBy) {
        case 'serviceName':
          aValue = a.serviceName;
          bValue = b.serviceName;
          break;
        case 'currentQueue':
          aValue = a.currentQueue;
          bValue = b.currentQueue;
          break;
        case 'estimatedDuration':
          aValue = a.estimatedDuration;
          bValue = b.estimatedDuration;
          break;
        case 'priority':
          aValue = a.priority;
          bValue = b.priority;
          break;
        default:
          aValue = a.priority;
          bValue = b.priority;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} นาที`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours} ชม. ${remainingMinutes} นาที` : `${hours} ชั่วโมง`;
  };

  const getQueueStatus = (service: { currentQueue: number; maxCapacity: number; isActive: boolean }) => {
    if (!service.isActive) {
      return { label: 'ปิดบริการ', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
    }
    
    const utilizationRate = service.currentQueue / service.maxCapacity;
    
    if (utilizationRate >= 1) {
      return { label: 'เต็ม', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
    } else if (utilizationRate >= 0.7) {
      return { label: 'คิวเยอะ', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    } else if (utilizationRate >= 0.3) {
      return { label: 'ปกติ', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    } else {
      return { label: 'ว่าง', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'text-red-600 font-bold';
    if (priority <= 4) return 'text-orange-600 font-semibold';
    if (priority <= 6) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">บริการในคิว</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">จัดการบริการที่ให้ในระบบคิว</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAddServiceModal(true)}
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            ➕ เพิ่มบริการ
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">บริการทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {viewModel.stats.totalServices}
              </p>
            </div>
            <div className="text-2xl">🛎️</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">บริการที่เปิด</p>
              <p className="text-2xl font-bold text-green-600">
                {viewModel.stats.activeServices}
              </p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">คิวรวม</p>
              <p className="text-2xl font-bold text-blue-600">
                {viewModel.stats.currentTotalQueue}
              </p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">เวลารอเฉลี่ย</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatDuration(viewModel.stats.averageWaitTime)}
              </p>
            </div>
            <div className="text-2xl">⏱️</div>
          </div>
        </div>
      </div>

      {/* Department Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Busy Departments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-red-500">🔥</span>
              แผนกที่คิวเยอะ
            </h2>
            {viewModel.busyDepartments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                ไม่มีแผนกที่คิวเยอะในขณะนี้
              </p>
            ) : (
              <div className="space-y-2">
                {viewModel.busyDepartments.map((dept, index) => (
                  <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="font-medium text-red-800 dark:text-red-200">{dept}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available Departments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-green-500">✨</span>
              แผนกที่ว่าง
            </h2>
            {viewModel.availableDepartments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                ไม่มีแผนกที่ว่างในขณะนี้
              </p>
            ) : (
              <div className="space-y-2">
                {viewModel.availableDepartments.map((dept, index) => (
                  <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="font-medium text-green-800 dark:text-green-200">{dept}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาบริการ หรือ แผนก..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Department Filter */}
          <div className="lg:w-48">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">ทุกแผนก</option>
              {viewModel.departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.serviceCount})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:w-32">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="active">เปิดบริการ</option>
              <option value="inactive">ปิดบริการ</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:w-40">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'serviceName' | 'currentQueue' | 'estimatedDuration' | 'priority')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="priority">เรียงตามลำดับ</option>
              <option value="currentQueue">เรียงตามคิว</option>
              <option value="estimatedDuration">เรียงตามเวลา</option>
              <option value="serviceName">เรียงตามชื่อ</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="lg:w-32">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="asc">น้อย → มาก</option>
              <option value="desc">มาก → น้อย</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue Services Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ลำดับ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  บริการ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  แผนก
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  คิว/ความจุ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  เวลาโดยประมาณ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-4">🛎️</div>
                      <p className="text-lg">ไม่พบบริการที่ตรงกับเงื่อนไขการค้นหา</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const queueStatus = getQueueStatus(service);
                  return (
                    <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPriorityColor(service.priority)}`}>
                          #{service.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {service.serviceName}
                          </div>
                          {service.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {service.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {service.departmentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {service.currentQueue}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 mx-1">/</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {service.maxCapacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              service.currentQueue / service.maxCapacity >= 0.8 ? 'bg-red-500' :
                              service.currentQueue / service.maxCapacity >= 0.5 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((service.currentQueue / service.maxCapacity) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDuration(service.estimatedDuration)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${queueStatus.color}`}>
                          {queueStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            แก้ไข
                          </button>
                          <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                            {service.isActive ? 'ปิด' : 'เปิด'}
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Service Modal Placeholder */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              เพิ่มบริการใหม่
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ฟีเจอร์นี้จะพัฒนาในเร็วๆ นี้
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddServiceModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
