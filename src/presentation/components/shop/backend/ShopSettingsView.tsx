"use client";

import { useState, useEffect } from "react";
import { ShopSettingsViewModel } from "@/src/presentation/presenters/shop/backend/ShopSettingsPresenter";
import { useShopSettingsPresenter } from "@/src/presentation/presenters/shop/backend/useShopSettingsPresenter";

interface ShopSettingsViewProps {
  shopId: string;
  initialViewModel?: ShopSettingsViewModel;
}

export function ShopSettingsView({
  shopId,
  initialViewModel,
}: ShopSettingsViewProps) {
  const {
    // Data
    viewModel,
    isLoading,
    error,

    // State
    activeCategory,
    isEditing,
    showExportModal,
    exportData,
    importData,
    isExporting,
    isImporting,
    importError,
    isSaving,
    saveSuccess,
    saveError,
    fieldErrors,
    formData,

    // CRUD Operations
    getShopSettings,
    updateShopSettings,
    createShopSettings,
    exportShopSettings,
    importShopSettings,
    refreshShopSettings,
    updateShopStatus,

    // State Actions
    setActiveCategory,
    setIsEditing,
    setShowExportModal,
    setExportData,
    setImportData,
    setIsExporting,
    setIsImporting,
    setImportError,
    setIsSaving,
    setSaveSuccess,
    setSaveError,
    setFieldErrors,
    setFormData,

    // Event Handlers
    handleInputChange,
    handleSave,
    handleExport,
    handleImport,
    handleResetToDefaults,
  } = useShopSettingsPresenter(shopId, initialViewModel);

  // Shop status state (separate from form data since it's part of Shop entity, not ShopSettings)
  const [shopStatus, setShopStatus] = useState<"open" | "closed">("open");
  
  // Initialize shop status from shop data
  useEffect(() => {
    if (viewModel.shop) {
      // Map shop status from DTO to UI format
      const shopStatus = viewModel.shop.status;
      setShopStatus(shopStatus === "active" ? "open" : "closed");
    }
  }, [viewModel.shop, shopId]);

  const handleShopStatusChange = async (newStatus: "open" | "closed") => {
    try {
      await updateShopStatus(newStatus);
      // The shop status will be updated from the refreshed viewModel
      // No need to manually setShopStatus as it will be updated from the useEffect
    } catch (error) {
      console.error("Failed to update shop status:", error);
      // You could show an error message here
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveError(null);
    setFieldErrors({});
  };

  if (!viewModel || !viewModel.settings) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-4">⚙️</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          ไม่พบการตั้งค่าร้าน
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          กรุณาติดต่อผู้ดูแลระบบ
        </p>
      </div>
    );
  }

  const settings = viewModel.settings;
  const stats = viewModel.stats;

  // Use form data for editing, original settings for display
  const currentSettings = isEditing ? formData : settings;

  const renderBasicSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ชื่อร้าน *
          </label>
          <input
            type="text"
            value={currentSettings.shopName || ""}
            onChange={(e) => handleInputChange("shopName", e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 ${
              fieldErrors.shopName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {fieldErrors.shopName && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.shopName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            เบอร์โทรศัพท์
          </label>
          <input
            type="tel"
            value={currentSettings.shopPhone || ""}
            onChange={(e) => handleInputChange("shopPhone", e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          คำอธิบายร้าน
        </label>
        <textarea
          value={currentSettings.shopDescription || ""}
          onChange={(e) => handleInputChange("shopDescription", e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            อีเมล
          </label>
          <input
            type="email"
            value={currentSettings.shopEmail || ""}
            onChange={(e) => handleInputChange("shopEmail", e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 ${
              fieldErrors.shopEmail
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {fieldErrors.shopEmail && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.shopEmail}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            เว็บไซต์
          </label>
          <input
            type="url"
            value={currentSettings.shopWebsite || ""}
            onChange={(e) => handleInputChange("shopWebsite", e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ที่อยู่
        </label>
        <textarea
          value={currentSettings.shopAddress || ""}
          onChange={(e) => handleInputChange("shopAddress", e.target.value)}
          disabled={!isEditing}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
        />
      </div>
    </div>
  );

  const renderQueueSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            จำนวนคิวสูงสุดต่อบริการ
          </label>
          <input
            type="number"
            value={currentSettings.maxQueuePerService || 1}
            onChange={(e) =>
              handleInputChange(
                "maxQueuePerService",
                parseInt(e.target.value) || 1
              )
            }
            disabled={!isEditing}
            min="1"
            max="50"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 ${
              fieldErrors.maxQueuePerService
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {fieldErrors.maxQueuePerService && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.maxQueuePerService}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            เวลาหมดอายุคิว (นาที)
          </label>
          <input
            type="number"
            value={currentSettings.queueTimeoutMinutes || 5}
            onChange={(e) =>
              handleInputChange(
                "queueTimeoutMinutes",
                parseInt(e.target.value) || 5
              )
            }
            disabled={!isEditing}
            min="5"
            max="60"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 ${
              fieldErrors.queueTimeoutMinutes
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {fieldErrors.queueTimeoutMinutes && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.queueTimeoutMinutes}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowWalkIn"
            checked={currentSettings.allowWalkIn || false}
            onChange={(e) => handleInputChange("allowWalkIn", e.target.checked)}
            disabled={!isEditing}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label
            htmlFor="allowWalkIn"
            className="ml-2 block text-sm text-gray-900 dark:text-white"
          >
            อนุญาตให้เดินเข้ามาจองคิวได้
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowAdvanceBooking"
            checked={currentSettings.allowAdvanceBooking || false}
            onChange={(e) =>
              handleInputChange("allowAdvanceBooking", e.target.checked)
            }
            disabled={!isEditing}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label
            htmlFor="allowAdvanceBooking"
            className="ml-2 block text-sm text-gray-900 dark:text-white"
          >
            อนุญาตให้จองล่วงหน้าได้
          </label>
        </div>
      </div>

      {currentSettings.allowAdvanceBooking && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            จองล่วงหน้าได้สูงสุด (วัน)
          </label>
          <input
            type="number"
            value={currentSettings.maxAdvanceBookingDays || 1}
            onChange={(e) =>
              handleInputChange(
                "maxAdvanceBookingDays",
                parseInt(e.target.value) || 1
              )
            }
            disabled={!isEditing}
            min="1"
            max="30"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>
      )}
    </div>
  );

  const renderPointsSettings = () => (
    <div className="flex gap-6 relative min-h-[200px]">
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="text-center py-8 z-10">
          <div className="text-4xl mb-4">🚧</div>
          <p className="text-gray-600 dark:text-gray-400">
            หมวดหมู่นี้กำลังพัฒนา
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="pointsEnabled"
          checked={currentSettings.pointsEnabled || false}
          onChange={(e) => handleInputChange("pointsEnabled", e.target.checked)}
          disabled={!isEditing}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
        />
        <label
          htmlFor="pointsEnabled"
          className="ml-2 block text-sm text-gray-900 dark:text-white"
        >
          เปิดใช้งานระบบแต้มสะสม
        </label>
      </div>

      {currentSettings.pointsEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              แต้มต่อ 1 บาท
            </label>
            <input
              type="number"
              value={currentSettings.pointsPerBaht || 0}
              onChange={(e) =>
                handleInputChange(
                  "pointsPerBaht",
                  parseFloat(e.target.value) || 0
                )
              }
              disabled={!isEditing}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              แต้มหมดอายุ (เดือน)
            </label>
            <input
              type="number"
              value={currentSettings.pointsExpiryMonths || 1}
              onChange={(e) =>
                handleInputChange(
                  "pointsExpiryMonths",
                  parseInt(e.target.value) || 1
                )
              }
              disabled={!isEditing}
              min="1"
              max="60"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              แต้มขั้นต่ำที่ใช้ได้
            </label>
            <input
              type="number"
              value={currentSettings.minimumPointsToRedeem || 0}
              onChange={(e) =>
                handleInputChange(
                  "minimumPointsToRedeem",
                  parseInt(e.target.value) || 0
                )
              }
              disabled={!isEditing}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="flex gap-6 relative">
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="text-center py-8 z-10">
          <div className="text-4xl mb-4">🚧</div>
          <p className="text-gray-600 dark:text-gray-400">
            หมวดหมู่นี้กำลังพัฒนา
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            วิธีการชำระเงิน
          </h3>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptCash"
              checked={currentSettings.acceptCash || false}
              onChange={(e) =>
                handleInputChange("acceptCash", e.target.checked)
              }
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label
              htmlFor="acceptCash"
              className="ml-2 block text-sm text-gray-900 dark:text-white"
            >
              💵 เงินสด
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptCreditCard"
              checked={currentSettings.acceptCreditCard || false}
              onChange={(e) =>
                handleInputChange("acceptCreditCard", e.target.checked)
              }
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label
              htmlFor="acceptCreditCard"
              className="ml-2 block text-sm text-gray-900 dark:text-white"
            >
              💳 บัตรเครดิต/เดบิต
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptBankTransfer"
              checked={currentSettings.acceptBankTransfer || false}
              onChange={(e) =>
                handleInputChange("acceptBankTransfer", e.target.checked)
              }
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label
              htmlFor="acceptBankTransfer"
              className="ml-2 block text-sm text-gray-900 dark:text-white"
            >
              🏦 โอนเงินผ่านธนาคาร
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptPromptPay"
              checked={currentSettings.acceptPromptPay || false}
              onChange={(e) =>
                handleInputChange("acceptPromptPay", e.target.checked)
              }
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label
              htmlFor="acceptPromptPay"
              className="ml-2 block text-sm text-gray-900 dark:text-white"
            >
              📱 PromptPay
            </label>
          </div>
        </div>

        {currentSettings.acceptPromptPay && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              PromptPay ID
            </label>
            <input
              type="text"
              value={currentSettings.promptPayId || ""}
              onChange={(e) => handleInputChange("promptPayId", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="flex gap-6 relative">
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="text-center py-8 z-10">
          <div className="text-4xl mb-4">🚧</div>
          <p className="text-gray-600 dark:text-gray-400">
            หมวดหมู่นี้กำลังพัฒนา
          </p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ⚙️ การตั้งค่าขั้นสูง
        </h3>

        <div className="space-y-6">
          {/* Security Settings */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              🔒 การตั้งค่าความปลอดภัย
            </h4>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableTwoFactor"
                  checked={currentSettings.enableTwoFactor || false}
                  onChange={(e) =>
                    handleInputChange("enableTwoFactor", e.target.checked)
                  }
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label
                  htmlFor="enableTwoFactor"
                  className="ml-2 block text-sm text-gray-900 dark:text-white"
                >
                  เปิดใช้งานการยืนยันตัวตนสองขั้นตอน (2FA)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireEmailVerification"
                  checked={currentSettings.requireEmailVerification || false}
                  onChange={(e) =>
                    handleInputChange(
                      "requireEmailVerification",
                      e.target.checked
                    )
                  }
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label
                  htmlFor="requireEmailVerification"
                  className="ml-2 block text-sm text-gray-900 dark:text-white"
                >
                  ต้องการยืนยันอีเมลสำหรับลูกค้า
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableSessionTimeout"
                  checked={currentSettings.enableSessionTimeout || false}
                  onChange={(e) =>
                    handleInputChange("enableSessionTimeout", e.target.checked)
                  }
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label
                  htmlFor="enableSessionTimeout"
                  className="ml-2 block text-sm text-gray-900 dark:text-white"
                >
                  เปิดใช้งานการหมดเวลาเซสชัน
                </label>
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              📊 ข้อมูลและความเป็นส่วนตัว
            </h4>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableAnalytics"
                  checked={currentSettings.enableAnalytics || false}
                  onChange={(e) =>
                    handleInputChange("enableAnalytics", e.target.checked)
                  }
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label
                  htmlFor="enableAnalytics"
                  className="ml-2 block text-sm text-gray-900 dark:text-white"
                >
                  เปิดใช้งานการวิเคราะห์ข้อมูล
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableDataBackup"
                  checked={currentSettings.enableDataBackup || false}
                  onChange={(e) =>
                    handleInputChange("enableDataBackup", e.target.checked)
                  }
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label
                  htmlFor="enableDataBackup"
                  className="ml-2 block text-sm text-gray-900 dark:text-white"
                >
                  เปิดใช้งานการสำรองข้อมูลอัตโนมัติ
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowDataExport"
                  checked={currentSettings.allowDataExport || false}
                  onChange={(e) =>
                    handleInputChange("allowDataExport", e.target.checked)
                  }
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label
                  htmlFor="allowDataExport"
                  className="ml-2 block text-sm text-gray-900 dark:text-white"
                >
                  อนุญาตให้ส่งออกข้อมูล
                </label>
              </div>
            </div>
          </div>

          {/* API & Integration */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              🔌 API และการเชื่อมต่อ
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={currentSettings.apiKey || ""}
                    onChange={(e) =>
                      handleInputChange("apiKey", e.target.value)
                    }
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    placeholder="••••••••••••••••"
                  />
                  <button
                    type="button"
                    disabled={!isEditing}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    สร้าง
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableWebhooks"
                  checked={currentSettings.enableWebhooks || false}
                  onChange={(e) =>
                    handleInputChange("enableWebhooks", e.target.checked)
                  }
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label
                  htmlFor="enableWebhooks"
                  className="ml-2 block text-sm text-gray-900 dark:text-white"
                >
                  เปิดใช้งาน Webhooks
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentCategory = () => {
    switch (activeCategory) {
      case "basic":
        return renderBasicSettings();
      case "queue":
        return renderQueueSettings();
      case "points":
        return renderPointsSettings();
      case "payments":
        return renderPaymentSettings();
      case "advanced":
        return renderAdvancedSettings();
      default:
        return (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚧</div>
            <p className="text-gray-600 dark:text-gray-400">
              หมวดหมู่นี้กำลังพัฒนา
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            ตั้งค่าร้าน
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            จัดการข้อมูลและการตั้งค่าของร้าน
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    กำลังบันทึก...
                  </>
                ) : (
                  "บันทึก"
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowExportModal(true)}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ส่งออกการตั้งค่า
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                แก้ไขการตั้งค่า
              </button>
            </>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 rounded-lg flex items-center gap-3 animate-fade-in">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>บันทึกการตั้งค่าสำเร็จ</span>
        </div>
      )}

      {saveError && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {saveError}
        </div>
      )}

      {/* Shop Status Toggle - Prominent Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            สถานะการเปิดร้าน
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            ควบคุมสถานะการเปิด-ปิดร้านของคุณ
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-inner flex">
            <button
              onClick={() => handleShopStatusChange("open")}
              className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-3 min-w-[140px] justify-center ${
                shopStatus === "open"
                  ? "bg-green-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              } hover:shadow-md`}
            >
              <span className="text-2xl">🟢</span>
              เปิดร้าน
            </button>
            
            <button
              onClick={() => handleShopStatusChange("closed")}
              className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-3 min-w-[140px] justify-center ml-2 ${
                shopStatus === "closed"
                  ? "bg-red-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              } hover:shadow-md`}
            >
              <span className="text-2xl">🔴</span>
              ปิดร้าน
            </button>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            shopStatus === "open"
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              shopStatus === "open" ? "bg-green-500" : "bg-red-500"
            }`}></span>
            สถานะปัจจุบัน: {shopStatus === "open" ? "เปิดร้าน" : "ปิดร้าน"}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ฟีเจอร์เปิดใช้
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.enabledFeatures.length}
                </p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ฟีเจอร์ปิดใช้
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats.disabledFeatures.length}
                </p>
              </div>
              <div className="text-2xl">⏸️</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  การเชื่อมต่อ
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    Object.values(stats.integrationStatus).filter(Boolean)
                      .length
                  }
                </p>
              </div>
              <div className="text-2xl">🔗</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  อัปเดตล่าสุด
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(stats.lastUpdated).toLocaleString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="text-2xl">🕐</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              หมวดหมู่การตั้งค่า
            </h2>
            <div className="space-y-2">
              {viewModel.settingsCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{category.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {category.settingsCount} รายการ
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {
                  viewModel.settingsCategories.find(
                    (c) => c.id === activeCategory
                  )?.name
                }
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {
                  viewModel.settingsCategories.find(
                    (c) => c.id === activeCategory
                  )?.description
                }
              </p>
            </div>

            {renderCurrentCategory()}
          </div>
        </div>
      </div>

      {/* Export/Import Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
              ส่งออก/นำเข้าการตั้งค่า
            </h3>

            {/* Export Section */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                📤 ส่งออกการตั้งค่า
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                ส่งออกการตั้งค่าทั้งหมดเป็นไฟล์ JSON
                เพื่อสำรองข้อมูลหรือโอนย้ายไปยังร้านอื่น
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {isExporting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      กำลังส่งออก...
                    </>
                  ) : (
                    "ส่งออกข้อมูล"
                  )}
                </button>

                {exportData && (
                  <button
                    onClick={() => {
                      if (exportData) {
                        const blob = new Blob([exportData], {
                          type: "application/json",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `shop-settings-${
                          new Date().toISOString().split("T")[0]
                        }.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                  >
                    📥 ดาวน์โหลดไฟล์
                  </button>
                )}
              </div>

              {exportData && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ข้อมูลที่ส่งออก:
                  </label>
                  <textarea
                    value={exportData}
                    readOnly
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  />
                </div>
              )}
            </div>

            {/* Import Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                📥 นำเข้าการตั้งค่า
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                นำเข้าการตั้งค่าจากไฟล์ JSON ที่ส่งออกไว้ก่อนหน้านี้
              </p>

              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  เลือกไฟล์การตั้งค่า (.json):
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setImportData(event.target.result as string);
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    dark:file:bg-blue-900 dark:file:text-blue-200"
                />
              </div>

              {/* Manual Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  หรือวางข้อมูล JSON ที่นี่:
                </label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={6}
                  placeholder="วางข้อมูล JSON ที่นี่..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {importError && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
                  {importError}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowExportModal(false);
                    setExportData(null);
                    setImportData("");
                    setImportError(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ปิด
                </button>

                <button
                  onClick={handleImport}
                  disabled={isImporting || !importData.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {isImporting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      กำลังนำเข้า...
                    </>
                  ) : (
                    "นำเข้าข้อมูล"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
