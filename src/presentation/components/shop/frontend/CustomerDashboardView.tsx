"use client";

import { useCustomerDashboardPresenter } from "@/src/presentation/presenters/shop/frontend/useCustomerDashboardPresenter";
import { useQRCode } from "next-qrcode";
import Link from "next/link";
import { useState } from "react";

interface CustomerDashboardViewProps {
  shopId: string;
  initialViewModel?: import("@/src/presentation/presenters/shop/frontend/CustomerDashboardPresenter").CustomerDashboardViewModel;
}

export function CustomerDashboardView({
  shopId,
  initialViewModel,
}: CustomerDashboardViewProps) {
  const { viewModel, loading, error, refreshData } =
    useCustomerDashboardPresenter(shopId, initialViewModel);
  const { Canvas } = useQRCode();
  const [showQRCode, setShowQRCode] = useState(false);

  // Show loading only on initial load or when explicitly loading
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลหน้าร้าน...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error but we have no data
  if (error && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                {error}
              </p>
              <button
                onClick={refreshData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!viewModel) {
    return null;
  }

  const {
    shopInfo,
    queueStatus,
    popularServices,
    promotions,
    canJoinQueue,
    announcement,
  } = viewModel;

  return (
    <div className="flex flex-col gap-8">
      {/* Announcement Banner */}
      {announcement && (
        <div className="shop-frontend-announcement p-3 sm:p-4 rounded-lg sm:rounded-xl">
          <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
            <span className="text-xl sm:text-2xl mt-0.5 sm:mt-0">📢</span>
            <p className="font-medium text-sm sm:text-base break-words">
              {announcement}
            </p>
          </div>
        </div>
      )}

      {/* Shop Header */}
      <div className="shop-frontend-card overflow-hidden">
        <div className="shop-frontend-shop-header p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 truncate">
                {shopInfo.name}
              </h1>
              <p className="shop-frontend-shop-header-text-light mb-3 sm:mb-4 text-sm sm:text-base">
                {shopInfo.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <span>⭐</span>
                  <span>{shopInfo.rating}/5</span>
                  <span className="hidden sm:inline">
                    ({shopInfo.totalReviews} รีวิว)
                  </span>
                  <span className="sm:hidden">({shopInfo.totalReviews})</span>
                </div>
                <div className="hidden sm:flex items-center space-x-1">
                  <span>•</span>
                </div>
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <span>🕒</span>
                  <span className="truncate max-w-[120px] sm:max-w-none">
                    {shopInfo.openingHours}
                  </span>
                </div>
                <div className="hidden sm:flex items-center space-x-1">
                  <span>•</span>
                </div>
                <div
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    shopInfo.isOpen
                      ? "shop-frontend-status-open"
                      : "shop-frontend-status-closed"
                  }`}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>{shopInfo.isOpen ? "เปิดอยู่" : "ปิดแล้ว"}</span>
                </div>
              </div>
            </div>
            <div className="text-right sm:text-left">
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="shop-frontend-button-primary px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto text-sm sm:text-base"
              >
                📱 QR Code
              </button>
            </div>
          </div>
        </div>

        {showQRCode && (
          <div className="p-4 sm:p-6 shop-frontend-qr-section">
            <div className="text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 shop-frontend-qr-code rounded-lg mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <Canvas
                  text={`${window.location.origin}/shop/${shopId}/queue`}
                  options={{
                    errorCorrectionLevel: "M",
                    margin: 2,
                    scale:
                      typeof window !== "undefined" && window.innerWidth < 640
                        ? 2.5
                        : 3,
                    width:
                      typeof window !== "undefined" && window.innerWidth < 640
                        ? 100
                        : 120,
                  }}
                  logo={{
                    src: "/qr-logo.png",
                    options: {
                      width:
                        typeof window !== "undefined" && window.innerWidth < 640
                          ? 24
                          : 30,
                    },
                  }}
                />
              </div>
              <p className="text-xs sm:text-sm shop-frontend-text-secondary">
                สแกน QR Code เพื่อเข้าคิวด่วน
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Queue Status */}
      <div className="shop-frontend-card">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold shop-frontend-text-primary mb-4 sm:mb-6">
            สถานะคิวปัจจุบัน
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="text-center p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shop-frontend-queue-current rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl font-bold">
                  {queueStatus.currentNumber || "-"}
                </span>
              </div>
              <p className="text-xs sm:text-sm shop-frontend-text-secondary">
                คิวปัจจุบัน
              </p>
            </div>

            <div className="text-center p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shop-frontend-queue-waiting rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl font-bold">
                  {queueStatus.totalConfirmed}
                </span>
              </div>
              <p className="text-xs sm:text-sm shop-frontend-text-secondary">
                คิวรอ
              </p>
            </div>

            <div className="text-center p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shop-frontend-queue-time rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl font-bold">
                  {Math.floor(queueStatus.estimatedWaitTime)}
                </span>
              </div>
              <p className="text-xs sm:text-sm shop-frontend-text-secondary">
                เวลารอ (นาที)
              </p>
            </div>

            <div className="text-center p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shop-frontend-queue-average rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl font-bold">
                  {Math.floor(queueStatus.averageServiceTime)}
                </span>
              </div>
              <p className="text-sm shop-frontend-text-secondary">
                เวลาเฉลี่ย (นาที)
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            {canJoinQueue ? (
              <Link
                href={`/shop/${shopId}/queue`}
                className="shop-frontend-button-join-queue px-8 py-4 rounded-xl font-semibold text-lg"
              >
                🎫 เข้าคิวตอนนี้
              </Link>
            ) : (
              <div className="text-center">
                <button
                  disabled
                  className="shop-frontend-button-disabled px-8 py-4 rounded-xl font-semibold text-lg"
                >
                  ไม่สามารถเข้าคิวได้ในขณะนี้
                </button>
                <p className="text-sm shop-frontend-text-muted mt-2">
                  {!shopInfo.isOpen ? "ร้านปิดแล้ว" : "คิวเต็ม กรุณารอสักครู่"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Services */}
      <div className="shop-frontend-card">
        <div className="p-6 border-b shop-frontend-card-border">
          <h2 className="text-xl font-semibold shop-frontend-text-primary">
            เมนูยอดนิยม
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service) => (
              <div
                key={service.id}
                className="shop-frontend-service-card rounded-lg p-4"
              >
                <div className="text-center">
                  <span className="text-4xl mb-3 block">{service.icon}</span>
                  <h3 className="font-semibold shop-frontend-text-primary mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm shop-frontend-text-secondary mb-3">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold shop-frontend-service-price">
                      ฿{service.price}
                    </span>
                    <span className="shop-frontend-text-muted">
                      ~{service.estimatedTime} นาที
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promotions */}
      {promotions.length > 0 && (
        <div className="shop-frontend-card">
          <div className="p-6 border-b shop-frontend-card-border">
            <h2 className="text-xl font-semibold shop-frontend-text-primary">
              โปรโมชันพิเศษ
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="shop-frontend-promotion-card rounded-lg p-6"
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{promotion.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold shop-frontend-text-primary mb-2">
                        {promotion.title}
                      </h3>
                      <p className="text-sm shop-frontend-text-secondary mb-3">
                        {promotion.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="shop-frontend-promotion-badge px-3 py-1 rounded-full text-sm font-medium">
                          ลด {promotion.discount}%
                        </span>
                        <span className="text-xs shop-frontend-text-muted">
                          ถึง {promotion.validUntil}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href={`/shop/${shopId}/queue`}
          className="shop-frontend-card shop-frontend-card-hover p-6"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">🎫</span>
            <h3 className="font-semibold shop-frontend-text-primary mb-2">
              เข้าคิว
            </h3>
            <p className="text-sm shop-frontend-text-secondary">
              จองคิวล่วงหน้า
            </p>
          </div>
        </Link>

        <Link
          href={`/shop/${shopId}/status`}
          className="shop-frontend-card shop-frontend-card-hover p-6"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">⏰</span>
            <h3 className="font-semibold shop-frontend-text-primary mb-2">
              ติดตามคิว
            </h3>
            <p className="text-sm shop-frontend-text-secondary">
              ดูสถานะคิวของคุณ
            </p>
          </div>
        </Link>

        <Link
          href={`/shop/${shopId}/rewards`}
          className="shop-frontend-card shop-frontend-card-hover p-6"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">🎁</span>
            <h3 className="font-semibold shop-frontend-text-primary mb-2">
              แต้มสะสม
            </h3>
            <p className="text-sm shop-frontend-text-secondary">
              ดูแต้มและสิทธิพิเศษ
            </p>
          </div>
        </Link>
      </div>

      {/* Shop Info */}
      <div className="shop-frontend-card">
        <div className="p-6 border-b shop-frontend-card-border">
          <h2 className="text-xl font-semibold shop-frontend-text-primary">
            ข้อมูลร้าน
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <span className="text-xl">📍</span>
            <div>
              <p className="font-medium shop-frontend-text-primary">ที่อยู่</p>
              <p className="shop-frontend-text-secondary">{shopInfo.address}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-xl">📞</span>
            <div>
              <p className="font-medium shop-frontend-text-primary">เบอร์โทร</p>
              <p className="shop-frontend-text-secondary">{shopInfo.phone}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-xl">🕒</span>
            <div>
              <p className="font-medium shop-frontend-text-primary">
                เวลาเปิด-ปิด
              </p>
              <p className="shop-frontend-text-secondary">
                {shopInfo.openingHours}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
