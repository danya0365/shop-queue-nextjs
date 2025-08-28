import type { Logger } from '@/src/domain/interfaces/logger';

export interface ShopInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  qrCodeUrl: string;
  logo?: string;
  openingHours: string;
  services: string[];
}

/**
 * Base presenter for Shop pages.
 * Provides common helpers for fetching shop info and generating metadata with shop name.
 */
export abstract class BaseShopPresenter {
  constructor(protected readonly logger: Logger) {}

  protected async getShopInfo(shopId: string): Promise<ShopInfo> {
    // TODO: Replace mock with real service call when backend is ready
    return {
      id: shopId,
      name: 'กาแฟดีดี',
      description: 'ร้านกาแฟและเบเกอรี่คุณภาพ',
      address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
      phone: '02-123-4567',
      qrCodeUrl: `https://shopqueue.app/shop/${shopId}`,
      logo: '/images/shop-logo.png',
      openingHours: 'จันทร์-อาทิตย์ 07:00-20:00',
      services: ['กาแฟสด', 'เบเกอรี่', 'เค้กสั่งทำ', 'เครื่องดื่มเย็น'],
    };
  }

  protected async generateShopMetadata(shopId: string, pageTitlePrefix: string, description: string) {
    const shopInfo = await this.getShopInfo(shopId);
    return {
      title: `${pageTitlePrefix} - ${shopInfo.name} | Shop Queue`,
      description,
    };
  }
}
