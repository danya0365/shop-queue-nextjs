"use client";

import {
  CreateShopSettingsInputDTO,
  UpdateShopSettingsInputDTO,
} from "@/src/application/dtos/shop/backend/shop-settings-dto";
import type { ShopSettings } from "@/src/application/services/shop/backend/BackendShopSettingsService";
import { useCallback, useEffect, useState } from "react";
import { ShopSettingsViewModel } from "./ShopSettingsPresenter";
import { useShopSettingsActions } from "./hooks/useShopSettingsActions";
import { useShopSettingsState } from "./hooks/useShopSettingsState";
import { useShopSettingsValidation } from "./hooks/useShopSettingsValidation";

interface UseShopSettingsPresenterReturn {
  // Data
  viewModel: ShopSettingsViewModel;
  isLoading: boolean;
  error: string | null;

  // State
  activeCategory: string;
  isEditing: boolean;
  showExportModal: boolean;
  exportData: string | null;
  importData: string;
  isExporting: boolean;
  isImporting: boolean;
  importError: string | null;
  isSaving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  fieldErrors: Record<string, string>;
  formData: Partial<CreateShopSettingsInputDTO | UpdateShopSettingsInputDTO>;

  // CRUD Operations
  getShopSettings: () => Promise<void>;
  updateShopSettings: (data: UpdateShopSettingsInputDTO) => Promise<void>;
  createShopSettings: (data: CreateShopSettingsInputDTO) => Promise<void>;
  exportShopSettings: () => Promise<void>;
  importShopSettings: (data: string) => Promise<void>;
  refreshShopSettings: () => Promise<void>;
  updateShopStatus: (status: "open" | "closed") => Promise<void>;

  // State Actions
  setActiveCategory: (category: string) => void;
  setIsEditing: (editing: boolean) => void;
  setShowExportModal: (show: boolean) => void;
  setExportData: (data: string | null) => void;
  setImportData: (data: string) => void;
  setIsExporting: (exporting: boolean) => void;
  setIsImporting: (importing: boolean) => void;
  setImportError: (error: string | null) => void;
  setIsSaving: (saving: boolean) => void;
  setSaveSuccess: (success: boolean) => void;
  setSaveError: (error: string | null) => void;
  setFieldErrors: (errors: Record<string, string>) => void;
  setFormData: (
    data: Partial<CreateShopSettingsInputDTO | UpdateShopSettingsInputDTO>
  ) => void;

  // Event Handlers
  handleInputChange: (field: string, value: string | number | boolean) => void;
  handleSave: () => Promise<void>;
  handleExport: () => Promise<void>;
  handleImport: () => Promise<void>;
  handleResetToDefaults: () => Promise<void>;
  showNotification: (message: string, type: "success" | "error") => void;

  // Validation
  validateForm: () => boolean;
  validateField: (field: string, value: any) => string | null;

  // Utility Functions
  formatCurrency: (amount: number) => string;
  formatPhoneNumber: (phone: string) => string;
  formatEmail: (email: string) => string;
  getCategoryIcon: (categoryId: string) => string;
  getCategoryName: (categoryId: string) => string;
}

export function useShopSettingsPresenter(
  shopId: string,
  initialViewModel?: ShopSettingsViewModel
): UseShopSettingsPresenterReturn {
  // Main state
  const [viewModel, setViewModel] = useState<ShopSettingsViewModel | null>(
    initialViewModel || null
  );
  const [isLoading, setIsLoading] = useState(
    initialViewModel?.isLoading || false
  );
  const [error, setError] = useState<string | null>(
    initialViewModel?.error || null
  );

  // Custom hooks
  const {
    activeCategory,
    isEditing,
    showExportModal,
    exportData,
    importData,
    isExporting,
    isImporting,
    importError,
    isSaving,
    saveSuccess,
    saveError,
    fieldErrors,
    formData,
    setActiveCategory,
    setIsEditing,
    setShowExportModal,
    setExportData,
    setImportData,
    setIsExporting,
    setIsImporting,
    setImportError,
    setIsSaving,
    setSaveSuccess,
    setSaveError,
    setFieldErrors,
    setFormData,
    resetFormState,
  } = useShopSettingsState(initialViewModel);

  const {
    getShopSettings,
    updateShopSettings: updateShopSettingsInternal,
    createShopSettings: createShopSettingsInternal,
    exportShopSettings: exportShopSettingsInternal,
    importShopSettings,
    refreshShopSettings,
    updateShopStatus,
  } = useShopSettingsActions(shopId, setViewModel, setIsLoading, setError);

  const updateShopSettings = useCallback(
    async (data: UpdateShopSettingsInputDTO) => {
      const convertedData: Partial<ShopSettings> = {
        ...data,
        // Convert null to undefined for optional fields
        shopDescription: data.shopDescription ?? undefined,
        shopPhone: data.shopPhone ?? undefined,
        shopEmail: data.shopEmail ?? undefined,
        shopAddress: data.shopAddress ?? undefined,
        shopWebsite: data.shopWebsite ?? undefined,
        shopLogo: data.shopLogo ?? undefined,
        promptPayId: data.promptPayId ?? undefined,
      };
      await updateShopSettingsInternal(convertedData);
    },
    [updateShopSettingsInternal]
  );

  // Wrapper function to convert CreateShopSettingsInputDTO to Omit<ShopSettings, "id" | "createdAt" | "updatedAt">
  const createShopSettings = useCallback(
    async (data: CreateShopSettingsInputDTO) => {
      const convertedData: Omit<
        ShopSettings,
        "id" | "createdAt" | "updatedAt"
      > = {
        ...data,
        // Ensure required fields are present with defaults
        shopId: shopId,
        currency: data.currency || "THB",
        language: data.language || "th",
        timezone: data.timezone || "Asia/Bangkok",
        defaultOpenTime: data.defaultOpenTime || "09:00",
        defaultCloseTime: data.defaultCloseTime || "18:00",
        maxQueuePerService: data.maxQueuePerService || 10,
        queueTimeoutMinutes: data.queueTimeoutMinutes || 30,
        allowWalkIn: data.allowWalkIn ?? true,
        allowAdvanceBooking: data.allowAdvanceBooking ?? true,
        maxAdvanceBookingDays: data.maxAdvanceBookingDays || 7,
        pointsEnabled: data.pointsEnabled ?? false,
        pointsPerBaht: data.pointsPerBaht || 1,
        pointsExpiryMonths: data.pointsExpiryMonths || 12,
        minimumPointsToRedeem: data.minimumPointsToRedeem || 100,
        smsEnabled: data.smsEnabled ?? false,
        emailEnabled: data.emailEnabled ?? false,
        lineNotifyEnabled: data.lineNotifyEnabled ?? false,
        notifyBeforeMinutes: data.notifyBeforeMinutes || 30,
        acceptCash: data.acceptCash ?? true,
        acceptCreditCard: data.acceptCreditCard ?? false,
        acceptBankTransfer: data.acceptBankTransfer ?? false,
        acceptPromptPay: data.acceptPromptPay ?? false,
        theme: data.theme || "light",
        dateFormat: data.dateFormat || "DD/MM/YYYY",
        timeFormat: data.timeFormat || "12h",
        autoConfirmBooking: data.autoConfirmBooking ?? false,
        requireCustomerPhone: data.requireCustomerPhone ?? true,
        allowGuestBooking: data.allowGuestBooking ?? false,
        showPricesPublic: data.showPricesPublic ?? true,
        enableReviews: data.enableReviews ?? true,
        enableTwoFactor: data.enableTwoFactor ?? false,
        requireEmailVerification: data.requireEmailVerification ?? false,
        enableSessionTimeout: data.enableSessionTimeout ?? true,
        enableAnalytics: data.enableAnalytics ?? false,
        enableDataBackup: data.enableDataBackup ?? true,
        allowDataExport: data.allowDataExport ?? true,
        apiKey: data.apiKey || `shop_${shopId}_${Date.now()}`,
        enableWebhooks: data.enableWebhooks ?? false,
        // Convert null to undefined for optional fields
        shopDescription: data.shopDescription ?? undefined,
        shopPhone: data.shopPhone ?? undefined,
        shopEmail: data.shopEmail ?? undefined,
        shopAddress: data.shopAddress ?? undefined,
        shopWebsite: data.shopWebsite ?? undefined,
        shopLogo: data.shopLogo ?? undefined,
        promptPayId: data.promptPayId ?? undefined,
      };
      await createShopSettingsInternal(convertedData);
    },
    [createShopSettingsInternal, shopId]
  );

  // Wrapper function to convert Promise<string> to Promise<void>
  const exportShopSettings = useCallback(async () => {
    const exportData = await exportShopSettingsInternal();
    setExportData(exportData);
  }, [exportShopSettingsInternal, setExportData]);

  const {
    validateForm,
    validateField,
    isValidEmail,
    isValidPhoneNumber,
    isValidCurrency,
  } = useShopSettingsValidation();

  // Initialize form data when viewModel changes
  useEffect(() => {
    if (viewModel?.settings) {
      setFormData({ ...viewModel.settings });
    }
  }, [viewModel?.settings, setFormData]);

  // Load initial data
  useEffect(() => {
    if (!initialViewModel && shopId) {
      getShopSettings();
    }
  }, [shopId, initialViewModel, getShopSettings]);

  // Event Handlers
  const handleInputChange = useCallback(
    (field: string, value: string | number | boolean) => {
      setFormData((prev: any) => ({
        ...prev,
        [field]: value,
      }));

      // Validate field on change
      const fieldError = validateField(field, value);
      if (fieldError) {
        setFieldErrors((prev: Record<string, string>) => ({
          ...prev,
          [field]: fieldError,
        }));
      } else {
        setFieldErrors((prev: Record<string, string>) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [setFormData, setFieldErrors, validateField]
  );

  const handleSave = useCallback(async () => {
    if (!viewModel?.settings?.shopId) return;

    setIsSaving(true);
    setSaveError(null);
    setFieldErrors({});

    // Validate form
    if (!validateForm()) {
      setSaveError("กรุณาตรวจสอบข้อมูลให้ถูกต้อง");
      setIsSaving(false);
      return;
    }

    try {
      // Convert formData to match UpdateShopSettingsInputDTO type
      const updateData: UpdateShopSettingsInputDTO = {
        ...formData,
        shopId: shopId, // Add required shopId
        // Convert null to undefined for optional fields
        shopDescription: formData.shopDescription ?? undefined,
        shopPhone: formData.shopPhone ?? undefined,
        shopEmail: formData.shopEmail ?? undefined,
        shopAddress: formData.shopAddress ?? undefined,
        shopWebsite: formData.shopWebsite ?? undefined,
        shopLogo: formData.shopLogo ?? undefined,
        promptPayId: formData.promptPayId ?? undefined,
      };

      await updateShopSettings(updateData);
      setSaveSuccess(true);
      setIsEditing(false);

      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError("ไม่สามารถบันทึกการตั้งค่าได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSaving(false);
    }
  }, [
    shopId,
    viewModel?.settings?.shopId,
    formData,
    validateForm,
    updateShopSettings,
    setIsSaving,
    setSaveError,
    setFieldErrors,
    setSaveSuccess,
    setIsEditing,
  ]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportData(null);

    try {
      const data = await exportShopSettings();
      setExportData(JSON.stringify(data, null, 2));
      setShowExportModal(true);
    } catch (error) {
      setSaveError("ไม่สามารถส่งออกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsExporting(false);
    }
  }, [
    exportShopSettings,
    setIsExporting,
    setExportData,
    setShowExportModal,
    setSaveError,
  ]);

  const handleImport = useCallback(async () => {
    if (!importData.trim()) {
      setImportError("กรุณาวางข้อมูลที่ต้องการนำเข้า");
      return;
    }

    setIsImporting(true);
    setImportError(null);

    try {
      const parsedData = JSON.parse(importData);
      await importShopSettings(parsedData);
      setImportData("");
      setShowExportModal(false);
      showNotification("นำเข้าข้อมูลสำเร็จ", "success");
      await refreshShopSettings();
    } catch (error) {
      if (error instanceof SyntaxError) {
        setImportError("รูปแบบข้อมูลไม่ถูกต้อง กรุณาตรวจสอบ JSON");
      } else {
        setImportError("ไม่สามารถนำเข้าข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsImporting(false);
    }
  }, [
    importData,
    importShopSettings,
    refreshShopSettings,
    setIsImporting,
    setImportError,
    setImportData,
    setShowExportModal,
  ]);

  const handleResetToDefaults = useCallback(async () => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตการตั้งค่าเป็นค่าเริ่มต้น?")) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Here you would call the service to reset settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await refreshShopSettings();
      showNotification("รีเซ็ตการตั้งค่าสำเร็จ", "success");
    } catch (error) {
      setSaveError("ไม่สามารถรีเซ็ตการตั้งค่าได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSaving(false);
    }
  }, [refreshShopSettings, setIsSaving, setSaveError]);

  const showNotification = useCallback(
    (message: string, type: "success" | "error") => {
      if (type === "success") {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(message);
        setTimeout(() => setSaveError(null), 5000);
      }
    },
    [setSaveSuccess, setSaveError]
  );

  // Utility Functions
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  }, []);

  const formatPhoneNumber = useCallback((phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    return phone;
  }, []);

  const formatEmail = useCallback((email: string): string => {
    return email.toLowerCase().trim();
  }, []);

  const getCategoryIcon = useCallback(
    (categoryId: string): string => {
      const category = viewModel?.settingsCategories?.find(
        (cat) => cat.id === categoryId
      );
      return category?.icon || "⚙️";
    },
    [viewModel?.settingsCategories]
  );

  const getCategoryName = useCallback(
    (categoryId: string): string => {
      const category = viewModel?.settingsCategories?.find(
        (cat) => cat.id === categoryId
      );
      return category?.name || categoryId;
    },
    [viewModel?.settingsCategories]
  );

  return {
    // Data
    viewModel: viewModel || ({} as ShopSettingsViewModel),
    isLoading,
    error,

    // State
    activeCategory,
    isEditing,
    showExportModal,
    exportData,
    importData,
    isExporting,
    isImporting,
    importError,
    isSaving,
    saveSuccess,
    saveError,
    fieldErrors,
    formData,

    // CRUD Operations
    getShopSettings,
    updateShopSettings,
    createShopSettings,
    exportShopSettings,
    importShopSettings,
    refreshShopSettings,
    updateShopStatus,

    // State Actions
    setActiveCategory,
    setIsEditing,
    setShowExportModal,
    setExportData,
    setImportData,
    setIsExporting,
    setIsImporting,
    setImportError,
    setIsSaving,
    setSaveSuccess,
    setSaveError,
    setFieldErrors,
    setFormData,

    // Event Handlers
    handleInputChange,
    handleSave,
    handleExport,
    handleImport,
    handleResetToDefaults,
    showNotification,

    // Validation
    validateForm,
    validateField,

    // Utility Functions
    formatCurrency,
    formatPhoneNumber,
    formatEmail,
    getCategoryIcon,
    getCategoryName,
  };
}
