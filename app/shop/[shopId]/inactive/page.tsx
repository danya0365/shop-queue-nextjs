import FrontendLayout from "@/src/presentation/components/layouts/shop/frontend/FrontendLayout";
import { ShopPresenterFactory } from "@/src/presentation/presenters/shop/ShopPresenter";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface InactiveShopPageProps {
  params: Promise<{ shopId: string }>;
}

export async function generateMetadata({
  params,
}: InactiveShopPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await ShopPresenterFactory.create();
  try {
    const shop = await presenter.getShopInfo(shopId);
    const title = shop?.name ? `${shop.name} | ร้านปิดชั่วคราว` : "ร้านปิดชั่วคราว";
    return {
      title,
      description:
        shop?.name
          ? `ขณะนี้ร้าน ${shop.name} อยู่ในสถานะปิดชั่วคราว กรุณากลับมาใหม่ภายหลัง หรือติดต่อร้านโดยตรง`
          : "ขณะนี้ร้านอยู่ในสถานะปิดชั่วคราว กรุณากลับมาใหม่ภายหลัง",
    };
  } catch {
    return {
      title: "ร้านปิดชั่วคราว",
      description: "ขณะนี้ร้านอยู่ในสถานะปิดชั่วคราว กรุณากลับมาใหม่ภายหลัง",
    };
  }
}

export default async function InactiveShopPage({ params }: InactiveShopPageProps) {
  const { shopId } = await params;
  const presenter = await ShopPresenterFactory.create();

  try {
    const shop = await presenter.getShopInfo(shopId);

    return (
      <FrontendLayout>
        <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
          <div className="max-w-xl w-full text-center">
            <div className="mb-4 text-5xl" aria-hidden>⏸️</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              ร้านนี้ยังไม่เปิดให้บริการ
            </h1>
            <p className="text-muted mb-6">
              {shop?.name ? (
                <>
                  ขณะนี้ร้าน <span className="font-semibold">{shop.name}</span> อยู่ในสถานะปิดชั่วคราวหรือยังไม่พร้อมให้บริการ
                </>
              ) : (
                <>ขณะนี้ร้านอยู่ในสถานะปิดชั่วคราวหรือยังไม่พร้อมให้บริการ</>
              )}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                กลับหน้าหลัก
              </Link>
              <Link
                href={`/shop/${shopId}/contact`}
                className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
              >
                ติดต่อร้านค้า
              </Link>
            </div>
          </div>
        </div>
      </FrontendLayout>
    );
  } catch {
    return (
      <FrontendLayout>
        <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
          <div className="max-w-xl w-full text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">เกิดข้อผิดพลาด</h1>
            <p className="text-muted mb-6">ไม่สามารถโหลดข้อมูลร้านได้</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                กลับหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </FrontendLayout>
    );
  }
}
