import { AccountView } from "@/src/presentation/components/account/AccountView";
import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { AccountPresenterFactory } from "@/src/presentation/presenters/account/AccountPresenter";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

// Tell Next.js this is a dynamic page that shouldn't be statically optimized
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the account page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await AccountPresenterFactory.create();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);
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
  const presenter = await AccountPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();
    if (!viewModel || !viewModel.user) {
      redirect("/auth/login");
    }

    return (
      <FrontendLayout>
        <AccountView
          user={viewModel.user}
        />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("Error fetching view model:", error);
    redirect("/auth/login");
  }
}
