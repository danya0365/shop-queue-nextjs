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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ติดตามสถานะคิว</h1>
          <p className="text-gray-600">{shopName}</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="text-center mb-6">
            <span className="text-6xl mb-4 block">🔍</span>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">ค้นหาคิวของคุณ</h2>
            <p className="text-gray-600">กรอกหมายเลขคิวเพื่อติดตามสถานะ</p>
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
                className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        {/* Current Queue Info */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">สถานะคิวปัจจุบัน</h2>
          </div>
          <div className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">{queueProgress.currentNumber}</span>
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">คิวที่กำลังให้บริการ</p>
              <p className="text-gray-600">เวลาเฉลี่ยต่อคิว: {queueProgress.averageServiceTime} นาที</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">สถานะคิวของคุณ</h1>
        <p className="text-gray-600">{shopName}</p>
      </div>

      {/* Queue Status Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-8 text-center">
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
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-orange-600">{customerQueue?.position}</span>
              </div>
              <p className="text-sm text-gray-600">ลำดับคิว</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">{queueProgress.totalAhead}</span>
              </div>
              <p className="text-sm text-gray-600">คิวข้างหน้า</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">{customerQueue?.estimatedWaitTime}</span>
              </div>
              <p className="text-sm text-gray-600">เวลารอ (นาที)</p>
            </div>
          </div>

          {/* Queue Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">รายละเอียดคิว</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">ชื่อลูกค้า:</span>
                <span className="font-medium">{customerQueue?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">บริการ:</span>
                <span className="font-medium">{customerQueue?.services.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ราคารวม:</span>
                <span className="font-bold text-green-600">฿{customerQueue?.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">เวลาเข้าคิว:</span>
                <span className="font-medium">{customerQueue?.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">คาดว่าจะถึงคิว:</span>
                <span className="font-medium text-orange-600">{queueProgress.estimatedCallTime}</span>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {customerQueue?.status === 'waiting' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⏳</span>
                <div>
                  <p className="font-medium text-orange-800">รอการยืนยันจากร้าน</p>
                  <p className="text-sm text-orange-600">ร้านจะยืนยันคิวของคุณในไม่ช้า</p>
                </div>
              </div>
            </div>
          )}

          {customerQueue?.status === 'confirmed' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-medium text-blue-800">คิวได้รับการยืนยันแล้ว</p>
                  <p className="text-sm text-blue-600">กรุณารอจนกว่าจะถึงคิวของคุณ</p>
                </div>
              </div>
            </div>
          )}

          {customerQueue?.status === 'serving' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🛎️</span>
                <div>
                  <p className="font-medium text-green-800">ถึงคิวของคุณแล้ว!</p>
                  <p className="text-sm text-green-600">กรุณามาที่เคาน์เตอร์เพื่อรับบริการ</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            {customerQueue?.status === 'serving' && (
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                🏃‍♂️ ไปรับบริการ
              </button>
            )}

            {canCancel && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                ❌ ยกเลิกคิว
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              🔄 รีเฟรชสถานะ
            </button>

            <button
              onClick={() => window.location.href = `/shop/${shopId}`}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
            >
              🏠 กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">⚠️</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ยืนยันการยกเลิกคิว</h3>
              <p className="text-gray-600">คุณแน่ใจหรือไม่ที่จะยกเลิกคิว {customerQueue?.queueNumber}?</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                ไม่ยกเลิก
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
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
