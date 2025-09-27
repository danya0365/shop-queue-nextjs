"use client";

import { QueuePriority } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import { QueueService } from "@/src/presentation/presenters/shop/frontend/CustomerQueueJoinPresenter";

interface PriorityOption {
  value: QueuePriority;
  label: string;
  price: number;
}

interface CustomerFormProps {
  customerName: string;
  customerPhone: string;
  priority: QueuePriority;
  specialRequests: string;
  isLoading: boolean;
  selectedServicesLength: number;
  stateError: string | null;
  priorityOptions: PriorityOption[];
  isShowBackButton?: boolean;
  onBackPressed?: () => void;
  setCustomerName: (value: string) => void;
  setCustomerPhone: (value: string) => void;
  setPriority: (value: QueuePriority) => void;
  setSpecialRequests: (value: string) => void;
  handleSubmit: (data: {
    customerName: string;
    customerPhone: string;
    services: QueueService[];
    specialRequests: string;
    priority: QueuePriority;
  }) => void;
  getSelectedServicesAsQueueServices: () => QueueService[];
}

export function CustomerForm({
  customerName,
  customerPhone,
  priority,
  specialRequests,
  isLoading,
  selectedServicesLength,
  stateError,
  priorityOptions,
  isShowBackButton,
  onBackPressed,
  setCustomerName,
  setCustomerPhone,
  setPriority,
  setSpecialRequests,
  handleSubmit,
  getSelectedServicesAsQueueServices,
}: CustomerFormProps) {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({
      customerName,
      customerPhone,
      services: getSelectedServicesAsQueueServices(),
      specialRequests,
      priority,
    });
  };

  return (
    <div className="shop-frontend-card">
      <div className="p-4 sm:p-6 border-b shop-frontend-card-border">
        <h2 className="text-lg sm:text-xl font-semibold shop-frontend-text-primary">
          ข้อมูลลูกค้า
        </h2>
      </div>
      <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium shop-frontend-text-primary mb-2">
            ชื่อ-นามสกุล *
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full shop-frontend-input min-h-[44px] px-4 py-3 text-base"
            placeholder="กรอกชื่อ-นามสกุล"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium shop-frontend-text-primary mb-2">
            เบอร์โทรศัพท์ *
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full shop-frontend-input min-h-[44px] px-4 py-3 text-base"
            placeholder="08x-xxx-xxxx"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium shop-frontend-text-primary mb-3">
            ความเร่งด่วน
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {priorityOptions.map((option) => (
              <label
                key={option.value}
                className={`relative flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  priority === option.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={option.value}
                  checked={priority === option.value}
                  onChange={(e) => setPriority(e.target.value as QueuePriority)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mb-2 ${
                    priority === option.value
                      ? "border-primary bg-primary"
                      : "border-gray-300"
                  }`}
                >
                  {priority === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium text-sm text-center mb-1">
                  {option.label}
                </span>
                {option.price > 0 ? (
                  <span className="text-xs text-primary font-semibold">
                    +฿{option.price}
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">ฟรี</span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium shop-frontend-text-primary mb-2">
            คำขอพิเศษ (ถ้ามี)
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="w-full shop-frontend-input px-4 py-3 text-base"
            rows={3}
            placeholder="เช่น ไม่ใส่น้ำตาล, เพิ่มน้ำแข็ง"
          />
        </div>

        {stateError && (
          <div className="shop-frontend-status-cancelled rounded-lg p-3 sm:p-4">
            <p className="shop-frontend-text-danger text-sm sm:text-base">
              {stateError}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {isShowBackButton && (
            <button
              type="button"
              onClick={onBackPressed}
              disabled={isLoading}
              className="flex-1 shop-frontend-button-secondary px-4 sm:px-6 py-4 sm:py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[52px] text-base sm:text-sm"
            >
              {isLoading ? (
                <span className="animate-spin text-base">⏳</span>
              ) : (
                <span className="text-base sm:text-sm">←</span>
              )}
              <span className="text-base sm:text-sm">ย้อนกลับ</span>
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || selectedServicesLength === 0}
            className={`${
              isShowBackButton ? "flex-1" : "w-full"
            } shop-frontend-button-join-queue px-4 sm:px-6 py-4 sm:py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] text-base sm:text-sm`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <span className="animate-spin text-base">⏳</span>
                <span className="text-base sm:text-sm">กำลังเข้าคิว...</span>
              </span>
            ) : (
              <span className="text-base sm:text-sm">🎫 ยืนยันเข้าคิว</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
