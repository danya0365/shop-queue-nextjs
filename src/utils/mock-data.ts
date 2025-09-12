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
    monday: { openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: true, is24Hours: false },
    tuesday: { openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: true, is24Hours: false },
    wednesday: { openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: true, is24Hours: false },
    thursday: { openTime: '09:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: true, is24Hours: false },
    friday: { openTime: '09:00', closeTime: '20:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: true, is24Hours: false },
    saturday: { openTime: '08:00', closeTime: '20:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: true, is24Hours: false },
    sunday: { openTime: '10:00', closeTime: '17:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: true, is24Hours: false }
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
    monday: { openTime: '10:00', closeTime: '22:00', breakStart: '14:00', breakEnd: '15:00', closed: false, hasBreak: true, is24Hours: false },
    tuesday: { openTime: '10:00', closeTime: '22:00', breakStart: '14:00', breakEnd: '15:00', closed: false, hasBreak: true, is24Hours: false },
    wednesday: { openTime: '10:00', closeTime: '22:00', breakStart: '14:00', breakEnd: '15:00', closed: false, hasBreak: true, is24Hours: false },
    thursday: { openTime: '10:00', closeTime: '22:00', breakStart: '14:00', breakEnd: '15:00', closed: false, hasBreak: true, is24Hours: false },
    friday: { openTime: '10:00', closeTime: '23:00', breakStart: '14:00', breakEnd: '15:00', closed: false, hasBreak: true, is24Hours: false },
    saturday: { openTime: '10:00', closeTime: '23:00', breakStart: '14:00', breakEnd: '15:00', closed: false, hasBreak: true, is24Hours: false },
    sunday: { openTime: '10:00', closeTime: '22:00', breakStart: '14:00', breakEnd: '15:00', closed: false, hasBreak: true, is24Hours: false }
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
    monday: { openTime: '07:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: true, is24Hours: false },
    tuesday: { openTime: '07:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: true, is24Hours: false },
    wednesday: { openTime: '07:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: true, is24Hours: false },
    thursday: { openTime: '07:00', closeTime: '18:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: true, is24Hours: false },
    friday: { openTime: '07:00', closeTime: '20:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: true, is24Hours: false },
    saturday: { openTime: '08:00', closeTime: '20:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: false, is24Hours: false },
    sunday: { openTime: '08:00', closeTime: '17:00', breakStart: '12:00', breakEnd: '13:00', closed: false, hasBreak: false, is24Hours: false }
  }
};

/**
 * Generate random mock shop data
 * @returns Random mock shop data
 */
export const getMockShopData = (): ShopCreateData => {
  // Shop types and names
  const shopTypes = [
    { type: 'haircut', names: ['ร้านตัดผมชายสมัยใหม่', 'ร้านตัดผมสไตล์คลาสสิก', 'ร้านตัดผมเกาหลี', 'ร้านตัดผมญี่ปุ่น', 'ร้านตัดผมยุโรป'] },
    { type: 'restaurant', names: ['ร้านอาหารไทยบ้านนา', 'ร้านอาหารญี่ปุ่น', 'ร้านอาหารจีน', 'ร้านอาหารอิตาเลียน', 'ร้านอาหารฝรั่งเศส'] },
    { type: 'cafe', names: ['คาเฟ่สาขลด', 'คาเฟ่โฮมเมด', 'คาเฟ่อาร์ต', 'คาเฟ่บุ๊ค', 'คาเฟ่การ์เดน'] }
  ];

  // Random shop type
  const randomShopType = shopTypes[Math.floor(Math.random() * shopTypes.length)];
  const randomName = randomShopType.names[Math.floor(Math.random() * randomShopType.names.length)];

  // Random descriptions
  const descriptions = [
    'บริการคุณภาพด้วยทีมงานมืออาชีพ',
    'สถานที่สะอาดสะอ้าน บริการดีเยี่ยม',
    'ประสบการณ์การบริการมากกว่า 10 ปี',
    'ราคายุติธรรม คุณภาพเยี่ยม',
    'บริการด้วยใจ ใส่ใจทุกรายละเอียด'
  ];
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

  // Random addresses
  const addresses = [
    '123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
    '456/78 ถนนพระราม 4 แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพมหานคร 10120',
    '789/10 ซอยสาขลด แขวงสาทร เขตสาทร กรุงเทพมหานคร 10120',
    '111/22 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500',
    '333/44 ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310'
  ];
  const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];

  // Random phone numbers
  const phonePrefixes = ['02', '081', '082', '083', '084', '085', '086', '087', '089', '061', '062', '063', '064', '065'];
  const randomPrefix = phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];
  const randomNumber = Math.floor(Math.random() * 9000000) + 1000000;
  const randomPhone = `${randomPrefix}-${randomNumber.toString().slice(0, 3)}-${randomNumber.toString().slice(3, 7)}`;

  // Random emails
  const emailDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
  const randomDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  const randomEmail = `contact${Math.floor(Math.random() * 1000)}@${randomDomain}`;

  // Random websites
  const websiteDomains = ['.com', '.co.th', '.net', '.org'];
  const randomWebsiteDomain = websiteDomains[Math.floor(Math.random() * websiteDomains.length)];
  const randomWebsite = `https://${randomName.toLowerCase().replace(/\s+/g, '')}${randomWebsiteDomain}`;

  // Generate random operating hours
  const generateOperatingHours = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hours: {
      monday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean; hasBreak: boolean; is24Hours: boolean };
      tuesday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean; hasBreak: boolean; is24Hours: boolean };
      wednesday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean; hasBreak: boolean; is24Hours: boolean };
      thursday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean; hasBreak: boolean; is24Hours: boolean };
      friday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean; hasBreak: boolean; is24Hours: boolean };
      saturday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean; hasBreak: boolean; is24Hours: boolean };
      sunday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean; hasBreak: boolean; is24Hours: boolean };
    } = {
      monday: { openTime: '', closeTime: '', breakStart: '', breakEnd: '', closed: false, hasBreak: false, is24Hours: false },
      tuesday: { openTime: '', closeTime: '', breakStart: '', breakEnd: '', closed: false, hasBreak: false, is24Hours: false },
      wednesday: { openTime: '', closeTime: '', breakStart: '', breakEnd: '', closed: false, hasBreak: false, is24Hours: false },
      thursday: { openTime: '', closeTime: '', breakStart: '', breakEnd: '', closed: false, hasBreak: false, is24Hours: false },
      friday: { openTime: '', closeTime: '', breakStart: '', breakEnd: '', closed: false, hasBreak: false, is24Hours: false },
      saturday: { openTime: '', closeTime: '', breakStart: '', breakEnd: '', closed: false, hasBreak: false, is24Hours: false },
      sunday: { openTime: '', closeTime: '', breakStart: '', breakEnd: '', closed: false, hasBreak: false, is24Hours: false }
    };
    
    days.forEach(day => {
      // Random open time between 7:00 and 11:00
      const openHour = Math.floor(Math.random() * 5) + 7;
      const openMinute = Math.random() < 0.5 ? '00' : '30';
      
      // Random close time between 17:00 and 23:00
      const closeHour = Math.floor(Math.random() * 7) + 17;
      const closeMinute = Math.random() < 0.5 ? '00' : '30';
      
      // Random break time if applicable
      const hasBreak = Math.random() < 0.7; // 70% chance of having break
      const breakStart = hasBreak ? `${Math.floor(Math.random() * 3) + 12}:00` : '12:00';
      const breakEnd = hasBreak ? `${Math.floor(Math.random() * 2) + 13}:00` : '13:00';
      
      // 10% chance of being closed
      const closed = Math.random() < 0.1;
      
      // 5% chance of being 24 hours
      const is24Hours = Math.random() < 0.05;
      
      // Type assertion to fix indexing issue
      const dayKey = day as keyof typeof hours;
      
      hours[dayKey] = {
        openTime: `${openHour}:${openMinute}`,
        closeTime: `${closeHour}:${closeMinute}`,
        breakStart,
        breakEnd,
        closed,
        hasBreak: hasBreak && !closed && !is24Hours,
        is24Hours
      };
    });
    
    return hours;
  };

  return {
    name: randomName,
    description: randomDescription,
    category: randomShopType.type,
    address: randomAddress,
    phone: randomPhone,
    email: randomEmail,
    website: randomWebsite,
    operatingHours: generateOperatingHours()
  };
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
