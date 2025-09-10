'use client';

import { ShopSettingsViewModel } from '@/src/presentation/presenters/shop/backend/ShopSettingsPresenter';
import { useState } from 'react';

interface ShopSettingsViewProps {
  viewModel: ShopSettingsViewModel;
}

export function ShopSettingsView({ viewModel }: ShopSettingsViewProps) {
  const [activeCategory, setActiveCategory] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  if (!viewModel.settings) {
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

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderBasicSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ชื่อร้าน *
          </label>
          <input
            type="text"
            value={settings.shopName}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            เบอร์โทรศัพท์
          </label>
          <input
            type="tel"
            value={settings.shopPhone || ''}
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
          value={settings.shopDescription || ''}
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
            value={settings.shopEmail || ''}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            เว็บไซต์
          </label>
          <input
            type="url"
            value={settings.shopWebsite || ''}
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
          value={settings.shopAddress || ''}
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
            value={settings.maxQueuePerService}
            disabled={!isEditing}
            min="1"
            max="50"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            เวลาหมดอายุคิว (นาที)
          </label>
          <input
            type="number"
            value={settings.queueTimeoutMinutes}
            disabled={!isEditing}
            min="5"
            max="60"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowWalkIn"
            checked={settings.allowWalkIn}
            disabled={!isEditing}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label htmlFor="allowWalkIn" className="ml-2 block text-sm text-gray-900 dark:text-white">
            อนุญาตให้เดินเข้ามาจองคิวได้
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowAdvanceBooking"
            checked={settings.allowAdvanceBooking}
            disabled={!isEditing}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label htmlFor="allowAdvanceBooking" className="ml-2 block text-sm text-gray-900 dark:text-white">
            อนุญาตให้จองล่วงหน้าได้
          </label>
        </div>
      </div>

      {settings.allowAdvanceBooking && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            จองล่วงหน้าได้สูงสุด (วัน)
          </label>
          <input
            type="number"
            value={settings.maxAdvanceBookingDays}
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
    <div className="space-y-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="pointsEnabled"
          checked={settings.pointsEnabled}
          disabled={!isEditing}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
        />
        <label htmlFor="pointsEnabled" className="ml-2 block text-sm text-gray-900 dark:text-white">
          เปิดใช้งานระบบแต้มสะสม
        </label>
      </div>

      {settings.pointsEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              แต้มต่อ 1 บาท
            </label>
            <input
              type="number"
              value={settings.pointsPerBaht}
              disabled={!isEditing}
              min="0"
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
              value={settings.pointsExpiryMonths}
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
              value={settings.minimumPointsToRedeem}
              disabled={!isEditing}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">วิธีการชำระเงิน</h3>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptCash"
              checked={settings.acceptCash}
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label htmlFor="acceptCash" className="ml-2 block text-sm text-gray-900 dark:text-white">
              💵 เงินสด
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptCreditCard"
              checked={settings.acceptCreditCard}
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label htmlFor="acceptCreditCard" className="ml-2 block text-sm text-gray-900 dark:text-white">
              💳 บัตรเครดิต/เดบิต
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptBankTransfer"
              checked={settings.acceptBankTransfer}
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label htmlFor="acceptBankTransfer" className="ml-2 block text-sm text-gray-900 dark:text-white">
              🏦 โอนเงินผ่านธนาคาร
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptPromptPay"
              checked={settings.acceptPromptPay}
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label htmlFor="acceptPromptPay" className="ml-2 block text-sm text-gray-900 dark:text-white">
              📱 PromptPay
            </label>
          </div>
        </div>

        {settings.acceptPromptPay && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              PromptPay ID
            </label>
            <input
              type="text"
              value={settings.promptPayId || ''}
              disabled={!isEditing}
              placeholder="เบอร์โทรหรือเลขบัตรประชาชน"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderCurrentCategory = () => {
    switch (activeCategory) {
      case 'basic':
        return renderBasicSettings();
      case 'queue':
        return renderQueueSettings();
      case 'points':
        return renderPointsSettings();
      case 'payments':
        return renderPaymentSettings();
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">ตั้งค่าร้าน</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">จัดการข้อมูลและการตั้งค่าของร้าน</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">ฟีเจอร์เปิดใช้</p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">ฟีเจอร์ปิดใช้</p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">การเชื่อมต่อ</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Object.values(stats.integrationStatus).filter(Boolean).length}
                </p>
              </div>
              <div className="text-2xl">🔗</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">อัปเดตล่าสุด</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDateTime(stats.lastUpdated)}
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
                  className={`w-full text-left p-3 rounded-lg transition-colors ${activeCategory === category.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
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
                {viewModel.settingsCategories.find(c => c.id === activeCategory)?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {viewModel.settingsCategories.find(c => c.id === activeCategory)?.description}
              </p>
            </div>

            {renderCurrentCategory()}
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              ส่งออกการตั้งค่า
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ฟีเจอร์นี้จะพัฒนาในเร็วๆ นี้
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
