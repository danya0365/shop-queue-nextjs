"use client";

import { EmployeeQueueViewModel } from "@/src/presentation/presenters/shop/employee/EmployeeQueuePresenter";
import { useState } from "react";

interface EmployeeQueueViewProps {
  viewModel: EmployeeQueueViewModel;
}

export function EmployeeQueueView({ viewModel }: EmployeeQueueViewProps) {
  const { myQueues, waitingQueues, totalQueues, employeeName, isOnDuty } =
    viewModel;
  const [selectedTab, setSelectedTab] = useState<"my" | "waiting">("my");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "shop-employee-warning";
      case "confirmed":
        return "shop-employee-secondary";
      case "serving":
        return "shop-employee-success";
      case "completed":
        return "shop-employee-text-muted";
      default:
        return "shop-employee-text-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "shop-employee-warning";
      case "vip":
        return "shop-employee-danger";
      default:
        return "shop-employee-text-muted";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return "รอยืนยัน";
      case "confirmed":
        return "ยืนยันแล้ว";
      case "serving":
        return "กำลังให้บริการ";
      case "completed":
        return "เสร็จสิ้น";
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "สำคัญ";
      case "vip":
        return "VIP";
      case "normal":
        return "ปกติ";
      default:
        return priority;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold shop-employee-header-text">
            จัดการคิว
          </h1>
          <p className="shop-employee-header-text-muted mt-1">
            พนักงาน: {employeeName} • คิวทั้งหมด: {totalQueues}
          </p>
        </div>
        <div className="flex items-center space-x-4">
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
              {isOnDuty ? "ปฏิบัติงาน" : "พักงาน"}
            </span>
          </div>
          <button className="shop-employee-button-blue text-white px-4 py-2 rounded-lg transition-colors">
            📞 เรียกคิวถัดไป
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="shop-employee-card rounded-xl shadow-sm">
        <div className="border-b shop-employee-sidebar-border">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab("my")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "my"
                  ? "shop-employee-tab-active shop-employee-primary"
                  : "shop-employee-tab-inactive shop-employee-text-muted shop-employee-primary-hover"
              }`}
            >
              คิวของฉัน ({myQueues.length})
            </button>
            <button
              onClick={() => setSelectedTab("waiting")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "waiting"
                  ? "shop-employee-tab-active shop-employee-primary"
                  : "shop-employee-tab-inactive shop-employee-text-muted shop-employee-primary-hover"
              }`}
            >
              คิวรอ ({waitingQueues.length})
            </button>
          </nav>
        </div>

        {/* Queue List */}
        <div className="p-6">
          {selectedTab === "my" && (
            <div className="space-y-4">
              {myQueues.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">😴</span>
                  <h3 className="text-lg font-medium shop-employee-text mb-2">
                    ไม่มีคิวที่กำลังให้บริการ
                  </h3>
                  <p className="shop-employee-text-muted">
                    คลิก &quot;เรียกคิวถัดไป&quot; เพื่อรับคิวใหม่
                  </p>
                </div>
              ) : (
                myQueues.map((queue) => (
                  <div
                    key={queue.id}
                    className="shop-employee-my-queue-bg shop-employee-my-queue-border border rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 shop-employee-my-queue-number rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {queue.queueNumber}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold shop-employee-text">
                              {queue.customerName}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                queue.status
                              )}`}
                            >
                              {getStatusText(queue.status)}
                            </span>
                            {queue.priority !== "normal" && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                  queue.priority
                                )}`}
                              >
                                {getPriorityText(queue.priority)}
                              </span>
                            )}
                          </div>
                          <p className="shop-employee-text-muted mb-1">
                            {queue.customerPhone}
                          </p>
                          <p className="text-sm shop-employee-text-muted">
                            บริการ: {queue.services.join(", ")}
                          </p>
                          <p className="text-sm font-medium shop-employee-primary">
                            ฿{queue.totalPrice} • ~{queue.estimatedTime} นาที
                          </p>
                          {queue.notes && (
                            <p className="text-sm shop-employee-secondary mt-1">
                              หมายเหตุ: {queue.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button className="shop-employee-button-primary text-white px-4 py-2 rounded-lg transition-colors">
                          ✅ เสร็จสิ้น
                        </button>
                        <button className="shop-employee-button-amber text-white px-4 py-2 rounded-lg transition-colors">
                          ⏸️ พัก
                        </button>
                        <button className="shop-employee-button-secondary px-4 py-2 rounded-lg transition-colors">
                          📝 หมายเหตุ
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedTab === "waiting" && (
            <div className="space-y-4">
              {waitingQueues.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🎉</span>
                  <h3 className="text-lg font-medium shop-employee-text mb-2">
                    ไม่มีคิวรอ
                  </h3>
                  <p className="shop-employee-text-muted">
                    คิวทั้งหมดได้รับการดำเนินการแล้ว
                  </p>
                </div>
              ) : (
                waitingQueues.map((queue, index) => (
                  <div
                    key={queue.id}
                    className="shop-employee-card rounded-lg p-6 shop-employee-card-hover transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0
                              ? "shop-employee-queue-number-first"
                              : index === 1
                              ? "shop-employee-queue-number-second"
                              : "shop-employee-queue-number-other"
                          }`}
                        >
                          {queue.queueNumber}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold shop-employee-text">
                              {queue.customerName}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                queue.status
                              )}`}
                            >
                              {getStatusText(queue.status)}
                            </span>
                            {queue.priority !== "normal" && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                  queue.priority
                                )}`}
                              >
                                {getPriorityText(queue.priority)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm shop-employee-text-muted mb-1">
                            {queue.customerPhone}
                          </p>
                          <p className="text-sm shop-employee-text-muted">
                            บริการ: {queue.services.join(", ")}
                          </p>
                          <p className="text-sm shop-employee-text-muted">
                            ฿{queue.totalPrice} • ~{queue.estimatedTime} นาที •{" "}
                            {queue.createdAt}
                          </p>
                          {queue.notes && (
                            <p className="text-sm shop-employee-secondary mt-1">
                              หมายเหตุ: {queue.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        {index === 0 && (
                          <button className="shop-employee-button-primary text-white px-4 py-2 rounded-lg transition-colors">
                            📞 รับคิว
                          </button>
                        )}
                        <button className="shop-employee-button-blue text-white px-4 py-2 rounded-lg transition-colors">
                          👁️ ดูรายละเอียด
                        </button>
                        {queue.status === "waiting" && (
                          <button className="shop-employee-button-amber text-white px-4 py-2 rounded-lg transition-colors">
                            ✅ ยืนยัน
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold shop-employee-text mb-4">
            การดำเนินการด่วน
          </h3>
          <div className="space-y-3">
            <button className="w-full shop-employee-button-primary text-white px-4 py-3 rounded-lg transition-colors">
              📞 เรียกคิวถัดไป
            </button>
            <button className="w-full shop-employee-button-blue text-white px-4 py-3 rounded-lg transition-colors">
              🔄 รีเฟรชคิว
            </button>
            <button className="w-full shop-employee-button-amber text-white px-4 py-3 rounded-lg transition-colors">
              ⏸️ พักการให้บริการ
            </button>
          </div>
        </div>

        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold shop-employee-text mb-4">
            สถิติวันนี้
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="shop-employee-text-muted">
                คิวที่ให้บริการ:
              </span>
              <span className="font-semibold shop-employee-text">
                15
              </span>
            </div>
            <div className="flex justify-between">
              <span className="shop-employee-text-muted">
                เวลาเฉลี่ย:
              </span>
              <span className="font-semibold shop-employee-text">
                8 นาที
              </span>
            </div>
            <div className="flex justify-between">
              <span className="shop-employee-text-muted">
                คะแนนความพึงพอใจ:
              </span>
              <span className="font-semibold shop-employee-warning">4.8/5</span>
            </div>
          </div>
        </div>

        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold shop-employee-text mb-4">
            ข้อความแนะนำ
          </h3>
          <div className="space-y-2 text-sm">
            <div className="p-2 shop-employee-info-bg rounded">
              <p className="font-medium shop-employee-info-text">
                เรียกคิว:
              </p>
              <p className="shop-employee-info-text-muted">
                &quot;เรียกคิว {myQueues[0]?.queueNumber || "A000"} ครับ&quot;
              </p>
            </div>
            <div className="p-2 shop-employee-info-bg rounded">
              <p className="font-medium shop-employee-info-text">
                เสร็จสิ้น:
              </p>
              <p className="shop-employee-info-text-muted">
                &quot;ขอบคุณครับ เรียบร้อยแล้ว&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
