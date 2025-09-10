import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { getClientContainer } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { isLocalDevelopment } from '@/src/utils/environment';
import { getMockShopData } from '@/src/utils/mock-data';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const clientContainer = getClientContainer();
const shopService = clientContainer.resolve<IShopService>('ShopService');
const profileService = clientContainer.resolve<IProfileService>('ProfileService');
const logger = clientContainer.resolve<Logger>('Logger');

// Helper function to map form operating hours to DTO opening hours format
const mapOperatingHoursToOpeningHours = (operatingHours: ShopCreateData['operatingHours']) => {
  return [
    {
      dayOfWeek: 'monday',
      isOpen: !operatingHours.monday.closed,
      openTime: operatingHours.monday.closed ? undefined : operatingHours.monday.openTime,
      closeTime: operatingHours.monday.closed ? undefined : operatingHours.monday.closeTime,
      breakStart: operatingHours.monday.closed ? undefined : operatingHours.monday.breakStart,
      breakEnd: operatingHours.monday.closed ? undefined : operatingHours.monday.breakEnd
    },
    {
      dayOfWeek: 'tuesday',
      isOpen: !operatingHours.tuesday.closed,
      openTime: operatingHours.tuesday.closed ? undefined : operatingHours.tuesday.openTime,
      closeTime: operatingHours.tuesday.closed ? undefined : operatingHours.tuesday.closeTime,
      breakStart: operatingHours.tuesday.closed ? undefined : operatingHours.tuesday.breakStart,
      breakEnd: operatingHours.tuesday.closed ? undefined : operatingHours.tuesday.breakEnd
    },
    {
      dayOfWeek: 'wednesday',
      isOpen: !operatingHours.wednesday.closed,
      openTime: operatingHours.wednesday.closed ? undefined : operatingHours.wednesday.openTime,
      closeTime: operatingHours.wednesday.closed ? undefined : operatingHours.wednesday.closeTime,
      breakStart: operatingHours.wednesday.closed ? undefined : operatingHours.wednesday.breakStart,
      breakEnd: operatingHours.wednesday.closed ? undefined : operatingHours.wednesday.breakEnd
    },
    {
      dayOfWeek: 'thursday',
      isOpen: !operatingHours.thursday.closed,
      openTime: operatingHours.thursday.closed ? undefined : operatingHours.thursday.openTime,
      closeTime: operatingHours.thursday.closed ? undefined : operatingHours.thursday.closeTime,
      breakStart: operatingHours.thursday.closed ? undefined : operatingHours.thursday.breakStart,
      breakEnd: operatingHours.thursday.closed ? undefined : operatingHours.thursday.breakEnd
    },
    {
      dayOfWeek: 'friday',
      isOpen: !operatingHours.friday.closed,
      openTime: operatingHours.friday.closed ? undefined : operatingHours.friday.openTime,
      closeTime: operatingHours.friday.closed ? undefined : operatingHours.friday.closeTime,
      breakStart: operatingHours.friday.closed ? undefined : operatingHours.friday.breakStart,
      breakEnd: operatingHours.friday.closed ? undefined : operatingHours.friday.breakEnd
    },
    {
      dayOfWeek: 'saturday',
      isOpen: !operatingHours.saturday.closed,
      openTime: operatingHours.saturday.closed ? undefined : operatingHours.saturday.openTime,
      closeTime: operatingHours.saturday.closed ? undefined : operatingHours.saturday.closeTime,
      breakStart: operatingHours.saturday.closed ? undefined : operatingHours.saturday.breakStart,
      breakEnd: operatingHours.saturday.closed ? undefined : operatingHours.saturday.breakEnd
    },
    {
      dayOfWeek: 'sunday',
      isOpen: !operatingHours.sunday.closed,
      openTime: operatingHours.sunday.closed ? undefined : operatingHours.sunday.openTime,
      closeTime: operatingHours.sunday.closed ? undefined : operatingHours.sunday.closeTime,
      breakStart: operatingHours.sunday.closed ? undefined : operatingHours.sunday.breakStart,
      breakEnd: operatingHours.sunday.closed ? undefined : operatingHours.sunday.breakEnd
    }
  ];
};

// Define form data interface
export interface ShopCreateData {
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  operatingHours: {
    monday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean };
    tuesday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean };
    wednesday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean };
    thursday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean };
    friday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean };
    saturday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean };
    sunday: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; closed: boolean };
  };
}

// Define state interface
export interface ShopCreatePresenterState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  validationErrors: Record<string, string>;
}

// Define actions interface
export interface ShopCreatePresenterActions {
  createShop: (data: ShopCreateData) => Promise<boolean>;
  reset: () => void;
  setError: (error: string | null) => void;
  clearValidationErrors: () => void;
  getMockData: () => ShopCreateData;
  isMockDataEnabled: () => boolean;
}

// Hook type
export type ShopCreatePresenterHook = [
  ShopCreatePresenterState,
  ShopCreatePresenterActions
];

// Custom hook implementation
export const useShopCreatePresenter = (): ShopCreatePresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateShopData = (data: ShopCreateData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.name.trim()) {
      errors.name = 'กรุณาระบุชื่อร้านค้า';
    } else if (data.name.length < 2) {
      errors.name = 'ชื่อร้านค้าต้องมีอย่างน้อย 2 ตัวอักษร';
    }

    if (!data.description.trim()) {
      errors.description = 'กรุณาระบุคำอธิบายร้านค้า';
    } else if (data.description.length < 10) {
      errors.description = 'คำอธิบายต้องมีอย่างน้อย 10 ตัวอักษร';
    }

    if (!data.category) {
      errors.category = 'กรุณาเลือกประเภทร้านค้า';
    }

    if (!data.address.trim()) {
      errors.address = 'กรุณาระบุที่อยู่ร้านค้า';
    }

    if (!data.phone.trim()) {
      errors.phone = 'กรุณาระบุเบอร์โทรศัพท์';
    } else if (!/^[0-9-+().\s]+$/.test(data.phone)) {
      errors.phone = 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง';
    }

    if (!data.email.trim()) {
      errors.email = 'กรุณาระบุอีเมล';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    if (data.website && data.website.trim() && !/^https?:\/\/.+/.test(data.website)) {
      errors.website = 'รูปแบบเว็บไซต์ไม่ถูกต้อง (ต้องขึ้นต้นด้วย http:// หรือ https://)';
    }

    return errors;
  };

  const createShop = async (data: ShopCreateData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setValidationErrors({});

    try {
      // Validate form data
      const errors = validateShopData(data);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setError('กรุณาแก้ไขข้อมูลที่ไม่ถูกต้อง');
        return false;
      }

      // Get current user profile to obtain ownerId
      const currentProfile = await profileService.getCurrentUserProfile();
      if (!currentProfile) {
        setError('ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินก่อนสร้างร้านค้า');
        return false;
      }

      logger.info('ShopCreatePresenter: Current profile', { profile: currentProfile });

      // Map form data to CreateShopInputDTO format
      const createShopData = {
        name: data.name,
        description: data.description || undefined,
        address: data.address,
        phone: data.phone,
        email: data.email || undefined,
        ownerId: currentProfile.id,
        categoryIds: [data.category], // Convert single category to array
        openingHours: mapOperatingHoursToOpeningHours(data.operatingHours)
      };

      logger.info('ShopCreatePresenter: Creating shop', { shopData: createShopData });

      const allShops = await shopService.getShopsByOwnerId(currentProfile.id);
      logger.info('ShopCreatePresenter: All shops', { shops: allShops });

      if (allShops.length >= 5) {
        setError('คุณไม่สามารถสร้างร้านค้าเพิ่มเติมได้เนื่องจากคุณมีร้านค้าครบแล้ว');
        return false;
      }

      // Call the service with properly mapped data
      await shopService.createShop(createShopData);

      // Mock success response
      setSuccess(true);
      logger.info('ShopCreatePresenter: Shop created successfully');

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

      return true;
    } catch (error) {
      logger.error('ShopCreatePresenter: Error creating shop', error);
      setError('เกิดข้อผิดพลาดในการสร้างร้านค้า กรุณาลองใหม่อีกครั้ง');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
    setValidationErrors({});
    logger.info('ShopCreatePresenter: Reset');
  };

  const getMockData = (): ShopCreateData => {
    logger.info('ShopCreatePresenter: Getting mock data for local development');
    return getMockShopData('barbershop');
  };

  const isMockDataEnabled = (): boolean => {
    return isLocalDevelopment();
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  return [
    { isLoading, error, success, validationErrors },
    { createShop, reset, setError, clearValidationErrors, getMockData, isMockDataEnabled },
  ];
};
