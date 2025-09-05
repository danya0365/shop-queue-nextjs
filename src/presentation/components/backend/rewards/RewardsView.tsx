'use client';

import { RewardsViewModel } from '@/src/presentation/presenters/backend/rewards/RewardsPresenter';
import { useRewardsPresenter } from '@/src/presentation/presenters/backend/rewards/useRewardsPresenter';
import type { RewardType } from '@/src/domain/entities/RewardEntity';

interface RewardsViewProps {
  viewModel: RewardsViewModel;
}

export function RewardsView({ viewModel }: RewardsViewProps) {
  const [state, actions] = useRewardsPresenter();
  const { rewardsData, rewardTypeStats } = viewModel;

  const getRewardTypeColor = (type: RewardType) => {
    switch (type) {
      case 'discount':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'free_item':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cashback':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'special_privilege':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRewardTypeText = (type: RewardType) => {
    switch (type) {
      case 'discount':
        return 'ส่วนลด';
      case 'free_item':
        return 'ของฟรี';
      case 'cashback':
        return 'คืนเงิน';
      case 'special_privilege':
        return 'สิทธิพิเศษ';
      default:
        return 'ไม่ทราบประเภท';
    }
  };

  const getAvailabilityColor = (isAvailable: boolean) => {
    return isAvailable
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getAvailabilityText = (isAvailable: boolean) => {
    return isAvailable ? 'พร้อมใช้งาน' : 'ไม่พร้อมใช้งาน';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat('th-TH').format(points) + ' แต้ม';
  };

  const handleToggleAvailability = async (rewardId: string, currentStatus: boolean) => {
    const success = await actions.toggleAvailability({
      rewardId,
      isAvailable: !currentStatus
    });
    if (success) {
      window.location.reload();
    }
  };

  const handleDeleteReward = async (rewardId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบรางวัลนี้?')) {
      const success = await actions.deleteReward(rewardId);
      if (success) {
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold backend-text">จัดการรางวัล</h1>
          <p className="backend-text-muted mt-2">จัดการรางวัลและแต้มสะสมสำหรับลูกค้า</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            ส่งออกรายงาน
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            เพิ่มรางวัลใหม่
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">รางวัลทั้งหมด</h3>
          <p className="text-2xl font-bold backend-text mt-2">{rewardsData.stats.totalRewards}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">รางวัลที่ใช้งานได้</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{rewardsData.stats.activeRewards}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">การแลกรางวัลทั้งหมด</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{rewardsData.stats.totalRedemptions}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">แต้มที่ใช้ไปแล้ว</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">{formatPoints(rewardsData.stats.totalPointsRedeemed)}</p>
        </div>
      </div>

      {/* Reward Type Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">ส่วนลด</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{rewardTypeStats.discount.count}</p>
              <p className="text-xs backend-text-muted">{rewardTypeStats.discount.percentage}% ของทั้งหมด</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">🎫</span>
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">ของฟรี</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{rewardTypeStats.free_item.count}</p>
              <p className="text-xs backend-text-muted">{rewardTypeStats.free_item.percentage}% ของทั้งหมด</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">🎁</span>
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">คืนเงิน</h3>
              <p className="text-2xl font-bold text-purple-600 mt-2">{rewardTypeStats.cashback.count}</p>
              <p className="text-xs backend-text-muted">{rewardTypeStats.cashback.percentage}% ของทั้งหมด</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">💰</span>
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">สิทธิพิเศษ</h3>
              <p className="text-2xl font-bold text-orange-600 mt-2">{rewardTypeStats.special_privilege.count}</p>
              <p className="text-xs backend-text-muted">{rewardTypeStats.special_privilege.percentage}% ของทั้งหมด</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-xl">👑</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อรางวัล, ประเภท, หรือคำอธิบาย..."
              className="w-full px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
            />
          </div>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">ทุกประเภท</option>
            <option value="discount">ส่วนลด</option>
            <option value="free_item">ของฟรี</option>
            <option value="cashback">คืนเงิน</option>
            <option value="special_privilege">สิทธิพิเศษ</option>
          </select>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">ทุกสถานะ</option>
            <option value="available">พร้อมใช้งาน</option>
            <option value="unavailable">ไม่พร้อมใช้งาน</option>
          </select>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">เรียงตาม</option>
            <option value="name">ชื่อรางวัล</option>
            <option value="points_required">แต้มที่ต้องใช้</option>
            <option value="value">มูลค่า</option>
            <option value="created_at">วันที่สร้าง</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* Rewards Table */}
      <div className="backend-sidebar-bg rounded-lg backend-sidebar-border border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold backend-text">รายการรางวัล</h2>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm">รีเฟรช</button>
              <button className="text-green-600 hover:text-green-800 text-sm">ส่งออก Excel</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b backend-sidebar-border">
                  <th className="text-left py-3 px-4 backend-text font-medium">รางวัล</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ประเภท</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">แต้มที่ต้องใช้</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">มูลค่า</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">วันหมดอายุ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">จำกัดการใช้</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">สถานะ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">วันที่สร้าง</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {rewardsData.rewards.map((reward) => (
                  <tr key={reward.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{reward.icon || '🎁'}</span>
                        <div>
                          <p className="backend-text font-medium">{reward.name}</p>
                          <p className="text-sm backend-text-muted">{reward.description || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRewardTypeColor(reward.type)}`}>
                        {getRewardTypeText(reward.type)}
                      </span>
                    </td>
                    <td className="py-3 px-4 backend-text font-medium">{formatPoints(reward.pointsRequired)}</td>
                    <td className="py-3 px-4 backend-text">
                      {reward.type === 'discount' ? `${reward.value}%` : formatCurrency(reward.value)}
                    </td>
                    <td className="py-3 px-4 backend-text-muted">
                      {reward.expiryDays ? `${reward.expiryDays} วัน` : 'ไม่หมดอายุ'}
                    </td>
                    <td className="py-3 px-4 backend-text-muted">
                      {reward.usageLimit ? `${reward.usageLimit} ครั้ง` : 'ไม่จำกัด'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getAvailabilityColor(reward.isAvailable)}`}>
                        {getAvailabilityText(reward.isAvailable)}
                      </span>
                    </td>
                    <td className="py-3 px-4 backend-text-muted">
                      {new Date(reward.createdAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleToggleAvailability(reward.id, reward.isAvailable)}
                          disabled={state.isLoading}
                          className={`text-sm disabled:opacity-50 ${
                            reward.isAvailable 
                              ? 'text-red-600 hover:text-red-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          {reward.isAvailable ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">แก้ไข</button>
                        <button 
                          onClick={() => handleDeleteReward(reward.id)}
                          disabled={state.isDeletingReward}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Usage */}
      <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
        <h2 className="text-xl font-semibold backend-text mb-4">การแลกรางวัลล่าสุด</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b backend-sidebar-border">
                <th className="text-left py-3 px-4 backend-text font-medium">ลูกค้า</th>
                <th className="text-left py-3 px-4 backend-text font-medium">รางวัล</th>
                <th className="text-left py-3 px-4 backend-text font-medium">แต้มที่ใช้</th>
                <th className="text-left py-3 px-4 backend-text font-medium">มูลค่า</th>
                <th className="text-left py-3 px-4 backend-text font-medium">หมายเลขคิว</th>
                <th className="text-left py-3 px-4 backend-text font-medium">วันที่แลก</th>
              </tr>
            </thead>
            <tbody>
              {rewardsData.recentUsage.map((usage) => {
                const reward = rewardsData.rewards.find(r => r.id === usage.rewardId);
                return (
                  <tr key={usage.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 backend-text">{usage.customerName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{reward?.icon || '🎁'}</span>
                        <span className="backend-text">{reward?.name || 'ไม่พบข้อมูลรางวัล'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 backend-text">{formatPoints(usage.pointsUsed)}</td>
                    <td className="py-3 px-4 backend-text">{formatCurrency(usage.rewardValue)}</td>
                    <td className="py-3 px-4 backend-text-muted">{usage.queueNumber || '-'}</td>
                    <td className="py-3 px-4 backend-text-muted">
                      {new Date(usage.usedAt).toLocaleDateString('th-TH')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="backend-text-muted text-sm">
          แสดง 1-{rewardsData.rewards.length} จาก {rewardsData.totalCount} รายการ
        </p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">ก่อนหน้า</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">2</button>
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">3</button>
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">ถัดไป</button>
        </div>
      </div>
    </div>
  );
}
