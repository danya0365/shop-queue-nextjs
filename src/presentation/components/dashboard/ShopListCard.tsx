'use client';

import { ShopDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import Link from 'next/link';

interface ShopListCardProps {
  shops: ShopDTO[];
}

export function ShopListCard({ shops }: ShopListCardProps) {
  if (shops.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">ร้านค้าของคุณ</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏪</div>
          <p className="text-muted-foreground mb-6">คุณยังไม่มีร้านค้า</p>
          <Link
            href="/dashboard/shops/create"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            สร้างร้านแรก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">ร้านค้าของคุณ</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shops.map((shop) => (
          <div key={shop.id} className="bg-background rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-foreground">{shop.name}</h4>
                <p className="text-sm text-muted-foreground">{shop.description}</p>
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                เปิด
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              <div>📍 {shop.address}</div>
              <div>🏪 ID: {shop.id.slice(0, 8)}...</div>
            </div>

            <div className="flex gap-2">
              {/* Customer View */}
              <Link
                href={`/shop/${shop.id}`}
                className="flex-1 bg-blue-500 text-white text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                ลูกค้า
              </Link>

              {/* Employee View */}
              <Link
                href={`/shop/${shop.id}/employee`}
                className="flex-1 bg-green-500 text-white text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
              >
                พนักงาน
              </Link>

              {/* Backend View */}
              <Link
                href={`/shop/${shop.id}/backend`}
                className="flex-1 bg-orange-500 text-white text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                จัดการ
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Shop Button */}
      <div className="mt-6 pt-6 border-t border-border">
        <Link
          href="/dashboard/shops/create"
          className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          เพิ่มร้านใหม่
        </Link>
      </div>
    </div>
  );
}
