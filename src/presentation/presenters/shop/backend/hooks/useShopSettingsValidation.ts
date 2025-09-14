"use client";

import { useCallback } from "react";

interface UseShopSettingsValidationReturn {
  validateForm: () => boolean;
  validateField: (field: string, value: any) => string | null;
  isValidEmail: (email: string) => boolean;
  isValidPhoneNumber: (phone: string) => boolean;
  isValidCurrency: (amount: number) => boolean;
}

export function useShopSettingsValidation(): UseShopSettingsValidationReturn {
  const isValidEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const isValidPhoneNumber = useCallback((phone: string): boolean => {
    const phoneRegex = /^0[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ""));
  }, []);

  const isValidCurrency = useCallback((amount: number): boolean => {
    return amount >= 0 && amount <= 999999999;
  }, []);

  const validateField = useCallback((field: string, value: any): string | null => {
    switch (field) {
      case "shopName":
        if (!value?.trim()) {
          return "กรุณาระบุชื่อร้าน";
        }
        if (value.trim().length < 2) {
          return "ชื่อร้านต้องมีอย่างน้อย 2 ตัวอักษร";
        }
        if (value.trim().length > 100) {
          return "ชื่อร้านต้องไม่เกิน 100 ตัวอักษร";
        }
        return null;

      case "shopEmail":
        if (value && !isValidEmail(value)) {
          return "รูปแบบอีเมลไม่ถูกต้อง";
        }
        return null;

      case "shopPhone":
        if (value && !isValidPhoneNumber(value)) {
          return "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
        }
        return null;

      case "shopAddress":
        if (!value?.trim()) {
          return "กรุณาระบุที่อยู่ร้าน";
        }
        return null;

      case "maxQueuePerService":
        if (value && (value < 1 || value > 50)) {
          return "จำนวนคิวสูงสุดต่อบริการต้องอยู่ระหว่าง 1-50";
        }
        return null;

      case "queueTimeoutMinutes":
        if (value && (value < 5 || value > 60)) {
          return "เวลาหมดอายุคิวต้องอยู่ระหว่าง 5-60 นาที";
        }
        return null;

      case "pointsPerQueue":
        if (value && (value < 0 || value > 1000)) {
          return "แต้มต่อคิวต้องอยู่ระหว่าง 0-1000";
        }
        return null;

      case "pointsToBahtRatio":
        if (value && (value < 0.1 || value > 100)) {
          return "อัตราแลกเปลี่ยนแต้มต้องอยู่ระหว่าง 0.1-100";
        }
        return null;

      case "minPointsForRedemption":
        if (value && (value < 10 || value > 10000)) {
          return "แต้มขั้นต่ำสำหรับการแลกต้องอยู่ระหว่าง 10-10000";
        }
        return null;

      case "defaultOpenTime":
      case "defaultCloseTime":
        if (value && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
          return "รูปแบบเวลาไม่ถูกต้อง (กรุณาใช้ HH:mm)";
        }
        return null;

      case "timezone":
        if (!value) {
          return "กรุณาระบุเขตเวลา";
        }
        return null;

      case "language":
        if (!value) {
          return "กรุณาระบุภาษา";
        }
        return null;

      case "currency":
        if (!value) {
          return "กรุณาระบุสกุลเงิน";
        }
        return null;

      default:
        return null;
    }
  }, [isValidEmail, isValidPhoneNumber]);

  const validateForm = useCallback((): boolean => {
    // This would be implemented based on the current form data
    // For now, return true as a placeholder
    return true;
  }, []);

  return {
    validateForm,
    validateField,
    isValidEmail,
    isValidPhoneNumber,
    isValidCurrency,
  };
}
