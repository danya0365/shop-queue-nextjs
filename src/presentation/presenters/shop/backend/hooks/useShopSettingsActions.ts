"use client";

import { useCallback } from "react";
import type { ShopSettings } from "@/src/application/services/shop/backend/BackendShopSettingsService";
import { ShopSettingsViewModel } from "../ShopSettingsPresenter";
import { ClientShopSettingsPresenterFactory } from "../ShopSettingsPresenter";

interface UseShopSettingsActionsReturn {
  getShopSettings: () => Promise<void>;
  updateShopSettings: (data: Partial<ShopSettings>) => Promise<void>;
  createShopSettings: (settings: Omit<ShopSettings, "id" | "createdAt" | "updatedAt">) => Promise<ShopSettings>;
  exportShopSettings: () => Promise<string>;
  importShopSettings: (data: string) => Promise<void>;
  refreshShopSettings: () => Promise<void>;
}

export function useShopSettingsActions(
  shopId: string,
  setViewModel: (viewModel: ShopSettingsViewModel) => void,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
): UseShopSettingsActionsReturn {
  const getShopSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const presenter = await ClientShopSettingsPresenterFactory.create();
      const viewModel = await presenter.getViewModel(shopId);
      setViewModel(viewModel);
    } catch (error) {
      setError("ไม่สามารถโหลดข้อมูลการตั้งค่าได้ กรุณาลองใหม่อีกครั้ง");
      console.error("Error loading shop settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [shopId, setViewModel, setIsLoading, setError]);

  const updateShopSettings = useCallback(async (data: Partial<ShopSettings>) => {
    setIsLoading(true);
    setError(null);

    try {
      const presenter = await ClientShopSettingsPresenterFactory.create();
      await presenter.updateShopSettings(shopId, data);
      
      // Refresh the view model after update
      const viewModel = await presenter.getViewModel(shopId);
      setViewModel(viewModel);
    } catch (error) {
      setError("ไม่สามารถอัปเดตการตั้งค่าได้ กรุณาลองใหม่อีกครั้ง");
      console.error("Error updating shop settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [shopId, setViewModel, setIsLoading, setError]);

  const createShopSettings = useCallback(
    async (settings: Omit<ShopSettings, "id" | "createdAt" | "updatedAt">): Promise<ShopSettings> => {
      try {
        const presenter = await ClientShopSettingsPresenterFactory.create();
        return await presenter.createShopSettings(settings);
      } catch (error: unknown) {
        console.error("Error creating shop settings:", error);
        throw error;
      }
    },
    []
  );

  const exportShopSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const presenter = await ClientShopSettingsPresenterFactory.create();
      const exportData = await presenter.exportShopSettings(shopId);
      return exportData;
    } catch (error) {
      setError("ไม่สามารถส่งออกข้อมูลการตั้งค่าได้ กรุณาลองใหม่อีกครั้ง");
      console.error("Error exporting shop settings:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [shopId, setIsLoading, setError]);

  const importShopSettings = useCallback(async (data: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const presenter = await ClientShopSettingsPresenterFactory.create();
      await presenter.importShopSettings(shopId, data);
      
      // Refresh the view model after import
      const viewModel = await presenter.getViewModel(shopId);
      setViewModel(viewModel);
    } catch (error) {
      setError("ไม่สามารถนำเข้าข้อมูลการตั้งค่าได้ กรุณาลองใหม่อีกครั้ง");
      console.error("Error importing shop settings:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [shopId, setViewModel, setIsLoading, setError]);

  const refreshShopSettings = useCallback(async () => {
    await getShopSettings();
  }, [getShopSettings]);

  return {
    getShopSettings,
    updateShopSettings,
    createShopSettings,
    exportShopSettings,
    importShopSettings,
    refreshShopSettings,
  };
}
