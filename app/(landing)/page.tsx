import { LandingView } from "@/src/presentation/components/landing/LandingView";
import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { LandingPresenter } from "@/src/presentation/presenters/LandingPresenter";
import type { Metadata } from "next";

const presenter = new LandingPresenter();

export async function generateMetadata(): Promise<Metadata> {
  return await presenter.generateMetadata();
}

export default async function Home() {
  const viewModel = await presenter.getViewModel();
  
  return (
    <FrontendLayout>
      <LandingView viewModel={viewModel} />
    </FrontendLayout>
  );
}
