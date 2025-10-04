"use client";

import { QueueStatus } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import { getFormatPhone } from "@/src/domain/utils/phone";
import type { CustomerQueueStatusViewModel } from "@/src/presentation/presenters/shop/frontend/CustomerQueueStatusPresenter";
import { useCustomerQueueStatusPresenter } from "@/src/presentation/presenters/shop/frontend/useCustomerQueueStatusPresenter";
import { useCustomerStore } from "@/src/presentation/stores/customer-store";

interface QueueStatusViewProps {
  shopId: string;
  initialViewModel?: CustomerQueueStatusViewModel;
}

export function CustomerQueueStatusView({
  shopId,
  initialViewModel,
}: QueueStatusViewProps) {
  const { getCustomer } = useCustomerStore();
  const customer = getCustomer(shopId);
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
    resetData,
    getStatusColor,
    getStatusText,
    getStatusIcon,
  } = useCustomerQueueStatusPresenter(shopId, initialViewModel);

  // Handle loading state
  if (loading && !viewModel) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold shop-frontend-text-primary mb-2">
            ติดตามสถานะคิว
          </h1>
        </div>
        <div className="shop-frontend-card">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
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
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="shop-frontend-text-secondary mb-2">เกิดข้อผิดพลาด</p>
            <p className="shop-frontend-text-primary mb-6">{error}</p>
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
          <div className="p-10 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="shop-frontend-text-secondary mb-6">ไม่พบข้อมูลคิว</p>
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="p-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={queueNumber}
                  onChange={(e) => setQueueNumber(e.target.value)}
                  placeholder="กรอกหมายเลขคิว (เช่น A001)"
                  className="shop-frontend-input w-full h-12 text-lg"
                  required
                  aria-label="หมายเลขคิว"
                />
                <p className="shop-frontend-text-muted text-sm mt-2">
                  ใบเสร็จหรือหน้าจอเข้าคิวจะแสดงหมายเลขคิวของคุณ (ตัวอย่าง:
                  A001)
                </p>
              </div>
              <button
                type="submit"
                className="shop-frontend-button-primary px-6 py-3 rounded-lg font-semibold transition-colors h-12"
                disabled={actionLoading}
                aria-busy={actionLoading}
              >
                {actionLoading ? "กำลังค้นหา..." : "ค้นหา"}
              </button>
            </div>
          </form>
        </div>

        {/* Current Queue Info */}
        <div className="shop-frontend-card">
          <div className="p-6 border-b shop-frontend-card-border">
            <h2 className="text-xl font-semibold shop-frontend-text-primary">
              สถานะคิวปัจจุบัน
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="shop-frontend-card-secondary p-6 rounded-lg text-center">
                <div className="text-sm shop-frontend-text-secondary mb-1">
                  คิวที่กำลังให้บริการ
                </div>
                <div className="text-3xl font-extrabold shop-frontend-text-primary">
                  {queueProgress.currentNumber || "-"}
                </div>
              </div>
              <div className="shop-frontend-card-secondary p-6 rounded-lg text-center">
                <div className="text-sm shop-frontend-text-secondary mb-1">
                  เวลาเฉลี่ยต่อคิว
                </div>
                <div className="text-2xl font-bold shop-frontend-text-primary">
                  {queueProgress.averageServiceTime} นาที
                </div>
              </div>
              <div className="shop-frontend-card-secondary p-6 rounded-lg text-center">
                <div className="text-sm shop-frontend-text-secondary mb-1">
                  แนะนำ
                </div>
                <div className="text-sm shop-frontend-text-muted">
                  เตรียมตัวล่วงหน้า ~5 นาที
                </div>
              </div>
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
          <div className="shop-frontend-card rounded-lg overflow-hidden">
            <div className="shop-frontend-shop-header p-8 text-center">
              <div className="text-6xl mb-4">
                {getStatusIcon(customerQueue.status)}
              </div>
              <h2 className="text-3xl font-bold mb-3">
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

            {/* Stepper (4 statuses) */}
            <div className="p-6">
              {/* Mobile: 2x2 grid cards */}
              <div
                className="grid grid-cols-2 gap-3 md:hidden"
                role="list"
                aria-label="สถานะคิว"
              >
                {[
                  { key: QueueStatus.WAITING, label: "รอยืนยัน" },
                  { key: QueueStatus.CONFIRMED, label: "รอคิว" },
                  { key: QueueStatus.SERVING, label: "กำลังให้บริการ" },
                  { key: QueueStatus.COMPLETED, label: "เสร็จสิ้น" },
                ].map((step, idx) => {
                  const order = [
                    QueueStatus.WAITING,
                    QueueStatus.CONFIRMED,
                    QueueStatus.SERVING,
                    QueueStatus.COMPLETED,
                  ];
                  const current = customerQueue.status;
                  const currentIndex = order.indexOf(current);
                  const stepIndex = order.indexOf(step.key);
                  const isActive = currentIndex === stepIndex;
                  const isDone = currentIndex > stepIndex;
                  return (
                    <div
                      key={step.key}
                      role="listitem"
                      className={`rounded-xl border p-3 flex items-center gap-3 ${
                        isActive
                          ? "bg-purple-50 border-purple-300 dark:bg-purple-900/30 dark:border-purple-600"
                          : isDone
                          ? "bg-white border-purple-200 dark:bg-gray-800 dark:border-purple-700"
                          : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border text-sm font-semibold ${
                          isActive
                            ? "bg-purple-600 text-white border-purple-600"
                            : isDone
                            ? "bg-purple-100 text-purple-600 border-purple-300"
                            : "bg-white text-gray-400 border-gray-300"
                        }`}
                        aria-current={isActive}
                        aria-label={`ขั้นตอนที่ ${idx + 1}`}
                      >
                        {idx + 1}
                      </div>
                      <div className="text-sm font-medium">
                        <div
                          className={
                            isActive
                              ? "text-purple-700 dark:text-purple-300"
                              : isDone
                              ? "text-purple-600 dark:text-purple-400"
                              : "shop-frontend-text-muted"
                          }
                        >
                          {step.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop: connected horizontal stepper */}
              <div
                className="hidden md:flex items-center justify-between"
                role="list"
                aria-label="สถานะคิว"
              >
                {[
                  { key: QueueStatus.WAITING, label: "รอยืนยัน" },
                  { key: QueueStatus.CONFIRMED, label: "รอคิว" },
                  { key: QueueStatus.SERVING, label: "กำลังให้บริการ" },
                  { key: QueueStatus.COMPLETED, label: "เสร็จสิ้น" },
                ].map((step, idx, arr) => {
                  const order = [
                    QueueStatus.WAITING,
                    QueueStatus.CONFIRMED,
                    QueueStatus.SERVING,
                    QueueStatus.COMPLETED,
                  ];
                  const current = customerQueue.status;
                  const currentIndex = order.indexOf(current);
                  const stepIndex = order.indexOf(step.key);
                  const isActive = currentIndex === stepIndex;
                  const isDone = currentIndex > stepIndex;
                  return (
                    <div
                      key={step.key}
                      className="flex-1 flex items-center"
                      role="listitem"
                    >
                      <div
                        className={`flex items-center justify-center w-9 h-9 rounded-full border text-sm font-semibold mr-2 ${
                          isActive
                            ? "bg-purple-600 text-white border-purple-600"
                            : isDone
                            ? "bg-purple-100 text-purple-600 border-purple-300"
                            : "bg-white text-gray-400 border-gray-300"
                        }`}
                        aria-current={isActive}
                        aria-label={`ขั้นตอนที่ ${idx + 1}`}
                      >
                        {idx + 1}
                      </div>
                      <span
                        className={`text-sm ${
                          isActive
                            ? "text-purple-700 dark:text-purple-300"
                            : isDone
                            ? "text-purple-600 dark:text-purple-400"
                            : "shop-frontend-text-muted"
                        }`}
                      >
                        {step.label}
                      </span>
                      {idx < arr.length - 1 && (
                        <div className="flex-1 h-0.5 mx-2 bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="shop-frontend-card-secondary p-6 rounded-lg text-center">
              <div className="text-sm shop-frontend-text-secondary mb-1">
                คิวปัจจุบัน
              </div>
              <div className="text-3xl font-extrabold shop-frontend-text-primary">
                {queueProgress.currentNumber || "-"}
              </div>
            </div>
            <div className="shop-frontend-card-secondary p-6 rounded-lg text-center">
              <div className="text-sm shop-frontend-text-secondary mb-1">
                จำนวนคิวข้างหน้า
              </div>
              <div className="text-3xl font-extrabold shop-frontend-text-primary">
                {customerQueue.totalAhead} คิว
              </div>
            </div>
            <div className="shop-frontend-card-secondary p-6 rounded-lg text-center">
              <div className="text-sm shop-frontend-text-secondary mb-1">
                เวลารอโดยประมาณ
              </div>
              <div className="text-2xl font-bold shop-frontend-text-primary">
                {customerQueue.estimatedWaitTime} นาที
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="shop-frontend-text-secondary">
                      ชื่อลูกค้า
                    </span>
                    <span className="shop-frontend-text-primary font-medium">
                      {customerQueue.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="shop-frontend-text-secondary">
                      เบอร์โทร
                    </span>
                    <span className="shop-frontend-text-primary font-medium">
                      {customerQueue.isOwner ? (
                        getFormatPhone(customer?.phone) || (
                          <span className="text-gray-400">ไม่ระบุ</span>
                        )
                      ) : customerQueue.customerPhone ? (
                        getFormatPhone(customerQueue.customerPhone)
                      ) : (
                        <span className="text-gray-400">ซ่อนเบอร์โทร</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="shop-frontend-text-secondary">
                      เวลาเข้าคิว
                    </span>
                    <span className="shop-frontend-text-primary font-medium">
                      {customerQueue.createdAt}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="shop-frontend-text-secondary">
                      ราคารวม
                    </span>
                    <span className="shop-frontend-service-price font-bold text-lg">
                      ฿{customerQueue.totalPrice}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="shop-frontend-text-secondary block mb-2">
                      บริการที่เลือก
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {customerQueue.services.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 shop-frontend-text-primary"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  {customerQueue.specialRequests && (
                    <div>
                      <span className="shop-frontend-text-secondary block mb-2">
                        คำขอพิเศษ
                      </span>
                      <div className="shop-frontend-card-secondary rounded-lg p-4 shop-frontend-text-primary">
                        {customerQueue.specialRequests}
                      </div>
                    </div>
                  )}
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
              onClick={() => {
                resetData();
              }}
              className="shop-frontend-button-secondary px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
              disabled={actionLoading}
            >
              🔍 ค้นหาคิวอื่น
            </button>

            {canCancel && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="shop-frontend-button-cancel px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
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
        <div className="fixed inset-0 shop-frontend-overlay flex items-center justify-center p-4 z-50">
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
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="shop-frontend-button-primary px-4 py-2 rounded-lg font-medium"
              >
                ไม่ยกเลิก
              </button>
              <button
                onClick={handleCancel}
                className="shop-frontend-button-cancel px-4 py-2 rounded-lg font-medium disabled:opacity-60"
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
