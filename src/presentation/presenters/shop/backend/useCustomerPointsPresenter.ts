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
}

export interface CustomerPointsPresenterActions {
  loadData: () => Promise<void>;
  setSearchTerm: (value: string) => void;
  setSelectedTier: (value: string) => void;
  setSortBy: (value: CustomerPointsSortByOption) => void;
  setSortOrder: (value: CustomerPointsSortOrder) => void;
  selectCustomer: (customerId: string) => void;
  clearSelectedCustomer: () => void;
  openAddPointsModal: () => void;
  closeAddPointsModal: () => void;
  setError: (value: string | null) => void;
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

  const selectCustomer = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId);
    setIsAddPointsModalOpen(true);
  }, []);

  const clearSelectedCustomer = useCallback(() => {
    setSelectedCustomerId(null);
  }, []);

  const openAddPointsModal = useCallback(() => {
    setIsAddPointsModalOpen(true);
  }, []);

  const closeAddPointsModal = useCallback(() => {
    setIsAddPointsModalOpen(false);
    setSelectedCustomerId(null);
  }, []);

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
  };

  return [state, actions];
}
