"use client";

import type {
  CreatePaymentParams,
  PaymentMethod,
} from "@/src/application/dtos/shop/backend/payments-dto";
import { PaymentStatus } from "@/src/application/dtos/shop/backend/payments-dto";
import { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: CreatePaymentParams) => Promise<void>;
  queue: {
    id: string;
    queueNumber: string;
    customerName: string;
    customerPhone: string;
    status: string;
    queueServices: Array<{
      serviceName: string;
      price: number;
      quantity: number;
    }>;
  };
  shopId: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSubmit,
  queue,
  shopId,
}: PaymentModalProps) {
  // Form state
  const [formData, setFormData] = useState<{
    totalAmount: number;
    paidAmount: number;
    paymentMethod: PaymentMethod | "";
    paymentStatus: PaymentStatus;
    processedByEmployeeId: string;
    paymentDate: string;
  }>({
    totalAmount: queue.queueServices.reduce(
      (sum, service) => sum + service.price * service.quantity,
      0
    ),
    paidAmount: 0,
    paymentMethod: "",
    paymentStatus: PaymentStatus.UNPAID,
    processedByEmployeeId: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total amount from services
  const calculateTotalAmount = () => {
    return queue.queueServices.reduce(
      (sum, service) => sum + service.price * service.quantity,
      0
    );
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "กรุณาเลือกวิธีการชำระเงิน";
    }

    if (formData.paidAmount < 0) {
      newErrors.paidAmount = "จำนวนเงินที่ชำระต้องไม่ติดลบ";
    }

    if (formData.paidAmount > formData.totalAmount) {
      newErrors.paidAmount = "จำนวนเงินที่ชำระต้องไม่เกินจำนวนเงินทั้งหมด";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when field is changed
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Auto-update payment status based on paid amount
    if (field === "paidAmount") {
      const paidAmount = Number(value);
      const totalAmount = formData.totalAmount;

      if (paidAmount === 0) {
        setFormData((prev) => ({
          ...prev,
          paymentStatus: PaymentStatus.UNPAID,
        }));
      } else if (paidAmount < totalAmount) {
        setFormData((prev) => ({
          ...prev,
          paymentStatus: PaymentStatus.PARTIAL,
        }));
      } else if (paidAmount === totalAmount) {
        setFormData((prev) => ({ ...prev, paymentStatus: PaymentStatus.PAID }));
      }
    }
  };

  // Quick payment functions
  const handleQuickPayment = (amount: number) => {
    const newPaidAmount = Math.min(amount, formData.totalAmount);
    handleInputChange("paidAmount", newPaidAmount);
  };

  const handleFullPayment = () => {
    handleInputChange("paidAmount", formData.totalAmount);
  };

  const handlePercentagePayment = (percentage: number) => {
    const amount = Math.round((formData.totalAmount * percentage) / 100);
    handleInputChange("paidAmount", amount);
  };

  // Calculate remaining amount
  const remainingAmount = formData.totalAmount - formData.paidAmount;
  const paymentPercentage = formData.totalAmount > 0 
    ? Math.round((formData.paidAmount / formData.totalAmount) * 100) 
    : 0;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentData: CreatePaymentParams = {
        queueId: queue.id,
        totalAmount: formData.totalAmount,
        paidAmount: formData.paidAmount,
        paymentMethod: formData.paymentMethod || undefined,
        paymentStatus: formData.paymentStatus,
        paymentDate: formData.paymentDate,
        processedByEmployeeId: formData.processedByEmployeeId || undefined,
        shopId,
      };

      await onSubmit(paymentData);

      // Reset form and close modal
      setFormData({
        totalAmount: calculateTotalAmount(),
        paidAmount: 0,
        paymentMethod: "" as PaymentMethod | "",
        paymentStatus: "unpaid" as PaymentStatus,
        processedByEmployeeId: "",
        paymentDate: new Date().toISOString().split("T")[0],
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error creating payment:", error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal closes
  const handleModalClose = () => {
    setFormData({
      totalAmount: calculateTotalAmount(),
      paidAmount: 0,
      paymentMethod: "",
      paymentStatus: PaymentStatus.UNPAID,
      processedByEmployeeId: "",
      paymentDate: new Date().toISOString().split("T")[0],
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleModalClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              ชำระเงินคิว {queue.queueNumber}
            </h2>
            <button
              onClick={handleModalClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Queue Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              ข้อมูลคิว
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                หมายเลขคิว:{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {queue.queueNumber}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                ลูกค้า:{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {queue.customerName}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                โทรศัพท์:{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {queue.customerPhone}
                </span>
              </p>
              <div className="mt-2">
                <p className="text-gray-600 dark:text-gray-400 mb-1">บริการ:</p>
                <div className="space-y-1">
                  {queue.queueServices.map((service, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {service.serviceName} x{service.quantity}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        ฿{(service.price * service.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              จำนวนเงินทั้งหมด
            </label>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ฿{formData.totalAmount.toLocaleString()}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              วิธีการชำระเงิน <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                handleInputChange(
                  "paymentMethod",
                  e.target.value as PaymentMethod
                )
              }
              className={`w-full border ${
                errors.paymentMethod
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
            >
              <option value="">เลือกวิธีการชำระเงิน</option>
              <option value="cash">เงินสด</option>
              <option value="card">บัตรเครดิต/เดบิต</option>
              <option value="qr">QR Code</option>
              <option value="transfer">โอนเงิน</option>
            </select>
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          {/* Paid Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              จำนวนเงินที่ชำระ
            </label>
            <input
              type="number"
              max={formData.totalAmount}
              step="0.01"
              value={formData.paidAmount}
              onChange={(e) => handleInputChange("paidAmount", e.target.value)}
              className={`w-full border ${
                errors.paidAmount
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              placeholder="0.00"
            />
            {errors.paidAmount && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.paidAmount}
              </p>
            )}

            {/* Payment Shortcuts */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                ชำระเงินด่วน
              </p>
              <div className="grid grid-cols-2 gap-2">
                {/* Full Payment Button */}
                <button
                  type="button"
                  onClick={handleFullPayment}
                  className="px-3 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                >
                  <span>ชำระเต็มจำนวน</span>
                  <span className="text-xs">(฿{formData.totalAmount.toLocaleString()})</span>
                </button>

                {/* 50% Payment Button */}
                <button
                  type="button"
                  onClick={() => handlePercentagePayment(50)}
                  className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                >
                  <span>ชำระ 50%</span>
                  <span className="text-xs">(฿{Math.round(formData.totalAmount * 0.5).toLocaleString()})</span>
                </button>

                {/* Fixed Amount Buttons */}
                {[100, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickPayment(amount)}
                    disabled={amount > formData.totalAmount}
                    className={`px-3 py-2 rounded-lg hover:opacity-80 transition-colors text-sm font-medium flex items-center justify-center space-x-1 ${
                      amount > formData.totalAmount
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                    }`}
                  >
                    <span>฿{amount.toLocaleString()}</span>
                    {amount > formData.totalAmount && (
                      <span className="text-xs">(เกินจำนวน)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              สถานะการชำระเงิน
            </label>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>ความคืบหน้าการชำระเงิน</span>
                <span>{paymentPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    paymentPercentage === 0
                      ? "bg-red-500"
                      : paymentPercentage < 100
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(paymentPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formData.paymentStatus === "unpaid"
                      ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      : formData.paymentStatus === "partial"
                      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                      : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  }`}
                >
                  {formData.paymentStatus === "unpaid" && "ยังไม่ได้ชำระ"}
                  {formData.paymentStatus === "partial" && "ชำระเงินบางส่วน"}
                  {formData.paymentStatus === "paid" && "ชำระเงินเสร็จสิ้น"}
                </span>
                {formData.paidAmount > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ฿{formData.paidAmount.toLocaleString()} / ฿
                    {formData.totalAmount.toLocaleString()}
                  </span>
                )}
              </div>
              
              {remainingAmount > 0 && (
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">คงเหลือ</p>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    ฿{remainingAmount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              วันที่ชำระเงิน
            </label>
            <input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => handleInputChange("paymentDate", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Processed By Employee - Simplified for now */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              พนักงานที่รับชำระเงิน
            </label>
            <input
              type="text"
              value={formData.processedByEmployeeId}
              onChange={(e) =>
                handleInputChange("processedByEmployeeId", e.target.value)
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="รหัสพนักงาน"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleModalClose}
              className="flex-1 px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกการชำระเงิน"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
