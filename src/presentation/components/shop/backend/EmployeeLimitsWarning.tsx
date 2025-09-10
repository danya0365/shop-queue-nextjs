'use client';

import { SubscriptionLimits, UsageStatsDto } from '@/src/application/dtos/subscription-dto';
import Link from 'next/link';

interface EmployeeLimitsWarningProps {
  limits: SubscriptionLimits;
  usage: UsageStatsDto;
  canAddEmployee: boolean;
  staffLimitReached: boolean;
}

export function EmployeeLimitsWarning({ limits, usage, canAddEmployee, staffLimitReached }: EmployeeLimitsWarningProps) {
  console.log('EmployeeLimitsWarning', { limits, usage, canAddEmployee, staffLimitReached });
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

  if (limits.maxStaff === null) {
    return null; // No limits for unlimited plans
  }

  const usagePercentage = getUsagePercentage(usage.currentStaff, limits.maxStaff);
  const isWarning = isNearLimit(usage.currentStaff, limits.maxStaff);

  return (
    <div className={`rounded-lg border p-4 mb-6 ${staffLimitReached
        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        : isWarning
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`rounded-full p-2 mr-3 ${staffLimitReached
              ? 'bg-red-100 dark:bg-red-900/40'
              : isWarning
                ? 'bg-yellow-100 dark:bg-yellow-900/40'
                : 'bg-blue-100 dark:bg-blue-900/40'
            }`}>
            <svg className={`w-5 h-5 ${staffLimitReached
                ? 'text-red-600 dark:text-red-400'
                : isWarning
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-blue-600 dark:text-blue-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {staffLimitReached ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              )}
            </svg>
          </div>
          <div>
            <h3 className={`font-semibold ${staffLimitReached
                ? 'text-red-900 dark:text-red-100'
                : isWarning
                  ? 'text-yellow-900 dark:text-yellow-100'
                  : 'text-blue-900 dark:text-blue-100'
              }`}>
              {staffLimitReached
                ? 'ถึงขีดจำกัดจำนวนพนักงานแล้ว'
                : isWarning
                  ? 'ใกล้ถึงขีดจำกัดจำนวนพนักงาน'
                  : 'การใช้งานจำนวนพนักงาน'
              }
            </h3>
            <p className={`text-sm ${staffLimitReached
                ? 'text-red-700 dark:text-red-200'
                : isWarning
                  ? 'text-yellow-700 dark:text-yellow-200'
                  : 'text-blue-700 dark:text-blue-200'
              }`}>
              มีพนักงาน {usage.currentStaff} จาก {formatLimit(limits.maxStaff)} คน
              {staffLimitReached && ' - ไม่สามารถเพิ่มพนักงานใหม่ได้'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Progress Bar */}
          <div className="flex items-center">
            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
              <div
                className={`h-2 rounded-full ${staffLimitReached
                    ? 'bg-red-500'
                    : isWarning
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${staffLimitReached
                ? 'text-red-700'
                : isWarning
                  ? 'text-yellow-700'
                  : 'text-blue-700'
              }`}>
              {Math.round(usagePercentage)}%
            </span>
          </div>

          {/* Upgrade Button */}
          {(staffLimitReached || isWarning) && (
            <Link
              href="/pricing"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${staffLimitReached
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
            >
              อัปเกรดแผน
            </Link>
          )}
        </div>
      </div>

      {/* Additional Info */}
      {staffLimitReached && (
        <div className="mt-4 p-3 bg-red-100 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">ตัวเลือกสำหรับคุณ:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>ลบพนักงานที่ไม่ได้ใช้งานเพื่อเพิ่มพนักงานใหม่</li>
                <li>อัปเกรดเป็นแผน Pro สำหรับพนักงาน 5 คน</li>
                <li>อัปเกรดเป็นแผน Enterprise สำหรับพนักงานไม่จำกัด</li>
                <li>ซื้อการเข้าถึงพิเศษแบบครั้งเดียวเพื่อเพิ่มพนักงาน</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
