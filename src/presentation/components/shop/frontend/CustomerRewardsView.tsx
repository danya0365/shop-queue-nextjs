"use client";

import type {
  AvailableReward,
  CustomerReward,
  CustomerRewardsViewModel,
} from "@/src/presentation/presenters/shop/frontend/CustomerRewardsPresenter";
import { cn } from "@/src/utils/cn";
import { useState } from "react";

interface CustomerRewardsViewProps {
  viewModel: CustomerRewardsViewModel;
}

export function CustomerRewardsView({ viewModel }: CustomerRewardsViewProps) {
  type TabType = "rewards" | "redeemed" | "history";
  const [activeTab, setActiveTab] = useState<TabType>("rewards");
  const [selectedReward, setSelectedReward] = useState<
    AvailableReward | CustomerReward | null
  >(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const handleRedeemReward = (reward: AvailableReward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

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
        <h1 className="text-3xl font-bold frontend-text-primary mb-2">
          แต้มสะสมและสิทธิพิเศษ
        </h1>
        <p className="frontend-text-secondary">
          ดูแต้มสะสมและแลกของรางวัลของคุณ
        </p>
      </div>

      {/* Points Summary */}
      <div className="frontend-card">
        <div className="p-6 border-b frontend-card-border">
          <h2 className="text-xl font-semibold frontend-text-primary">
            สรุปแต้ม
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold frontend-text-primary mb-2">
                {viewModel.customerPoints.currentPoints}
              </div>
              <div className="text-sm frontend-text-secondary">
                แต้มปัจจุบัน
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold frontend-text-success mb-2">
                {viewModel.customerPoints.totalEarned}
              </div>
              <div className="text-sm frontend-text-secondary">
                แต้มที่ได้รับ
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold frontend-text-muted mb-2">
                {viewModel.customerPoints.totalRedeemed}
              </div>
              <div className="text-sm frontend-text-secondary">
                แต้มที่ใช้แล้ว
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Benefits */}
      <div className="frontend-card p-6 mb-6">
        <h3 className="text-lg font-medium frontend-text-primary mb-4">
          สิทธิประโยชน์สมาชิก {viewModel.customerPoints.tier}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {viewModel.customerPoints.tierBenefits.map((benefit, index) => (
            <div key={index} className="flex items-center">
              <span className="frontend-text-success mr-2">✓</span>
              <span className="frontend-text-primary">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="frontend-card">
        <div className="border-b frontend-card-border">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "rewards", name: "แลกของรางวัล", icon: "🎁" },
              { id: "redeemed", name: "ของรางวัลที่แลกแล้ว", icon: "📦" },
              { id: "history", name: "ประวัติแต้ม", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 frontend-text-primary"
                    : "border-transparent frontend-text-secondary hover:frontend-text-primary hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Available Rewards Tab */}
        {activeTab === "rewards" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {viewModel.availableRewards.map((reward) => (
                <div
                  key={reward.id}
                  className={cn(
                    `rounded-lg p-4 ${
                      reward.isAvailable
                        ? "frontend-card frontend-card-hover"
                        : "frontend-card-disabled"
                    } transition-shadow`,
                    reward.isAvailable
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  )}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{reward.imageUrl}</div>
                    <h3 className="font-medium frontend-text-primary">
                      {reward.name}
                    </h3>
                    <p className="text-sm frontend-text-secondary mt-1">
                      {reward.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="frontend-badge-info text-xs px-2 py-1 rounded-full">
                      {reward.category}
                    </span>
                    <span className="text-lg font-bold frontend-service-price">
                      {reward.pointsCost} แต้ม
                    </span>
                  </div>

                  {reward.stock !== undefined && (
                    <div className="text-xs frontend-text-muted mb-3">
                      เหลือ {reward.stock} ชิ้น
                    </div>
                  )}

                  <button
                    onClick={() => handleRedeemReward(reward)}
                    disabled={
                      !reward.isAvailable ||
                      viewModel.customerPoints.currentPoints < reward.pointsCost
                    }
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      reward.isAvailable &&
                      viewModel.customerPoints.currentPoints >=
                        reward.pointsCost
                        ? "frontend-button-primary"
                        : "frontend-button-disabled cursor-not-allowed"
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
              ))}
            </div>
          </div>
        )}

        {/* Redeemed Rewards Tab */}
        {activeTab === "redeemed" && (
          <div className="p-6">
            {viewModel.redeemedRewards.length === 0 ? (
              <div className="text-center py-8">
                <div className="frontend-text-muted text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium frontend-text-primary mb-2">
                  ยังไม่มีของรางวัลที่แลก
                </h3>
                <p className="frontend-text-secondary">
                  เมื่อคุณแลกของรางวัล จะแสดงที่นี่
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {viewModel.redeemedRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="frontend-card frontend-card-hover p-4 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">{reward.imageUrl}</div>
                        <div>
                          <h3 className="font-medium frontend-text-primary">
                            {reward.name}
                          </h3>
                          <p className="text-sm frontend-text-secondary">
                            {reward.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs frontend-text-muted">
                            <span>
                              แลกเมื่อ:{" "}
                              {new Date(reward.redeemedAt!).toLocaleDateString(
                                "th-TH"
                              )}
                            </span>
                            {reward.expiryDate && (
                              <span>
                                หมดอายุ:{" "}
                                {new Date(reward.expiryDate).toLocaleDateString(
                                  "th-TH"
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium frontend-service-price">
                          {reward.pointsCost} แต้ม
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full mt-1 ${
                            reward.isAvailable
                              ? "frontend-badge-success"
                              : "frontend-status-cancelled"
                          }`}
                        >
                          {reward.isAvailable ? "ใช้ได้" : "ใช้แล้ว/หมดอายุ"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="p-6">
            <div className="space-y-4">
              {viewModel.rewardTransactions.map((transaction) => (
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
                        {new Date(transaction.date).toLocaleDateString("th-TH")}
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
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Redeem Confirmation Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {(selectedReward as AvailableReward).imageUrl}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ยืนยันการแลกของรางวัล
              </h3>
              <p className="text-gray-600">{selectedReward.name}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">ของรางวัล:</span>
                <span className="font-medium">{selectedReward.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">ใช้แต้ม:</span>
                <span className="font-medium text-blue-600">
                  {(selectedReward as AvailableReward).pointsCost} แต้ม
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">แต้มคงเหลือ:</span>
                <span className="font-medium">
                  {(
                    viewModel.customerPoints.currentPoints -
                    (selectedReward as AvailableReward).pointsCost
                  ).toLocaleString()}{" "}
                  แต้ม
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmRedeem}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ยืนยันการแลก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
