"use client";

import { EmployeeServeViewModel } from "@/src/presentation/presenters/shop/employee/EmployeeServePresenter";
import { useState } from "react";

interface EmployeeServeViewProps {
  viewModel: EmployeeServeViewModel;
}

export function EmployeeServeView({ viewModel }: EmployeeServeViewProps) {
  const {
    currentQueue,
    serviceActions,
    employeeName,
    stationNumber,
    isOnDuty,
  } = viewModel;
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "shop-employee-service-pending";
      case "preparing":
        return "shop-employee-service-preparing";
      case "ready":
        return "shop-employee-service-ready";
      case "served":
        return "shop-employee-service-served";
      default:
        return "shop-employee-service-pending";
    }
  };

  const getServiceStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "รอเตรียม";
      case "preparing":
        return "กำลังเตรียม";
      case "ready":
        return "พร้อมเสิร์ฟ";
      case "served":
        return "เสิร์ฟแล้ว";
      default:
        return status;
    }
  };

  const handleServiceAction = (actionId: string, serviceId?: string) => {
    if (actionId === "add_note") {
      setShowNoteModal(true);
      return;
    }

    // Mock action handling
    console.log(
      `Action: ${actionId}`,
      serviceId ? `for service: ${serviceId}` : ""
    );
    alert(`ดำเนินการ: ${serviceActions.find((a) => a.id === actionId)?.label}`);
  };

  if (!currentQueue) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold shop-employee-header-text">
              ให้บริการ
            </h1>
            <p className="shop-employee-header-text-muted mt-1">
              สถานี: {stationNumber} • พนักงาน: {employeeName}
            </p>
          </div>
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isOnDuty
                ? "shop-employee-status-on-duty"
                : "shop-employee-status-off-duty"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                isOnDuty ? "shop-employee-status-online" : "shop-employee-status-offline-bg"
              }`}
            ></div>
            <span className="font-medium">
              {isOnDuty ? "พร้อมให้บริการ" : "พักงาน"}
            </span>
          </div>
        </div>

        {/* No Queue State */}
        <div className="shop-employee-card rounded-xl shadow-sm">
          <div className="p-12 text-center">
            <span className="text-8xl mb-6 block">😴</span>
            <h2 className="text-2xl font-bold shop-employee-text mb-4">
              ไม่มีคิวที่กำลังให้บริการ
            </h2>
            <p className="shop-employee-text-muted mb-8">
              คลิก &quot;เรียกคิวถัดไป&quot; เพื่อรับคิวใหม่
            </p>
            <button className="shop-employee-button-primary text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg">
              📞 เรียกคิวถัดไป
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold shop-employee-header-text">
            ให้บริการ
          </h1>
          <p className="shop-employee-header-text-muted mt-1">
            สถานี: {stationNumber} • พนักงาน: {employeeName}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="shop-employee-status-on-duty px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 shop-employee-status-online rounded-full animate-pulse"></div>
              <span className="font-medium">กำลังให้บริการ</span>
            </div>
          </div>
          <div className="text-sm shop-employee-text-muted">
            เริ่ม: {currentQueue.startTime} • คาดว่า:{" "}
            {currentQueue.estimatedDuration} นาที
          </div>
        </div>
      </div>

      {/* Current Queue Card */}
      <div className="shop-employee-queue-card-bg rounded-xl shadow-lg text-white">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                คิว {currentQueue.queueNumber}
              </h2>
              <p className="shop-employee-queue-card-text text-lg">
                {currentQueue.customerName}
              </p>
              <p className="shop-employee-queue-card-text">{currentQueue.customerPhone}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                ฿{currentQueue.totalPrice}
              </div>
              <div className="shop-employee-queue-card-text">ราคารวม</div>
            </div>
          </div>

          {currentQueue.specialRequests && (
            <div className="bg-white/20 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">🗒️ คำขอพิเศษ</h3>
              <p className="shop-employee-queue-card-text">{currentQueue.specialRequests}</p>
            </div>
          )}
        </div>
      </div>

      {/* Service Items */}
      <div className="shop-employee-card rounded-xl shadow-sm">
        <div className="p-6 border-b shop-employee-sidebar-border">
          <h2 className="text-xl font-semibold shop-employee-text">
            รายการบริการ
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {currentQueue.services.map((service) => (
              <div
                key={service.id}
                className={`border rounded-lg p-6 transition-all ${
                  selectedService === service.id
                    ? "shop-employee-service-selected-border shop-employee-service-selected-bg"
                    : "shop-employee-service-default-border shop-employee-service-hover-border"
                }`}
                onClick={() =>
                  setSelectedService(
                    selectedService === service.id ? null : service.id
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold shop-employee-text">
                        {service.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getServiceStatusColor(
                          service.status
                        )}`}
                      >
                        {getServiceStatusText(service.status)}
                      </span>
                      <span className="text-sm shop-employee-text-muted">
                        x{service.quantity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm shop-employee-text-muted">
                      <span>฿{service.price}</span>
                      <span>•</span>
                      <span>~{service.estimatedTime} นาที</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {service.status === "pending" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceAction("start_service", service.id);
                        }}
                        className="shop-employee-button-primary text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        ▶️ เริ่มเตรียม
                      </button>
                    )}
                    {service.status === "preparing" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceAction("mark_ready", service.id);
                        }}
                        className="shop-employee-button-blue text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        ✅ พร้อมเสิร์ฟ
                      </button>
                    )}
                    {service.status === "ready" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceAction("complete_service", service.id);
                        }}
                        className="shop-employee-button-purple text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        🍽️ เสิร์ฟแล้ว
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {serviceActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleServiceAction(action.id)}
            className={`${action.color} text-white px-4 py-6 rounded-lg hover:opacity-90 transition-all font-semibold`}
          >
            <div className="text-center">
              <span className="text-2xl block mb-2">{action.icon}</span>
              <span className="text-sm">{action.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="shop-employee-card rounded-xl shadow-sm">
        <div className="p-6 border-b shop-employee-sidebar-border">
          <h2 className="text-xl font-semibold shop-employee-text">
            สรุปความคืบหน้า
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 shop-employee-progress-pending-bg rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold shop-employee-progress-pending-text">
                  {
                    currentQueue.services.filter((s) => s.status === "pending")
                      .length
                  }
                </span>
              </div>
              <p className="text-sm shop-employee-text-muted">
                รอเตรียม
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 shop-employee-progress-preparing-bg rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold shop-employee-progress-preparing-text">
                  {
                    currentQueue.services.filter(
                      (s) => s.status === "preparing"
                    ).length
                  }
                </span>
              </div>
              <p className="text-sm shop-employee-text-muted">
                กำลังเตรียม
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 shop-employee-progress-ready-bg rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold shop-employee-progress-ready-text">
                  {
                    currentQueue.services.filter((s) => s.status === "ready")
                      .length
                  }
                </span>
              </div>
              <p className="text-sm shop-employee-text-muted">
                พร้อมเสิร์ฟ
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 shop-employee-progress-served-bg rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold shop-employee-progress-served-text">
                  {
                    currentQueue.services.filter((s) => s.status === "served")
                      .length
                  }
                </span>
              </div>
              <p className="text-sm shop-employee-text-muted">
                เสิร์ฟแล้ว
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="shop-employee-progress-bar-bg rounded-full h-3">
              <div
                className="shop-employee-progress-bar-fill h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (currentQueue.services.filter((s) => s.status === "served")
                      .length /
                      currentQueue.services.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-center text-sm shop-employee-text-muted mt-2">
              ความคืบหน้า:{" "}
              {
                currentQueue.services.filter((s) => s.status === "served")
                  .length
              }
              /{currentQueue.services.length} รายการ
            </p>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="shop-employee-card rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold shop-employee-text mb-4">
              เพิ่มหมายเหตุ
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border shop-employee-service-default-border rounded-lg px-3 py-2 shop-employee-card shop-employee-text focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={4}
              placeholder="กรอกหมายเหตุ..."
            />
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 shop-employee-button-secondary px-4 py-2 rounded-lg font-medium transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  console.log("Note added:", notes);
                  setNotes("");
                  setShowNoteModal(false);
                }}
                className="flex-1 shop-employee-button-primary text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
