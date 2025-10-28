"use client";

import {
  CustomerPointsSortByOption,
  CustomerPointsSortOrder,
  CustomerPointsViewModel,
} from "@/src/presentation/presenters/shop/backend/CustomerPointsPresenter";
import { useCustomerPointsPresenter } from "@/src/presentation/presenters/shop/backend/useCustomerPointsPresenter";
import { AddCustomerPointsModal } from "./AddCustomerPointsModal";
import { CustomerPointsHistoryModal } from "./CustomerPointsHistoryModal";
import { RedeemCustomerPointsModal } from "./RedeemCustomerPointsModal";

interface CustomerPointsViewProps {
  shopId: string;
  initialViewModel?: CustomerPointsViewModel;
  initialCustomerId?: string;
}

export function CustomerPointsView({
  shopId,
  initialViewModel,
  initialCustomerId,
}: CustomerPointsViewProps) {
  const [state, actions] = useCustomerPointsPresenter({
    shopId,
    initialViewModel,
    initialCustomerId,
  });

  const {
    viewModel,
    loading,
    error,
    searchTerm,
    selectedTier,
    sortBy,
    sortOrder,
    filteredCustomers,
    selectedCustomerId,
    isAddPointsModalOpen,
    pointsMode,
    isSubmitting,
    submissionError,
    isHistoryModalOpen,
    historyCustomerId,
  } = state;

  const {
    setSearchTerm,
    setSelectedTier,
    setSortBy,
    setSortOrder,
    selectCustomer,
    openAddPointsModal,
    closeAddPointsModal,
    loadData,
    setSelectedCustomerId,
    submitPointsChange,
    clearSubmissionError,
    openHistoryModal,
    closeHistoryModal,
  } = actions;

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat("th-TH").format(points);
  };

  const getTierColor = (tier: string) => {
    const colors = {
      bronze:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      silver: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      gold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      platinum:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };
    return (
      colors[tier as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  const getTierLabel = (tier: string) => {
    const labels = {
      bronze: "บรอนซ์",
      silver: "เงิน",
      gold: "ทอง",
      platinum: "แพลทินัม",
    };
    return labels[tier as keyof typeof labels] || tier;
  };

  const getTierIcon = (tier: string) => {
    const icons = {
      bronze: "🥉",
      silver: "🥈",
      gold: "🥇",
    };
    return icons[tier as keyof typeof icons] || "";
  };

  // Show loading only on initial load or when explicitly loading
  if (loading || !viewModel) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลลูกค้า...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error but we have no data
  if (error && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                {error}
              </p>
              <button
                onClick={loadData}
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

  if (!viewModel) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            จัดการแต้มลูกค้า
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            ดูและจัดการแต้มสะสมของลูกค้าทั้งหมด
          </p>
        </div>
        <button
          onClick={openAddPointsModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          เพิ่ม/ลดแต้ม
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                สมาชิกทั้งหมด
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {viewModel.totalCustomers}
              </p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                แต้มที่แจกแล้ว
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatPoints(viewModel.totalPointsIssued)}
              </p>
            </div>
            <div className="text-2xl">🎁</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                แต้มที่ใช้แล้ว
              </p>
              <p className="text-2xl font-bold text-red-600">
                {formatPoints(viewModel.totalPointsRedeemed)}
              </p>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                เฉลี่ยต่อคน
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {formatPoints(Math.round(viewModel.averagePointsPerCustomer))}
              </p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                สมาชิกทอง+
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {(viewModel.tierDistribution.gold || 0) +
                  (viewModel.tierDistribution.platinum || 0)}
              </p>
            </div>
            <div className="text-2xl">🏆</div>
          </div>
        </div>
      </div>

      {/* Tier Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            การกระจายตัวของสมาชิก
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(viewModel.tierDistribution).map(([tier, count]) => (
              <div
                key={tier}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center"
              >
                <div className="text-3xl mb-2">{getTierIcon(tier)}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getTierLabel(tier)}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            สมาชิกแต้มสูงสุด (Top 5)
          </h2>
          <div className="space-y-3">
            {viewModel.topCustomers.map((customer, index) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : index === 2
                        ? "bg-orange-600"
                        : "bg-blue-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {customer.customerName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {customer.customerPhone}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(
                      customer.membershipTier
                    )}`}
                  >
                    {getTierIcon(customer.membershipTier)}{" "}
                    {getTierLabel(customer.membershipTier)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatPoints(customer.currentPoints)} แต้ม
                  </p>
                  <p className="text-sm text-green-600">
                    รวมได้ {formatPoints(customer.totalEarned)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาลูกค้า (ชื่อ หรือ เบอร์โทร)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Tier Filter */}
          <div className="lg:w-40">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">ทุกระดับ</option>
              <option value="bronze">บรอนซ์</option>
              <option value="silver">เงิน</option>
              <option value="gold">ทอง</option>
              <option value="platinum">แพลทินัม</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:w-40">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as CustomerPointsSortByOption)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="currentPoints">เรียงตามแต้มปัจจุบัน</option>
              <option value="totalEarned">เรียงตามแต้มรวม</option>
              <option value="name">เรียงตามชื่อ</option>
              <option value="tier">เรียงตามระดับ</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="lg:w-32">
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as CustomerPointsSortOrder)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="desc">มาก → น้อย</option>
              <option value="asc">น้อย → มาก</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Points Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ลูกค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ระดับสมาชิก
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  แต้มปัจจุบัน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  แต้มรวมที่ได้
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  แต้มที่ใช้แล้ว
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-4">👥</div>
                      <p className="text-lg">
                        {searchTerm || selectedTier !== "all"
                          ? "ไม่พบลูกค้าที่ตรงกับเงื่อนไขการค้นหา"
                          : "ยังไม่มีลูกค้าในระบบ"}
                      </p>
                      {searchTerm || selectedTier !== "all" ? (
                        <p className="text-sm text-gray-400 mt-2">
                          ลองปรับเงื่อนไขการค้นหาหรือเพิ่มลูกค้าใหม่
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 mt-2">
                          คลิกปุ่ม &lsquo;เพิ่มลูกค้า&rsquo;
                          เพื่อเริ่มเพิ่มลูกค้าคนแรกของคุณ
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedCustomerId === customer.id
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {customer.customerName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {customer.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(
                          customer.membershipTier
                        )}`}
                      >
                        {getTierIcon(customer.membershipTier)}{" "}
                        {getTierLabel(customer.membershipTier)}
                      </span>
                      {customer.pointsToNextTier &&
                        customer.pointsToNextTier > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            อีก {formatPoints(customer.pointsToNextTier)} แต้ม →{" "}
                            {getTierLabel(customer.nextTier || "")}
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-600">
                        {formatPoints(customer.currentPoints)} แต้ม
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatPoints(customer.totalEarned)} แต้ม
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatPoints(customer.totalRedeemed)} แต้ม
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => selectCustomer(customer.id, "add")}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          เพิ่มแต้ม
                        </button>
                        <button
                          onClick={() => selectCustomer(customer.id, "redeem")}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          ใช้แต้ม
                        </button>
                        <button
                          onClick={() => openHistoryModal(customer.id)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          ประวัติ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddPointsModalOpen && pointsMode === "add" && (
        <AddCustomerPointsModal
          isOpen={isAddPointsModalOpen}
          customers={viewModel?.customerPoints ?? []}
          selectedCustomerId={selectedCustomerId}
          onClose={closeAddPointsModal}
          onSubmit={submitPointsChange}
          onSelectCustomer={setSelectedCustomerId}
          isSubmitting={isSubmitting}
          error={submissionError}
          clearError={clearSubmissionError}
        />
      )}

      {isAddPointsModalOpen && pointsMode === "redeem" && (
        <RedeemCustomerPointsModal
          isOpen={isAddPointsModalOpen}
          customers={viewModel?.customerPoints ?? []}
          selectedCustomerId={selectedCustomerId}
          onClose={closeAddPointsModal}
          onSubmit={submitPointsChange}
          onSelectCustomer={setSelectedCustomerId}
          isSubmitting={isSubmitting}
          error={submissionError}
          clearError={clearSubmissionError}
        />
      )}

      {isHistoryModalOpen && historyCustomerId && (
        <CustomerPointsHistoryModal
          isOpen={isHistoryModalOpen}
          customerId={historyCustomerId}
          customers={viewModel?.customerPoints ?? []}
          onClose={closeHistoryModal}
        />
      )}
    </div>
  );
}
