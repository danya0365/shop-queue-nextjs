import { redirect } from "next/navigation";
import type { Metadata } from "next";

import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { SwitchProfileView } from "@/src/presentation/components/account/SwitchProfileView";
import { SwitchProfilePresenterFactory } from "@/src/presentation/presenters/account/SwitchProfilePresenter";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata(): Promise<Metadata> {
  const presenter = await SwitchProfilePresenterFactory.create();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("SwitchProfilePage: Failed to generate metadata", error);
    return {
      title: "เปลี่ยนโปรไฟล์การใช้งาน | Shop Queue",
      description: "สลับโปรไฟล์เพื่อใช้งานในบทบาทที่ต้องการได้อย่างรวดเร็ว",
    };
  }
}

export default async function SwitchProfilePage() {
  const presenter = await SwitchProfilePresenterFactory.create();

  try {
    const viewModel = await presenter.getViewModel();

    if (!viewModel.user) {
      redirect("/auth/login");
    }

    return (
      <FrontendLayout>
        <SwitchProfileView viewModel={viewModel} />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("SwitchProfilePage: Failed to load view model", error);
    redirect("/auth/login");
  }
}
