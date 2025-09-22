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
      <div className="p-6 border-b frontend-card-border">
        <h2 className="text-xl font-semibold frontend-text-primary">
          ข้อมูลลูกค้า
        </h2>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium frontend-text-primary mb-1">
            ชื่อ-นามสกุล *
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full frontend-input"
            placeholder="กรอกชื่อ-นามสกุล"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium frontend-text-primary mb-1">
            เบอร์โทรศัพท์ *
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full frontend-input"
            placeholder="08x-xxx-xxxx"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium frontend-text-primary mb-1">
            ความเร่งด่วน
          </label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as QueuePriority)
            }
            className="w-full frontend-input"
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
          <label className="block text-sm font-medium frontend-text-primary mb-1">
            คำขอพิเศษ (ถ้ามี)
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="w-full frontend-input"
            rows={3}
            placeholder="เช่น ไม่ใส่น้ำตาล, เพิ่มน้ำแข็ง"
          />
        </div>

        {stateError && (
          <div className="frontend-status-cancelled rounded-lg p-3">
            <p className="frontend-text-danger text-sm">{stateError}</p>
          </div>
        )}

        <div className="flex flex-row gap-3">
          {isShowBackButton && (
            <button
              type="button"
              onClick={onBackPressed}
              disabled={isLoading}
              className="flex-1 frontend-button-secondary px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <span>←</span>
              )}
              <span>ย้อนกลับ</span>
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || selectedServicesLength === 0}
            className={`${isShowBackButton ? 'flex-1' : 'w-full'} frontend-button-join-queue px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <span className="animate-spin">⏳</span>
                <span>กำลังเข้าคิว...</span>
              </span>
            ) : (
              "🎫 ยืนยันเข้าคิว"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
