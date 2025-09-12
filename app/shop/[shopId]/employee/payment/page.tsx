import EmployeeLayout from "@/src/presentation/components/layouts/shop/employee/EmployeeLayout";
import { EmployeePaymentView } from "@/src/presentation/components/shop/employee/EmployeePaymentView";
import { EmployeePaymentPresenterFactory } from "@/src/presentation/presenters/shop/employee/EmployeePaymentPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface EmployeePaymentPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: EmployeePaymentPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await EmployeePaymentPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ชำระเงิน - พนักงาน | Shop Queue",
      description: "จัดการการชำระเงินและออกใบเสร็จสำหรับลูกค้า",
    };
  }
}

/**
 * Employee Payment page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function EmployeePaymentPage({
  params,
}: EmployeePaymentPageProps) {
  const { shopId } = await params;
  const presenter = await EmployeePaymentPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);
    const shopInfo = await presenter.getShopInfo(shopId);
    return (
      <EmployeeLayout shop={shopInfo}>
        <EmployeePaymentView viewModel={viewModel} />
      </EmployeeLayout>
    );
  } catch (error) {
    console.error("Error fetching employee payment data:", error);

    // Fallback UI
    return (
      <EmployeeLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลการชำระเงินได้</p>
            <Link
              href={`/shop/${shopId}/employee`}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </EmployeeLayout>
    );
  }
}
