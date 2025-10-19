"use client";

import type { ShopMerchantDashboardViewModel } from "@/src/presentation/presenters/shop/merchant/ShopMerchantDashboardPresenter";
import { useProfileStore } from "@/src/presentation/stores/profile-store";
import Link from "next/link";

interface ShopMerchantDashboardViewProps {
  viewModel: ShopMerchantDashboardViewModel;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTime(minutes: number) {
  if (minutes < 60) {
    return `${minutes} นาที`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours} ชม. ${remainingMinutes} นาที`
    : `${hours} ชั่วโมง`;
}

export function ShopMerchantDashboardView({
  viewModel,
}: ShopMerchantDashboardViewProps) {
  const { activeProfile } = useProfileStore();
  const { stats, recentActivity, hasShops, shops, subscription } = viewModel;

  return (
    <div className="space-y-10">
      <section className="marketplace-card gradient-border p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold">
              ภาพรวม
            </p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              ยินดีต้อนรับกลับ, {activeProfile?.fullName || "ผู้ประกอบการ"}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
              สรุปภาพรวมการดำเนินงานร้านค้าของคุณ
              ตรวจสอบสถิติสำคัญและจัดการร้านค้าได้จากที่นี่
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center px-4 py-2 rounded-lg marketplace-button-primary text-white"
            >
              สำรวจตลาดร้านค้า
            </Link>
            <Link
              href="/shop/create"
              className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              สร้างร้านค้าใหม่
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <DashboardStatCard
          title="ร้านค้าทั้งหมด"
          value={stats.totalShops.toLocaleString("th-TH")}
          description="ร้านที่คุณดูแล"
        />
        <DashboardStatCard
          title="รายได้วันนี้"
          value={formatCurrency(stats.todayRevenue)}
          change={stats.revenueChange}
          changeType={stats.revenueChangeType}
          description="เทียบกับเมื่อวาน"
        />
        <DashboardStatCard
          title="คิวที่ใช้งานอยู่"
          value={stats.activeQueues.toLocaleString("th-TH")}
          change={stats.activeQueuesChange}
          changeType={stats.activeQueuesChangeType}
          description="กำลังรอการให้บริการ"
        />
        <DashboardStatCard
          title="ให้บริการแล้ววันนี้"
          value={stats.servedToday.toLocaleString("th-TH")}
          change={stats.servedChange}
          changeType={stats.servedChangeType}
          description="คิวเสร็จสิ้นทั้งหมด"
        />
        <DashboardStatCard
          title="คิวที่รออนุมัติ"
          value={stats.pendingQueues.toLocaleString("th-TH")}
          description="ต้องการความสนใจ"
        />
        <DashboardStatCard
          title="เวลารอเฉลี่ย"
          value={formatTime(stats.averageWaitTime)}
          change={stats.waitTimeChange}
          changeType={stats.waitTimeChangeType}
          description="แนวโน้มจากเมื่อวาน"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          <div className="marketplace-card bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  กิจกรรมล่าสุด
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  บันทึกการให้บริการและสถานะคิวแบบเรียลไทม์
                </p>
              </div>
              <Link
                href="/shop/backend/queues"
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                จัดการคิวทั้งหมด
              </Link>
            </div>

            {recentActivity.length === 0 ? (
              <EmptyState
                title="ยังไม่มีกิจกรรม"
                description="ระบบจะบันทึกข้อมูลกิจกรรมเมื่อมีการเคลื่อนไหวของคิวหรือการชำระเงิน"
              />
            ) : (
              <div className="space-y-4">
                {recentActivity.slice(0, 6).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.timestamp}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-wide text-orange-500 font-semibold">
                      {activity.type === "queue_served"
                        ? "คิวสำเร็จ"
                        : activity.type === "payment_received"
                        ? "ชำระเงิน"
                        : "คิวใหม่"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="marketplace-card bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  ร้านค้าที่คุณดูแล
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  เข้าถึงหน้าแดชบอร์ดของแต่ละร้านเพื่อจัดการข้อมูลและคิว
                </p>
              </div>
              <Link
                href="/shop"
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                ดูร้านทั้งหมด
              </Link>
            </div>

            {!hasShops ? (
              <EmptyState
                title="ยังไม่มีร้านค้าที่คุณดูแล"
                description="เริ่มต้นสร้างร้านค้าเพื่อจัดการคิวและบริการได้ทันที"
              >
                <Link
                  href="/shop/create"
                  className="inline-flex items-center px-4 py-2 rounded-lg marketplace-button-primary text-white"
                >
                  สร้างร้านค้าแรกของคุณ
                </Link>
              </EmptyState>
            ) : (
              <div className="space-y-4">
                {shops.map((shop) => (
                  <div
                    key={shop.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-4"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        {shop.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {shop.description || "ร้านค้าของคุณในระบบ Shop Queue"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/shop/${shop.id}/backend`}
                        className="inline-flex items-center px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        จัดการร้านค้า
                      </Link>
                      <Link
                        href={`/shop/${shop.id}/queue`}
                        className="inline-flex items-center px-3 py-2 rounded-lg marketplace-button-primary text-sm text-white"
                      >
                        ดูคิวปัจจุบัน
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="marketplace-card bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              สถานะการสมัครใช้งาน
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              ตรวจสอบการใช้งานแพ็กเกจของคุณและขยายความสามารถได้ทุกเมื่อ
            </p>
            <div className="space-y-4">
              <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-500/40 p-4">
                <p className="text-sm text-orange-600 font-semibold uppercase tracking-wide">
                  แพ็กเกจปัจจุบัน
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {subscription.tier}
                </p>
              </div>

              <div className="space-y-3">
                <UsageStat
                  label="จำนวนร้านที่ใช้งาน"
                  current={subscription.usage.currentShops}
                  limit={subscription.limits.maxShops}
                />
                <UsageStat
                  label="จำนวนคิววันนี้"
                  current={subscription.usage.todayQueues}
                  limit={subscription.limits.maxQueuesPerDay}
                />
                <UsageStat
                  label="พนักงานที่ใช้งาน"
                  current={subscription.usage.currentStaff}
                  limit={subscription.limits.maxStaff}
                />
              </div>

              <Link
                href="/pricing"
                className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg marketplace-button-primary text-white"
              >
                อัปเกรดแพ็กเกจ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface DashboardStatCardProps {
  title: string;
  value: string;
  description: string;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
}

function DashboardStatCard({
  title,
  value,
  description,
  change,
  changeType,
}: DashboardStatCardProps) {
  const changeColor =
    changeType === "increase"
      ? "text-emerald-600"
      : changeType === "decrease"
      ? "text-red-600"
      : "text-slate-500";

  return (
    <div className="marketplace-card bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-3xl font-semibold text-slate-900 dark:text-white mt-2">
        {value}
      </p>
      {change && (
        <p className={`text-sm font-medium mt-2 ${changeColor}`}>{change}</p>
      )}
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
        {description}
      </p>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 py-14 px-6">
      <div className="text-5xl mb-4">📊</div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 max-w-md">
        {description}
      </p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

interface UsageStatProps {
  label: string;
  current: number;
  limit: number | null | undefined;
}

function UsageStat({ label, current, limit }: UsageStatProps) {
  const percentage =
    limit && limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>{label}</span>
        <span>
          {current.toLocaleString("th-TH")} /{" "}
          {limit ? limit.toLocaleString("th-TH") : "ไม่จำกัด"}
        </span>
      </div>
      {limit && limit > 0 ? (
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      ) : (
        <div className="text-xs text-slate-400 dark:text-slate-500">
          ไม่จำกัดการใช้งาน
        </div>
      )}
    </div>
  );
}
