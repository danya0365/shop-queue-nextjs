"use client";

import { useCallback, useState } from "react";
import { ShopSettingsViewModel } from "../ShopSettingsPresenter";

interface UseShopSettingsStateReturn {
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
  formData: any;

  // Actions
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
  setFieldErrors: (errors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  setFormData: (data: any | ((prev: any) => any)) => void;
  resetFormState: () => void;
}

export function useShopSettingsState(
  initialViewModel?: ShopSettingsViewModel
): UseShopSettingsStateReturn {
  // Form and UI state
  const [activeCategory, setActiveCategory] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<string | null>(null);
  const [importData, setImportData] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<any>({});

  const resetFormState = useCallback(() => {
    setActiveCategory("basic");
    setIsEditing(false);
    setShowExportModal(false);
    setExportData(null);
    setImportData("");
    setIsExporting(false);
    setIsImporting(false);
    setImportError(null);
    setIsSaving(false);
    setSaveSuccess(false);
    setSaveError(null);
    setFieldErrors({});
    setFormData({});
  }, []);

  return {
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

    // Actions
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
  };
}
