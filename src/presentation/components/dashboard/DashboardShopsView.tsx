"use client";

import type { ShopDTO } from "@/src/application/dtos/shop/backend/shops-dto";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ShopListCard } from "./ShopListCard";

interface DashboardShopsViewProps {
  shops: ShopDTO[];
  canCreateShop: boolean;
  maxShopsAllowed: number | null;
}

export function DashboardShopsView({
  shops,
  canCreateShop,
  maxShopsAllowed,
}: DashboardShopsViewProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              ร้านค้าของคุณ
            </h1>
            <p className="mt-2 text-muted-foreground">
              จัดการร้านค้าทั้งหมดของคุณและสร้างร้านใหม่ได้จากหน้านี้
            </p>
          </div>

          {canCreateShop ? (
            <Link
              href="/dashboard/shops/create"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              สร้างร้านใหม่
            </Link>
          ) : (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-700/60 dark:bg-yellow-900/20 dark:text-yellow-200">
              คุณมีจำนวนร้านค้าครบตามแพ็กเกจปัจจุบันแล้ว
              {maxShopsAllowed !== null && (
                <> (สูงสุด {maxShopsAllowed.toLocaleString("th-TH")} ร้าน)</>
              )}
            </div>
          )}
        </div>

        <ShopListCard shops={shops} />
      </div>
    </div>
  );
}
