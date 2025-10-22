import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  ClientPostersPresenterFactory,
  PosterCustomization,
  PostersViewModel,
  PosterTemplate,
} from "./PostersPresenter";

const presenter = ClientPostersPresenterFactory.create();

// Define form/action data interfaces
export interface CreatePosterData {
  templateId: string;
  customization: {
    customText?: string;
    showServices: boolean;
    showOpeningHours: boolean;
    showPhone: boolean;
    showAddress: boolean;
    qrCodeSize: "small" | "medium" | "large";
  };
}

// Define state interface
export interface PostersPresenterState {
  viewModel: PostersViewModel | null;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  selectedTemplate: PosterTemplate | null;
  showPreview: boolean;
  showPaymentModal: boolean;
  customization: Partial<PosterCustomization>;
  posterPreviewRef: React.RefObject<HTMLDivElement | null>;
}

// Define actions interface
export interface PostersPresenterActions {
  refreshData: () => Promise<void>;
  setError: (error: string | null) => void;
  setSelectedTemplate: (template: PosterTemplate | null) => void;
  setShowPreview: (show: boolean) => void;
  setShowPaymentModal: (show: boolean) => void;
  updateCustomization: (customization: Partial<PosterCustomization>) => void;
  handleTemplateSelect: (template: PosterTemplate) => void;
  handleCreatePoster: () => Promise<boolean>;
  handlePrint: () => void;
  handlePreview: () => void;
  getCategoryIcon: (category: string) => string;
  getCategoryName: (category: string) => string;
  resetCustomization: () => void;
}

// Hook type
export type PostersPresenterHook = [
  PostersPresenterState,
  PostersPresenterActions
];

// Custom hook implementation
export const usePostersPresenter = (
  shopId: string,
  initialViewModel?: PostersViewModel
): PostersPresenterHook => {
  const [viewModel, setViewModel] = useState<PostersViewModel | null>(
    initialViewModel || null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PosterTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customization, setCustomization] = useState<
    Partial<PosterCustomization>
  >({
    showServices: true,
    showOpeningHours: true,
    showPhone: true,
    showAddress: true,
    qrCodeSize: "medium",
    customText: "",
  });
  const posterPreviewRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: posterPreviewRef });

  // Initialize with initial view model if provided
  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setIsLoading(false);
    }
  }, [initialViewModel]);

  // Function to load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const newViewModel = await presenter.getViewModel(shopId);

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load posters data"
      );
      console.error("Error loading posters data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  // Load data when dependencies change, but not if we have initial view model
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  const refreshData = async () => {
    await loadData();
  };

  // Helper functions
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case "minimal":
        return "✨";
      case "colorful":
        return "🎨";
      case "professional":
        return "💼";
      case "creative":
        return "🎭";
      default:
        return "📄";
    }
  };

  const getCategoryName = (category: string): string => {
    switch (category) {
      case "minimal":
        return "เรียบง่าย";
      case "colorful":
        return "สีสันสดใส";
      case "professional":
        return "มืออาชีพ";
      case "creative":
        return "สร้างสรรค์";
      default:
        return category;
    }
  };

  const resetCustomization = () => {
    setCustomization({
      showServices: true,
      showOpeningHours: true,
      showPhone: true,
      showAddress: true,
      qrCodeSize: "medium",
      customText: "",
    });
  };

  // Event handlers
  const handleTemplateSelect = (template: PosterTemplate) => {
    if (
      viewModel &&
      template.isPremium &&
      !viewModel.userSubscription.isPremium
    ) {
      alert("โปสเตอร์นี้ต้องสมัครแพ็คเกจ Premium เท่านั้น");
      return;
    }
    setSelectedTemplate(template);
  };

  const handleCreatePoster = async (): Promise<boolean> => {
    if (!selectedTemplate) return false;

    if (
      viewModel?.userSubscription.usage.canCreateFree ||
      viewModel?.userSubscription.limits.hasUnlimitedPosters
    ) {
      handlePrint();
      setShowPreview(false);
      setSelectedTemplate(null);
      resetCustomization();
    } else {
      setShowPaymentModal(true);
    }

    return true;
  };

  const handlePrint = () => {
    reactToPrintFn();
  };

  const handlePreview = () => {
    if (!selectedTemplate) return;
    setShowPreview(true);
  };

  const updateCustomization = (
    newCustomization: Partial<PosterCustomization>
  ) => {
    setCustomization((prev) => ({ ...prev, ...newCustomization }));
  };

  const actions: PostersPresenterActions = {
    refreshData,
    setError,
    setSelectedTemplate,
    setShowPreview,
    setShowPaymentModal,
    updateCustomization,
    handleTemplateSelect,
    handleCreatePoster,
    handlePrint,
    handlePreview,
    getCategoryIcon,
    getCategoryName,
    resetCustomization,
  };

  const state: PostersPresenterState = {
    viewModel,
    isLoading,
    error,
    isCreating,
    selectedTemplate,
    showPreview,
    showPaymentModal,
    customization,
    posterPreviewRef,
  };

  return [state, actions];
};
