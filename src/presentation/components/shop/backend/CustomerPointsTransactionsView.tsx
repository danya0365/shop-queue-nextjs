'use client';

import { CustomerPointsTransactionsViewModel } from '@/src/presentation/presenters/shop/backend/CustomerPointsTransactionsPresenter';
import { useState } from 'react';

interface CustomerPointsTransactionsViewProps {
  viewModel: CustomerPointsTransactionsViewModel;
}

export function CustomerPointsTransactionsView({ viewModel }: CustomerPointsTransactionsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'points' | 'customerName'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

  // Get unique customers for filter
  const uniqueCustomers = Array.from(
    new Map(
      viewModel.transactions
        .filter(t => t.customerName)
        .map(t => [t.customerId, { id: t.customerId, name: t.customerName! }])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Filter and sort transactions
  const filteredTransactions = viewModel.transactions
    .filter(transaction => {
      const matchesSearch = transaction.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.customerPhone?.includes(searchTerm) ||
                           transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || transaction.transactionType === selectedType;
      const matchesCustomer = selectedCustomer === 'all' || transaction.customerId === selectedCustomer;
      return matchesSearch && matchesType && matchesCustomer;
    })
    .sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;
      
      switch (sortBy) {
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'points':
          aValue = Math.abs(a.points);
          bValue = Math.abs(b.points);
          break;
        case 'customerName':
          aValue = a.customerName || '';
          bValue = b.customerName || '';
          break;
        default:
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat('th-TH').format(Math.abs(points));
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTransactionTypeColor = (type: string) => {
    const colors = {
      earned: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      redeemed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      expired: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      adjusted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getTransactionTypeIcon = (type: string) => {
    const icons = {
      earned: '➕',
      redeemed: '➖',
      expired: '⏰',
      adjusted: '🔧'
    };
    return icons[type as keyof typeof icons] || '📝';
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels = {
      earned: 'ได้รับแต้ม',
      redeemed: 'ใช้แต้ม',
      expired: 'หมดอายุ',
      adjusted: 'ปรับแต้ม'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">ประวัติการใช้แต้ม</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">ดูประวัติการสะสมและการใช้แต้มของลูกค้าทั้งหมด</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">รายการทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {viewModel.stats.totalTransactions}
              </p>
            </div>
            <div className="text-2xl">📋</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">แต้มที่แจก</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPoints(viewModel.stats.totalPointsEarned)}
              </p>
            </div>
            <div className="text-2xl">🎁</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">แต้มที่ใช้</p>
              <p className="text-2xl font-bold text-red-600">
                {formatPoints(viewModel.stats.totalPointsRedeemed)}
              </p>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">แต้มหมดอายุ</p>
              <p className="text-2xl font-bold text-gray-600">
                {formatPoints(viewModel.stats.totalPointsExpired)}
              </p>
            </div>
            <div className="text-2xl">⏰</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">แต้มปรับ</p>
              <p className={`text-2xl font-bold ${viewModel.stats.totalPointsAdjusted >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {viewModel.stats.totalPointsAdjusted >= 0 ? '+' : ''}{formatPoints(viewModel.stats.totalPointsAdjusted)}
              </p>
            </div>
            <div className="text-2xl">🔧</div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            แนวโน้มรายเดือน
          </h2>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 min-w-max">
              {viewModel.monthlyTrends.slice(0, 6).map((trend) => (
                <div key={trend.month} className="flex-shrink-0 w-32 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {trend.monthLabel}
                  </p>
                  <div className="space-y-1">
                    <div className="text-xs text-green-600">
                      +{formatPoints(trend.earned)}
                    </div>
                    <div className="text-xs text-red-600">
                      -{formatPoints(trend.redeemed)}
                    </div>
                    <div className={`text-sm font-semibold ${trend.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trend.net >= 0 ? '+' : ''}{formatPoints(trend.net)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Types Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ประเภทรายการ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {viewModel.transactionTypes.map((type) => (
              <div
                key={type.value}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center"
              >
                <div className="text-2xl mb-2">{getTransactionTypeIcon(type.value)}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{type.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{type.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ลูกค้าที่ได้แต้มมากที่สุด (Top 5)
          </h2>
          <div className="space-y-3">
            {viewModel.stats.topCustomers.map((customer, index) => (
              <div
                key={customer.customerId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' :
                    'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{customer.customerName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{customer.transactionCount} รายการ</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    +{formatPoints(customer.totalPoints)} แต้ม
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
              placeholder="ค้นหาลูกค้า, เบอร์โทร หรือ รายละเอียด..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Type Filter */}
          <div className="lg:w-40">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">ทุกประเภท</option>
              {viewModel.transactionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} ({type.count})
                </option>
              ))}
            </select>
          </div>

          {/* Customer Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">ทุกลูกค้า</option>
              {uniqueCustomers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:w-40">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'points' | 'customerName')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="createdAt">เรียงตามวันที่</option>
              <option value="points">เรียงตามแต้ม</option>
              <option value="customerName">เรียงตามชื่อ</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="lg:w-32">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="desc">ใหม่ → เก่า</option>
              <option value="asc">เก่า → ใหม่</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  วันที่/เวลา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ลูกค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ประเภท
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  แต้ม
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ยอดคงเหลือ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  รายละเอียด
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  พนักงาน
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-lg">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDateTime(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.customerName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.transactionType)}`}>
                        {getTransactionTypeIcon(transaction.transactionType)} {getTransactionTypeLabel(transaction.transactionType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${
                        transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.points > 0 ? '+' : ''}{formatPoints(transaction.points)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-500 dark:text-gray-400">
                          {formatPoints(transaction.previousBalance)} → {formatPoints(transaction.newBalance)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {transaction.description}
                      </div>
                      {transaction.referenceId && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          อ้างอิง: {transaction.referenceId}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.employeeName || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal Placeholder */}
      {showAddTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              เพิ่มรายการแต้ม
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ฟีเจอร์นี้จะพัฒนาในเร็วๆ นี้
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddTransactionModal(false)}
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
