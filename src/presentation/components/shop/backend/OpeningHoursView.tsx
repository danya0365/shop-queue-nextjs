'use client';

import { OpeningHoursViewModel } from '@/src/presentation/presenters/shop/backend/OpeningHoursPresenter';
import { useState } from 'react';

interface OpeningHoursViewProps {
  viewModel: OpeningHoursViewModel;
}

export function OpeningHoursView({ viewModel }: OpeningHoursViewProps) {
  const [editMode, setEditMode] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const formatTime = (time: string | null) => {
    if (!time) return '-';
    return time;
  };

  const getDayOrder = () => {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  };

  const getStatusColor = (isOpen: boolean) => {
    return isOpen 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const calculateWorkingHours = (openTime: string | null, closeTime: string | null, breakStart: string | null, breakEnd: string | null) => {
    if (!openTime || !closeTime) return '0 ชั่วโมง';
    
    const openMinutes = timeToMinutes(openTime);
    const closeMinutes = timeToMinutes(closeTime);
    let totalMinutes = closeMinutes - openMinutes;
    
    if (breakStart && breakEnd) {
      const breakStartMinutes = timeToMinutes(breakStart);
      const breakEndMinutes = timeToMinutes(breakEnd);
      totalMinutes -= (breakEndMinutes - breakStartMinutes);
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (minutes === 0) {
      return `${hours} ชั่วโมง`;
    }
    return `${hours} ชั่วโมง ${minutes} นาที`;
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            จัดการเวลาเปิด-ปิด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            จัดการเวลาทำการของร้าน กำหนดวันเวลาเปิด-ปิด และเวลาพักเบรก
          </p>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            editMode 
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <span>{editMode ? '📝' : '⚙️'}</span>
          {editMode ? 'ยกเลิกแก้ไข' : 'แก้ไขเวลาทำการ'}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">วันเปิดทำการ</p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">วันปิดทำการ</p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">เฉลี่ยชั่วโมงต่อวัน</p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">มีเวลาพัก</p>
              <p className="text-2xl font-bold text-orange-600">
                {viewModel.hasBreakTime}
              </p>
            </div>
            <div className="text-2xl">☕</div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
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
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Day Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-20 text-center">
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {viewModel.dayLabels[day]}
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dayData.isOpen)}`}>
                          {dayData.isOpen ? 'เปิด' : 'ปิด'}
                        </span>
                      </div>

                      {dayData.isOpen && (
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Operating Hours */}
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">เวลาทำการ</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatTime(dayData.openTime)} - {formatTime(dayData.closeTime)}
                            </p>
                          </div>

                          {/* Break Time */}
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">เวลาพัก</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {dayData.breakStart && dayData.breakEnd
                                ? `${formatTime(dayData.breakStart)} - ${formatTime(dayData.breakEnd)}`
                                : 'ไม่มี'
                              }
                            </p>
                          </div>

                          {/* Total Hours */}
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">รวมชั่วโมง</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {calculateWorkingHours(dayData.openTime, dayData.closeTime, dayData.breakStart, dayData.breakEnd)}
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
                            onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              dayData.isOpen
                                ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                                : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                            }`}
                          >
                            {dayData.isOpen ? 'ปิดวันนี้' : 'เปิดวันนี้'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Edit Form */}
                  {editMode && selectedDay === day && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            เวลาเปิด
                          </label>
                          <input
                            type="time"
                            defaultValue={dayData.openTime || ''}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            เวลาปิด
                          </label>
                          <input
                            type="time"
                            defaultValue={dayData.closeTime || ''}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            เริ่มพัก
                          </label>
                          <input
                            type="time"
                            defaultValue={dayData.breakStart || ''}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            สิ้นสุดพัก
                          </label>
                          <input
                            type="time"
                            defaultValue={dayData.breakEnd || ''}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={() => setSelectedDay(null)}
                          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                          ยกเลิก
                        </button>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
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

      {/* Quick Actions */}
      {editMode && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            การตั้งค่าด่วน
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              เปิดทุกวัน 9:00-18:00
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              เปิดจันทร์-ศุกร์ 9:00-17:00
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
              เปิดจันทร์-เสาร์ 10:00-19:00
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
              ปิดทุกวันอาทิตย์
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
