"use client";

import type { CustomerQueueStatusViewModel } from "@/src/presentation/presenters/shop/frontend/CustomerQueueStatusPresenter";
import { useCustomerQueueStatusPresenter } from "@/src/presentation/presenters/shop/frontend/useCustomerQueueStatusPresenter";

interface QueueStatusViewProps {
  shopId: string;
  initialViewModel?: CustomerQueueStatusViewModel;
}

export function CustomerQueueStatusView({
  shopId,
  initialViewModel,
}: QueueStatusViewProps) {
  const {
    viewModel,
    loading,
    error,
    actionLoading,
    queueNumber,
    setQueueNumber,
    showCancelConfirm,
    setShowCancelConfirm,
    handleSearch,
    handleCancel,
    refreshData,
    getStatusColor,
    getStatusText,
    getStatusIcon,
  } = useCustomerQueueStatusPresenter(shopId, initialViewModel);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold shop-frontend-text-primary mb-2">
            ติดตามสถานะคิว
          </h1>
        </div>
        <div className="shop-frontend-card">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="shop-frontend-text-secondary">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold shop-frontend-text-primary mb-2">
            ติดตามสถานะคิว
          </h1>
        </div>
        <div className="shop-frontend-card">
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="shop-frontend-text-secondary mb-4">เกิดข้อผิดพลาด</p>
            <p className="shop-frontend-text-primary mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="shop-frontend-button-primary px-6 py-3 rounded-lg font-semibold"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle no data state
  if (!viewModel) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold shop-frontend-text-primary mb-2">
            ติดตามสถานะคิว
          </h1>
        </div>
        <div className="shop-frontend-card">
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="shop-frontend-text-secondary mb-4">ไม่พบข้อมูลคิว</p>
            <button
              onClick={refreshData}
              className="shop-frontend-button-primary px-6 py-3 rounded-lg font-semibold"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { customerQueue, queueProgress, shopName, isFound, canCancel } =
    viewModel;

  if (!isFound) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold shop-frontend-text-primary mb-2">
            ติดตามสถานะคิว
          </h1>
          <p className="shop-frontend-text-secondary">{shopName}</p>
        </div>
        {/* Search Form */}
        <div className="shop-frontend-card">
          <div className="p-6 border-b shop-frontend-card-border">
            <h1 className="text-2xl font-bold shop-frontend-text-primary">
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
                className="shop-frontend-input flex-1"
              />
              <button
                onClick={handleSearch}
                className="shop-frontend-button-primary px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        {/* Current Queue Info */}
        <div className="shop-frontend-card">
          <div className="p-6 border-b shop-frontend-card-border">
            <h2 className="text-xl font-semibold shop-frontend-text-primary">
              สถานะคิวปัจจุบัน
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 shop-frontend-queue-current rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">
                  {queueProgress.currentNumber || "-"}
                </span>
              </div>
              <p className="text-lg font-medium shop-frontend-text-primary mb-2">
                คิวที่กำลังให้บริการ
              </p>
              <p className="shop-frontend-text-secondary">
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
        <h1 className="text-3xl font-bold shop-frontend-text-primary mb-2">
          สถานะคิวของคุณ
        </h1>
        <p className="shop-frontend-text-secondary">{shopName}</p>
      </div>

      {isFound && customerQueue && (
        <>
          {/* Queue Status Card */}
          <div className="shop-frontend-card">
            <div className="shop-frontend-shop-header p-6">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {getStatusIcon(customerQueue.status)}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  คิวหมายเลข {customerQueue.queueNumber}
                </h2>
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                    customerQueue.status
                  )}`}
                >
                  {getStatusText(customerQueue.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="shop-frontend-card-secondary p-6 rounded-lg text-center">
              <div className="text-2xl font-bold shop-frontend-text-primary mb-1">
                {queueProgress.currentNumber || "-"}
              </div>
              <div className="text-sm shop-frontend-text-secondary">
                คิวปัจจุบัน
              </div>
            </div>
            <div className="shop-frontend-card-secondary p-6 rounded-lg text-center">
              <div className="text-2xl font-bold shop-frontend-text-primary mb-1">
                {queueProgress.totalAhead}
              </div>
              <div className="text-sm shop-frontend-text-secondary">
                คิวข้างหน้า
              </div>
            </div>
            <div className="shop-frontend-card-secondary p-6 rounded-lg text-center">
              <div className="text-2xl font-bold shop-frontend-text-primary mb-1">
                {queueProgress.estimatedCallTime}
              </div>
              <div className="text-sm shop-frontend-text-secondary">
                เวลารอ (นาที)
              </div>
            </div>
          </div>

          {/* Queue Details */}
          <div className="shop-frontend-card">
            <div className="p-6 border-b shop-frontend-card-border">
              <h3 className="text-lg font-semibold shop-frontend-text-primary">
                รายละเอียดคิว
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="shop-frontend-text-secondary">
                    ชื่อลูกค้า:
                  </span>
                  <span className="shop-frontend-text-primary font-medium">
                    {customerQueue.customerName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="shop-frontend-text-secondary">
                    เบอร์โทร:
                  </span>
                  <span className="shop-frontend-text-primary font-medium">
                    {customerQueue.customerPhone}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="shop-frontend-text-secondary">
                    เวลาเข้าคิว:
                  </span>
                  <span className="shop-frontend-text-primary font-medium">
                    {customerQueue.createdAt}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="shop-frontend-text-secondary">
                    บริการที่เลือก:
                  </span>
                  <span className="shop-frontend-text-primary font-medium">
                    {customerQueue.services.join(", ")}
                  </span>
                </div>
                {customerQueue.specialRequests && (
                  <div className="flex justify-between items-start">
                    <span className="shop-frontend-text-secondary">
                      คำขอพิเศษ:
                    </span>
                    <span className="shop-frontend-text-primary font-medium text-right">
                      {customerQueue.specialRequests}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="shop-frontend-text-secondary">ราคารวม:</span>
                  <span className="shop-frontend-service-price font-bold text-lg">
                    ฿{customerQueue.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={refreshData}
              className="shop-frontend-button-primary px-6 py-3 rounded-lg font-semibold"
            >
              🔄 รีเฟรช
            </button>

            <button
              onClick={() => (window.location.href = `/shop/${shopId}`)}
              className="shop-frontend-button-secondary px-6 py-3 rounded-lg font-semibold"
            >
              🏠 กลับหน้าหลัก
            </button>

            {canCancel && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="shop-frontend-button-danger px-6 py-3 rounded-lg font-semibold"
                disabled={actionLoading}
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
          <div className="shop-frontend-card p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">⚠️</span>
              <h3 className="text-xl font-semibold shop-frontend-text-primary mb-2">
                ยืนยันการยกเลิกคิว
              </h3>
              <p className="shop-frontend-text-secondary">
                คุณแน่ใจหรือไม่ที่จะยกเลิกคิว {customerQueue?.queueNumber}?
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 shop-frontend-button-secondary px-4 py-2 rounded-lg font-medium transition-colors"
              >
                ไม่ยกเลิก
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 shop-frontend-button-danger px-4 py-2 rounded-lg font-medium transition-colors"
                disabled={actionLoading}
              >
                {actionLoading ? "กำลังยกเลิก..." : "ยืนยันยกเลิก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
