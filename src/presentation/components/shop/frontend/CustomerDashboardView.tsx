'use client';

import { CustomerDashboardViewModel } from '@/src/presentation/presenters/shop/frontend/CustomerDashboardPresenter';
import Link from 'next/link';
import { useState } from 'react';

interface CustomerDashboardViewProps {
  viewModel: CustomerDashboardViewModel;
  shopId: string;
}

export function CustomerDashboardView({ viewModel, shopId }: CustomerDashboardViewProps) {
  const { shopInfo, queueStatus, popularServices, promotions, canJoinQueue, announcement } = viewModel;
  const [showQRCode, setShowQRCode] = useState(false);

  return (
    <div className="space-y-8">
      {/* Announcement Banner */}
      {announcement && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📢</span>
            <p className="font-medium">{announcement}</p>
          </div>
        </div>
      )}

      {/* Shop Header */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{shopInfo.name}</h1>
              <p className="text-purple-100 mb-4">{shopInfo.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <span>⭐</span>
                  <span>{shopInfo.rating}/5</span>
                  <span>({shopInfo.totalReviews} รีวิว)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🕒</span>
                  <span>{shopInfo.openTime} - {shopInfo.closeTime}</span>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                  shopInfo.isOpen ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>{shopInfo.isOpen ? 'เปิดอยู่' : 'ปิดแล้ว'}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                📱 QR Code
              </button>
            </div>
          </div>
        </div>

        {showQRCode && (
          <div className="p-6 border-t bg-gray-50">
            <div className="text-center">
              <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
              <p className="text-sm text-gray-600">สแกน QR Code เพื่อเข้าคิวด่วน</p>
            </div>
          </div>
        )}
      </div>

      {/* Queue Status */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">สถานะคิวปัจจุบัน</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">{queueStatus.currentNumber}</span>
              </div>
              <p className="text-sm text-gray-600">คิวปัจจุบัน</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-orange-600">{queueStatus.totalWaiting}</span>
              </div>
              <p className="text-sm text-gray-600">คิวรอ</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">{queueStatus.estimatedWaitTime}</span>
              </div>
              <p className="text-sm text-gray-600">เวลารอ (นาที)</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-purple-600">{queueStatus.averageServiceTime}</span>
              </div>
              <p className="text-sm text-gray-600">เวลาเฉลี่ย (นาที)</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            {canJoinQueue ? (
              <Link
                href={`/shop/${shopId}/queue`}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105"
              >
                🎫 เข้าคิวตอนนี้
              </Link>
            ) : (
              <div className="text-center">
                <button
                  disabled
                  className="bg-gray-300 text-gray-500 px-8 py-4 rounded-xl font-semibold text-lg cursor-not-allowed"
                >
                  ไม่สามารถเข้าคิวได้ในขณะนี้
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  {!shopInfo.isOpen ? 'ร้านปิดแล้ว' : 'คิวเต็ม กรุณารอสักครู่'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Services */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">เมนูยอดนิยม</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service) => (
              <div key={service.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="text-center">
                  <span className="text-4xl mb-3 block">{service.icon}</span>
                  <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-purple-600">฿{service.price}</span>
                    <span className="text-gray-500">~{service.estimatedTime} นาที</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promotions */}
      {promotions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">โปรโมชันพิเศษ</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{promotion.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{promotion.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{promotion.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          ลด {promotion.discount}%
                        </span>
                        <span className="text-xs text-gray-500">ถึง {promotion.validUntil}</span>
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
          className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">🎫</span>
            <h3 className="font-semibold text-gray-900 mb-2">เข้าคิว</h3>
            <p className="text-sm text-gray-600">จองคิวล่วงหน้า</p>
          </div>
        </Link>

        <Link
          href={`/shop/${shopId}/status`}
          className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">⏰</span>
            <h3 className="font-semibold text-gray-900 mb-2">ติดตามคิว</h3>
            <p className="text-sm text-gray-600">ดูสถานะคิวของคุณ</p>
          </div>
        </Link>

        <Link
          href={`/shop/${shopId}/rewards`}
          className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">🎁</span>
            <h3 className="font-semibold text-gray-900 mb-2">แต้มสะสม</h3>
            <p className="text-sm text-gray-600">ดูแต้มและสิทธิพิเศษ</p>
          </div>
        </Link>
      </div>

      {/* Shop Info */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">ข้อมูลร้าน</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <span className="text-xl">📍</span>
            <div>
              <p className="font-medium text-gray-900">ที่อยู่</p>
              <p className="text-gray-600">{shopInfo.address}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-xl">📞</span>
            <div>
              <p className="font-medium text-gray-900">เบอร์โทร</p>
              <p className="text-gray-600">{shopInfo.phone}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-xl">🕒</span>
            <div>
              <p className="font-medium text-gray-900">เวลาเปิด-ปิด</p>
              <p className="text-gray-600">{shopInfo.openTime} - {shopInfo.closeTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
