import { ServiceDTO } from '@/src/application/dtos/backend/services-dto';
import { OpeningHour } from '@/src/application/dtos/shop/backend/shop-opening-hour-dto';
import { IShopService, ShopService } from '@/src/application/services/shop/ShopService';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { Metadata } from 'next';

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
  constructor(protected readonly logger: Logger, protected readonly shopService: IShopService) { }

  protected async getShopInfo(shopId: string): Promise<ShopInfo> {
    const shop = await this.shopService.getShopById(shopId);
    return {
      id: shop.id,
      name: shop.name,
      description: shop.description || '',
      address: shop.address || '',
      phone: shop.phone || '',
      qrCodeUrl: `https://shopqueue.app/shop/${shopId}`,
      logo: '/images/shop-logo.png',
      openingHours: this.createOpeningHoursString(shop.openingHours),
      services: this.createServicesString(shop.services),
    };
  }


  // create opening hours string from OpeningHour[]
  protected createOpeningHoursString(openingHours: OpeningHour[]): string {
    if (!openingHours || openingHours.length === 0) {
      return 'ทุกวันตลอด 24 ชั่วโมง';
    }
    // create map of dayOfWeek to day
    const dayMap = new Map([
      ['monday', 'จันทร์'],
      ['tuesday', 'อังคาร'],
      ['wednesday', 'พุธ'],
      ['thursday', 'พฤหัส'],
      ['friday', 'ศุกร์'],
      ['saturday', 'เสาร์'],
      ['sunday', 'อาทิตย์'],
    ]);

    return openingHours.map((hour) => `${dayMap.get(hour.dayOfWeek)}: ${hour.openTime} - ${hour.closeTime}`).join(', ');
  }

  // create services string from ServiceDTO[]
  protected createServicesString(services: Partial<ServiceDTO>[]): string[] {
    return services.map((service) => service.name || '');
  }

  protected async generateShopMetadata(shopId: string, pageTitlePrefix: string, description: string): Promise<Metadata> {
    const shopInfo = await this.getShopInfo(shopId);
    return {
      title: `${pageTitlePrefix} - ${shopInfo.name} | Shop Queue`,
      description,
    };
  }
}
