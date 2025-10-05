import { DashboardView } from "@/src/presentation/components/dashboard/DashboardView";
import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { DashboardPresenterFactory } from "@/src/presentation/presenters/dashboard/DashboardPresenter";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

// Tell Next.js this is a dynamic page that shouldn't be statically optimized
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the dashboard page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await DashboardPresenterFactory.create();
  
  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);
    
    // Fallback metadata
    return {
      title: "แดชบอร์ด | Shop Queue",
      description: "ภาพรวมการจัดการร้านค้าและระบบคิวของคุณ",
    };
  }
}

/**
 * Dashboard page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function DashboardPage() {
  const presenter = await DashboardPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();
    
    if (!viewModel || !viewModel.user) {
      redirect("/auth/login");
    }

    return (
      <FrontendLayout>
        <DashboardView viewModel={viewModel} />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    
    // Show error UI instead of redirecting
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-surface rounded-lg border border-border p-8 text-center">
              {/* Error Icon */}
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

              {/* Error Message */}
              <h2 className="text-xl font-bold text-foreground mb-2">
                เกิดข้อผิดพลาด
              </h2>
              <p className="text-muted mb-6">
                ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ กรุณาลองใหม่อีกครั้ง
              </p>

              {/* Error Details (in development) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-error/5 border border-error/20 rounded-md p-4 mb-6 text-left">
                  <p className="text-xs font-mono text-error break-all">
                    {error instanceof Error ? error.message : 'Unknown error'}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/dashboard"
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
                  href="/auth/login"
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
                  เข้าสู่ระบบใหม่
                </a>
              </div>
            </div>
          </div>
        </div>
      </FrontendLayout>
    );
  }
}
