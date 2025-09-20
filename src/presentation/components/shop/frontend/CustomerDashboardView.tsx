"use client";

import { CustomerDashboardViewModel } from "@/src/presentation/presenters/shop/frontend/CustomerDashboardPresenter";
import { useQRCode } from "next-qrcode";
import Link from "next/link";
import { useState } from "react";

interface CustomerDashboardViewProps {
  viewModel: CustomerDashboardViewModel;
  shopId: string;
}

export function CustomerDashboardView({
  viewModel,
  shopId,
}: CustomerDashboardViewProps) {
  const { Canvas } = useQRCode();
  const {
    shopInfo,
    queueStatus,
    popularServices,
    promotions,
    canJoinQueue,
    announcement,
  } = viewModel;
  const [showQRCode, setShowQRCode] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Announcement Banner */}
      {announcement && (
        <div className="frontend-announcement p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📢</span>
            <p className="font-medium">{announcement}</p>
          </div>
        </div>
      )}

      {/* Shop Header */}
      <div className="frontend-card overflow-hidden">
        <div className="frontend-shop-header p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{shopInfo.name}</h1>
              <p className="frontend-shop-header-text-light mb-4">
                {shopInfo.description}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <span>⭐</span>
                  <span>{shopInfo.rating}/5</span>
                  <span>({shopInfo.totalReviews} รีวิว)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🕒</span>
                  <span>{shopInfo.openingHours}</span>
                </div>
                <div
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    shopInfo.isOpen
                      ? "frontend-status-open"
                      : "frontend-status-closed"
                  }`}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>{shopInfo.isOpen ? "เปิดอยู่" : "ปิดแล้ว"}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="frontend-button-primary px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                📱 QR Code
              </button>
            </div>
          </div>
        </div>

        {showQRCode && (
          <div className="p-6 frontend-qr-section">
            <div className="text-center">
              <div className="w-32 h-32 frontend-qr-code rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Canvas
                  text={`${window.location.origin}/shop/${shopId}/queue`}
                  options={{
                    errorCorrectionLevel: "M",
                    margin: 2,
                    scale: 3,
                    width: 120,
                  }}
                  logo={{
                    src: "/qr-logo.png",
                    options: { width: 30 },
                  }}
                />
              </div>
              <p className="text-sm frontend-text-secondary">
                สแกน QR Code เพื่อเข้าคิวด่วน
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Queue Status */}
      <div className="frontend-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold frontend-text-primary mb-6">
            สถานะคิวปัจจุบัน
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 frontend-queue-current rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">
                  {queueStatus.currentNumber}
                </span>
              </div>
              <p className="text-sm frontend-text-secondary">คิวปัจจุบัน</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 frontend-queue-waiting rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">
                  {queueStatus.totalWaiting}
                </span>
              </div>
              <p className="text-sm frontend-text-secondary">คิวรอ</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 frontend-queue-time rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">
                  {queueStatus.estimatedWaitTime}
                </span>
              </div>
              <p className="text-sm frontend-text-secondary">เวลารอ (นาที)</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 frontend-queue-average rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">
                  {queueStatus.averageServiceTime}
                </span>
              </div>
              <p className="text-sm frontend-text-secondary">
                เวลาเฉลี่ย (นาที)
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            {canJoinQueue ? (
              <Link
                href={`/shop/${shopId}/queue`}
                className="frontend-button-join-queue px-8 py-4 rounded-xl font-semibold text-lg"
              >
                🎫 เข้าคิวตอนนี้
              </Link>
            ) : (
              <div className="text-center">
                <button
                  disabled
                  className="frontend-button-disabled px-8 py-4 rounded-xl font-semibold text-lg"
                >
                  ไม่สามารถเข้าคิวได้ในขณะนี้
                </button>
                <p className="text-sm frontend-text-muted mt-2">
                  {!shopInfo.isOpen ? "ร้านปิดแล้ว" : "คิวเต็ม กรุณารอสักครู่"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Services */}
      <div className="frontend-card">
        <div className="p-6 border-b frontend-card-border">
          <h2 className="text-xl font-semibold frontend-text-primary">
            เมนูยอดนิยม
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service) => (
              <div
                key={service.id}
                className="frontend-service-card rounded-lg p-4"
              >
                <div className="text-center">
                  <span className="text-4xl mb-3 block">{service.icon}</span>
                  <h3 className="font-semibold frontend-text-primary mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm frontend-text-secondary mb-3">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promotions */}
      {promotions.length > 0 && (
        <div className="frontend-card">
          <div className="p-6 border-b frontend-card-border">
            <h2 className="text-xl font-semibold frontend-text-primary">
              โปรโมชันพิเศษ
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="frontend-promotion-card rounded-lg p-6"
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{promotion.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold frontend-text-primary mb-2">
                        {promotion.title}
                      </h3>
                      <p className="text-sm frontend-text-secondary mb-3">
                        {promotion.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="frontend-promotion-badge px-3 py-1 rounded-full text-sm font-medium">
                          ลด {promotion.discount}%
                        </span>
                        <span className="text-xs frontend-text-muted">
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
          className="frontend-card frontend-card-hover p-6"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">🎫</span>
            <h3 className="font-semibold frontend-text-primary mb-2">
              เข้าคิว
            </h3>
            <p className="text-sm frontend-text-secondary">จองคิวล่วงหน้า</p>
          </div>
        </Link>

        <Link
          href={`/shop/${shopId}/status`}
          className="frontend-card frontend-card-hover p-6"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">⏰</span>
            <h3 className="font-semibold frontend-text-primary mb-2">
              ติดตามคิว
            </h3>
            <p className="text-sm frontend-text-secondary">ดูสถานะคิวของคุณ</p>
          </div>
        </Link>

        <Link
          href={`/shop/${shopId}/rewards`}
          className="frontend-card frontend-card-hover p-6"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">🎁</span>
            <h3 className="font-semibold frontend-text-primary mb-2">
              แต้มสะสม
            </h3>
            <p className="text-sm frontend-text-secondary">
              ดูแต้มและสิทธิพิเศษ
            </p>
          </div>
        </Link>
      </div>

      {/* Shop Info */}
      <div className="frontend-card">
        <div className="p-6 border-b frontend-card-border">
          <h2 className="text-xl font-semibold frontend-text-primary">
            ข้อมูลร้าน
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <span className="text-xl">📍</span>
            <div>
              <p className="font-medium frontend-text-primary">ที่อยู่</p>
              <p className="frontend-text-secondary">{shopInfo.address}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-xl">📞</span>
            <div>
              <p className="font-medium frontend-text-primary">เบอร์โทร</p>
              <p className="frontend-text-secondary">{shopInfo.phone}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-xl">🕒</span>
            <div>
              <p className="font-medium frontend-text-primary">เวลาเปิด-ปิด</p>
              <p className="frontend-text-secondary">{shopInfo.openingHours}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
