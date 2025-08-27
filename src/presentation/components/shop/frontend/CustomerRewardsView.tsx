'use client';

import React, { useState } from 'react';
import type { CustomerRewardsViewModel, AvailableReward, CustomerReward } from '@/src/presentation/presenters/shop/frontend/CustomerRewardsPresenter';

interface CustomerRewardsViewProps {
  viewModel: CustomerRewardsViewModel;
}

export function CustomerRewardsView({ viewModel }: CustomerRewardsViewProps) {
  const [activeTab, setActiveTab] = useState<'rewards' | 'redeemed' | 'history'>('rewards');
  const [selectedReward, setSelectedReward] = useState<AvailableReward | CustomerReward | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const handleRedeemReward = (reward: AvailableReward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    if (selectedReward) {
      console.log('Redeeming reward:', selectedReward.id);
      setShowRedeemModal(false);
      setSelectedReward(null);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return 'text-amber-600 bg-amber-100';
      case 'Silver':
        return 'text-gray-600 bg-gray-100';
      case 'Gold':
        return 'text-yellow-600 bg-yellow-100';
      case 'Platinum':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
        return 'text-green-600';
      case 'redeemed':
        return 'text-blue-600';
      case 'expired':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return '➕';
      case 'redeemed':
        return '🎁';
      case 'expired':
        return '⏰';
      default:
        return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">รางวัลและแต้มสะสม</h1>
                <p className="text-sm text-gray-600">แลกของรางวัลและติดตามแต้มสะสมของคุณ</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">สวัสดี</p>
                <p className="text-lg font-medium text-gray-900">
                  {viewModel.customerName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Points Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">แต้มสะสมของคุณ</h2>
              <p className="text-blue-100">สะสมแต้มเพื่อแลกของรางวัลสุดพิเศษ</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{viewModel.customerPoints.currentPoints.toLocaleString()}</div>
              <div className="text-sm text-blue-100">แต้ม</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-sm text-blue-100">รวมได้รับ</div>
              <div className="text-xl font-bold">{viewModel.customerPoints.totalEarned.toLocaleString()}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-sm text-blue-100">รวมใช้แล้ว</div>
              <div className="text-xl font-bold">{viewModel.customerPoints.totalRedeemed.toLocaleString()}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-sm text-blue-100">สถานะสมาชิก</div>
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTierColor(viewModel.customerPoints.tier)}`}>
                {viewModel.customerPoints.tier}
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-sm text-blue-100">ถึงระดับถัดไป</div>
              <div className="text-xl font-bold">{viewModel.customerPoints.nextTierPoints} แต้ม</div>
            </div>
          </div>

          {viewModel.customerPoints.pointsExpiring > 0 && (
            <div className="mt-4 bg-yellow-500 bg-opacity-20 border border-yellow-400 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-yellow-200 mr-2">⚠️</span>
                <span className="text-sm">
                  แต้ม {viewModel.customerPoints.pointsExpiring} แต้ม จะหมดอายุในวันที่ {viewModel.customerPoints.expiryDate}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tier Benefits */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            สิทธิประโยชน์สมาชิก {viewModel.customerPoints.tier}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {viewModel.customerPoints.tierBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'rewards', name: 'แลกของรางวัล', icon: '🎁' },
                { id: 'redeemed', name: 'ของรางวัลที่แลกแล้ว', icon: '📦' },
                { id: 'history', name: 'ประวัติแต้ม', icon: '📊' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Available Rewards Tab */}
          {activeTab === 'rewards' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {viewModel.availableRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={`border rounded-lg p-4 ${
                      reward.isAvailable ? 'border-gray-200 hover:shadow-md' : 'border-gray-100 bg-gray-50'
                    } transition-shadow`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{reward.imageUrl}</div>
                      <h3 className="font-medium text-gray-900">{reward.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {reward.category}
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {reward.pointsCost} แต้ม
                      </span>
                    </div>

                    {reward.stock !== undefined && (
                      <div className="text-xs text-gray-500 mb-3">
                        เหลือ {reward.stock} ชิ้น
                      </div>
                    )}

                    <button
                      onClick={() => handleRedeemReward(reward)}
                      disabled={!reward.isAvailable || viewModel.customerPoints.currentPoints < reward.pointsCost}
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        reward.isAvailable && viewModel.customerPoints.currentPoints >= reward.pointsCost
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {!reward.isAvailable
                        ? 'ไม่พร้อมใช้งาน'
                        : viewModel.customerPoints.currentPoints < reward.pointsCost
                        ? 'แต้มไม่เพียงพอ'
                        : 'แลกเลย'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Redeemed Rewards Tab */}
          {activeTab === 'redeemed' && (
            <div className="p-6">
              {viewModel.redeemedRewards.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ยังไม่มีของรางวัลที่แลก
                  </h3>
                  <p className="text-gray-600">เมื่อคุณแลกของรางวัล จะแสดงที่นี่</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {viewModel.redeemedRewards.map((reward) => (
                    <div key={reward.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="text-3xl mr-4">{reward.imageUrl}</div>
                          <div>
                            <h3 className="font-medium text-gray-900">{reward.name}</h3>
                            <p className="text-sm text-gray-600">{reward.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>แลกเมื่อ: {new Date(reward.redeemedAt!).toLocaleDateString('th-TH')}</span>
                              {reward.expiryDate && (
                                <span>หมดอายุ: {new Date(reward.expiryDate).toLocaleDateString('th-TH')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">
                            {reward.pointsCost} แต้ม
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                            reward.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {reward.isAvailable ? 'ใช้ได้' : 'ใช้แล้ว/หมดอายุ'}
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
          {activeTab === 'history' && (
            <div className="p-6">
              <div className="space-y-4">
                {viewModel.rewardTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{getTransactionIcon(transaction.type)}</div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points} แต้ม
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Redeem Confirmation Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{(selectedReward as AvailableReward).imageUrl}</div>
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
                <span className="font-medium text-blue-600">{(selectedReward as AvailableReward).pointsCost} แต้ม</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">แต้มคงเหลือ:</span>
                <span className="font-medium">
                  {(viewModel.customerPoints.currentPoints - (selectedReward as AvailableReward).pointsCost).toLocaleString()} แต้ม
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
