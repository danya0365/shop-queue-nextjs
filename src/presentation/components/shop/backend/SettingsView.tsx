'use client';

import React, { useState } from 'react';
import type { SettingsViewModel } from '@/src/presentation/presenters/shop/backend/SettingsPresenter';

interface SettingsViewProps {
  viewModel: SettingsViewModel;
}

export function SettingsView({ viewModel }: SettingsViewProps) {
  type TabType = 'shop' | 'queue' | 'payment' | 'notifications' | 'system';
  const [activeTab, setActiveTab] = useState<TabType>('shop');
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    console.log('Saving settings...');
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ตั้งค่าระบบ</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">จัดการการตั้งค่าร้านและระบบต่างๆ</p>
              </div>
              {hasChanges && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setHasChanges(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
                  >
                    บันทึก
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'shop', name: 'ข้อมูลร้าน', icon: '🏪' },
                { id: 'queue', name: 'ระบบคิว', icon: '📋' },
                { id: 'payment', name: 'การชำระเงิน', icon: '💳' },
                { id: 'notifications', name: 'การแจ้งเตือน', icon: '🔔' },
                { id: 'system', name: 'ระบบ', icon: '⚙️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Shop Settings Tab */}
          {activeTab === 'shop' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">ข้อมูลร้าน</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ชื่อร้าน</label>
                    <input
                      type="text"
                      defaultValue={viewModel.shopSettings.shopName}
                      onChange={() => setHasChanges(true)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">เบอร์โทร</label>
                    <input
                      type="tel"
                      defaultValue={viewModel.shopSettings.phone}
                      onChange={() => setHasChanges(true)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">คำอธิบายร้าน</label>
                  <textarea
                    defaultValue={viewModel.shopSettings.shopDescription}
                    onChange={() => setHasChanges(true)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">เวลาทำการ</h4>
                  <div className="space-y-3">
                    {viewModel.shopSettings.openingHours.map((hour) => (
                      <div key={hour.day} className="flex items-center space-x-4">
                        <div className="w-20">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{hour.day}</span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked={hour.isOpen}
                            onChange={() => setHasChanges(true)}
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
                          />
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">เปิด</span>
                        </div>
                        {hour.isOpen && (
                          <>
                            <input
                              type="time"
                              defaultValue={hour.openTime}
                              onChange={() => setHasChanges(true)}
                              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <span className="text-sm text-gray-500 dark:text-gray-400">ถึง</span>
                            <input
                              type="time"
                              defaultValue={hour.closeTime}
                              onChange={() => setHasChanges(true)}
                              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Queue Settings Tab */}
          {activeTab === 'queue' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">ตั้งค่าระบบคิว</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">จำนวนคิวสูงสุด</label>
                    <input
                      type="number"
                      defaultValue={viewModel.queueSettings.maxQueueSize}
                      onChange={() => setHasChanges(true)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">เวลาให้บริการโดยประมาณ (นาที)</label>
                    <input
                      type="number"
                      defaultValue={viewModel.queueSettings.estimatedServiceTime}
                      onChange={() => setHasChanges(true)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={viewModel.queueSettings.allowAdvanceBooking}
                      onChange={() => setHasChanges(true)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 bg-white dark:bg-gray-700"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">อนุญาตให้จองคิวล่วงหน้า</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={viewModel.queueSettings.autoAssignEmployee}
                      onChange={() => setHasChanges(true)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 bg-white dark:bg-gray-700"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">มอบหมายพนักงานอัตโนมัติ</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings Tab */}
          {activeTab === 'payment' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">ตั้งค่าการชำระเงิน</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">วิธีการชำระเงินที่รับ</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input type="checkbox" defaultChecked={viewModel.paymentSettings.acceptCash} onChange={() => setHasChanges(true)} className="rounded border-gray-300 dark:border-gray-600 text-blue-600 bg-white dark:bg-gray-700" />
                      <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">💵 เงินสด</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" defaultChecked={viewModel.paymentSettings.acceptCard} onChange={() => setHasChanges(true)} className="rounded border-gray-300 dark:border-gray-600 text-blue-600 bg-white dark:bg-gray-700" />
                      <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">💳 บัตรเครดิต/เดบิต</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" defaultChecked={viewModel.paymentSettings.acceptQR} onChange={() => setHasChanges(true)} className="rounded border-gray-300 dark:border-gray-600 text-blue-600 bg-white dark:bg-gray-700" />
                      <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">📱 QR Code</label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">อัตราภาษี (%)</label>
                    <input type="number" step="0.01" defaultValue={viewModel.paymentSettings.taxRate} onChange={() => setHasChanges(true)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ค่าบริการ (%)</label>
                    <input type="number" step="0.01" defaultValue={viewModel.paymentSettings.serviceCharge} onChange={() => setHasChanges(true)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs with simplified content */}
          {activeTab === 'notifications' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">ตั้งค่าการแจ้งเตือน</h3>
              <div className="text-center py-8">
                <span className="text-6xl mb-4 block">🔔</span>
                <p className="text-gray-600 dark:text-gray-400">การตั้งค่าการแจ้งเตือนจะพัฒนาในเวอร์ชันถัดไป</p>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">ตั้งค่าระบบ</h3>
              <div className="text-center py-8">
                <span className="text-6xl mb-4 block">⚙️</span>
                <p className="text-gray-600 dark:text-gray-400">การตั้งค่าระบบจะพัฒนาในเวอร์ชันถัดไป</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
