import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { getClientContainer } from "@/src/di/client-container";
import { Logger } from "@/src/domain/interfaces/logger";
import { isLocalDevelopment } from "@/src/utils/environment";
import { getMockShopData } from "@/src/utils/mock-data";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClientShopCreatePresenterFactory } from "./ShopCreatePresenter";

const clientContainer = getClientContainer();
const profileService =
  clientContainer.resolve<IProfileService>("ProfileService");
const logger = clientContainer.resolve<Logger>("Logger");

// Helper function to map a single day's operating hours to DTO format
const mapDayToOpeningHours = (
  dayOfWeek: string,
  dayData: ShopCreateData["operatingHours"][keyof ShopCreateData["operatingHours"]]
) => {
  return {
    dayOfWeek,
    isOpen: !dayData.closed,
    openTime: dayData.closed || dayData.is24Hours ? undefined : dayData.openTime,
    closeTime: dayData.closed || dayData.is24Hours ? undefined : dayData.closeTime,
    breakStart: dayData.closed || dayData.is24Hours || !dayData.hasBreak ? undefined : dayData.breakStart,
    breakEnd: dayData.closed || dayData.is24Hours || !dayData.hasBreak ? undefined : dayData.breakEnd,
    is24Hours: !dayData.closed && dayData.is24Hours,
  };
};

// Helper function to map form operating hours to DTO opening hours format
const mapOperatingHoursToOpeningHours = (
  operatingHours: ShopCreateData["operatingHours"]
) => {
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  
  return daysOfWeek.map(day => 
    mapDayToOpeningHours(day, operatingHours[day as keyof typeof operatingHours])
  );
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
    monday: {
      openTime: string;
      closeTime: string;
      breakStart: string;
      breakEnd: string;
      closed: boolean;
      hasBreak: boolean;
      is24Hours: boolean;
    };
    tuesday: {
      openTime: string;
      closeTime: string;
      breakStart: string;
      breakEnd: string;
      closed: boolean;
      hasBreak: boolean;
      is24Hours: boolean;
    };
    wednesday: {
      openTime: string;
      closeTime: string;
      breakStart: string;
      breakEnd: string;
      closed: boolean;
      hasBreak: boolean;
      is24Hours: boolean;
    };
    thursday: {
      openTime: string;
      closeTime: string;
      breakStart: string;
      breakEnd: string;
      closed: boolean;
      hasBreak: boolean;
      is24Hours: boolean;
    };
    friday: {
      openTime: string;
      closeTime: string;
      breakStart: string;
      breakEnd: string;
      closed: boolean;
      hasBreak: boolean;
      is24Hours: boolean;
    };
    saturday: {
      openTime: string;
      closeTime: string;
      breakStart: string;
      breakEnd: string;
      closed: boolean;
      hasBreak: boolean;
      is24Hours: boolean;
    };
    sunday: {
      openTime: string;
      closeTime: string;
      breakStart: string;
      breakEnd: string;
      closed: boolean;
      hasBreak: boolean;
      is24Hours: boolean;
    };
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
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const router = useRouter();

  const validateShopData = (data: ShopCreateData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.name.trim()) {
      errors.name = "กรุณาระบุชื่อร้านค้า";
    } else if (data.name.length < 2) {
      errors.name = "ชื่อร้านค้าต้องมีอย่างน้อย 2 ตัวอักษร";
    }

    if (!data.description.trim()) {
      errors.description = "กรุณาระบุคำอธิบายร้านค้า";
    } else if (data.description.length < 10) {
      errors.description = "คำอธิบายต้องมีอย่างน้อย 10 ตัวอักษร";
    }

    if (!data.category) {
      errors.category = "กรุณาเลือกประเภทร้านค้า";
    }

    if (!data.address.trim()) {
      errors.address = "กรุณาระบุที่อยู่ร้านค้า";
    }

    if (!data.phone.trim()) {
      errors.phone = "กรุณาระบุเบอร์โทรศัพท์";
    } else if (!/^[0-9-+().\s]+$/.test(data.phone)) {
      errors.phone = "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
    }

    if (!data.email.trim()) {
      errors.email = "กรุณาระบุอีเมล";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (
      data.website &&
      data.website.trim() &&
      !/^https?:\/\/.+/.test(data.website)
    ) {
      errors.website =
        "รูปแบบเว็บไซต์ไม่ถูกต้อง (ต้องขึ้นต้นด้วย http:// หรือ https://)";
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
        setError("กรุณาแก้ไขข้อมูลที่ไม่ถูกต้อง");
        return false;
      }

      // Get current user profile to obtain ownerId
      const currentProfile = await profileService.getCurrentUserProfile();
      if (!currentProfile) {
        setError("ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินก่อนสร้างร้านค้า");
        return false;
      }

      // Map form data to CreateShopInputDTO format
      const createShopData = {
        name: data.name,
        description: data.description || undefined,
        address: data.address,
        phone: data.phone,
        email: data.email || undefined,
        ownerId: currentProfile.id,
        categoryIds: [data.category], // Convert single category to array
        openingHours: mapOperatingHoursToOpeningHours(data.operatingHours),
      };

      // Use ShopCreatePresenter for business logic
      const presenter = await ClientShopCreatePresenterFactory.create();
      const result = await presenter.createShop(createShopData);

      if (result) {
        // Mock success response
        setSuccess(true);
        logger.info("ShopCreatePresenter: Shop created successfully");

        // Redirect to dashboard after success
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }

      return result;
    } catch (error) {
      logger.error("ShopCreatePresenter: Error creating shop", error);
      setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการสร้างร้านค้า กรุณาลองใหม่อีกครั้ง");
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
    logger.info("ShopCreatePresenter: Reset");
  };

  const getMockData = (): ShopCreateData => {
    logger.info("ShopCreatePresenter: Getting mock data for local development");
    return getMockShopData();
  };

  const isMockDataEnabled = (): boolean => {
    return isLocalDevelopment();
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  return [
    { isLoading, error, success, validationErrors },
    {
      createShop,
      reset,
      setError,
      clearValidationErrors,
      getMockData,
      isMockDataEnabled,
    },
  ];
};
