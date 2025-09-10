'use client';

import { SubscriptionLimits, UsageStatsDto } from '@/src/application/dtos/subscription-dto';
import Link from 'next/link';

interface QueueLimitsWarningProps {
  limits: SubscriptionLimits;
  usage: UsageStatsDto;
  dailyLimitReached: boolean;
  canCreateQueue: boolean;
}

export function QueueLimitsWarning({ limits, usage, dailyLimitReached, canCreateQueue }: QueueLimitsWarningProps) {
  console.log('QueueLimitsWarning props', { limits, usage, dailyLimitReached, canCreateQueue });

  const getUsagePercentage = (current: number, max: number | null) => {
    if (max === null) return 0;
    return Math.min((current / max) * 100, 100);
  };

  const formatLimit = (value: number | null) => {
    return value === null ? 'ไม่จำกัด' : value.toLocaleString();
  };

  const isNearLimit = (current: number, max: number | null, threshold = 80) => {
    if (max === null) return false;
    return (current / max) * 100 >= threshold;
  };

  if (limits.maxQueuesPerDay === null) {
    return null; // No limits for unlimited plans
  }

  const usagePercentage = getUsagePercentage(usage.todayQueues, limits.maxQueuesPerDay);
  const isWarning = isNearLimit(usage.todayQueues, limits.maxQueuesPerDay);

  return (
    <div className={`rounded-lg border p-4 mb-6 ${dailyLimitReached
      ? 'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700'
      : isWarning
        ? 'bg-yellow-50 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-700'
        : 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700'
      }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`rounded-full p-2 mr-3 ${dailyLimitReached
            ? 'bg-red-100 dark:bg-red-800/50'
            : isWarning
              ? 'bg-yellow-100 dark:bg-yellow-800/50'
              : 'bg-blue-100 dark:bg-blue-800/50'
            }`}>
            <svg className={`w-5 h-5 ${dailyLimitReached
              ? 'text-red-600 dark:text-red-400'
              : isWarning
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-blue-600 dark:text-blue-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {dailyLimitReached ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </div>
          <div>
            <h3 className={`font-semibold ${dailyLimitReached
              ? 'text-red-900 dark:text-red-200'
              : isWarning
                ? 'text-yellow-900 dark:text-yellow-200'
                : 'text-blue-900 dark:text-blue-200'
              }`}>
              {dailyLimitReached
                ? 'ถึงขีดจำกัดคิวรายวันแล้ว'
                : isWarning
                  ? 'ใกล้ถึงขีดจำกัดคิวรายวัน'
                  : 'การใช้งานคิวรายวัน'
              }
            </h3>
            <p className={`text-sm ${dailyLimitReached
              ? 'text-red-700 dark:text-red-300'
              : isWarning
                ? 'text-yellow-700 dark:text-yellow-300'
                : 'text-blue-700 dark:text-blue-300'
              }`}>
              ใช้ไปแล้ว {usage.todayQueues} จาก {formatLimit(limits.maxQueuesPerDay)} คิว
              {dailyLimitReached && ' - ไม่สามารถสร้างคิวใหม่ได้วันนี้'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Progress Bar */}
          <div className="flex items-center">
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
              <div
                className={`h-2 rounded-full ${dailyLimitReached
                  ? 'bg-red-500 dark:bg-red-400'
                  : isWarning
                    ? 'bg-yellow-500 dark:bg-yellow-400'
                    : 'bg-blue-500 dark:bg-blue-400'
                  }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${dailyLimitReached
              ? 'text-red-700 dark:text-red-300'
              : isWarning
                ? 'text-yellow-700 dark:text-yellow-300'
                : 'text-blue-700 dark:text-blue-300'
              }`}>
              {Math.round(usagePercentage)}%
            </span>
          </div>

          {/* Upgrade Button */}
          {(dailyLimitReached || isWarning) && (
            <Link
              href="/pricing"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dailyLimitReached
                ? 'bg-red-600 dark:bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700'
                : 'bg-yellow-600 dark:bg-yellow-600 text-white hover:bg-yellow-700 dark:hover:bg-yellow-700'
                }`}
            >
              อัปเกรดแผน
            </Link>
          )}
        </div>
      </div>

      {/* Additional Info */}
      {dailyLimitReached && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/40 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-red-800 dark:text-red-200">
              <p className="font-medium mb-1">ตัวเลือกสำหรับคุณ:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>รอจนถึงวันพรุ่งนี้เพื่อรีเซ็ตขีดจำกัด</li>
                <li>อัปเกรดเป็นแผน Pro หรือ Enterprise สำหรับคิวไม่จำกัด</li>
                <li>ซื้อการเข้าถึงพิเศษแบบครั้งเดียวสำหรับวันนี้</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
