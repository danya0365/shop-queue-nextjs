import localforage from "localforage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

localforage.config({
  name: "shop-queue",
  storeName: "shop-setup-tutorial",
});

interface ShopSetupTutorialState {
  collapsedShops: Record<string, boolean>;
  setCollapsed: (shopId: string, collapsed: boolean) => void;
}

export const useShopSetupTutorialStore = create<ShopSetupTutorialState>()(
  persist(
    (set) => {
      return {
        collapsedShops: {},
        setCollapsed: (shopId, collapsed) => {
          set((state) => ({
            collapsedShops: {
              ...state.collapsedShops,
              [shopId]: collapsed,
            },
          }));
        },
      };
    },
    {
      name: "shop-setup-tutorial-store",
      storage: createJSONStorage(() => localforage),
    }
  )
);
