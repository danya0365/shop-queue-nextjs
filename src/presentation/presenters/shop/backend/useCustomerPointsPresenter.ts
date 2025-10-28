"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CustomerPointsPresenterFactory,
  type CustomerPointsFilters,
  type CustomerPointsSortByOption,
  type CustomerPointsSortOrder,
  type CustomerPointsViewModel,
} from "./CustomerPointsPresenter";

const presenter = CustomerPointsPresenterFactory.createClient();

declare type CustomerPointsItem = CustomerPointsViewModel["customerPoints"][number];

export type CustomerPointsMode = "add" | "redeem";

export interface CustomerPointsPresenterState {
  viewModel: CustomerPointsViewModel | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedTier: string;
  sortBy: CustomerPointsSortByOption;
  sortOrder: CustomerPointsSortOrder;
  filteredCustomers: CustomerPointsItem[];
  selectedCustomerId: string | null;
  isAddPointsModalOpen: boolean;
  pointsMode: CustomerPointsMode;
  isSubmitting: boolean;
  submissionError: string | null;
}

export interface CustomerPointsPresenterActions {
  loadData: () => Promise<void>;
  setSearchTerm: (value: string) => void;
  setSelectedTier: (value: string) => void;
  setSortBy: (value: CustomerPointsSortByOption) => void;
  setSortOrder: (value: CustomerPointsSortOrder) => void;
  selectCustomer: (customerId: string, mode?: CustomerPointsMode) => void;
  clearSelectedCustomer: () => void;
  openAddPointsModal: () => void;
  closeAddPointsModal: () => void;
  setError: (value: string | null) => void;
  setSelectedCustomerId: (customerId: string | null) => void;
  setPointsMode: (mode: CustomerPointsMode) => void;
  submitPointsChange: (input: {
    customerId: string;
    points: number;
    description: string;
    mode: CustomerPointsMode;
  }) => Promise<boolean>;
  clearSubmissionError: () => void;
}

interface UseCustomerPointsPresenterArgs {
  shopId: string;
  initialViewModel?: CustomerPointsViewModel;
  initialCustomerId?: string;
}

export function useCustomerPointsPresenter({
  shopId,
  initialViewModel,
  initialCustomerId,
}: UseCustomerPointsPresenterArgs): [
  CustomerPointsPresenterState,
  CustomerPointsPresenterActions
] {
  const [viewModel, setViewModel] = useState<CustomerPointsViewModel | null>(
    initialViewModel || null
  );

  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [sortBy, setSortBy] = useState<CustomerPointsSortByOption>(
    "currentPoints"
  );
  const [sortOrder, setSortOrder] = useState<CustomerPointsSortOrder>("desc");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [isAddPointsModalOpen, setIsAddPointsModalOpen] = useState(false);
  const [pointsMode, setPointsMode] = useState<CustomerPointsMode>("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const clearSubmissionErrorCallback = useCallback(() => {
    setSubmissionError(null);
  }, []);

  const hasAppliedInitialFocusRef = useRef(false);
  const skipInitialFetchRef = useRef<boolean>(!!initialViewModel);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const normalizedSearch = searchTerm.trim();
      const filters: CustomerPointsFilters = {
        sortBy,
        sortOrder,
      };

      if (normalizedSearch) {
        filters.searchQuery = normalizedSearch;
      }

      if (selectedTier !== "all") {
        filters.membershipTier = selectedTier;
      }

      const newViewModel = await presenter.getViewModel(shopId, filters);
      setViewModel(newViewModel);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("CustomerPointsPresenter: Error loading data", err);
    } finally {
      setLoading(false);
    }
  }, [shopId, searchTerm, selectedTier, sortBy, sortOrder]);

  const filteredCustomers = viewModel?.customerPoints ?? [];

  const selectCustomer = useCallback(
    (customerId: string, mode: CustomerPointsMode = "add") => {
      setSelectedCustomerId(customerId);
      setPointsMode(mode);
      setSubmissionError(null);
      setIsAddPointsModalOpen(true);
    },
    []
  );

  const clearSelectedCustomer = useCallback(() => {
    setSelectedCustomerId(null);
  }, []);

  const openAddPointsModal = useCallback(() => {
    setPointsMode("add");
    setSubmissionError(null);
    setSelectedCustomerId(null);
    setIsAddPointsModalOpen(true);
  }, []);

  const closeAddPointsModal = useCallback(() => {
    setIsAddPointsModalOpen(false);
    setSelectedCustomerId(null);
    setPointsMode("add");
    setSubmissionError(null);
  }, []);

  const submitPointsChange = useCallback(
    async ({ customerId, points, description, mode }: {
      customerId: string;
      points: number;
      description: string;
      mode: CustomerPointsMode;
    }) => {
      if (!customerId) {
        setSubmissionError("กรุณาเลือกลูกค้า");
        return false;
      }

      if (points <= 0) {
        setSubmissionError("จำนวนแต้มต้องมากกว่า 0");
        return false;
      }

      try {
        setIsSubmitting(true);
        setSubmissionError(null);
        if (mode === "add") {
          await presenter.addPoints(shopId, customerId, points, description);
        } else {
          await presenter.redeemPoints(shopId, customerId, points, description);
        }
        await loadData();
        closeAddPointsModal();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "ไม่สามารถบันทึกข้อมูลได้";
        setSubmissionError(message);
        console.error("CustomerPointsPresenter: Error updating points", err);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [closeAddPointsModal, loadData, shopId]
  );

  useEffect(() => {
    if (initialViewModel) {
      setLoading(false);
    }
  }, [initialViewModel]);

  useEffect(() => {
    if (skipInitialFetchRef.current) {
      skipInitialFetchRef.current = false;
      return;
    }

    loadData();
  }, [loadData]);

  useEffect(() => {
    if (
      !initialCustomerId ||
      hasAppliedInitialFocusRef.current ||
      !viewModel
    ) {
      return;
    }

    const targetCustomer = viewModel.customerPoints.find(
      (customer) => customer.id === initialCustomerId
    );

    if (targetCustomer) {
      const initialSearchValue =
        targetCustomer.customerName || targetCustomer.customerPhone || "";
      if (initialSearchValue) {
        setSearchTerm(initialSearchValue);
      }
      setSelectedCustomerId(initialCustomerId);
      setIsAddPointsModalOpen(true);
      setPointsMode("add");
      hasAppliedInitialFocusRef.current = true;
    }
  }, [initialCustomerId, viewModel]);

  const state: CustomerPointsPresenterState = {
    viewModel,
    loading,
    error,
    searchTerm,
    selectedTier,
    sortBy,
    sortOrder,
    filteredCustomers,
    selectedCustomerId,
    isAddPointsModalOpen,
    pointsMode,
    isSubmitting,
    submissionError,
  };

  const actions: CustomerPointsPresenterActions = {
    loadData,
    setSearchTerm,
    setSelectedTier,
    setSortBy,
    setSortOrder,
    selectCustomer,
    clearSelectedCustomer,
    openAddPointsModal,
    closeAddPointsModal,
    setError,
    setSelectedCustomerId,
    setPointsMode,
    submitPointsChange,
    clearSubmissionError: clearSubmissionErrorCallback,
  };

  return [state, actions];
}
