import { getServerContainer } from "@/src/di/server-container";
import { Logger } from "@/src/domain/interfaces/logger";
import { createServerSupabaseClient } from "@/src/infrastructure/datasources/supabase-server-client";
import { AccountView } from "@/src/presentation/components/account/AccountView";
import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { AccountPresenter } from "@/src/presentation/presenters/account/AccountPresenter";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

/**
 * Generate metadata for the account page
 */
export async function generateMetadata(): Promise<Metadata> {
  const serverContainer = await getServerContainer();
  // Get dependencies
  const logger = serverContainer.resolve<Logger>("Logger");
  const presenter = new AccountPresenter(logger);

  try {
    return presenter.generateMetadata();
  } catch (error) {
    logger.error("AccountPage: Error generating metadata", error);

    // Fallback metadata
    return {
      title: "จัดการบัญชี | Shop Queue",
      description: "จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณ",
    };
  }
}

/**
 * Account page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function AccountPage() {
  const serverContainer = await getServerContainer();
  // Get dependencies
  const logger = serverContainer.resolve<Logger>("Logger");
  const presenter = new AccountPresenter(logger);

  // Check authentication
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return (
      <FrontendLayout>
        <AccountView
          title={viewModel.title}
          description={viewModel.description}
          authId={user.id}
        />
      </FrontendLayout>
    );
  } catch (error) {
    logger.error("AccountPage: Error rendering page", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 mb-4">ไม่สามารถโหลดหน้าจัดการบัญชีได้</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }
}
