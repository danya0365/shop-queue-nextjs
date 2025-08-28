'use client';

import type { SubscriptionLimits, UsageStatsDto } from '@/src/application/dtos/subscription-dto';
import Link from 'next/link';

interface DataRetentionWarningProps {
  limits: SubscriptionLimits;
  usage: UsageStatsDto;
  hasDataRetentionLimit: boolean;
  dataRetentionDays: number;
  isFreeTier: boolean;
}

export function DataRetentionWarning({
  limits,
  usage,
  hasDataRetentionLimit,
  dataRetentionDays,
  isFreeTier
}: DataRetentionWarningProps) {
  console.log('DataRetentionWarning', {
    limits,
    usage,
    hasDataRetentionLimit,
    dataRetentionDays,
    isFreeTier
  });
  // Don't show warning if there's no data retention limit
  if (!hasDataRetentionLimit) {
    return null;
  }

  // Calculate days until data expires (mock calculation)
  const daysUntilExpiry = Math.max(0, dataRetentionDays - 30); // Mock: assume data is 30 days old
  const isNearExpiry = daysUntilExpiry <= 7;
  const isExpired = daysUntilExpiry === 0;

  // Don't show if data is not near expiry and not free tier
  if (!isNearExpiry && !isFreeTier) {
    return null;
  }

  const getWarningStyle = () => {
    if (isExpired) {
      return 'bg-red-50 border-red-200 text-red-800';
    } else if (isNearExpiry) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    } else if (isFreeTier) {
      return 'bg-blue-50 border-blue-200 text-blue-800';
    }
    return 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getIconColor = () => {
    if (isExpired) return 'text-red-500';
    if (isNearExpiry) return 'text-yellow-500';
    if (isFreeTier) return 'text-blue-500';
    return 'text-gray-500';
  };

  const getWarningMessage = () => {
    if (isExpired) {
      return 'ข้อมูลเก่าได้ถูกลบแล้วตามนโยบายการเก็บข้อมูล';
    } else if (isNearExpiry) {
      return `ข้อมูลจะถูกลบในอีก ${daysUntilExpiry} วัน`;
    } else if (isFreeTier) {
      return `ข้อมูลจะถูกเก็บไว้เพียง ${dataRetentionDays} วัน`;
    }
    return '';
  };

  return (
    <div className={`rounded-lg border p-4 mb-6 ${getWarningStyle()}`}>
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${getIconColor()}`}>
          {isExpired ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : isNearExpiry ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">
                {isExpired ? 'ข้อมูลถูกลบแล้ว' : isNearExpiry ? 'ข้อมูลใกล้หมดอายุ' : 'ข้อจำกัดการเก็บข้อมูล'}
              </h3>
              <p className="text-sm mt-1">
                {getWarningMessage()}
              </p>

              {isFreeTier && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600 mb-2">
                    การเก็บข้อมูล: {dataRetentionDays} วัน (แพ็กเกจฟรี)
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (30 / dataRetentionDays) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ข้อมูลปัจจุบัน: ~30 วัน
                  </div>
                </div>
              )}
            </div>

            {(isFreeTier || isNearExpiry) && (
              <div className="flex-shrink-0 ml-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  อัปเกรด
                </Link>
              </div>
            )}
          </div>

          {isFreeTier && (
            <div className="mt-3 text-xs">
              <p className="text-gray-600">
                💡 <strong>อัปเกรดเพื่อรับสิทธิ์:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">
                <li>Pro: เก็บข้อมูล 1 ปี</li>
                <li>Enterprise: เก็บข้อมูลไม่จำกัด</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
