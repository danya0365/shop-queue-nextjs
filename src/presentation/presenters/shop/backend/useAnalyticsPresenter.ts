import { getClientService } from "@/src/di/client-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { useCallback, useEffect, useState } from "react";
import type { AnalyticsViewModel } from "./AnalyticsPresenter";

const logger = getClientService<Logger>("Logger");

export interface AnalyticsPresenterState {
  viewModel: AnalyticsViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface AnalyticsPresenterActions {
  refreshData: () => void;
  setError: (error: string | null) => void;
}

export type AnalyticsPresenterHook = [
  AnalyticsPresenterState,
  AnalyticsPresenterActions
];

export const useAnalyticsPresenter = (
  shopId: string,
  initialViewModel?: AnalyticsViewModel
): AnalyticsPresenterHook => {
  const [viewModel, setViewModel] = useState<AnalyticsViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setLoading(false);
    }
  }, [initialViewModel]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { ClientAnalyticsPresenterFactory } = await import(
        "./AnalyticsPresenter"
      );
      const presenter = await ClientAnalyticsPresenterFactory.create();
      const vm = await presenter.getViewModel(shopId);
      setViewModel(vm);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ";
      setError(message);
      logger.error("AnalyticsPresenter: Error loading data", err);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  return [
    { viewModel, loading, error },
    { refreshData, setError },
  ];
};
