'use client';

import { QueueStatusViewModel } from '@/src/presentation/presenters/shop/frontend/QueueStatusPresenter';
import { useState } from 'react';

interface QueueStatusViewProps {
  viewModel: QueueStatusViewModel;
  shopId: string;
}

export function QueueStatusView({ viewModel, shopId }: QueueStatusViewProps) {
  const { customerQueue, queueProgress, shopName, isFound, canCancel } = viewModel;
  const [queueNumber, setQueueNumber] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'serving': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'รอการยืนยัน';
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'serving': return 'กำลังให้บริการ';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิกแล้ว';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return '⏳';
      case 'confirmed': return '✅';
      case 'serving': return '🛎️';
      case 'completed': return '🎉';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  const handleSearch = () => {
    if (queueNumber.trim()) {
      window.location.href = `/shop/${shopId}/status?queue=${queueNumber.trim()}`;
    }
  };

  const handleCancel = () => {
    // Mock cancel logic
    setShowCancelConfirm(false);
    alert('คิวของคุณถูกยกเลิกแล้ว');
    window.location.href = `/shop/${shopId}`;
  };

  if (!isFound) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold frontend-text-primary mb-2">ติดตามสถานะคิว</h1>
          <p className="frontend-text-secondary">{shopName}</p>
        </div>

        {/* Search Form */}
        <div className="frontend-card p-8">
          <div className="text-center mb-6">
            <span className="text-6xl mb-4 block">🔍</span>
            <h2 className="text-2xl font-semibold frontend-text-primary mb-2">ค้นหาคิวของคุณ</h2>
            <p className="frontend-text-secondary">กรอกหมายเลขคิวเพื่อติดตามสถานะ</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex space-x-4">
              <input
                type="text"
                value={queueNumber}
                onChange={(e) => setQueueNumber(e.target.value.toUpperCase())}
                placeholder="เช่น A016"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-lg font-mono"
              />
              <button
                onClick={handleSearch}
                className="frontend-button-primary px-6 py-3 rounded-lg font-semibold"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        {/* Current Queue Info */}
        <div className="mt-8 frontend-card">
          <div className="p-6 border-b frontend-card-border">
            <h2 className="text-xl font-semibold frontend-text-primary">สถานะคิวปัจจุบัน</h2>
          </div>
          <div className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 frontend-queue-current rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">{queueProgress.currentNumber}</span>
              </div>
              <p className="text-lg font-medium frontend-text-primary mb-2">คิวที่กำลังให้บริการ</p>
              <p className="frontend-text-secondary">เวลาเฉลี่ยต่อคิว: {queueProgress.averageServiceTime} นาที</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold frontend-text-primary mb-2">สถานะคิวของคุณ</h1>
        <p className="frontend-text-secondary">{shopName}</p>
      </div>

      {/* Queue Status Card */}
      <div className="frontend-card overflow-hidden mb-8">
        <div className="frontend-shop-header text-white p-8 text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold">{customerQueue?.queueNumber}</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">หมายเลขคิวของคุณ</h2>
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(customerQueue?.status || '')}`}>
            <span className="text-xl">{getStatusIcon(customerQueue?.status || '')}</span>
            <span className="font-medium">{getStatusText(customerQueue?.status || '')}</span>
          </div>
        </div>

        <div className="p-8">
          {/* Progress Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 frontend-badge-warning rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">{customerQueue?.position}</span>
              </div>
              <p className="text-sm frontend-text-secondary">ลำดับคิว</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 frontend-badge-info rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">{queueProgress.totalAhead}</span>
              </div>
              <p className="text-sm frontend-text-secondary">คิวข้างหน้า</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 frontend-badge-success rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">{customerQueue?.estimatedWaitTime}</span>
              </div>
              <p className="text-sm frontend-text-secondary">เวลารอ (นาที)</p>
            </div>
          </div>

          {/* Queue Details */}
          <div className="frontend-card-secondary rounded-lg p-6 mb-6">
            <h3 className="font-semibold frontend-text-primary mb-4">รายละเอียดคิว</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="frontend-text-secondary">ชื่อลูกค้า:</span>
                <span className="font-medium frontend-text-primary">{customerQueue?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="frontend-text-secondary">บริการ:</span>
                <span className="font-medium frontend-text-primary">{customerQueue?.services.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="frontend-text-secondary">ราคารวม:</span>
                <span className="font-bold frontend-text-success">฿{customerQueue?.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="frontend-text-secondary">เวลาเข้าคิว:</span>
                <span className="font-medium frontend-text-primary">{customerQueue?.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="frontend-text-secondary">คาดว่าจะถึงคิว:</span>
                <span className="font-medium frontend-text-warning">{queueProgress.estimatedCallTime}</span>
              </div>
            </div>
          </div>

          {/* Queue Information */}
          <div className="frontend-card-secondary p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="frontend-text-secondary text-sm mb-1">คิวปัจจุบัน</p>
                <p className="text-2xl font-bold frontend-text-primary">{queueProgress.currentNumber}</p>
              </div>
              <div>
                <p className="frontend-text-secondary text-sm mb-1">เวลารอโดยประมาณ</p>
                <p className="text-2xl font-bold frontend-queue-current">{customerQueue?.estimatedWaitTime} นาที</p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {customerQueue?.status === 'waiting' && (
            <div className="frontend-status-waiting rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⏳</span>
                <div>
                  <h3 className="font-semibold frontend-text-primary">กรุณารอสักครู่</h3>
                  <p className="frontend-text-secondary text-sm">ระบบกำลังจัดคิวให้คุณ โปรดรอการเรียกจากเจ้าหน้าที่</p>
                </div>
              </div>
            </div>
          )}

          {customerQueue?.status === 'serving' && (
            <div className="frontend-status-serving rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-semibold frontend-text-primary">ถึงคิวของคุณแล้ว!</h3>
                  <p className="frontend-text-secondary text-sm">กรุณาไปที่เคาน์เตอร์เพื่อรับบริการ</p>
                </div>
              </div>
            </div>
          )}

          {customerQueue?.status === 'completed' && (
            <div className="frontend-status-completed rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <h3 className="font-semibold frontend-text-primary">เสร็จสิ้นแล้ว</h3>
                  <p className="frontend-text-secondary text-sm">ขอบคุณที่ใช้บริการ หวังว่าจะได้พบกันอีก</p>
                </div>
              </div>
            </div>
          )}

          {customerQueue?.status === 'cancelled' && (
            <div className="frontend-status-cancelled rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">❌</span>
                <div>
                  <h3 className="font-semibold frontend-text-primary">คิวถูกยกเลิก</h3>
                  <p className="frontend-text-secondary text-sm">คิวของคุณถูกยกเลิกแล้ว สามารถจองคิวใหม่ได้</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {customerQueue?.status === 'waiting' && (
              <button
                onClick={handleCancel}
                className="w-full frontend-button-danger py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                ยกเลิกคิว
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full frontend-button-secondary py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              รีเฟรช
            </button>

            <button
              onClick={() => window.location.href = `/shop/${shopId}`}
              className="w-full frontend-button-primary py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="frontend-card p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">⚠️</span>
              <h3 className="text-xl font-semibold frontend-text-primary mb-2">ยืนยันการยกเลิกคิว</h3>
              <p className="frontend-text-secondary">คุณแน่ใจหรือไม่ที่จะยกเลิกคิว {customerQueue?.queueNumber}?</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 frontend-button-secondary px-4 py-2 rounded-lg font-medium transition-colors"
              >
                ไม่ยกเลิก
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 frontend-button-danger px-4 py-2 rounded-lg font-medium transition-colors"
              >
                ยืนยันยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
