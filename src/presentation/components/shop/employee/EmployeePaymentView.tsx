'use client';

import type { EmployeePaymentViewModel, PaymentQueue } from '@/src/presentation/presenters/shop/employee/EmployeePaymentPresenter';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ชำระเงิน</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">จัดการการชำระเงินและออกใบเสร็จ</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">ยอดขายวันนี้</p>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('ready')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'ready'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                รอชำระเงิน ({viewModel.readyQueues.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'completed'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    ไม่มีคิวที่รอชำระเงิน
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">คิวทั้งหมดได้ชำระเงินเรียบร้อยแล้ว</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {viewModel.readyQueues.map((queue) => (
                    <div
                      key={queue.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-sm font-medium px-2.5 py-0.5 rounded">
                              คิว {queue.queueNumber}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${queue.paymentStatus === 'unpaid'
                                ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200'
                                : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200'
                              }`}>
                              {queue.paymentStatus === 'unpaid' ? 'ยังไม่ชำระ' : 'ชำระบางส่วน'}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {queue.customerName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {queue.customerPhone}
                          </p>

                          {/* Services */}
                          <div className="space-y-1 mb-3">
                            {queue.services.map((service) => (
                              <div key={service.id} className="flex justify-between text-sm text-gray-900 dark:text-gray-100">
                                <span>{service.name} x{service.quantity}</span>
                                <span>฿{service.total}</span>
                              </div>
                            ))}
                          </div>

                          {/* Payment Summary */}
                          <div className="border-t border-gray-200 dark:border-gray-600 pt-2 space-y-1">
                            <div className="flex justify-between text-sm text-gray-900 dark:text-gray-100">
                              <span>ยอดรวม</span>
                              <span>฿{queue.subtotal}</span>
                            </div>
                            {queue.discount > 0 && (
                              <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                <span>ส่วนลด</span>
                                <span>-฿{queue.discount}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm text-gray-900 dark:text-gray-100">
                              <span>ภาษี</span>
                              <span>฿{queue.tax}</span>
                            </div>
                            <div className="flex justify-between font-medium text-lg border-t border-gray-200 dark:border-gray-600 pt-1 text-gray-900 dark:text-gray-100">
                              <span>รวมทั้งสิ้น</span>
                              <span className="text-blue-600 dark:text-blue-400">฿{queue.total}</span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4">
                          <button
                            onClick={() => handleProcessPayment(queue)}
                            className="bg-green-600 dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors"
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    ยังไม่มีการชำระเงิน
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">รายการชำระเงินจะแสดงที่นี่</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {viewModel.completedPayments.map((queue) => (
                    <div
                      key={queue.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium px-2.5 py-0.5 rounded">
                              คิว {queue.queueNumber}
                            </span>
                            <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                              ชำระแล้ว
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {queue.completedAt}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {queue.customerName}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              ชำระเงิน - คิว {selectedQueue.queueNumber}
            </h3>

            {/* Payment Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">ยอดที่ต้องชำระ</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ฿{selectedQueue.total}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedQueue.customerName}
              </p>
            </div>

            {/* Payment Methods */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                วิธีการชำระเงิน
              </label>
              <div className="grid grid-cols-2 gap-2">
                {viewModel.paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    disabled={!method.available}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200'
                        : method.available
                          ? 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  จำนวนเงินที่รับ
                </label>
                <input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
                {calculateChange() > 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    เงินทอน: ฿{calculateChange().toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={!paymentMethod}
                className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
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
