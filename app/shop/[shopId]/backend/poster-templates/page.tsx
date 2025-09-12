import type { PosterTemplateFilters } from "@/src/application/services/shop/backend/poster-templates-backend-service";
import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { PosterTemplatesView } from "@/src/presentation/components/shop/backend/PosterTemplatesView";
import { PosterTemplatesPresenterFactory } from "@/src/presentation/presenters/shop/backend/PosterTemplatesPresenter";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ shopId: string }>;
  searchParams: Promise<{
    category?: string;
    orientation?: string;
    difficulty?: string;
    status?: string;
    search?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await PosterTemplatesPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error(
      "Error generating metadata for poster templates page:",
      error
    );
    return {
      title: "เทมเพลตโปสเตอร์ - เจ้าของร้าน | Shop Queue",
      description: "จัดการและติดตามเทมเพลตโปสเตอร์ของร้านคุณ",
    };
  }
}

export default async function PosterTemplatesPage({
  params,
  searchParams,
}: PageProps) {
  const { shopId } = await params;
  const { category, orientation, difficulty, status, search } =
    await searchParams;
  const presenter = await PosterTemplatesPresenterFactory.create();

  try {
    // Build filters from search params
    const filters: PosterTemplateFilters = {};
    if (category && category !== "all") {
      filters.category = category;
    }
    if (orientation && orientation !== "all") {
      filters.orientation = orientation;
    }
    if (difficulty && difficulty !== "all") {
      filters.difficulty = difficulty;
    }
    if (status && status !== "all") {
      filters.status = status;
    }
    if (search) {
      filters.search = search;
    }

    const viewModel = await presenter.getViewModel(shopId, filters);
    const shopInfo = await presenter.getShopInfo(shopId);
    return (
      <BackendLayout shop={shopInfo}>
        <PosterTemplatesView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("PosterTemplatesPage: Error loading page", {
      shopId,
      searchParams,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return (
      <BackendLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              เกิดข้อผิดพลาด
            </h2>
            <p className="text-gray-600 mb-4">
              ไม่สามารถโหลดข้อมูลเทมเพลตโปสเตอร์ได้
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </BackendLayout>
    );
  }
}
