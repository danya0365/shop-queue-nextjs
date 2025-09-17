"use client";

import { QueueStatusViewModel } from "@/src/presentation/presenters/shop/frontend/QueueStatusPresenter";
import { useState } from "react";

interface QueueStatusViewProps {
  viewModel: QueueStatusViewModel;
  shopId: string;
}

export function QueueStatusView({ viewModel, shopId }: QueueStatusViewProps) {
  const { customerQueue, queueProgress, shopName, isFound, canCancel } =
    viewModel;
  const [queueNumber, setQueueNumber] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "serving":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return "รอการยืนยัน";
      case "confirmed":
        return "ยืนยันแล้ว";
      case "serving":
        return "กำลังให้บริการ";
      case "completed":
        return "เสร็จสิ้น";
      case "cancelled":
        return "ยกเลิกแล้ว";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting":
        return "⏳";
      case "confirmed":
        return "✅";
      case "serving":
        return "🛎️";
      case "completed":
        return "🎉";
      case "cancelled":
        return "❌";
      default:
        return "❓";
    }
  };

  const handleSearch = () => {
    if (queueNumber.trim()) {
      window.location.href = `/shop/${shopId}/status?queue=${queueNumber.trim()}`;
    }
  };

  const handleCancel = () => {
    // Mock cancel logic
    setShowCancelConfirm(false);
    alert("คิวของคุณถูกยกเลิกแล้ว");
    window.location.href = `/shop/${shopId}`;
  };

  if (!isFound) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold frontend-text-primary mb-2">
            ติดตามสถานะคิว
          </h1>
          <p className="frontend-text-secondary">{shopName}</p>
        </div>
        {/* Search Form */}
        <div className="frontend-card">
          <div className="p-6 border-b frontend-card-border">
            <h1 className="text-2xl font-bold frontend-text-primary">
              ตรวจสอบสถานะคิว - {shopName}
            </h1>
          </div>
          <div className="p-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={queueNumber}
                onChange={(e) => setQueueNumber(e.target.value)}
                placeholder="กรอกหมายเลขคิว (เช่น A001)"
                className="frontend-input flex-1"
              />
              <button
                onClick={handleSearch}
                className="frontend-button-primary px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        {/* Current Queue Info */}
        <div className="frontend-card">
          <div className="p-6 border-b frontend-card-border">
            <h2 className="text-xl font-semibold frontend-text-primary">
              สถานะคิวปัจจุบัน
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 frontend-queue-current rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">
                  {queueProgress.currentNumber}
                </span>
              </div>
              <p className="text-lg font-medium frontend-text-primary mb-2">
                คิวที่กำลังให้บริการ
              </p>
              <p className="frontend-text-secondary">
                เวลาเฉลี่ยต่อคิว: {queueProgress.averageServiceTime} นาที
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold frontend-text-primary mb-2">
          สถานะคิวของคุณ
        </h1>
        <p className="frontend-text-secondary">{shopName}</p>
      </div>

      {isFound && customerQueue && (
        <>
          {/* Queue Status Card */}
          <div className="frontend-card">
            <div className="frontend-shop-header p-6">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {getStatusIcon(customerQueue.status)}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  คิวหมายเลข {customerQueue.queueNumber}
                </h2>
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
                    customerQueue.status === "waiting"
                      ? "frontend-badge-warning"
                      : customerQueue.status === "confirmed"
                      ? "frontend-badge-info"
                      : customerQueue.status === "serving"
                      ? "frontend-badge-success"
                      : customerQueue.status === "completed"
                      ? "frontend-badge-success"
                      : "frontend-status-cancelled"
                  }`}
                >
                  {getStatusText(customerQueue.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="frontend-card-secondary p-6 rounded-lg text-center">
              <div className="text-2xl font-bold frontend-text-primary mb-1">
                {queueProgress.currentNumber}
              </div>
              <div className="text-sm frontend-text-secondary">คิวปัจจุบัน</div>
            </div>
            <div className="frontend-card-secondary p-6 rounded-lg text-center">
              <div className="text-2xl font-bold frontend-text-primary mb-1">
                {queueProgress.totalAhead}
              </div>
              <div className="text-sm frontend-text-secondary">คิวข้างหน้า</div>
            </div>
            <div className="frontend-card-secondary p-6 rounded-lg text-center">
              <div className="text-2xl font-bold frontend-text-primary mb-1">
                {queueProgress.estimatedCallTime}
              </div>
              <div className="text-sm frontend-text-secondary">
                เวลารอ (นาที)
              </div>
            </div>
          </div>

          {/* Queue Details */}
          <div className="frontend-card">
            <div className="p-6 border-b frontend-card-border">
              <h3 className="text-lg font-semibold frontend-text-primary">
                รายละเอียดคิว
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="frontend-text-secondary">ชื่อลูกค้า:</span>
                  <span className="frontend-text-primary font-medium">
                    {customerQueue.customerName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="frontend-text-secondary">เบอร์โทร:</span>
                  <span className="frontend-text-primary font-medium">
                    {customerQueue.customerPhone}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="frontend-text-secondary">เวลาเข้าคิว:</span>
                  <span className="frontend-text-primary font-medium">
                    {customerQueue.createdAt}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="frontend-text-secondary">
                    บริการที่เลือก:
                  </span>
                  <span className="frontend-text-primary font-medium">
                    {customerQueue.services.join(", ")}
                  </span>
                </div>
                {customerQueue.specialRequests && (
                  <div className="flex justify-between items-start">
                    <span className="frontend-text-secondary">คำขอพิเศษ:</span>
                    <span className="frontend-text-primary font-medium text-right">
                      {customerQueue.specialRequests}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="frontend-text-secondary">ราคารวม:</span>
                  <span className="frontend-service-price font-bold text-lg">
                    ฿{customerQueue.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.reload()}
              className="frontend-button-primary px-6 py-3 rounded-lg font-semibold"
            >
              🔄 รีเฟรช
            </button>

            <button
              onClick={() => (window.location.href = `/shop/${shopId}`)}
              className="frontend-button-secondary px-6 py-3 rounded-lg font-semibold"
            >
              🏠 กลับหน้าหลัก
            </button>

            {canCancel && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="frontend-button-danger px-6 py-3 rounded-lg font-semibold"
              >
                ❌ ยกเลิกคิว
              </button>
            )}
          </div>
        </>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="frontend-card p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">⚠️</span>
              <h3 className="text-xl font-semibold frontend-text-primary mb-2">
                ยืนยันการยกเลิกคิว
              </h3>
              <p className="frontend-text-secondary">
                คุณแน่ใจหรือไม่ที่จะยกเลิกคิว {customerQueue?.queueNumber}?
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 frontend-button-secondary px-4 py-2 rounded-lg font-medium transition-colors"
              >
                ไม่ยกเลิก
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 frontend-button-danger px-4 py-2 rounded-lg font-medium transition-colors"
              >
                ยืนยันยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
