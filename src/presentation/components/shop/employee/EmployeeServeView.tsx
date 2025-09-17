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
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
      case "preparing":
        return "bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200";
      case "ready":
        return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200";
      case "served":
        return "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              ให้บริการ
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              สถานี: {stationNumber} • พนักงาน: {employeeName}
            </p>
          </div>
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isOnDuty
                ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                isOnDuty ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="font-medium">
              {isOnDuty ? "พร้อมให้บริการ" : "พักงาน"}
            </span>
          </div>
        </div>

        {/* No Queue State */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-12 text-center">
            <span className="text-8xl mb-6 block">😴</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ไม่มีคิวที่กำลังให้บริการ
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              คลิก &quot;เรียกคิวถัดไป&quot; เพื่อรับคิวใหม่
            </p>
            <button className="bg-green-500 dark:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 dark:hover:bg-green-700 transition-colors text-lg">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            ให้บริการ
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            สถานี: {stationNumber} • พนักงาน: {employeeName}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">กำลังให้บริการ</span>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            เริ่ม: {currentQueue.startTime} • คาดว่า:{" "}
            {currentQueue.estimatedDuration} นาที
          </div>
        </div>
      </div>

      {/* Current Queue Card */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg text-white">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                คิว {currentQueue.queueNumber}
              </h2>
              <p className="text-green-100 text-lg">
                {currentQueue.customerName}
              </p>
              <p className="text-green-100">{currentQueue.customerPhone}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                ฿{currentQueue.totalPrice}
              </div>
              <div className="text-green-100">ราคารวม</div>
            </div>
          </div>

          {currentQueue.specialRequests && (
            <div className="bg-white/20 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">🗒️ คำขอพิเศษ</h3>
              <p className="text-green-100">{currentQueue.specialRequests}</p>
            </div>
          )}
        </div>
      </div>

      {/* Service Items */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
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
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {service.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getServiceStatusColor(
                          service.status
                        )}`}
                      >
                        {getServiceStatusText(service.status)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        x{service.quantity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
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
                        className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
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
                        className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
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
                        className="bg-purple-500 dark:bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            สรุปความคืบหน้า
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                  {
                    currentQueue.services.filter((s) => s.status === "pending")
                      .length
                  }
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                รอเตรียม
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {
                    currentQueue.services.filter(
                      (s) => s.status === "preparing"
                    ).length
                  }
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                กำลังเตรียม
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {
                    currentQueue.services.filter((s) => s.status === "ready")
                      .length
                  }
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                พร้อมเสิร์ฟ
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {
                    currentQueue.services.filter((s) => s.status === "served")
                      .length
                  }
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                เสิร์ฟแล้ว
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
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
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              เพิ่มหมายเหตุ
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
              placeholder="กรอกหมายเหตุ..."
            />
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  console.log("Note added:", notes);
                  setNotes("");
                  setShowNoteModal(false);
                }}
                className="flex-1 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
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
