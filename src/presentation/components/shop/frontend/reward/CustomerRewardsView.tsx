"use client";

import type {
  AvailableReward,
  CustomerReward,
  CustomerRewardsViewModel,
  RewardTransaction,
} from "@/src/presentation/presenters/shop/frontend/CustomerRewardsPresenter";
import { useCustomerRewardsPresenter } from "@/src/presentation/presenters/shop/frontend/useCustomerRewardsPresenter";
import { useCustomerStore } from "@/src/presentation/stores/customer-store";
import { cn } from "@/src/utils/cn";
import { useState } from "react";
import { PointsSummary } from "./components/PointsSummary";
import { RedeemConfirmationModal } from "./components/RedeemConfirmationModal";
import { TierBenefits } from "./components/TierBenefits";

enum TabType {
  REWARDS = "rewards",
  REDEEMED = "redeemed",
  HISTORY = "history",
}

interface CustomerRewardsViewProps {
  shopId: string;
  initialViewModel?: CustomerRewardsViewModel;
}

export function CustomerRewardsView({
  shopId,
  initialViewModel,
}: CustomerRewardsViewProps) {
  const { getCustomer } = useCustomerStore();
  const customer = getCustomer(shopId);
  const {
    viewModel,
    loading,
    error,
    handleRedeemReward: handleRedeemRewardAction,
    handleViewRewardDetails,
    refreshData,
  } = useCustomerRewardsPresenter(shopId, initialViewModel);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.REWARDS);
  const [selectedReward, setSelectedReward] = useState<AvailableReward | null>(
    null
  );
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const handleRedeemReward = (reward: AvailableReward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  // Loading state
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">กำลังโหลดข้อมูลรางวัล...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            ไม่มีข้อมูล
          </h1>
          <p className="text-muted mb-4">ไม่พบข้อมูลรางวัล</p>
        </div>
      </div>
    );
  }

  const confirmRedeem = () => {
    if (selectedReward) {
      console.log("Redeeming reward:", selectedReward.id);
      setShowRedeemModal(false);
      setSelectedReward(null);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return "text-amber-600 bg-amber-100";
      case "Silver":
        return "text-gray-600 bg-gray-100";
      case "Gold":
        return "text-yellow-600 bg-yellow-100";
      case "Platinum":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earned":
        return "text-green-600";
      case "redeemed":
        return "text-blue-600";
      case "expired":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earned":
        return "➕";
      case "redeemed":
        return "🎁";
      case "expired":
        return "⏰";
      default:
        return "📝";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold shop-frontend-text-primary mb-2">
          แต้มสะสมและสิทธิพิเศษ
        </h1>
        <p className="shop-frontend-text-secondary">
          ดูแต้มสะสมและแลกของรางวัลของคุณ
        </p>
      </div>

      {/* Points Summary */}
      <PointsSummary
        currentPoints={viewModel.customerPoints.currentPoints}
        totalEarned={viewModel.customerPoints.totalEarned}
        totalRedeemed={viewModel.customerPoints.totalRedeemed}
        shopId={shopId}
      />

      {/* Tier Benefits */}
      <TierBenefits
        tier={viewModel.customerPoints.tier}
        benefits={viewModel.customerPoints.tierBenefits}
        shopId={shopId}
      />

      {/* Tabs */}
      <div className="shop-frontend-card">
        <div className="border-b shop-frontend-card-border">
          <nav className="flex space-x-8 px-6">
            {[
              { id: TabType.REWARDS, name: "แลกของรางวัล", icon: "🎁" },
              { id: TabType.REDEEMED, name: "ของรางวัลที่แลกแล้ว", icon: "📦" },
              { id: TabType.HISTORY, name: "ประวัติแต้ม", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 shop-frontend-text-primary"
                    : "border-transparent shop-frontend-text-secondary hover:shop-frontend-text-primary hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Available Rewards Tab */}
        {activeTab === TabType.REWARDS && (
          <div className="p-6 relative min-h-48">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {viewModel.availableRewards.data.map(
                (reward: AvailableReward) => (
                  <div
                    key={reward.id}
                    className={cn(
                      `rounded-lg p-4 ${
                        reward.isAvailable
                          ? "shop-frontend-card shop-frontend-card-hover"
                          : "shop-frontend-card-disabled"
                      } transition-shadow`,
                      reward.isAvailable
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-50"
                    )}
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{reward.imageUrl}</div>
                      <h3 className="font-medium shop-frontend-text-primary">
                        {reward.name}
                      </h3>
                      <p className="text-sm shop-frontend-text-secondary mt-1">
                        {reward.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="shop-frontend-badge-info text-xs px-2 py-1 rounded-full">
                        {reward.category}
                      </span>
                      <span className="text-lg font-bold shop-frontend-service-price">
                        {reward.pointsCost} แต้ม
                      </span>
                    </div>

                    {reward.stock !== undefined && (
                      <div className="text-xs shop-frontend-text-muted mb-3">
                        เหลือ {reward.stock} ชิ้น
                      </div>
                    )}

                    <button
                      onClick={() => handleRedeemReward(reward)}
                      disabled={
                        !reward.isAvailable ||
                        viewModel.customerPoints.currentPoints <
                          reward.pointsCost
                      }
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        reward.isAvailable &&
                        viewModel.customerPoints.currentPoints >=
                          reward.pointsCost
                          ? "shop-frontend-button-primary"
                          : "shop-frontend-button-disabled cursor-not-allowed"
                      }`}
                    >
                      {!reward.isAvailable
                        ? "ไม่พร้อมใช้งาน"
                        : viewModel.customerPoints.currentPoints <
                          reward.pointsCost
                        ? "แต้มไม่เพียงพอ"
                        : "แลกเลย"}
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Redeemed Rewards Tab */}
        {activeTab === TabType.REDEEMED && (
          <div className="p-6 relative min-h-48">
            {!customer ? (
              <div className="absolute inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                <div className="text-center py-8 z-10">
                  <div className="text-4xl mb-4">❌</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    ไม่พบข้อมูลสมาชิก
                  </p>
                </div>
              </div>
            ) : null}
            {viewModel.redeemedRewards.data.length === 0 ? (
              <div className="text-center py-8">
                <div className="shop-frontend-text-muted text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium shop-frontend-text-primary mb-2">
                  ยังไม่มีของรางวัลที่แลก
                </h3>
                <p className="shop-frontend-text-secondary">
                  เมื่อคุณแลกของรางวัล จะแสดงที่นี่
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {viewModel.redeemedRewards.data.map(
                  (reward: CustomerReward) => (
                    <div
                      key={reward.id}
                      className="shop-frontend-card shop-frontend-card-hover p-4 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="text-3xl mr-4">{reward.imageUrl}</div>
                          <div>
                            <h3 className="font-medium shop-frontend-text-primary">
                              {reward.name}
                            </h3>
                            <p className="text-sm shop-frontend-text-secondary">
                              {reward.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs shop-frontend-text-muted">
                              <span>
                                แลกเมื่อ:{" "}
                                {new Date(
                                  reward.redeemedAt!
                                ).toLocaleDateString("th-TH")}
                              </span>
                              {reward.expiryDate && (
                                <span>
                                  หมดอายุ:{" "}
                                  {new Date(
                                    reward.expiryDate
                                  ).toLocaleDateString("th-TH")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium shop-frontend-service-price">
                            {reward.pointsCost} แต้ม
                          </div>
                          <div
                            className={`text-xs px-2 py-1 rounded-full mt-1 ${
                              reward.isAvailable
                                ? "shop-frontend-badge-success"
                                : "shop-frontend-status-cancelled"
                            }`}
                          >
                            {reward.isAvailable ? "ใช้ได้" : "ใช้แล้ว/หมดอายุ"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === TabType.HISTORY && (
          <div className="p-6 relative min-h-48">
            {!customer ? (
              <div className="absolute inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                <div className="text-center py-8 z-10">
                  <div className="text-4xl mb-4">❌</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    ไม่พบข้อมูลสมาชิก
                  </p>
                </div>
              </div>
            ) : null}
            <div className="space-y-4">
              {viewModel.rewardTransactions.data.map(
                (transaction: RewardTransaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString(
                            "th-TH"
                          )}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold ${getTransactionColor(
                        transaction.type
                      )}`}
                    >
                      {transaction.points > 0 ? "+" : ""}
                      {transaction.points} แต้ม
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Redeem Confirmation Modal */}
      <RedeemConfirmationModal
        isOpen={showRedeemModal}
        reward={selectedReward}
        currentPoints={viewModel?.customerPoints.currentPoints || 0}
        onConfirm={confirmRedeem}
        onCancel={() => setShowRedeemModal(false)}
      />
    </div>
  );
}
