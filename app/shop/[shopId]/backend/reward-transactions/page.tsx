import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import RewardTransactionsView from "@/src/presentation/components/shop/backend/RewardTransactionsView";
import { RewardTransactionsPresenterFactory } from "@/src/presentation/presenters/shop/backend/RewardTransactionsPresenter";
import { Metadata } from "next";

interface RewardTransactionsPageProps {
  params: Promise<{ shopId: string }>;
  searchParams: Promise<{
    status?: string;
    rewardType?: string;
    page?: string;
    limit?: string;
  }>;
}

export async function generateMetadata({
  params,
}: RewardTransactionsPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await RewardTransactionsPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error(
      "Error generating metadata for reward transactions page:",
      error
    );
    return {
      title: "ประวัติการแลกรางวัล - เจ้าของร้าน | Shop Queue",
      description: "จัดการและติดตามประวัติการแลกรางวัลของลูกค้า",
    };
  }
}

export default async function RewardTransactionsPage({
  params,
  searchParams,
}: RewardTransactionsPageProps) {
  const { shopId } = await params;
  const { status, rewardType, page, limit } = await searchParams;

  try {
    const presenter = await RewardTransactionsPresenterFactory.create();

    // Parse search params for filters
    const filters = {
      status: status,
      rewardType: rewardType,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    };

    const viewModel = await presenter.getViewModel(shopId, filters);
    const shopInfo = await presenter.getShopInfo(shopId);
    return (
      <BackendLayout shop={shopInfo}>
        <RewardTransactionsView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("RewardTransactionsPage: Error rendering page:", {
      shopId,
      error: errorMessage,
    });

    return (
      <BackendLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  เกิดข้อผิดพลาดในการโหลดข้อมูล
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    ไม่สามารถโหลดข้อมูลประวัติการแลกรางวัลได้
                    กรุณาลองใหม่อีกครั้ง
                  </p>
                  <p className="mt-1 text-xs">
                    รายละเอียดข้อผิดพลาด: {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BackendLayout>
    );
  }
}
