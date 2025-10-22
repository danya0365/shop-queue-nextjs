import { useCallback, useEffect, useState } from "react";
import type { AnalyticsViewModel } from "./AnalyticsPresenter";
import { ClientAnalyticsPresenterFactory } from "./AnalyticsPresenter";

const presenter = ClientAnalyticsPresenterFactory.create();

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

      const vm = await presenter.getViewModel(shopId);
      setViewModel(vm);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ";
      setError(message);
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
