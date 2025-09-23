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
    <div className="frontend-card">
      <div className="p-4 sm:p-6 border-b frontend-card-border">
        <h2 className="text-lg sm:text-xl font-semibold frontend-text-primary">
          ข้อมูลลูกค้า
        </h2>
      </div>
      <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium frontend-text-primary mb-2">
            ชื่อ-นามสกุล *
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full frontend-input min-h-[44px] px-4 py-3 text-base"
            placeholder="กรอกชื่อ-นามสกุล"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium frontend-text-primary mb-2">
            เบอร์โทรศัพท์ *
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full frontend-input min-h-[44px] px-4 py-3 text-base"
            placeholder="08x-xxx-xxxx"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium frontend-text-primary mb-2">
            ความเร่งด่วน
          </label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as QueuePriority)
            }
            className="w-full frontend-input min-h-[44px] px-4 py-3 text-base"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
                {option.price > 0 && ` (+฿${option.price})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium frontend-text-primary mb-2">
            คำขอพิเศษ (ถ้ามี)
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="w-full frontend-input px-4 py-3 text-base"
            rows={3}
            placeholder="เช่น ไม่ใส่น้ำตาล, เพิ่มน้ำแข็ง"
          />
        </div>

        {stateError && (
          <div className="frontend-status-cancelled rounded-lg p-3 sm:p-4">
            <p className="frontend-text-danger text-sm sm:text-base">{stateError}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {isShowBackButton && (
            <button
              type="button"
              onClick={onBackPressed}
              disabled={isLoading}
              className="flex-1 frontend-button-secondary px-4 sm:px-6 py-4 sm:py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[52px] text-base sm:text-sm"
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
            className={`${isShowBackButton ? 'flex-1' : 'w-full'} frontend-button-join-queue px-4 sm:px-6 py-4 sm:py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] text-base sm:text-sm`}
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
