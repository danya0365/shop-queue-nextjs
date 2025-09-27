import { ShopMarketplaceLayout } from "@/src/presentation/components/layouts/shop/marketplace";
import { ShopContactView } from "@/src/presentation/components/shop/contact/ShopContactView";
import { ShopContactPresenterFactory } from "@/src/presentation/presenters/shop/contact/ShopContactPresenter";
import type { Metadata } from "next";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the contact page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ติดต่อเรา | Shop Queue",
    description: "ติดต่อทีมงาน Shop Queue สำหรับการสนับสนุน คำถาม หรือข้อเสนอแนะ เราพร้อมให้บริการและช่วยเหลือคุณตลอด 24 ชั่วโมง",
    keywords: "ติดต่อเรา, Shop Queue, สนับสนุน, ช่วยเหลือ, คำถาม, ข้อเสนอแนะ, บริการลูกค้า",
    openGraph: {
      title: "ติดต่อเรา | Shop Queue",
      description: "ติดต่อทีมงาน Shop Queue สำหรับการสนับสนุน คำถาม หรือข้อเสนอแนะ",
      type: "website",
    },
  };
}

/**
 * Shop Contact page - Server Component for SEO optimization
 * Contact us page with contact form and company information
 */
export default async function ShopContactPage() {
  try {
    const presenter = await ShopContactPresenterFactory.create();
    const viewModel = await presenter.getViewModel();

    return (
      <ShopMarketplaceLayout>
        <ShopContactView initialViewModel={viewModel} />
      </ShopMarketplaceLayout>
    );
  } catch (error) {
    console.error("Error fetching shop contact data:", error);

    return (
      <ShopMarketplaceLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold marketplace-text-primary mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="marketplace-text-secondary mb-4">
              ไม่สามารถโหลดข้อมูลติดต่อได้
            </p>
            <form action="">
              <button
                type="submit"
                className="marketplace-button-primary px-4 py-2 rounded-lg transition-colors"
              >
                ลองใหม่อีกครั้ง
              </button>
            </form>
          </div>
        </div>
      </ShopMarketplaceLayout>
    );
  }
}
