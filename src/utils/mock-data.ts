/**
 * Mock data utilities for development and testing
 * Following Clean Architecture and SOLID principles
 */

import { ShopCreateData } from '@/src/presentation/presenters/dashboard/shop-create/useShopCreatePresenter';

/**
 * Mock shop data for testing the shop creation form
 * This data is used in local development to auto-fill the form
 */
export const MOCK_SHOP_DATA: ShopCreateData = {
  name: 'ร้านตัดผมชายสมัยใหม่',
  description: 'ร้านตัดผมชายที่ทันสมัย บริการตัดผม ทำผม และดูแลเส้นผมโดยช่างผมมืออาชีพ',
  category: 'haircut', // This should match a valid category ID from your database
  address: '123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
  phone: '02-123-4567',
  email: 'contact@modernbarbershop.com',
  website: 'https://modernbarbershop.com',
  operatingHours: {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '20:00', closed: false },
    saturday: { open: '08:00', close: '20:00', closed: false },
    sunday: { open: '10:00', close: '17:00', closed: false }
  }
};

/**
 * Alternative mock data for a restaurant
 */
export const MOCK_RESTAURANT_DATA: ShopCreateData = {
  name: 'ร้านอาหารไทยบ้านนา',
  description: 'ร้านอาหารไทยแท้ๆ บริการอาหารไทยภาคกลางและภาคอีสาน วัตถุดิบสดใหม่ทุกวัน',
  category: 'restaurant',
  address: '456/78 ถนนพระราม 4 แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพมหานคร 10120',
  phone: '02-987-6543',
  email: 'info@thaifoodhome.com',
  website: 'https://thaifoodhome.com',
  operatingHours: {
    monday: { open: '10:00', close: '22:00', closed: false },
    tuesday: { open: '10:00', close: '22:00', closed: false },
    wednesday: { open: '10:00', close: '22:00', closed: false },
    thursday: { open: '10:00', close: '22:00', closed: false },
    friday: { open: '10:00', close: '23:00', closed: false },
    saturday: { open: '10:00', close: '23:00', closed: false },
    sunday: { open: '10:00', close: '22:00', closed: false }
  }
};

/**
 * Alternative mock data for a coffee shop
 */
export const MOCK_COFFEE_SHOP_DATA: ShopCreateData = {
  name: 'คาเฟ่สาขลด',
  description: 'คาเฟ่เล็กๆ สไตล์โฮมเมด บริการกาแฟสด เค้กและของว่างในบรรยากาศสบายๆ',
  category: 'cafe',
  address: '789/10 ซอยสาขลด แขวงสาทร เขตสาทร กรุงเทพมหานคร 10120',
  phone: '02-555-6666',
  email: 'hello@sakhacoffee.com',
  website: 'https://sakhacoffee.com',
  operatingHours: {
    monday: { open: '07:00', close: '18:00', closed: false },
    tuesday: { open: '07:00', close: '18:00', closed: false },
    wednesday: { open: '07:00', close: '18:00', closed: false },
    thursday: { open: '07:00', close: '18:00', closed: false },
    friday: { open: '07:00', close: '20:00', closed: false },
    saturday: { open: '08:00', close: '20:00', closed: false },
    sunday: { open: '08:00', close: '17:00', closed: false }
  }
};

/**
 * Get mock data based on shop type
 * @param type The type of mock data to get ('barbershop', 'restaurant', 'cafe')
 * @returns Mock shop data
 */
export const getMockShopData = (type: 'barbershop' | 'restaurant' | 'cafe' = 'barbershop'): ShopCreateData => {
  switch (type) {
    case 'restaurant':
      return MOCK_RESTAURANT_DATA;
    case 'cafe':
      return MOCK_COFFEE_SHOP_DATA;
    default:
      return MOCK_SHOP_DATA;
  }
};

/**
 * Get all available mock data types
 * @returns Array of available mock data types
 */
export const getMockDataTypes = () => {
  return [
    { value: 'barbershop', label: 'ร้านตัดผม' },
    { value: 'restaurant', label: 'ร้านอาหาร' },
    { value: 'cafe', label: 'คาเฟ่' }
  ];
};
