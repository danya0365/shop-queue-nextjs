"use client";

import type {
  EmployeePaymentViewModel,
  PaymentQueue,
} from "@/src/presentation/presenters/shop/employee/EmployeePaymentPresenter";
import { useState } from "react";

interface EmployeePaymentViewProps {
  viewModel: EmployeePaymentViewModel;
}

export function EmployeePaymentView({ viewModel }: EmployeePaymentViewProps) {
  const [activeTab, setActiveTab] = useState<"ready" | "completed">("ready");
  const [selectedQueue, setSelectedQueue] = useState<PaymentQueue | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleProcessPayment = (queue: PaymentQueue) => {
    setSelectedQueue(queue);
    setPaymentMethod("");
    setReceivedAmount(queue.total.toString());
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (selectedQueue && paymentMethod) {
      // Mock payment processing
      console.log("Processing payment:", {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold shop-employee-header-text">
            ชำระเงิน
          </h1>
          <p className="shop-employee-header-text-muted mt-1">
            จัดการการชำระเงินและออกใบเสร็จ
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm shop-employee-text-muted">
            ยอดขายวันนี้
          </p>
          <p className="text-2xl font-bold shop-employee-payment-discount">
            ฿{viewModel.totalSales.toLocaleString()}
          </p>
        </div>
      </div>
      {/* Tabs */}
      <div className="shop-employee-card rounded-xl shadow-sm">
        <div className="border-b shop-employee-sidebar-border">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("ready")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "ready"
                  ? "shop-employee-tab-active shop-employee-primary"
                  : "shop-employee-tab-inactive shop-employee-text-muted shop-employee-primary-hover"
              }`}
            >
              รอชำระเงิน ({viewModel.readyQueues.length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "completed"
                  ? "shop-employee-tab-active shop-employee-primary"
                  : "shop-employee-tab-inactive shop-employee-text-muted shop-employee-primary-hover"
              }`}
            >
              ชำระแล้ว ({viewModel.completedPayments.length})
            </button>
          </nav>
        </div>

        {/* Ready Queues Tab */}
        {activeTab === "ready" && (
          <div className="p-6">
            {viewModel.readyQueues.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-8xl mb-6 block">💳</span>
                <h3 className="text-2xl font-bold shop-employee-text mb-4">
                  ไม่มีคิวที่รอชำระเงิน
                </h3>
                <p className="shop-employee-text-muted">
                  คิวทั้งหมดได้ชำระเงินเรียบร้อยแล้ว
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {viewModel.readyQueues.map((queue) => (
                  <div
                    key={queue.id}
                    className="border rounded-lg shop-employee-payment-card shop-employee-payment-card-hover transition-colors p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="shop-employee-payment-queue-number text-sm font-medium px-2.5 py-0.5 rounded">
                            คิว {queue.queueNumber}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              queue.paymentStatus === "unpaid"
                                ? "shop-employee-payment-unpaid"
                                : "shop-employee-payment-partial"
                            }`}
                          >
                            {queue.paymentStatus === "unpaid"
                              ? "ยังไม่ชำระ"
                              : "ชำระบางส่วน"}
                          </span>
                        </div>
                        <h3 className="font-medium shop-employee-text mb-1">
                          {queue.customerName}
                        </h3>
                        <p className="text-sm shop-employee-text-muted mb-3">
                          {queue.customerPhone}
                        </p>

                        {/* Services */}
                        <div className="space-y-1 mb-3">
                          {queue.services.map((service) => (
                            <div
                              key={service.id}
                              className="flex justify-between text-sm shop-employee-text"
                            >
                              <span>
                                {service.name} x{service.quantity}
                              </span>
                              <span>฿{service.total}</span>
                            </div>
                          ))}
                        </div>

                        {/* Payment Summary */}
                        <div className="border-t shop-employee-payment-card-border pt-2 space-y-1">
                          <div className="flex justify-between text-sm shop-employee-text">
                            <span>ยอดรวม</span>
                            <span>฿{queue.subtotal}</span>
                          </div>
                          {queue.discount > 0 && (
                            <div className="flex justify-between text-sm shop-employee-payment-discount">
                              <span>ส่วนลด</span>
                              <span>-฿{queue.discount}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm shop-employee-text">
                            <span>ภาษี</span>
                            <span>฿{queue.tax}</span>
                          </div>
                          <div className="flex justify-between font-medium text-lg border-t shop-employee-payment-card-border pt-1 shop-employee-text">
                            <span>รวมทั้งสิ้น</span>
                            <span className="shop-employee-payment-total">
                              ฿{queue.total}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4">
                        <button
                          onClick={() => handleProcessPayment(queue)}
                          className="shop-employee-button-primary text-white px-4 py-2 rounded-lg transition-colors"
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
        {activeTab === "completed" && (
          <div className="p-6">
            {viewModel.completedPayments.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-8xl mb-6 block">📋</span>
                <h3 className="text-2xl font-bold shop-employee-text mb-4">
                  ยังไม่มีการชำระเงิน
                </h3>
                <p className="shop-employee-text-muted">
                  รายการชำระเงินจะแสดงที่นี่
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {viewModel.completedPayments.map((queue) => (
                  <div
                    key={queue.id}
                    className="border rounded-lg shop-employee-payment-card shop-employee-payment-card-hover transition-colors p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="shop-employee-payment-completed-queue text-sm font-medium px-2.5 py-0.5 rounded">
                            คิว {queue.queueNumber}
                          </span>
                          <span className="shop-employee-payment-completed text-xs px-2 py-1 rounded-full">
                            ชำระแล้ว
                          </span>
                          <span className="text-xs shop-employee-text-muted">
                            {queue.completedAt}
                          </span>
                        </div>
                        <h3 className="font-medium shop-employee-text mb-1">
                          {queue.customerName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm shop-employee-text-muted">
                          <span>฿{queue.total}</span>
                          <span className="flex items-center gap-1">
                            {queue.paymentMethod === "cash" && "💵"}
                            {queue.paymentMethod === "card" && "💳"}
                            {queue.paymentMethod === "qr" && "📱"}
                            {queue.paymentMethod === "transfer" && "🏦"}
                            {queue.paymentMethod === "cash" && "เงินสด"}
                            {queue.paymentMethod === "card" && "บัตรเครดิต"}
                            {queue.paymentMethod === "qr" && "QR Code"}
                            {queue.paymentMethod === "transfer" && "โอนเงิน"}
                          </span>
                        </div>
                      </div>
                      <button className="shop-employee-payment-print-button shop-employee-payment-print-button-hover text-sm">
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

      {/* Payment Modal */}
      {showPaymentModal && selectedQueue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="shop-employee-card rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold shop-employee-text mb-4">
              ชำระเงิน - คิว {selectedQueue.queueNumber}
            </h3>

            {/* Payment Summary */}
            <div className="shop-employee-payment-modal-bg rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium shop-employee-text">
                  ยอดที่ต้องชำระ
                </span>
                <span className="text-xl font-bold shop-employee-payment-total">
                  ฿{selectedQueue.total}
                </span>
              </div>
              <p className="text-sm shop-employee-text-muted">
                {selectedQueue.customerName}
              </p>
            </div>

            {/* Payment Methods */}
            <div className="mb-4">
              <label className="block text-sm font-medium shop-employee-text mb-2">
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
                        ? "shop-employee-payment-method-selected"
                        : method.available
                        ? "shop-employee-payment-method-available shop-employee-payment-method-available-hover shop-employee-text"
                        : "shop-employee-payment-method-disabled cursor-not-allowed"
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
            {paymentMethod === "cash" && (
              <div className="mb-4">
                <label className="block text-sm font-medium shop-employee-text mb-2">
                  จำนวนเงินที่รับ
                </label>
                <input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg shop-employee-payment-input shop-employee-text focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="0.00"
                />
                {calculateChange() > 0 && (
                  <p className="text-sm shop-employee-payment-change-text mt-1">
                    เงินทอน: ฿{calculateChange().toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 shop-employee-button-secondary rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={!paymentMethod}
                className="flex-1 px-4 py-2 shop-employee-button-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
