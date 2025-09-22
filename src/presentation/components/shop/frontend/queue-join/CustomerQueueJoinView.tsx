"use client";

import { useEffect, useState } from "react";
import { ClientCustomerQueueJoinView } from "./ClientCustomerQueueJoinView";

interface CustomerQueueJoinViewProps {
  shopId: string;
  initialViewModel?: import("@/src/presentation/presenters/shop/frontend/CustomerQueueJoinPresenter").CustomerQueueJoinViewModel;
}

export function CustomerQueueJoinView({
  shopId,
  initialViewModel,
}: CustomerQueueJoinViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ClientCustomerQueueJoinView
      shopId={shopId}
      initialViewModel={initialViewModel}
    />
  );
}
