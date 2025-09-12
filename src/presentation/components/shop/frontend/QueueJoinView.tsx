"use client";

import { QueueJoinViewModel } from "@/src/presentation/presenters/shop/frontend/QueueJoinPresenter";
import { useQueueJoinPresenter } from "@/src/presentation/presenters/shop/frontend/useQueueJoinPresenter";
import { useState } from "react";

interface QueueJoinViewProps {
  viewModel: QueueJoinViewModel;
  shopId: string;
}

export function QueueJoinView({ viewModel, shopId }: QueueJoinViewProps) {
  const {
    services,
    categories,
    estimatedWaitTime,
    currentQueueLength,
    shopName,
    isAcceptingQueues,
  } = viewModel;
  const [state, actions] = useQueueJoinPresenter({ shopId });
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");

  const filteredServices =
    selectedCategory === "ทั้งหมด"
      ? services
      : services.filter((service) => service.category === selectedCategory);

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
      setCustomerName("");
      setCustomerPhone("");
      setSpecialRequests("");
      setPriority("normal");
    }
  };

  if (state.isSuccess && state.queueNumber) {
    return (
      <div className="max-w-2xl mx-auto">
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
                <span className="text-3xl font-bold">{state.queueNumber}</span>
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
                  (window.location.href = `/shop/${shopId}/status?queue=${state.queueNumber}`)
                }
                className="frontend-button-primary px-6 py-3 rounded-lg font-semibold mr-4"
              >
                ติดตามสถานะคิว
              </button>
              <button
                onClick={() => {
                  actions.resetState();
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
      <div className="space-y-8">
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
    <div className="space-y-8">
      {/* Shop Header */}
      <div className="mb-8 flex flex-col gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Selection */}
        <div className="lg:col-span-2">
          <div className="frontend-card">
            <div className="p-6 border-b frontend-card-border">
              <h2 className="text-xl font-semibold frontend-text-primary">
                เลือกบริการ
              </h2>
            </div>
            <div className="p-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["ทั้งหมด", ...categories].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "frontend-button-primary"
                        : "frontend-button-secondary"
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
                  const isSelected = state.selectedServices.includes(
                    service.id
                  );
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleServiceToggle(service.id)}
                      className={`cursor-pointer rounded-lg p-4 border-2 transition-all ${
                        isSelected
                          ? "frontend-service-card border-purple-500"
                          : "frontend-card frontend-card-hover border-transparent"
                      }`}
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
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold frontend-service-price">
                            ฿{service.price}
                          </span>
                          <span className="frontend-text-muted">
                            ~{service.estimatedTime} นาที
                          </span>
                        </div>
                        {isSelected && (
                          <div className="mt-2">
                            <span className="frontend-text-success text-sm font-medium">
                              ✓ เลือกแล้ว
                            </span>
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
        <div className="space-y-6">
          {/* Order Summary */}
          {state.selectedServices.length > 0 && (
            <div className="frontend-card">
              <div className="p-6 border-b frontend-card-border">
                <h3 className="text-lg font-semibold frontend-text-primary">
                  สรุปการสั่ง
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {state.selectedServices.map((serviceId) => {
                    const service = services.find((s) => s.id === serviceId);
                    if (!service) return null;
                    return (
                      <div
                        key={serviceId}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <span className="frontend-text-primary font-medium">
                            {service.name}
                          </span>
                          <span className="frontend-text-muted text-sm ml-2">
                            ~{service.estimatedTime} นาที
                          </span>
                        </div>
                        <span className="frontend-service-price font-bold">
                          ฿{service.price}
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
                      {state.selectedServices.reduce((total, serviceId) => {
                        const service = services.find(
                          (s) => s.id === serviceId
                        );
                        return total + (service?.price || 0);
                      }, 0)}
                    </span>
                  </div>
                  <div className="text-sm frontend-text-secondary mt-1">
                    เวลาโดยประมาณ:{" "}
                    {state.selectedServices.reduce((total, serviceId) => {
                      const service = services.find((s) => s.id === serviceId);
                      return total + (service?.estimatedTime || 0);
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                    setPriority(e.target.value as "normal" | "urgent")
                  }
                  className="w-full frontend-input"
                >
                  <option value="normal">ปกติ</option>
                  <option value="urgent">เร่งด่วน (+฿20)</option>
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

              {state.error && (
                <div className="frontend-status-cancelled rounded-lg p-3">
                  <p className="frontend-text-danger text-sm">{state.error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  state.isLoading || state.selectedServices.length === 0
                }
                className="w-full frontend-button-join-queue px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.isLoading ? (
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
      </div>
    </div>
  );
}
