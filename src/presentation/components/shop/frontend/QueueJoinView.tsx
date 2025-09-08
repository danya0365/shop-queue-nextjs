'use client';

import { QueueJoinViewModel } from '@/src/presentation/presenters/shop/frontend/QueueJoinPresenter';
import { useQueueJoinPresenter } from '@/src/presentation/presenters/shop/frontend/useQueueJoinPresenter';
import { useState } from 'react';

interface QueueJoinViewProps {
  viewModel: QueueJoinViewModel;
  shopId: string;
}

export function QueueJoinView({ viewModel, shopId }: QueueJoinViewProps) {
  const { services, categories, estimatedWaitTime, currentQueueLength, shopName, isAcceptingQueues } = viewModel;
  const [state, actions] = useQueueJoinPresenter({ shopId });
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');

  const filteredServices = selectedCategory === 'ทั้งหมด'
    ? services
    : services.filter(service => service.category === selectedCategory);

  const handleServiceToggle = (serviceId: string) => {
    if (state.selectedServices.includes(serviceId)) {
      actions.removeService(serviceId);
    } else {
      actions.addService(serviceId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await actions.joinQueue({
      customerName,
      customerPhone,
      services: state.selectedServices,
      specialRequests,
      priority,
    });

    if (success) {
      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setSpecialRequests('');
      setPriority('normal');
    }
  };

  if (state.isSuccess && state.queueNumber) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8 text-center">
            <span className="text-6xl mb-4 block">🎉</span>
            <h1 className="text-3xl font-bold mb-2">เข้าคิวสำเร็จ!</h1>
            <p className="text-green-100">คุณได้รับหมายเลขคิวแล้ว</p>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-blue-600">{state.queueNumber}</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">หมายเลขคิวของคุณ</h2>
              <p className="text-gray-600">กรุณาจำหมายเลขนี้ไว้</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">รายละเอียดคิว</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ชื่อ:</span>
                  <span className="font-medium">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">เบอร์โทร:</span>
                  <span className="font-medium">{customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนบริการ:</span>
                  <span className="font-medium">{state.selectedServices.length} รายการ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ราคารวม:</span>
                  <span className="font-bold text-green-600">฿{state.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">เวลารอโดยประมาณ:</span>
                  <span className="font-medium text-orange-600">{estimatedWaitTime} นาที</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={() => window.location.href = `/shop/${shopId}/status`}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                📱 ติดตามสถานะคิว
              </button>
              <button
                onClick={actions.reset}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                🔄 เข้าคิวใหม่
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAcceptingQueues) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <span className="text-6xl mb-4 block">😔</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ขณะนี้ไม่รับคิวเพิ่ม</h1>
          <p className="text-gray-600 mb-6">ร้านอาจปิดแล้วหรือคิวเต็ม กรุณาลองใหม่ภายหลัง</p>
          <button
            onClick={() => window.location.href = `/shop/${shopId}`}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">เข้าคิว - {shopName}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>คิวปัจจุบัน: {currentQueueLength} คิว</span>
          <span>•</span>
          <span>เวลารอโดยประมาณ: {estimatedWaitTime} นาที</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">เลือกบริการ</h2>
            </div>

            {/* Category Filter */}
            <div className="p-6 border-b">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('ทั้งหมด')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === 'ทั้งหมด'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  ทั้งหมด
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${!service.available
                        ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50'
                        : state.selectedServices.includes(service.id)
                          ? 'bg-purple-50 border-purple-500 shadow-md'
                          : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-sm'
                      }`}
                    onClick={() => service.available && handleServiceToggle(service.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{service.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          {state.selectedServices.includes(service.id) && (
                            <span className="text-purple-500">✓</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-purple-600">฿{service.price}</span>
                          <span className="text-gray-500">~{service.estimatedTime} นาที</span>
                        </div>
                        {!service.available && (
                          <span className="text-xs text-red-500 mt-1 block">ไม่พร้อมให้บริการ</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Form */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">สรุปคำสั่ง</h2>
            </div>
            <div className="p-6">
              {state.selectedServices.length === 0 ? (
                <p className="text-gray-500 text-center py-4">ยังไม่ได้เลือกบริการ</p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {state.selectedServices.map((serviceId) => {
                      const service = services.find(s => s.id === serviceId);
                      return service ? (
                        <div key={serviceId} className="flex justify-between text-sm">
                          <span>{service.name}</span>
                          <span>฿{service.price}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>รวม:</span>
                      <span className="text-purple-600">฿{state.totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>เวลาโดยประมาณ:</span>
                      <span>{state.estimatedTime} นาที</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Form */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">ข้อมูลลูกค้า</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="กรอกชื่อ-นามสกุล"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทรศัพท์ *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="08x-xxx-xxxx"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ความเร่งด่วน
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="normal">ปกติ</option>
                  <option value="urgent">เร่งด่วน (+฿20)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  คำขอพิเศษ (ถ้ามี)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="เช่น ไม่ใส่น้ำตาล, เพิ่มน้ำแข็ง"
                />
              </div>

              {state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{state.error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={state.isLoading || state.selectedServices.length === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="animate-spin">⏳</span>
                    <span>กำลังเข้าคิว...</span>
                  </span>
                ) : (
                  '🎫 ยืนยันเข้าคิว'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
