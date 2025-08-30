'use client';

import { QueuesViewModel } from '@/src/presentation/presenters/backend/queues/QueuesPresenter';
import { useQueuesPresenter } from '@/src/presentation/presenters/backend/queues/useQueuesPresenter';

interface QueuesViewProps {
  viewModel: QueuesViewModel;
}

export function QueuesView({ viewModel }: QueuesViewProps) {
  const [state, actions] = useQueuesPresenter();
  const { queuesData } = viewModel;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'no_show': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'รอคิว';
      case 'in_progress': return 'กำลังให้บริการ';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      case 'no_show': return 'ไม่มาตามนัด';
      default: return 'ไม่ทราบ';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'normal': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'ด่วนมาก';
      case 'high': return 'ด่วน';
      case 'normal': return 'ปกติ';
      default: return 'ปกติ';
    }
  };

  const handleCallQueue = async (id: string) => {
    const success = await actions.callQueue(id);
    if (success) {
      window.location.reload();
    }
  };

  const handleCompleteQueue = async (id: string) => {
    const success = await actions.completeQueue(id);
    if (success) {
      window.location.reload();
    }
  };

  const handleCancelQueue = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกคิวนี้?')) {
      const success = await actions.cancelQueue(id);
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
          <h1 className="text-3xl font-bold backend-text">จัดการคิว</h1>
          <p className="backend-text-muted mt-2">จัดการคิวและสถานะการให้บริการ</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            ส่งออกข้อมูล
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            เพิ่มคิวใหม่
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">คิวทั้งหมด</h3>
          <p className="text-2xl font-bold backend-text mt-2">{queuesData.stats.total_queues}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">รอคิว</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{queuesData.stats.waiting_queues}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">กำลังให้บริการ</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{queuesData.stats.in_progress_queues}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">เสร็จสิ้นวันนี้</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{queuesData.stats.completed_today}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">ยกเลิกวันนี้</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">{queuesData.stats.cancelled_today}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">เวลารอเฉลี่ย</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">{queuesData.stats.average_wait_time} นาที</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อลูกค้า, เบอร์โทร หรือหมายเลขคิว..."
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
            />
          </div>
          <select
            value={state.statusFilter}
            onChange={(e) => actions.setStatusFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกสถานะ</option>
            <option value="waiting">รอคิว</option>
            <option value="in_progress">กำลังให้บริการ</option>
            <option value="completed">เสร็จสิ้น</option>
            <option value="cancelled">ยกเลิก</option>
            <option value="no_show">ไม่มาตามนัด</option>
          </select>
          <select
            value={state.shopFilter}
            onChange={(e) => actions.setShopFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกร้านค้า</option>
            <option value="1">ร้านตัดผมสไตล์</option>
            <option value="2">คลินิกความงาม</option>
            <option value="3">ศูนย์ซ่อมมือถือ</option>
          </select>
          <select
            value={state.priorityFilter}
            onChange={(e) => actions.setPriorityFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกความสำคัญ</option>
            <option value="urgent">ด่วนมาก</option>
            <option value="high">ด่วน</option>
            <option value="normal">ปกติ</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* Queues Table */}
      <div className="backend-sidebar-bg rounded-lg backend-sidebar-border border">
        <div className="p-6">
          <h2 className="text-xl font-semibold backend-text mb-4">รายการคิว</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b backend-sidebar-border">
                  <th className="text-left py-3 px-4 backend-text font-medium">หมายเลขคิว</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ลูกค้า</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ร้านค้า</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">บริการ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ความสำคัญ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">เวลารอ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">สถานะ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {queuesData.queues.map((queue) => (
                  <tr key={queue.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold backend-text">{queue.queue_number}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="backend-text font-medium">{queue.customer_name}</div>
                        <div className="backend-text-muted text-sm">{queue.customer_phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 backend-text">{queue.shop_name}</td>
                    <td className="py-3 px-4 backend-text">{queue.queue_services[0].service_name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(queue.priority)}`}>
                        {getPriorityText(queue.priority)}
                      </span>
                    </td>
                    <td className="py-3 px-4 backend-text text-center">
                      <div>
                        <div className="font-medium">{queue.estimated_wait_time} นาที</div>
                        {queue.actual_wait_time && (
                          <div className="text-sm backend-text-muted">จริง: {queue.actual_wait_time} นาที</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(queue.status)}`}>
                        {getStatusText(queue.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {queue.status === 'waiting' && (
                          <button
                            onClick={() => handleCallQueue(queue.id)}
                            disabled={state.isLoading}
                            className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                          >
                            เรียกคิว
                          </button>
                        )}
                        {queue.status === 'in_progress' && (
                          <button
                            onClick={() => handleCompleteQueue(queue.id)}
                            disabled={state.isLoading}
                            className="text-green-600 hover:text-green-800 text-sm disabled:opacity-50"
                          >
                            เสร็จสิ้น
                          </button>
                        )}
                        {(queue.status === 'waiting' || queue.status === 'in_progress') && (
                          <button
                            onClick={() => handleCancelQueue(queue.id)}
                            disabled={state.isLoading}
                            className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                          >
                            ยกเลิก
                          </button>
                        )}
                        <button className="text-purple-600 hover:text-purple-800 text-sm">ดูรายละเอียด</button>
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
          แสดง 1-{queuesData.queues.length} จาก {queuesData.total_count} รายการ
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
