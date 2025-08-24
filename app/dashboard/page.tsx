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
    redirect("/auth/login");
  }
}
