"use client";

import { DashboardViewModel } from "@/src/presentation/presenters/dashboard/DashboardPresenter";
import { QuickActionsCard } from "./QuickActionsCard";
import { RecentActivityCard } from "./RecentActivityCard";
import { ShopListCard } from "./ShopListCard";
import { StatsCard } from "./StatsCard";
import { SubscriptionLimitsCard } from "./SubscriptionLimitsCard";

interface DashboardViewProps {
  viewModel: DashboardViewModel;
}

export function DashboardView({ viewModel }: DashboardViewProps) {
  const { user, stats, recentActivity, hasShops, shops, subscription } =
    viewModel;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} นาที`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} ชม. ${remainingMinutes} นาที`
      : `${hours} ชั่วโมง`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            สวัสดี, {user?.email?.split("@")[0] || "ผู้ใช้"}! 👋
          </h1>
          <p className="text-muted">
            {hasShops
              ? "ภาพรวมการจัดการร้านค้าและระบบคิวของคุณ"
              : "เริ่มต้นการจัดการร้านค้าของคุณ"}
          </p>
        </div>

        {hasShops ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              <StatsCard
                title="ร้านค้าทั้งหมด"
                value={stats.totalShops}
                icon={
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                }
                description="ร้านที่คุณจัดการ"
              />

              <StatsCard
                title="คิวที่ใช้งานอยู่"
                value={stats.activeQueues}
                change={stats.activeQueuesChange}
                changeType={stats.activeQueuesChangeType}
                icon={
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                }
                description="คิวที่รอการให้บริการ"
              />

              <StatsCard
                title="รายได้วันนี้"
                value={formatCurrency(stats.todayRevenue)}
                change={stats.revenueChange}
                changeType={stats.revenueChangeType}
                icon={
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                }
                description="เปรียบเทียบกับเมื่อวาน"
              />

              <StatsCard
                title="ให้บริการแล้ววันนี้"
                value={stats.servedToday}
                change={stats.servedChange}
                changeType={stats.servedChangeType}
                icon={
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                description="คิวที่เสร็จสิ้นแล้ว"
              />

              <StatsCard
                title="คิวที่รอยืนยัน"
                value={stats.pendingQueues}
                icon={
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                description="ต้องการความสนใจ"
              />

              <StatsCard
                title="เวลารอเฉลี่ย"
                value={formatTime(stats.averageWaitTime)}
                change={stats.waitTimeChange}
                changeType={stats.waitTimeChangeType}
                icon={
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                }
                description="ดีขึ้นจากเมื่อวาน"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <QuickActionsCard hasShops={hasShops} />
              <RecentActivityCard activities={recentActivity} />
              <SubscriptionLimitsCard
                tier={subscription.tier}
                limits={subscription.limits}
                usage={subscription.usage}
                canCreateShop={subscription.canCreateShop}
              />
            </div>

            {/* Shop List Section */}
            <ShopListCard shops={shops} />
          </>
        ) : (
          /* No Shops State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-4">
                ยินดีต้อนรับสู่ Shop Queue!
              </h2>

              <p className="text-muted mb-8">
                เริ่มต้นการจัดการร้านค้าของคุณด้วยระบบคิวที่ทันสมัย
                สร้างร้านแรกของคุณเพื่อเริ่มใช้งานระบบ
              </p>

              <QuickActionsCard hasShops={hasShops} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
