import { LandingView } from "@/src/presentation/components/landing/LandingView";
import { LandingPresenter } from "@/src/presentation/presenters/LandingPresenter";
import { ThemeToggle } from "@/src/presentation/components/ui/ThemeToggle";
import type { Metadata } from "next";

const presenter = new LandingPresenter();

export async function generateMetadata(): Promise<Metadata> {
  return await presenter.generateMetadata();
}

export default async function Home() {
  const viewModel = await presenter.getViewModel();
  
  return (
    <div className="relative min-h-screen">
      <LandingView viewModel={viewModel} />
      
      {/* Fixed Theme Toggle in bottom right corner */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
