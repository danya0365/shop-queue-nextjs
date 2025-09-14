"use client";

import type { OpeningHoursStats } from "../hooks/useOpeningHoursCalculations";

interface OpeningHoursStatsProps {
  stats: OpeningHoursStats;
}

export function OpeningHoursStats({ stats }: OpeningHoursStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Open Days Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              วันเปิดทำการ
            </p>
            <p className="text-2xl font-bold text-green-600">
              {stats.totalOpenDays}
            </p>
          </div>
          <div className="text-2xl">🟢</div>
        </div>
      </div>

      {/* Closed Days Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              วันปิดทำการ
            </p>
            <p className="text-2xl font-bold text-red-600">
              {stats.totalClosedDays}
            </p>
          </div>
          <div className="text-2xl">🔴</div>
        </div>
      </div>

      {/* Average Hours Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              เฉลี่ยชั่วโมงต่อวัน
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.averageOpenHours.toFixed(1)}
            </p>
          </div>
          <div className="text-2xl">⏰</div>
        </div>
      </div>

      {/* Break Time Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              มีเวลาพัก
            </p>
            <p className="text-2xl font-bold text-orange-600">
              {stats.hasBreakTime}
            </p>
          </div>
          <div className="text-2xl">☕</div>
        </div>
      </div>
    </div>
  );
}
