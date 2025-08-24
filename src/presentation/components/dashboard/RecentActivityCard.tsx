'use client';

import { RecentActivity } from '@/src/presentation/presenters/dashboard/DashboardPresenter';

interface RecentActivityCardProps {
  activities: RecentActivity[];
}

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'queue_created':
        return (
          <div className="w-8 h-8 bg-info-light rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'queue_served':
        return (
          <div className="w-8 h-8 bg-success-light rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'payment_received':
        return (
          <div className="w-8 h-8 bg-warning-light rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-muted-light rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'เมื่อสักครู่';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} นาทีที่แล้ว`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ชั่วโมงที่แล้ว`;
    } else {
      return date.toLocaleDateString('th-TH');
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">กิจกรรมล่าสุด</h3>
        <button className="text-sm text-primary hover:text-primary-dark transition-colors">
          ดูทั้งหมด
        </button>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-muted">ยังไม่มีกิจกรรมล่าสุด</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.message}</p>
                {activity.amount && (
                  <p className="text-sm font-medium text-success">
                    ฿{activity.amount.toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-muted mt-1">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
