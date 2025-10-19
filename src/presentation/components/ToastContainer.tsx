"use client";

import { useEffect } from "react";

import { useToastStore } from "@/src/presentation/stores/toast-store";

const typeStyles: Record<string, string> = {
  success:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200",
  error:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200",
  info:
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    if (toasts.length > 0) {
      document.body.classList.add("has-toast");
      return () => {
        document.body.classList.remove("has-toast");
      };
    }
  }, [toasts.length]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex w-full max-w-sm flex-col gap-3 sm:right-8 sm:bottom-8">
      {toasts.map((toast) => {
        const style = typeStyles[toast.type] ?? typeStyles.info;
        return (
          <div
            key={toast.id}
            className={`rounded-xl border p-4 text-sm shadow-lg backdrop-blur transition-all ${style}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex-1 leading-relaxed">{toast.message}</span>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-xs text-muted hover:text-foreground"
              >
                ปิด
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
