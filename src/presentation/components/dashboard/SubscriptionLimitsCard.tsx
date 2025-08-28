'use client';

import { SubscriptionTier, SubscriptionLimits, UsageStatsDto } from '@/src/application/dtos/subscription-dto';
import Link from 'next/link';

interface SubscriptionLimitsCardProps {
  tier: SubscriptionTier;
  limits: SubscriptionLimits;
  usage: UsageStatsDto;
  canCreateShop: boolean;
}

export function SubscriptionLimitsCard({ tier, limits, usage, canCreateShop }: SubscriptionLimitsCardProps) {
  const getTierDisplayName = (tier: SubscriptionTier) => {
    const names = {
      free: 'ฟรี',
      pro: 'Pro',
      enterprise: 'Enterprise'
    };
    return names[tier];
  };

  const getTierColor = (tier: SubscriptionTier) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800 border-gray-200',
      pro: 'bg-blue-100 text-blue-800 border-blue-200',
      enterprise: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[tier];
  };

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">แผนการใช้งาน</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTierColor(tier)}`}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            {getTierDisplayName(tier)}
          </div>
        </div>
        {tier === 'free' && (
          <Link
            href="/pricing"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            อัปเกรด
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {/* Shop Limits */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">จำนวนร้านค้า</p>
              <p className="text-xs text-gray-500">
                {usage.currentShops} / {formatLimit(limits.maxShops)}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {!canCreateShop && (
              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded mr-2">
                เต็มแล้ว
              </span>
            )}
            {limits.maxShops && (
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    isNearLimit(usage.currentShops, limits.maxShops) ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${getUsagePercentage(usage.currentShops, limits.maxShops)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Queue Limits */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">คิวต่อวัน</p>
              <p className="text-xs text-gray-500">
                {usage.todayQueues} / {formatLimit(limits.maxQueuesPerDay)}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {limits.maxQueuesPerDay && isNearLimit(usage.todayQueues, limits.maxQueuesPerDay) && (
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded mr-2">
                ใกล้เต็ม
              </span>
            )}
            {limits.maxQueuesPerDay && (
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    isNearLimit(usage.todayQueues, limits.maxQueuesPerDay) ? 'bg-orange-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${getUsagePercentage(usage.todayQueues, limits.maxQueuesPerDay)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Staff Limits */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">จำนวนพนักงาน</p>
              <p className="text-xs text-gray-500">
                {usage.currentStaff} / {formatLimit(limits.maxStaff)}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {limits.maxStaff && isNearLimit(usage.currentStaff, limits.maxStaff) && (
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded mr-2">
                ใกล้เต็ม
              </span>
            )}
            {limits.maxStaff && (
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    isNearLimit(usage.currentStaff, limits.maxStaff) ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${getUsagePercentage(usage.currentStaff, limits.maxStaff)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Data Retention */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">เก็บข้อมูล</p>
              <p className="text-xs text-gray-500">
                {limits.dataRetentionMonths === null ? 'ตลอดชีพ' : `${limits.dataRetentionMonths} เดือน`}
              </p>
            </div>
          </div>
          {limits.dataRetentionMonths === 1 && (
            <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
              จำกัด
            </span>
          )}
        </div>

        {/* Premium Features */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">ฟีเจอร์พิเศษ</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`flex items-center ${limits.hasAnalytics ? 'text-green-600' : 'text-gray-400'}`}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={limits.hasAnalytics ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
              Analytics
            </div>
            <div className={`flex items-center ${limits.hasPromotionFeatures ? 'text-green-600' : 'text-gray-400'}`}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={limits.hasPromotionFeatures ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
              โปรโมชัน
            </div>
            <div className={`flex items-center ${limits.hasAdvancedReports ? 'text-green-600' : 'text-gray-400'}`}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={limits.hasAdvancedReports ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
              รายงานขั้นสูง
            </div>
            <div className={`flex items-center ${limits.hasApiAccess ? 'text-green-600' : 'text-gray-400'}`}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={limits.hasApiAccess ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
              API Access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
