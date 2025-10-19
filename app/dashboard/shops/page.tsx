import { DashboardShopsView } from "@/src/presentation/components/dashboard/DashboardShopsView";
import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { DashboardPresenterFactory } from "@/src/presentation/presenters/dashboard/DashboardPresenter";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata(): Promise<Metadata> {
  const presenter = await DashboardPresenterFactory.create();

  try {
    const metadata = presenter.generateMetadata();
    return {
      ...metadata,
      title: "ร้านค้าของคุณ | Shop Queue",
      description: "จัดการร้านค้า สร้างร้านใหม่ และเข้าถึงหน้าจัดการระบบคิวของคุณ",
    };
  } catch (error) {
    console.error("Error generating metadata for dashboard shops page:", error);
    return {
      title: "ร้านค้าของคุณ | Shop Queue",
      description: "จัดการร้านค้าและเริ่มต้นใช้งานระบบคิว Shop Queue",
    };
  }
}

export default async function DashboardShopsPage() {
  const presenter = await DashboardPresenterFactory.create();

  try {
    const viewModel = await presenter.getViewModel();

    if (!viewModel || !viewModel.user) {
      redirect("/auth/login");
    }

    const shops = viewModel.shops ?? [];
    const canCreateShop = viewModel.subscription.canCreateShop;
    const maxShopsAllowed = viewModel.subscription.limits.maxShops ?? null;

    return (
      <FrontendLayout>
        <DashboardShopsView
          shops={shops}
          canCreateShop={canCreateShop}
          maxShopsAllowed={maxShopsAllowed}
        />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("Error fetching dashboard shops data:", error);

    return (
      <FrontendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-surface rounded-lg border border-border p-8 text-center">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-error"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-2">เกิดข้อผิดพลาด</h2>
              <p className="text-muted mb-6">
                ไม่สามารถโหลดข้อมูลร้านค้าได้ กรุณาลองใหม่อีกครั้ง
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/dashboard/shops"
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  ลองใหม่อีกครั้ง
                </a>
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-4 py-2 bg-surface border border-border text-foreground rounded-md hover:bg-muted/50 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  กลับแดชบอร์ด
                </a>
              </div>
            </div>
          </div>
        </div>
      </FrontendLayout>
    );
  }
}
