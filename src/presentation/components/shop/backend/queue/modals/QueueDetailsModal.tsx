"use client";

import {
  QueuePriority,
  QueueStatus,
} from "@/src/domain/entities/backend/backend-queue.entity";
import { QueueItem } from "@/src/presentation/presenters/shop/backend/QueueManagementPresenter";

interface QueueDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  queue: QueueItem | null;
}

export function QueueDetailsModal({
  isOpen,
  onClose,
  queue,
}: QueueDetailsModalProps) {
  if (!isOpen || !queue) return null;

  const getStatusColor = (status: QueueStatus) => {
    switch (status) {
      case QueueStatus.WAITING:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case QueueStatus.CONFIRMED:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case QueueStatus.SERVING:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case QueueStatus.COMPLETED:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case QueueStatus.CANCELLED:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusText = (status: QueueStatus) => {
    switch (status) {
      case QueueStatus.WAITING:
        return "รอยืนยัน";
      case QueueStatus.CONFIRMED:
        return "ยืนยันแล้ว";
      case QueueStatus.SERVING:
        return "กำลังให้บริการ";
      case QueueStatus.COMPLETED:
        return "เสร็จสิ้น";
      case QueueStatus.CANCELLED:
        return "ยกเลิก";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: QueuePriority) => {
    switch (priority) {
      case QueuePriority.HIGH:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case QueuePriority.URGENT:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case QueuePriority.NORMAL:
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityText = (priority: QueuePriority) => {
    switch (priority) {
      case QueuePriority.HIGH:
        return "สำคัญ";
      case QueuePriority.URGENT:
        return "ด่วน";
      case QueuePriority.NORMAL:
      default:
        return "ปกติ";
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotalAmount = () => {
    return queue.queueServices.reduce(
      (total, service) => total + service.total,
      0
    );
  };

  const calculateTotalDuration = () => {
    return queue.queueServices.reduce(
      (total, service) => total + service.quantity * 15,
      0
    ); // Assuming 15 min per service
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              รายละเอียดคิว
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">คิว #{queue.queueNumber}</h2>
                <p className="text-blue-100">{queue.shopName}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(queue.status)}`}>
                  {getStatusText(queue.status)}
                </span>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(queue.priority)}`}>
                    {getPriorityText(queue.priority)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="mr-2">👤</span> ข้อมูลลูกค้า
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">ชื่อลูกค้า</label>
                <p className="font-medium text-gray-900 dark:text-gray-100">{queue.customerName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">เบอร์โทรศัพท์</label>
                <p className="font-medium text-gray-900 dark:text-gray-100">{queue.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Services Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="mr-2">🔧</span> บริการที่เลือก
            </h3>
            <div className="space-y-3">
              {queue.queueServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{service.serviceName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{service.quantity} ชิ้น</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">฿{service.total.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">฿{service.price.toLocaleString()}/ชิ้น</p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">รวมทั้งหมด</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">฿{calculateTotalAmount().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">ระยะเวลาโดยประมาณ</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{calculateTotalDuration()} นาที</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {queue.payments && queue.payments.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span className="mr-2">💳</span> ข้อมูลการชำระเงิน
              </h3>
              <div className="space-y-3">
                {queue.payments.map((payment, index) => (
                  <div key={index} className="p-3 bg-white dark:bg-gray-600 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">การชำระเงิน #{index + 1}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        payment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        payment.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {payment.paymentStatus === 'paid' ? 'ชำระแล้ว' : 
                         payment.paymentStatus === 'partial' ? 'ชำระบางส่วน' : 'ยังไม่ชำระ'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">วิธีการชำระ:</span>
                        <span className="ml-2 font-medium">{payment.paymentMethod || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">จำนวนเงิน:</span>
                        <span className="ml-2 font-medium">฿{payment.paidAmount?.toLocaleString() || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">ยอดรวม:</span>
                        <span className="ml-2 font-medium">฿{payment.totalAmount?.toLocaleString() || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">วันที่ชำระ:</span>
                        <span className="ml-2 font-medium">{payment.paymentDate ? formatDateTime(payment.paymentDate) : '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="mr-2">⏰</span> ไทม์ไลน์คิว
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">สร้างคิว</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(queue.createdAt)}</p>
                </div>
              </div>
              {queue.calledAt && (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">เรียกคิว</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(queue.calledAt)}</p>
                  </div>
                </div>
              )}
              {queue.completedAt && (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">เสร็จสิ้น</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(queue.completedAt)}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">อัปเดตล่าสุด</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(queue.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Wait Time Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="mr-2">⏱️</span> ข้อมูลเวลารอ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                <label className="text-sm text-gray-600 dark:text-gray-400">เวลารอโดยประมาณ</label>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{queue.estimatedWaitTime} นาที</p>
              </div>
              {queue.actualWaitTime && (
                <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                  <label className="text-sm text-gray-600 dark:text-gray-400">เวลารอจริง</label>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{queue.actualWaitTime} นาที</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          {queue.notes && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span className="mr-2">📝</span> หมายเหตุ
              </h3>
              <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                <p className="text-gray-900 dark:text-gray-100">{queue.notes}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
