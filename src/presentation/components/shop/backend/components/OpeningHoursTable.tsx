"use client";

import { OpeningHourDTO } from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { OpeningHoursStats } from "../hooks/useOpeningHoursCalculations";
import { formatTime, getStatusColor, getDayOrder } from "../utils/openingHoursUtils";

interface OpeningHoursTableProps {
  weeklySchedule: Record<string, OpeningHourDTO>;
  stats: OpeningHoursStats;
  editMode: boolean;
  selectedDay: string | null;
  calculateWorkingHours: (
    openTime: string | null,
    closeTime: string | null,
    breakStart: string | null,
    breakEnd: string | null
  ) => string;
  onEdit: (day: string) => void;
  onToggleStatus: (day: string, currentStatus: boolean) => void;
}

export function OpeningHoursTable({
  weeklySchedule,
  stats,
  editMode,
  selectedDay,
  calculateWorkingHours,
  onEdit,
  onToggleStatus,
}: OpeningHoursTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ตารางเวลาทำการประจำสัปดาห์
        </h2>

        <div className="space-y-4">
          {getDayOrder().map((day) => {
            const dayData = weeklySchedule[day];
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
                        {stats.dayLabels[day]}
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
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                          onClick={() => onEdit(day)}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="แก้ไข"
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
                            onToggleStatus(day, dayData.isOpen)
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
