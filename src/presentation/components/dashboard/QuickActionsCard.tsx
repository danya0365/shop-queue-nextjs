'use client';

import Link from 'next/link';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'info';
}

interface QuickActionsCardProps {
  hasShops: boolean;
}

export function QuickActionsCard({ hasShops }: QuickActionsCardProps) {
  const getColorClasses = (color: QuickAction['color']) => {
    switch (color) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary-dark';
      case 'success':
        return 'bg-success text-white hover:bg-success-dark';
      case 'warning':
        return 'bg-warning text-white hover:bg-warning-dark';
      case 'info':
        return 'bg-info text-white hover:bg-info-dark';
      default:
        return 'bg-primary text-white hover:bg-primary-dark';
    }
  };

  const quickActions: QuickAction[] = hasShops
    ? [
        {
          title: 'จัดการคิว',
          description: 'ดูและจัดการคิวปัจจุบัน',
          href: '/dashboard/queues',
          color: 'primary',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          )
        },
        {
          title: 'เพิ่มลูกค้า',
          description: 'เพิ่มลูกค้าเข้าคิวใหม่',
          href: '/dashboard/customers/add',
          color: 'success',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          )
        },
        {
          title: 'รายงาน',
          description: 'ดูรายงานและสถิติ',
          href: '/dashboard/reports',
          color: 'info',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        },
        {
          title: 'ตั้งค่าร้าน',
          description: 'จัดการข้อมูลร้านค้า',
          href: '/dashboard/shops',
          color: 'warning',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )
        }
      ]
    : [
        {
          title: 'สร้างร้านแรก',
          description: 'เริ่มต้นด้วยการสร้างร้านค้าของคุณ',
          href: '/dashboard/shops/create',
          color: 'primary',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )
        },
        {
          title: 'คู่มือการใช้งาน',
          description: 'เรียนรู้วิธีใช้งานระบบ',
          href: '/help',
          color: 'info',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      ];

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">การดำเนินการด่วน</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`
              p-4 rounded-lg transition-all duration-200 transform hover:scale-105
              ${getColorClasses(action.color)}
            `}
          >
            <div className="flex items-center space-x-3">
              {action.icon}
              <div>
                <h4 className="font-medium">{action.title}</h4>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
