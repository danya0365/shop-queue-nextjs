"use client";

import { QueuePriority } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import { useCustomerQueueJoinPresenter } from "@/src/presentation/presenters/shop/frontend/useCustomerQueueJoinPresenter";
import { cn } from "@/src/utils/cn";
import { useState } from "react";
import StickyBox from "react-sticky-box";

interface CustomerQueueJoinViewProps {
  shopId: string;
  initialViewModel?: import("@/src/presentation/presenters/shop/frontend/CustomerQueueJoinPresenter").CustomerQueueJoinViewModel;
}

export function CustomerQueueJoinView({
  shopId,
  initialViewModel,
}: CustomerQueueJoinViewProps) {
  const {
    viewModel,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    specialRequests,
    setSpecialRequests,
    priority,
    setPriority,
    handleServiceToggle,
    updateServiceQuantity,
    increaseServiceQuantity,
    decreaseServiceQuantity,
    handleSubmit,
    reset,
    getSelectedServicesAsQueueServices,
    serviceQuantities,
  } = useCustomerQueueJoinPresenter(shopId, initialViewModel);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  // Priority options configuration
  const priorityOptions = [
    { value: QueuePriority.NORMAL, label: "ปกติ", price: 0 },
    { value: QueuePriority.HIGH, label: "สูง", price: 10 },
    { value: QueuePriority.URGENT, label: "เร่งด่วน", price: 20 },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">กำลังโหลดข้อมูลการเข้าคิว...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            ไม่มีข้อมูล
          </h1>
          <p className="text-muted mb-4">ไม่พบข้อมูลร้านค้า</p>
        </div>
      </div>
    );
  }

  const {
    services,
    categories,
    estimatedWaitTime,
    currentQueueLength,
    shopName,
    isAcceptingQueues,
    selectedServices,
    isSuccess,
    queueNumber,
    isLoading,
    error: stateError,
  } = viewModel;

  const filteredServices =
    selectedCategory === "ทั้งหมด"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  if (isSuccess && queueNumber) {
    return (
      <div className="flex flex-col gap-8">
        <div className="frontend-card overflow-hidden">
          <div className="frontend-shop-header p-8 text-center">
            <span className="text-6xl mb-4 block">🎉</span>
            <h1 className="text-3xl font-bold mb-2">เข้าคิวสำเร็จ!</h1>
            <p className="frontend-shop-header-text-light">
              คุณได้รับหมายเลขคิวแล้ว
            </p>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 frontend-queue-current rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold">{queueNumber}</span>
              </div>
              <h2 className="text-2xl font-semibold frontend-text-primary mb-2">
                หมายเลขคิวของคุณ
              </h2>
              <p className="frontend-text-secondary">กรุณาจำหมายเลขนี้ไว้</p>
            </div>

            <div className="frontend-qr-section rounded-lg p-6 mb-6">
              <h3 className="font-semibold frontend-text-primary mb-4">
                รายละเอียดคิว
              </h3>
              <button
                onClick={() =>
                  (window.location.href = `/shop/${shopId}/status?queue=${queueNumber}`)
                }
                className="frontend-button-primary px-6 py-3 rounded-lg font-semibold mr-4"
              >
                ติดตามสถานะคิว
              </button>
              <button
                onClick={() => {
                  reset();
                }}
                className="frontend-button-secondary px-6 py-3 rounded-lg font-semibold"
              >
                เข้าคิวใหม่
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAcceptingQueues) {
    return (
      <div className="flex flex-col gap-8">
        <div className="frontend-card p-8 text-center">
          <span className="text-6xl mb-4 block">😔</span>
          <h1 className="text-2xl font-bold frontend-text-primary mb-2">
            ขณะนี้ไม่รับคิวเพิ่ม
          </h1>
          <p className="frontend-text-secondary mb-6">
            ร้านอาจปิดแล้วหรือคิวเต็ม กรุณาลองใหม่ภายหลัง
          </p>
          <button
            onClick={() => (window.location.href = `/shop/${shopId}`)}
            className="frontend-button-primary px-6 py-3 rounded-lg font-semibold"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Shop Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold frontend-text-primary mb-2">
          {shopName}
        </h1>
        <div className="flex flex-row items-center gap-4 text-sm frontend-text-secondary">
          <span>⏰ เวลารอโดยประมาณ: {estimatedWaitTime} นาที</span>
          <span>👥 คิวข้างหน้า: {currentQueueLength} คิว</span>
          <span
            className={
              isAcceptingQueues
                ? "frontend-text-success"
                : "frontend-text-danger"
            }
          >
            {isAcceptingQueues ? "✅ รับคิวอยู่" : "❌ ไม่รับคิว"}
          </span>
        </div>
      </div>

      <div className="flex flex-row items-start gap-8">
        {/* Service Selection */}
        <div className="flex flex-col flex-1">
          <div className="frontend-card">
            <div className="p-6 border-b frontend-card-border">
              <h2 className="text-xl font-semibold frontend-text-primary">
                เลือกบริการ
              </h2>
            </div>
            <div className="p-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-3 mb-6">
                {["ทั้งหมด", ...categories].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`frontend-category-filter ${
                      selectedCategory === category
                        ? "frontend-category-filter-active"
                        : "frontend-category-filter-inactive"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  const isDisabled = service.available === false;
                  const quantity = serviceQuantities[service.id] || 1;

                  return (
                    <div
                      key={service.id}
                      onClick={() =>
                        !isDisabled && handleServiceToggle(service.id)
                      }
                      className={cn(
                        "p-4 transition-all",
                        isSelected
                          ? "frontend-item-card-selected"
                          : "frontend-item-card",
                        isDisabled
                          ? "frontend-item-card-disabled cursor-not-allowed"
                          : "cursor-pointer"
                      )}
                    >
                      <div className="text-center">
                        <span className="text-3xl mb-2 block">
                          {service.icon}
                        </span>
                        <h3 className="font-semibold frontend-text-primary mb-1">
                          {service.name}
                        </h3>
                        <p className="text-sm frontend-text-secondary mb-2">
                          {service.description}
                        </p>
                        <div className="flex justify-between items-center text-sm mb-3">
                          <span className="font-bold frontend-service-price">
                            ฿{service.price}
                          </span>
                          <span className="frontend-text-muted">
                            ~{service.estimatedTime} นาที
                          </span>
                        </div>

                        {/* Quantity controls - only show for selected services */}
                        {isSelected && (
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                decreaseServiceQuantity(service.id);
                              }}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold transition-colors"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-semibold">
                              {quantity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                increaseServiceQuantity(service.id);
                              }}
                              className="w-8 h-8 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center text-white font-bold transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}

                        {isSelected && (
                          <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none">
                            <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                              <span className="text-sm">✓</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Form */}
        <StickyBox className="w-92 flex-none hidden lg:block">
          <div className="flex flex-col gap-6">
            {/* Order Summary */}
            {selectedServices.length > 0 && (
              <div className="frontend-card">
                <div className="p-6 border-b frontend-card-border">
                  <h3 className="text-lg font-semibold frontend-text-primary">
                    สรุปการสั่ง
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {selectedServices.map((serviceId) => {
                      const service = services.find((s) => s.id === serviceId);
                      const quantity = serviceQuantities[serviceId] || 1;
                      if (!service) return null;

                      return (
                        <div
                          key={serviceId}
                          className="flex justify-between items-center"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="frontend-text-primary font-medium">
                                {service.name}
                              </span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    decreaseServiceQuantity(serviceId)
                                  }
                                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm transition-colors"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-semibold text-sm">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    increaseServiceQuantity(serviceId)
                                  }
                                  className="w-6 h-6 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center text-white font-bold text-sm transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <span className="frontend-text-muted text-sm ml-12">
                              ~{service.estimatedTime} นาที/ชิ้น
                            </span>
                          </div>
                          <span className="frontend-service-price font-bold">
                            ฿{service.price * quantity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t frontend-card-border mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold frontend-text-primary">
                        รวมทั้งหมด
                      </span>
                      <span className="font-bold text-lg frontend-service-price">
                        ฿
                        {selectedServices.reduce((total, serviceId) => {
                          const service = services.find(
                            (s) => s.id === serviceId
                          );
                          const quantity = serviceQuantities[serviceId] || 1;
                          return total + (service?.price || 0) * quantity;
                        }, 0)}
                      </span>
                    </div>
                    <div className="text-sm frontend-text-secondary mt-1">
                      เวลาโดยประมาณ:
                      {selectedServices.reduce((total, serviceId) => {
                        const service = services.find(
                          (s) => s.id === serviceId
                        );
                        const quantity = serviceQuantities[serviceId] || 1;
                        return total + (service?.estimatedTime || 0) * quantity;
                      }, 0)}{" "}
                      นาที
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Form */}
            <div className="frontend-card">
              <div className="p-6 border-b frontend-card-border">
                <h2 className="text-xl font-semibold frontend-text-primary">
                  ข้อมูลลูกค้า
                </h2>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit({
                    customerName,
                    customerPhone,
                    services: getSelectedServicesAsQueueServices(),
                    specialRequests,
                    priority,
                  });
                }}
                className="p-6 space-y-4"
              >
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

                <button
                  type="submit"
                  disabled={isLoading || selectedServices.length === 0}
                  className="w-full frontend-button-join-queue px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              </form>
            </div>
          </div>
        </StickyBox>
      </div>
    </div>
  );
}
