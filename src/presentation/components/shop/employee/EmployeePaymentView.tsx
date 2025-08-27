'use client';

import React, { useState } from 'react';
import type { EmployeePaymentViewModel, PaymentQueue, PaymentMethod } from '@/src/presentation/presenters/shop/employee/EmployeePaymentPresenter';

interface EmployeePaymentViewProps {
  viewModel: EmployeePaymentViewModel;
}

export function EmployeePaymentView({ viewModel }: EmployeePaymentViewProps) {
  const [activeTab, setActiveTab] = useState<'ready' | 'completed'>('ready');
  const [selectedQueue, setSelectedQueue] = useState<PaymentQueue | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleProcessPayment = (queue: PaymentQueue) => {
    setSelectedQueue(queue);
    setPaymentMethod('');
    setReceivedAmount(queue.total.toString());
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (selectedQueue && paymentMethod) {
      // Mock payment processing
      console.log('Processing payment:', {
        queueId: selectedQueue.id,
        method: paymentMethod,
        amount: receivedAmount,
      });
      setShowPaymentModal(false);
      setSelectedQueue(null);
    }
  };

  const calculateChange = () => {
    if (!selectedQueue || !receivedAmount) return 0;
    return Math.max(0, parseFloat(receivedAmount) - selectedQueue.total);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ชำระเงิน</h1>
                <p className="text-sm text-gray-600">จัดการการชำระเงินและออกใบเสร็จ</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">ยอดขายวันนี้</p>
                <p className="text-2xl font-bold text-green-600">
                  ฿{viewModel.totalSales.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('ready')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ready'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                รอชำระเงิน ({viewModel.readyQueues.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ชำระแล้ว ({viewModel.completedPayments.length})
              </button>
            </nav>
          </div>

          {/* Ready Queues Tab */}
          {activeTab === 'ready' && (
            <div className="p-6">
              {viewModel.readyQueues.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">💳</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ไม่มีคิวที่รอชำระเงิน
                  </h3>
                  <p className="text-gray-600">คิวทั้งหมดได้ชำระเงินเรียบร้อยแล้ว</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {viewModel.readyQueues.map((queue) => (
                    <div
                      key={queue.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                              คิว {queue.queueNumber}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              queue.paymentStatus === 'unpaid' 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {queue.paymentStatus === 'unpaid' ? 'ยังไม่ชำระ' : 'ชำระบางส่วน'}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {queue.customerName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {queue.customerPhone}
                          </p>

                          {/* Services */}
                          <div className="space-y-1 mb-3">
                            {queue.services.map((service) => (
                              <div key={service.id} className="flex justify-between text-sm">
                                <span>{service.name} x{service.quantity}</span>
                                <span>฿{service.total}</span>
                              </div>
                            ))}
                          </div>

                          {/* Payment Summary */}
                          <div className="border-t pt-2 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>ยอดรวม</span>
                              <span>฿{queue.subtotal}</span>
                            </div>
                            {queue.discount > 0 && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>ส่วนลด</span>
                                <span>-฿{queue.discount}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span>ภาษี</span>
                              <span>฿{queue.tax}</span>
                            </div>
                            <div className="flex justify-between font-medium text-lg border-t pt-1">
                              <span>รวมทั้งสิ้น</span>
                              <span className="text-blue-600">฿{queue.total}</span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4">
                          <button
                            onClick={() => handleProcessPayment(queue)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            ชำระเงิน
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Completed Payments Tab */}
          {activeTab === 'completed' && (
            <div className="p-6">
              {viewModel.completedPayments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ยังไม่มีการชำระเงิน
                  </h3>
                  <p className="text-gray-600">รายการชำระเงินจะแสดงที่นี่</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {viewModel.completedPayments.map((queue) => (
                    <div
                      key={queue.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                              คิว {queue.queueNumber}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              ชำระแล้ว
                            </span>
                            <span className="text-xs text-gray-500">
                              {queue.completedAt}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {queue.customerName}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>฿{queue.total}</span>
                            <span className="flex items-center gap-1">
                              {queue.paymentMethod === 'cash' && '💵'}
                              {queue.paymentMethod === 'card' && '💳'}
                              {queue.paymentMethod === 'qr' && '📱'}
                              {queue.paymentMethod === 'transfer' && '🏦'}
                              {queue.paymentMethod === 'cash' && 'เงินสด'}
                              {queue.paymentMethod === 'card' && 'บัตรเครดิต'}
                              {queue.paymentMethod === 'qr' && 'QR Code'}
                              {queue.paymentMethod === 'transfer' && 'โอนเงิน'}
                            </span>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          พิมพ์ใบเสร็จ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedQueue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ชำระเงิน - คิว {selectedQueue.queueNumber}
            </h3>

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">ยอดที่ต้องชำระ</span>
                <span className="text-xl font-bold text-blue-600">
                  ฿{selectedQueue.total}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {selectedQueue.customerName}
              </p>
            </div>

            {/* Payment Methods */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วิธีการชำระเงิน
              </label>
              <div className="grid grid-cols-2 gap-2">
                {viewModel.paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    disabled={!method.available}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : method.available
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{method.icon}</span>
                      <span>{method.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            {paymentMethod === 'cash' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  จำนวนเงินที่รับ
                </label>
                <input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
                {calculateChange() > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    เงินทอน: ฿{calculateChange().toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={!paymentMethod}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                ยืนยันการชำระ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
