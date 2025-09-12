'use client';

import { RewardsViewModel } from '@/src/presentation/presenters/shop/backend/RewardsPresenter';
import { useState } from 'react';

interface RewardsViewProps {
  viewModel: RewardsViewModel;
}

export function RewardsView({ viewModel }: RewardsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter rewards based on search and type
  const filteredRewards = viewModel.rewards.filter(reward => {
    const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (reward.description && reward.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || reward.type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat('th-TH').format(points);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      discount: 'ส่วนลด',
      free_item: 'ของฟรี',
      cashback: 'คืนเงิน',
      special_privilege: 'สิทธิพิเศษ'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      discount: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      free_item: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cashback: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      special_privilege: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getValueDisplay = (reward: { type: string; value: number }) => {
    switch (reward.type) {
      case 'discount':
        return `${reward.value}%`;
      case 'cashback':
        return `${reward.value} บาท`;
      case 'free_item':
        return `มูลค่า ${reward.value} บาท`;
      case 'special_privilege':
        return 'สิทธิพิเศษ';
      default:
        return reward.value;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">จัดการรางวัล</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">สร้างและจัดการรางวัลสำหรับแลกเปลี่ยนแต้ม</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            🎁 สร้างรางวัล
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">รางวัลทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {viewModel.totalRewards}
              </p>
            </div>
            <div className="text-2xl">🎁</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">เปิดใช้งาน</p>
              <p className="text-2xl font-bold text-green-600">
                {viewModel.activeRewards}
              </p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ปิดใช้งาน</p>
              <p className="text-2xl font-bold text-red-600">
                {viewModel.inactiveRewards}
              </p>
            </div>
            <div className="text-2xl">❌</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ส่วนลด</p>
              <p className="text-2xl font-bold text-blue-600">
                {viewModel.rewardsByType.discount}
              </p>
            </div>
            <div className="text-2xl">🎫</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ของฟรี</p>
              <p className="text-2xl font-bold text-green-600">
                {viewModel.rewardsByType.free_item}
              </p>
            </div>
            <div className="text-2xl">🆓</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ถูกแลกแล้ว</p>
              <p className="text-2xl font-bold text-orange-600">
                {viewModel.totalRedeemed}
              </p>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหารางวัล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Type Filter */}
          <div className="sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">ประเภททั้งหมด</option>
              <option value="discount">ส่วนลด</option>
              <option value="free_item">ของฟรี</option>
              <option value="cashback">คืนเงิน</option>
              <option value="special_privilege">สิทธิพิเศษ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">🎁</div>
              <p className="text-lg">
                {searchTerm || selectedType !== 'all'
                  ? "ไม่พบรางวัลที่ตรงกับเงื่อนไขการค้นหา"
                  : "ยังไม่มีรางวัลในระบบ"}
              </p>
              {searchTerm || selectedType !== 'all' ? (
                <p className="text-sm text-gray-400 mt-2">
                  ลองปรับเงื่อนไขการค้นหาหรือเพิ่มรางวัลใหม่
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-2">
                  คลิกปุ่ม &lsquo;สร้างรางวัล&rsquo; เพื่อเริ่มบันทึกรายการแรกของคุณ
                </p>
              )}
            </div>
          </div>
        ) : (
          filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Reward Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">{reward.icon || '🎁'}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {reward.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(reward.type)}`}>
                      {getTypeLabel(reward.type)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Reward Description */}
              {reward.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {reward.description}
                </p>
              )}

              {/* Reward Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">แต้มที่ต้องใช้:</span>
                  <span className="font-semibold text-blue-600">
                    {formatPoints(reward.pointsRequired)} แต้ม
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">มูลค่า:</span>
                  <span className="font-semibold text-green-600">
                    {getValueDisplay(reward)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">ถูกแลกแล้ว:</span>
                  <span className="font-semibold text-orange-600">
                    {reward.totalRedeemed || 0} ครั้ง
                  </span>
                </div>

                {reward.usageLimit && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">คงเหลือ:</span>
                    <span className="font-semibold text-purple-600">
                      {reward.remainingUsage || 0} ครั้ง
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">หมดอายุ:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {reward.expiryDays} วัน
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    reward.isAvailable
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {reward.isAvailable ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </span>
                  <button className={`text-sm font-medium ${
                    reward.isAvailable
                      ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                      : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                  }`}>
                    {reward.isAvailable ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Reward Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              เพิ่มรางวัลใหม่
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ฟีเจอร์นี้จะพัฒนาในเร็วๆ นี้
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
