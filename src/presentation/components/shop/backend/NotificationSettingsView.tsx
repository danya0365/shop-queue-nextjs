"use client";

import type { NotificationSettingsViewModel } from "@/src/presentation/presenters/shop/backend/NotificationSettingsPresenter";
import { useState } from "react";
// Removed unused imports

interface NotificationSettingsViewProps {
  viewModel: NotificationSettingsViewModel;
}

export default function NotificationSettingsView({
  viewModel,
}: NotificationSettingsViewProps) {
  const { settings, templates, stats, categories } = viewModel;

  const [selectedCategory, setSelectedCategory] = useState<string>("sms");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testType, setTestType] = useState<"sms" | "email" | "line" | "push">(
    "sms"
  );
  const [testRecipient, setTestRecipient] = useState("");

  if (!settings) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5-5-5h5v-6h5v6z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            ไม่พบการตั้งค่าการแจ้งเตือน
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            กรุณาติดต่อผู้ดูแลระบบเพื่อตั้งค่าเริ่มต้น
          </p>
        </div>
      </div>
    );
  }

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            การตั้งค่าการแจ้งเตือน
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            จัดการการแจ้งเตือนต่างๆ ของระบบ
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTestModal(true)}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
          >
            ทดสอบการส่ง
          </button>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isEditMode
                ? "bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700"
                : "bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-700 dark:hover:bg-gray-700"
            }`}
          >
            {isEditMode ? "บันทึก" : "แก้ไข"}
          </button>
        </div>
      </div>

      {/* Notification Categories */}
      <div className="space-y-6">
        {viewModel.categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ส่งทั้งหมด
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalSent.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                ประเภทการแจ้งเตือน
              </h3>
            </div>
            <div className="p-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{category.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {category.settingsCount} การตั้งค่า
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        category.enabled
                          ? "bg-green-400"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {selectedCategoryData?.icon}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {selectedCategoryData?.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedCategoryData?.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    เปิดใช้งาน
                  </span>
                  <div
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      selectedCategoryData?.enabled
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedCategoryData?.enabled
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Settings forms would go here - simplified for space */}
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                การตั้งค่าสำหรับ {selectedCategoryData?.name}
                <br />
                <span className="text-sm">
                  ({isEditMode ? "โหมดแก้ไข" : "โหมดดู"})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                เทมเพลตการแจ้งเตือน
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                จัดการข้อความแจ้งเตือนสำหรับแต่ละประเภท
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">
                      {template.type === "sms" && "📱"}
                      {template.type === "email" && "📧"}
                      {template.type === "line" && "💬"}
                      {template.type === "push" && "🔔"}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {template.type.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      template.isActive
                        ? "bg-green-400"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                  {template.content}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {template.variables.length} ตัวแปร
                  </span>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                    แก้ไข
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            การแจ้งเตือนล่าสุด
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            ประวัติการส่งการแจ้งเตือนล่าสุด
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ประเภท
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  เหตุการณ์
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ผู้รับ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  เวลาส่ง
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentNotifications.map((notification) => (
                <tr key={notification.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {notification.type === "sms" && "📱"}
                        {notification.type === "email" && "📧"}
                        {notification.type === "line" && "💬"}
                        {notification.type === "push" && "🔔"}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {notification.type.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {notification.event === "booking_confirm" && "ยืนยันการจอง"}
                    {notification.event === "booking_reminder" &&
                      "แจ้งเตือนนัดหมาย"}
                    {notification.event === "booking_cancelled" &&
                      "ยกเลิกการจอง"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {notification.recipient}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        notification.status === "delivered"
                          ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                          : notification.status === "sent"
                          ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
                          : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {notification.status === "delivered" && "ส่งสำเร็จ"}
                      {notification.status === "sent" && "ส่งแล้ว"}
                      {notification.status === "failed" && "ส่งไม่สำเร็จ"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(notification.sentAt).toLocaleString("th-TH")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              ทดสอบการส่งการแจ้งเตือน
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ประเภท
                </label>
                <select
                  value={testType}
                  onChange={(e) =>
                    setTestType(
                      e.target.value as "sms" | "email" | "line" | "push"
                    )
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="line">LINE Notify</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ผู้รับ
                </label>
                <input
                  type="text"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder={
                    testType === "sms"
                      ? "เบอร์โทรศัพท์"
                      : testType === "email"
                      ? "อีเมล"
                      : testType === "line"
                      ? "LINE User ID"
                      : "Device Token"
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  // TODO: Implement test functionality
                  setShowTestModal(false);
                }}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700"
              >
                ทดสอบส่ง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
