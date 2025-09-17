"use client";

import { RewardsViewModel } from "@/src/presentation/presenters/shop/backend/RewardsPresenter";
import { useRewardsPresenter } from "@/src/presentation/presenters/shop/backend/useRewardsPresenter";

interface RewardsViewProps {
  shopId: string;
  initialViewModel?: RewardsViewModel;
}

export function RewardsView({ shopId, initialViewModel }: RewardsViewProps) {
  const [state, actions] = useRewardsPresenter(shopId, initialViewModel);
  const viewModel = state.viewModel;

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat("th-TH").format(points);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      discount: "ส่วนลด",
      free_item: "ของฟรี",
      cashback: "คืนเงิน",
      special_privilege: "สิทธิพิเศษ",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      discount: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      free_item:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cashback:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      special_privilege:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  const getValueDisplay = (reward: { type: string; value: number }) => {
    switch (reward.type) {
      case "discount":
        return `${reward.value}%`;
      case "cashback":
        return `${reward.value} บาท`;
      case "free_item":
        return `มูลค่า ${reward.value} บาท`;
      case "special_privilege":
        return "สิทธิพิเศษ";
      default:
        return reward.value;
    }
  };

  // Filter rewards based on search and type
  const filteredRewards =
    viewModel?.rewards.filter((reward) => {
      const matchesSearch =
        reward.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        (reward.description &&
          reward.description
            .toLowerCase()
            .includes(state.searchTerm.toLowerCase()));
      const matchesType =
        state.selectedType === "all" || reward.type === state.selectedType;
      return matchesSearch && matchesType;
    }) || [];

  // Show loading only on initial load or when explicitly loading
  if (state.loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลรางวัล...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error but we have no data
  if (state.error && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                เกิดข้อผิดพลาด
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {state.error}
              </p>
              <button
                onClick={actions.refreshData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we have no view model and not loading, show empty state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🎁</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                ยังไม่มีข้อมูลรางวัล
              </p>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                ข้อมูลรางวัลจะแสดงที่นี่เมื่อมีการสร้างรางวัล
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Development Status Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              กำลังพัฒนาระบบ
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              เปิดใช้งานเร็วๆ นี้
            </p>
          </div>
          <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>กำลังปรับปรุงฟีเจอร์การจัดการรางวัล</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
              <span>เพิ่มประสิทธิภาพการทำงาน</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
              <span>ปรับปรุงประสบการณ์ผู้ใช้</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              ขออภัยในความไม่สะดวก
              <br />
              ทีมงานกำลังพัฒนาเพื่อคุณ
            </p>
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            จัดการรางวัล
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            สร้างและจัดการรางวัลสำหรับแลกเปลี่ยนแต้ม
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={actions.openCreateModal}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                รางวัลทั้งหมด
              </p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                เปิดใช้งาน
              </p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ปิดใช้งาน
              </p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ถูกแลกแล้ว
              </p>
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
              value={state.searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Type Filter */}
          <div className="sm:w-48">
            <select
              value={state.selectedType}
              onChange={(e) => actions.setSelectedType(e.target.value)}
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
                {state.searchTerm || state.selectedType !== "all"
                  ? "ไม่พบรางวัลที่ตรงกับเงื่อนไขการค้นหา"
                  : "ยังไม่มีรางวัลในระบบ"}
              </p>
              {state.searchTerm || state.selectedType !== "all" ? (
                <p className="text-sm text-gray-400 mt-2">
                  ลองปรับเงื่อนไขการค้นหาหรือเพิ่มรางวัลใหม่
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-2">
                  คลิกปุ่ม &lsquo;สร้างรางวัล&rsquo;
                  เพื่อเริ่มบันทึกรายการแรกของคุณ
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
                  <div className="text-3xl mr-3">{reward.icon || "🎁"}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {reward.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                        reward.type
                      )}`}
                    >
                      {getTypeLabel(reward.type)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
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
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    แต้มที่ต้องใช้:
                  </span>
                  <span className="font-semibold text-blue-600">
                    {formatPoints(reward.pointsRequired)} แต้ม
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    มูลค่า:
                  </span>
                  <span className="font-semibold text-green-600">
                    {getValueDisplay(reward)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ถูกแลกแล้ว:
                  </span>
                  <span className="font-semibold text-orange-600">
                    {reward.totalRedeemed || 0} ครั้ง
                  </span>
                </div>

                {reward.usageLimit && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      คงเหลือ:
                    </span>
                    <span className="font-semibold text-purple-600">
                      {reward.remainingUsage || 0} ครั้ง
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    หมดอายุ:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {reward.expiryDays} วัน
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reward.isAvailable
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {reward.isAvailable ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                  </span>
                  <button
                    className={`text-sm font-medium ${
                      reward.isAvailable
                        ? "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        : "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    }`}
                  >
                    {reward.isAvailable ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Reward Modal Placeholder */}
      {state.isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              เพิ่มรางวัลใหม่
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ฟีเจอร์นี้จะพัฒนาในเร็วๆ นี้
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={actions.closeCreateModal}
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
