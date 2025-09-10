import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
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
  const logger = getClientService<Logger>('Logger');
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

      // Simulate API call (replace with actual API call)
      logger.info('ShopCreatePresenter: Creating shop', { shopName: data.name });
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  return [
    { isLoading, error, success, validationErrors },
    { createShop, reset, setError, clearValidationErrors },
  ];
};
