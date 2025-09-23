"use client";

import { QueuePriority } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import useGetDevice from "@/src/presentation/hooks/get-device";
import { useCustomerQueueJoinPresenter } from "@/src/presentation/presenters/shop/frontend/useCustomerQueueJoinPresenter";
import { cn } from "@/src/utils/cn";
import { useState } from "react";
import StickyBox from "react-sticky-box";
import { CustomerForm } from "./components/CustomerForm";
import { OrderSummary } from "./components/OrderSummary";

interface CustomerQueueJoinViewProps {
  shopId: string;
  initialViewModel?: import("@/src/presentation/presenters/shop/frontend/CustomerQueueJoinPresenter").CustomerQueueJoinViewModel;
}

export function ClientCustomerQueueJoinView({
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
  const device = useGetDevice();
  const [isShowFinalOrderSummary, setIsShowFinalOrderSummary] = useState(false);

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

  if (isShowFinalOrderSummary) {
    return (
      <div className="flex flex-col gap-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <button
            onClick={() => setIsShowFinalOrderSummary(false)}
            className="frontend-button-secondary px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            ← ย้อนกลับ
          </button>
        </div>
        <div className="flex flex-col gap-6">
          <OrderSummary
            selectedServices={selectedServices}
            services={services}
            serviceQuantities={serviceQuantities}
            decreaseServiceQuantity={decreaseServiceQuantity}
            increaseServiceQuantity={increaseServiceQuantity}
          />
          <CustomerForm
            customerName={customerName}
            customerPhone={customerPhone}
            priority={priority}
            specialRequests={specialRequests}
            isLoading={isLoading}
            selectedServicesLength={selectedServices.length}
            stateError={stateError}
            priorityOptions={priorityOptions}
            setCustomerName={setCustomerName}
            setCustomerPhone={setCustomerPhone}
            setPriority={setPriority}
            setSpecialRequests={setSpecialRequests}
            handleSubmit={handleSubmit}
            isShowBackButton={true}
            onBackPressed={() => setIsShowFinalOrderSummary(false)}
            getSelectedServicesAsQueueServices={
              getSelectedServicesAsQueueServices
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Shop Header */}
      <div className="flex flex-col gap-2 sm:gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold frontend-text-primary">{shopName}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm frontend-text-secondary">
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

      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
        {/* Service Selection */}
        <div className="flex flex-col flex-1 w-full">
          <div className="frontend-card p-4 sm:p-6 gap-4 sm:gap-6 flex flex-col">
            <div className="border-b frontend-card-border pb-4">
              <h2 className="text-lg sm:text-xl font-semibold frontend-text-primary">
                เลือกบริการ
              </h2>
            </div>
            <div className="mb-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {["ทั้งหมด", ...categories].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`frontend-category-filter px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base ${
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
            <div className="">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                        "p-3 sm:p-4 transition-all relative min-h-[200px] sm:min-h-[220px]",
                        isSelected
                          ? "frontend-item-card-selected"
                          : "frontend-item-card",
                        isDisabled
                          ? "frontend-item-card-disabled cursor-not-allowed"
                          : "cursor-pointer hover:scale-[1.02]"
                      )}
                    >
                      <div className="text-center h-full flex flex-col justify-between">
                        <div>
                          <span className="text-2xl sm:text-3xl mb-2 block">
                            {service.icon}
                          </span>
                          <h3 className="font-semibold frontend-text-primary mb-1 text-sm sm:text-base">
                            {service.name}
                          </h3>
                          <p className="text-xs sm:text-sm frontend-text-secondary mb-2 line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center text-sm mb-3">
                            <span className="font-bold frontend-service-price text-sm sm:text-base">
                              ฿{service.price}
                            </span>
                            <span className="frontend-text-muted text-xs sm:text-sm">
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
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold transition-colors active:scale-95"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-semibold text-sm sm:text-base">
                                {quantity}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  increaseServiceQuantity(service.id);
                                }}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center text-white font-bold transition-colors active:scale-95"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>

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
        {device === "desktop" ? (
          <StickyBox className="w-80 sm:w-92 flex-none">
            <div className="flex flex-col gap-6">
              <OrderSummary
                selectedServices={selectedServices}
                services={services}
                serviceQuantities={serviceQuantities}
                decreaseServiceQuantity={decreaseServiceQuantity}
                increaseServiceQuantity={increaseServiceQuantity}
              />
              <CustomerForm
                customerName={customerName}
                customerPhone={customerPhone}
                priority={priority}
                specialRequests={specialRequests}
                isLoading={isLoading}
                selectedServicesLength={selectedServices.length}
                stateError={stateError}
                priorityOptions={priorityOptions}
                setCustomerName={setCustomerName}
                setCustomerPhone={setCustomerPhone}
                setPriority={setPriority}
                setSpecialRequests={setSpecialRequests}
                handleSubmit={handleSubmit}
                getSelectedServicesAsQueueServices={
                  getSelectedServicesAsQueueServices
                }
              />
            </div>
          </StickyBox>
        ) : (
          <>
            <button
              onClick={() => setIsShowFinalOrderSummary(true)}
              className={cn(
                "fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center gap-2 text-sm sm:text-base",
                selectedServices.length === 0 && "hidden"
              )}
            >
              <span>เข้าคิว</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
