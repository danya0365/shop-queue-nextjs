"use client";

import type {
  PostersViewModel,
  PosterTemplate,
} from "@/src/presentation/presenters/shop/backend/PostersPresenter";
import { usePostersPresenter } from "@/src/presentation/presenters/shop/backend/usePostersPresenter";
import { PaymentModal } from "../../pricing/PaymentModal";
import { SubscriptionUpgradeButton } from "../../shared/SubscriptionUpgradeButton";

interface PostersViewProps {
  shopId: string;
  initialViewModel: PostersViewModel;
}

export function PostersView({ shopId, initialViewModel }: PostersViewProps) {
  const [state, actions] = usePostersPresenter(shopId, initialViewModel);
  const viewModel = state.viewModel;
  const { selectedTemplate, showPreview, showPaymentModal, customization } =
    state;

  // Show loading only on initial load or when explicitly loading
  if (state.isLoading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลโปสเตอร์...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error but we have no data
  if (state.error && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                เกิดข้อผิดพลาด
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {state.error}
              </p>
              <button
                onClick={actions.refreshData}
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

  // If we have no view model and not loading, show empty state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                ยังไม่มีข้อมูลโปสเตอร์
              </p>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                ข้อมูลโปสเตอร์จะแสดงที่นี่เมื่อมีการสร้างโปสเตอร์
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const groupedTemplates = viewModel.templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, PosterTemplate[]>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            จัดการโปสเตอร์
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            สร้างและจัดการโปสเตอร์สำหรับร้านของคุณ
          </p>
        </div>
        <div className="flex space-x-4">
          <div
            className={`px-4 py-2 rounded-lg ${
              viewModel.userSubscription.isPremium
                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{viewModel.userSubscription.isPremium ? "👑" : "📦"}</span>
              <span className="font-medium">
                {viewModel.userSubscription.planName}
              </span>
            </div>
          </div>

          {/* Poster Usage Counter */}
          <div className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg">
            <div className="text-sm">
              <span className="font-medium">โปสเตอร์ฟรี:</span>
              <span className="ml-1">
                {viewModel.userSubscription.usage.remainingFreePosters} /{" "}
                {viewModel.userSubscription.limits.maxFreePosters}
                {viewModel.userSubscription.limits.hasUnlimitedPosters &&
                  " (ไม่จำกัด)"}
              </span>
            </div>
            {viewModel.userSubscription.usage.paidPostersUsed > 0 && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                ซื้อเพิ่ม: {viewModel.userSubscription.usage.paidPostersUsed} ใบ
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shop Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          ข้อมูลร้านค้า
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">ชื่อร้าน</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {viewModel.shopInfo.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">คำอธิบาย</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {viewModel.shopInfo.description}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">เบอร์โทร</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {viewModel.shopInfo.phone}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              เวลาทำการ
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {viewModel.shopInfo.openingHours}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">ที่อยู่</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {viewModel.shopInfo.address}
            </p>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="space-y-8">
        {Object.entries(groupedTemplates).map(([category, templates]) => (
          <div
            key={category}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">
                {actions.getCategoryIcon(category)}
              </span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {actions.getCategoryName(category)}
              </h3>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-sm">
                {templates.length} แบบ
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  } ${
                    template.isPremium && !viewModel.userSubscription.isPremium
                      ? "opacity-60"
                      : ""
                  }`}
                  onClick={() => actions.handleTemplateSelect(template)}
                >
                  {/* Premium Badge */}
                  {template.isPremium && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <span>👑</span>
                      Premium
                    </div>
                  )}

                  {/* Template Preview */}
                  <div
                    className={`w-full h-32 rounded-lg mb-3 flex items-center justify-center text-white font-bold ${
                      template.layout === "landscape"
                        ? "aspect-[4/3]"
                        : "aspect-[3/4]"
                    }`}
                    style={{
                      background: template.backgroundColor,
                      color: template.textColor,
                    }}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">
                        {viewModel.shopInfo.name}
                      </div>
                      <div className="text-xs opacity-80">QR Code</div>
                      <div className="w-8 h-8 bg-white/20 rounded mx-auto mt-1"></div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {template.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-1">
                      {template.features.slice(0, 2).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs text-gray-500 dark:text-gray-400"
                        >
                          <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Layout Badge */}
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          template.layout === "portrait"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        }`}
                      >
                        {template.layout === "portrait"
                          ? "📱 แนวตั้ง"
                          : "🖥️ แนวนอน"}
                      </span>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                      <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <span className="text-sm">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Customization Panel */}
      {selectedTemplate && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            ปรับแต่งโปสเตอร์
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Options */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                ข้อมูลที่จะแสดง
              </h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={customization.showServices}
                    onChange={(e) =>
                      actions.updateCustomization({
                        ...customization,
                        showServices: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    แสดงรายการบริการ
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={customization.showOpeningHours}
                    onChange={(e) =>
                      actions.updateCustomization({
                        ...customization,
                        showOpeningHours: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    แสดงเวลาทำการ
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={customization.showPhone}
                    onChange={(e) =>
                      actions.updateCustomization({
                        ...customization,
                        showPhone: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    แสดงเบอร์โทรศัพท์
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={customization.showAddress}
                    onChange={(e) =>
                      actions.updateCustomization({
                        ...customization,
                        showAddress: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    แสดงที่อยู่
                  </span>
                </label>
              </div>
            </div>

            {/* QR Code Size */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                ขนาด QR Code
              </h4>
              <select
                value={customization.qrCodeSize}
                onChange={(e) =>
                  actions.updateCustomization({
                    ...customization,
                    qrCodeSize: e.target.value as "small" | "medium" | "large",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="small">เล็ก</option>
                <option value="medium">กลาง</option>
                <option value="large">ใหญ่</option>
              </select>

              {/* Custom Text */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ข้อความเพิ่มเติม (ไม่บังคับ)
                </label>
                <textarea
                  value={customization.customText}
                  onChange={(e) =>
                    actions.updateCustomization({
                      ...customization,
                      customText: e.target.value,
                    })
                  }
                  placeholder="เช่น 'สแกน QR Code เพื่อเข้าคิว' หรือ 'ลูกค้าใหม่ลด 10%'"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 flex-end justify-end">
            <button
              onClick={actions.handlePreview}
              className="bg-blue-600 dark:bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
            >
              🔍 ดูตัวอย่างก่อนปริ้น
            </button>
          </div>
        </div>
      )}

      {/* Poster Usage Warning */}
      {!viewModel.userSubscription.usage.canCreateFree &&
        !viewModel.userSubscription.limits.hasUnlimitedPosters && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  โปสเตอร์ฟรีหมดแล้ว
                </h3>
                <p className="text-orange-700 mb-4">
                  คุณได้ใช้โปสเตอร์ฟรี{" "}
                  {viewModel.userSubscription.usage.freePostersUsed} ใบจาก{" "}
                  {viewModel.userSubscription.limits.maxFreePosters} ใบแล้ว
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => actions.setShowPaymentModal(true)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    💳 ซื้อโปสเตอร์ ({viewModel.payPerPosterPrice} บาท/ใบ)
                  </button>
                  <SubscriptionUpgradeButton
                    variant="outline"
                    targetPlan="pro"
                    currentPlan={viewModel.userSubscription.tier}
                  >
                    🚀 อัปเกรดแผน Pro
                  </SubscriptionUpgradeButton>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Premium Upgrade Banner */}
      {!viewModel.userSubscription.isPremium && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 mt-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🚀 อัพเกรดเป็น Premium</h3>
              <p className="text-yellow-100">
                ปลดล็อคโปสเตอร์พิเศษ {viewModel.premiumTemplates.length} แบบ
                พร้อมฟีเจอร์เพิ่มเติม
              </p>
              <ul className="mt-2 text-sm text-yellow-100 space-y-1">
                <li>
                  • โปสเตอร์ดีไซน์พิเศษ {viewModel.premiumTemplates.length} แบบ
                </li>
                <li>
                  • โปสเตอร์ฟรี{" "}
                  {viewModel.userSubscription.tier === "free"
                    ? "10"
                    : "ไม่จำกัด"}{" "}
                  ใบ/เดือน
                </li>
                <li>• ปรับแต่งสีและฟอนต์ได้</li>
                <li>• อัพโหลดโลโก้ร้านเอง</li>
                <li>• ไม่มี watermark</li>
              </ul>
            </div>
            <div>
              <SubscriptionUpgradeButton
                variant="secondary"
                size="lg"
                targetPlan="pro"
                currentPlan={viewModel.userSubscription.tier}
                className="bg-white text-orange-600 hover:bg-gray-100"
              >
                อัพเกรดตอนนี้
              </SubscriptionUpgradeButton>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  ตัวอย่างโปสเตอร์
                </h3>
                <button
                  onClick={() => actions.setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Poster Preview */}
              <div
                className="flex justify-center p-6"
                ref={state.posterPreviewRef}
              >
                <div
                  className={`${
                    selectedTemplate.layout === "portrait"
                      ? "w-80 h-96"
                      : "w-96 h-72"
                  } rounded-lg shadow-lg p-8 text-center flex flex-col justify-between`}
                  style={{
                    background: selectedTemplate.backgroundColor,
                    color: selectedTemplate.textColor,
                  }}
                >
                  {/* Header */}
                  <div>
                    <h1 className="text-2xl font-bold mb-2">
                      {viewModel.shopInfo.name}
                    </h1>
                    <p className="text-sm opacity-90 mb-4">
                      {viewModel.shopInfo.description}
                    </p>
                  </div>

                  {/* QR Code Area */}
                  <div className="flex-1 flex items-center justify-center">
                    <div
                      className={`bg-white rounded-lg flex items-center justify-center ${
                        customization.qrCodeSize === "small"
                          ? "w-20 h-20"
                          : customization.qrCodeSize === "large"
                          ? "w-32 h-32"
                          : "w-24 h-24"
                      }`}
                    >
                      <span className="text-gray-600 text-xs">QR Code</span>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="space-y-2 text-sm">
                    {customization.customText && (
                      <p
                        className="font-medium"
                        style={{ color: selectedTemplate.accentColor }}
                      >
                        {customization.customText}
                      </p>
                    )}
                    {customization.showPhone && (
                      <p>📞 {viewModel.shopInfo.phone}</p>
                    )}
                    {customization.showOpeningHours && (
                      <p>🕒 {viewModel.shopInfo.openingHours}</p>
                    )}
                    {customization.showAddress && (
                      <p className="text-xs opacity-80">
                        📍 {viewModel.shopInfo.address}
                      </p>
                    )}
                    {customization.showServices && (
                      <div className="flex flex-wrap gap-1 justify-center mt-2">
                        {viewModel.shopInfo.services
                          .slice(0, 3)
                          .map((service, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded-full text-xs"
                              style={{
                                backgroundColor:
                                  selectedTemplate.accentColor + "20",
                                color: selectedTemplate.accentColor,
                              }}
                            >
                              {service}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => actions.setShowPreview(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ปิด
                </button>
                <button
                  onClick={actions.handleCreatePoster}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {viewModel.userSubscription.usage.canCreateFree ||
                  viewModel.userSubscription.limits.hasUnlimitedPosters
                    ? "🖨️ ปริ้นฟรี"
                    : `💳 ซื้อ (${viewModel.payPerPosterPrice} บาท)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Target with hidden visibility */}
      <div className="hidden">
        {selectedTemplate ? (
          <div className="flex justify-center p-6">
            <div
              className={`${
                selectedTemplate.layout === "portrait"
                  ? "w-80 h-96"
                  : "w-96 h-72"
              } rounded-lg shadow-lg p-8 text-center flex flex-col justify-between`}
              style={{
                background: selectedTemplate.backgroundColor,
                color: selectedTemplate.textColor,
              }}
            >
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {viewModel.shopInfo.name}
                </h1>
                <p className="text-sm opacity-90 mb-4">
                  {viewModel.shopInfo.description}
                </p>
              </div>

              {/* QR Code Area */}
              <div className="flex-1 flex items-center justify-center">
                <div
                  className={`bg-white rounded-lg flex items-center justify-center ${
                    customization.qrCodeSize === "small"
                      ? "w-20 h-20"
                      : customization.qrCodeSize === "large"
                      ? "w-32 h-32"
                      : "w-24 h-24"
                  }`}
                >
                  <span className="text-gray-600 text-xs">QR Code</span>
                </div>
              </div>

              {/* Footer Info */}
              <div className="space-y-2 text-sm">
                {customization.customText && (
                  <p
                    className="font-medium"
                    style={{ color: selectedTemplate.accentColor }}
                  >
                    {customization.customText}
                  </p>
                )}
                {customization.showPhone && (
                  <p>📞 {viewModel.shopInfo.phone}</p>
                )}
                {customization.showOpeningHours && (
                  <p>🕒 {viewModel.shopInfo.openingHours}</p>
                )}
                {customization.showAddress && (
                  <p className="text-xs opacity-80">
                    📍 {viewModel.shopInfo.address}
                  </p>
                )}
                {customization.showServices && (
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {viewModel.shopInfo.services
                      .slice(0, 3)
                      .map((service, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor:
                              selectedTemplate.accentColor + "20",
                            color: selectedTemplate.accentColor,
                          }}
                        >
                          {service}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Payment Modal for Pay-per-Poster */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => actions.setShowPaymentModal(false)}
        plan={{
          id: "poster-payment",
          name: "โปสเตอร์แบบจ่ายต่อใบ",
          nameEn: "Pay-per-Poster",
          description: `สร้างโปสเตอร์ 1 ใบ`,
          descriptionEn: "Create 1 poster",
          price: viewModel.payPerPosterPrice,
          currency: "THB",
          billingPeriod: "one_time",
          type: "one_time",
          features: [
            "โปสเตอร์คุณภาพสูง",
            "QR Code ที่กำหนดเอง",
            "ดาวน์โหลดได้ทันที",
          ],
          featuresEn: [
            "High-quality poster",
            "Custom QR Code",
            "Instant download",
          ],
          limits: undefined,
          isPopular: false,
          isRecommended: false,
          buttonText: `จ่าย ${viewModel.payPerPosterPrice} บาท`,
          buttonTextEn: `Pay ${viewModel.payPerPosterPrice} THB`,
        }}
        isAnnual={false}
        currentPlan={viewModel.userSubscription.tier}
      />
    </div>
  );
}
