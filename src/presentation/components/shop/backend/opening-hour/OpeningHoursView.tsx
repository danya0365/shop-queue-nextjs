"use client";

import { OpeningHoursViewModel } from "@/src/presentation/presenters/shop/backend/opening-hours/OpeningHoursPresenter";
import { useOpeningHoursPresenter } from "@/src/presentation/presenters/shop/backend/opening-hours/useOpeningHoursPresenter";

interface OpeningHoursViewProps {
  shopId: string;
  initialViewModel?: OpeningHoursViewModel;
}

export function OpeningHoursView({
  shopId,
  initialViewModel,
}: OpeningHoursViewProps) {
  const {
    // Data
    viewModel,
    isLoading,
    error,

    // State
    editMode,
    selectedDay,
    editForm,
    notification,

    // State Actions
    setEditMode,
    setSelectedDay,
    setEditForm,
    setNotification,
    resetEditForm,
    resetNotification,

    // Event Handlers
    handleToggleDayStatus,
    handleEditDay,
    handleSaveDay,
    handleQuickAction,
    showNotification,

    // Utility Functions
    formatTime,
    getDayOrder,
    getStatusColor,
    calculateWorkingHours,
  } = useOpeningHoursPresenter(shopId, initialViewModel);

  return (
    <div className="space-y-6 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              กำลังโหลดข้อมูลเวลาทำการ...
            </p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center">
            <span className="mr-2">
              {notification.type === "success" ? "✓" : "⚠️"}
            </span>
            {notification.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            เวลาทำการ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            จัดการเวลาทำการของร้านค้า
          </p>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            editMode
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {editMode ? "เสร็จสิ้น" : "แก้ไข"}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                วันเปิดทำการ
              </p>
              <p className="text-2xl font-bold text-green-600">
                {viewModel.totalOpenDays}
              </p>
            </div>
            <div className="text-2xl">🟢</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                วันปิดทำการ
              </p>
              <p className="text-2xl font-bold text-red-600">
                {viewModel.totalClosedDays}
              </p>
            </div>
            <div className="text-2xl">🔴</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                เฉลี่ยชั่วโมงต่อวัน
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {viewModel.averageOpenHours.toFixed(1)}
              </p>
            </div>
            <div className="text-2xl">⏰</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                มีเวลาพัก
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {viewModel.hasBreakTime}
              </p>
            </div>
            <div className="text-2xl">☕</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {editMode && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            การตั้งค่าด่วน
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleQuickAction("all-days")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              เปิดทุกวัน 9:00-18:00
            </button>
            <button
              onClick={() => handleQuickAction("weekdays")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              เปิดจันทร์-ศุกร์ 9:00-17:00
            </button>
            <button
              onClick={() => handleQuickAction("monday-saturday")}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              เปิดจันทร์-เสาร์ 10:00-19:00
            </button>
            <button
              onClick={() => handleQuickAction("close-sunday")}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              ปิดทุกวันอาทิตย์
            </button>
          </div>
        </div>
      )}

      {/* Opening Hours */}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ตารางเวลาทำการประจำสัปดาห์
          </h2>

          <div className="space-y-4">
            {getDayOrder().map((day) => {
              const dayData = viewModel.weeklySchedule[day];
              if (!dayData) return null;

              return (
                <div
                  key={day}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedDay === day
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Day Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-20 text-center">
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {viewModel.dayLabels[day]}
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            dayData.isOpen
                          )}`}
                        >
                          {dayData.isOpen ? "เปิด" : "ปิด"}
                        </span>
                      </div>

                      {dayData.isOpen && (
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
                          {/* Operating Hours */}
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              เวลาทำการ
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatTime(dayData.openTime)} -{" "}
                              {formatTime(dayData.closeTime)}
                            </p>
                          </div>

                          {/* Break Time */}
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              เวลาพัก
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {dayData.breakStart && dayData.breakEnd
                                ? `${formatTime(
                                    dayData.breakStart
                                  )} - ${formatTime(dayData.breakEnd)}`
                                : "ไม่มี"}
                            </p>
                          </div>

                          {/* Total Hours */}
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              รวมชั่วโมง
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {calculateWorkingHours(
                                dayData.openTime,
                                dayData.closeTime,
                                dayData.breakStart,
                                dayData.breakEnd
                              )}
                            </p>
                          </div>

                          {/* Timezone */}
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Timezone
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {dayData.timezone || "Asia/Bangkok"}
                            </p>
                          </div>
                        </div>
                      )}

                      {!dayData.isOpen && (
                        <div className="flex-1">
                          <p className="text-gray-500 dark:text-gray-400 italic">
                            ร้านปิดทำการ
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      {editMode && (
                        <>
                          <button
                            onClick={() => handleEditDay(day)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              handleToggleDayStatus(day, dayData.isOpen)
                            }
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              dayData.isOpen
                                ? "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                : "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                            }`}
                          >
                            {dayData.isOpen ? "ปิดวันนี้" : "เปิดวันนี้"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Edit Form */}
                  {editMode && selectedDay === day && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            เวลาเปิด
                          </label>
                          <input
                            type="time"
                            value={editForm.openTime || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                openTime: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            เวลาปิด
                          </label>
                          <input
                            type="time"
                            value={editForm.closeTime || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                closeTime: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            เวลาพักเริ่มต้น
                          </label>
                          <input
                            type="time"
                            value={editForm.breakStart || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                breakStart: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            เวลาพักสิ้นสุด
                          </label>
                          <input
                            type="time"
                            value={editForm.breakEnd || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                breakEnd: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Timezone
                          </label>
                          <select
                            value={editForm.timezone || "Asia/Bangkok"}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                timezone: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          >
                            {/* Common Asia timezones; can be expanded as needed */}
                            <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                            <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                            <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                            <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (GMT+8)</option>
                            <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                            <option value="Asia/Hong_Kong">Asia/Hong_Kong (GMT+8)</option>
                            <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                            <option value="Asia/Shanghai">Asia/Shanghai (GMT+8)</option>
                            <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                            <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={() => setSelectedDay(null)}
                          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                          ยกเลิก
                        </button>
                        <button
                          onClick={handleSaveDay}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          บันทึก
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
