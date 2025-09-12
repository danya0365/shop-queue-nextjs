'use client';

import type { RewardTransaction } from '@/src/application/services/shop/backend/reward-transactions-backend-service';
import type { RewardTransactionsViewModel } from '@/src/presentation/presenters/shop/backend/RewardTransactionsPresenter';
import { useState } from 'react';

interface RewardTransactionsViewProps {
  viewModel: RewardTransactionsViewModel;
}

export default function RewardTransactionsView({ viewModel }: RewardTransactionsViewProps) {
  const { transactions, stats, statusOptions, typeOptions, filters } = viewModel;

  const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || '');
  const [selectedType, setSelectedType] = useState<string>(filters.rewardType || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<RewardTransaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' ||
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerPhone.includes(searchTerm) ||
      transaction.rewardName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === '' || transaction.status === selectedStatus;
    const matchesType = selectedType === '' || transaction.rewardType === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption?.color || 'gray';
  };

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption?.label || status;
  };

  const getTypeIcon = (type: string) => {
    const typeOption = typeOptions.find(opt => opt.value === type);
    return typeOption?.icon || '🎁';
  };

  const getTypeLabel = (type: string) => {
    const typeOption = typeOptions.find(opt => opt.value === type);
    return typeOption?.label || type;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">ประวัติการแลกรางวัล</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">ดูประวัติการแลกเปลี่ยนรางวัลของลูกค้า</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ตัวกรอง
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            ส่งออกข้อมูล
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">รายการทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">คะแนนที่ใช้</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPointsUsed.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ส่วนลดทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">฿{stats.totalDiscountGiven.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">มูลค่ารางวัล</p>
              <p className="text-2xl font-bold text-gray-900">฿{stats.totalValueRedeemed.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ชื่อลูกค้า, เบอร์โทร, ชื่อรางวัล"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">ทั้งหมด</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทรางวัล</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">ทั้งหมด</option>
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedStatus('');
                  setSelectedType('');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ล้างตัวกรอง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">สรุปตามสถานะ</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statusOptions.map(status => (
            <div key={status.value} className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  status.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    status.color === 'green' ? 'bg-green-100 text-green-800' :
                      status.color === 'gray' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                }`}>
                {status.label}
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.statusBreakdown[status.value] || 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">รายการแลกรางวัล</h3>
            <p className="text-sm text-gray-500">พบ {filteredTransactions.length} รายการ</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รางวัล</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คะแนน</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ส่วนลด</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-lg">
                        {searchTerm || selectedStatus || selectedType
                          ? "ไม่พบรายการแลกรางวัลที่ตรงกับเงื่อนไขการค้นหา"
                          : "ยังไม่มีรายการแลกรางวัลในระบบ"}
                      </p>
                      {searchTerm || selectedStatus || selectedType ? (
                        <p className="text-sm text-gray-400 mt-2">
                          ลองปรับเงื่อนไขการค้นหาหรือเพิ่มรายการแลกรางวัลใหม่
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 mt-2">
                          รายการแลกรางวัลจะแสดงที่นี่เมื่อลูกค้าทำการแลกเปลี่ยนรางวัล
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.transactionDate).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.customerName}</div>
                      <div className="text-sm text-gray-500">{transaction.customerPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getTypeIcon(transaction.rewardType)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.rewardName}</div>
                        <div className="text-sm text-gray-500">{getTypeLabel(transaction.rewardType)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.pointsUsed.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.discountAmount ? `฿${transaction.discountAmount.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        getStatusColor(transaction.status) === 'blue' ? 'bg-blue-100 text-blue-800' :
                          getStatusColor(transaction.status) === 'green' ? 'bg-green-100 text-green-800' :
                            getStatusColor(transaction.status) === 'gray' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                      }`}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setShowDetailModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      ดูรายละเอียด
                    </button>
                    {transaction.status === 'pending' && (
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        อนุมัติ
                      </button>
                    )}
                    {transaction.status === 'approved' && (
                      <button className="text-purple-600 hover:text-purple-900 mr-3">
                        ใช้รางวัล
                      </button>
                    )}
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Rewards */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">รางวัลยอดนิยม</h3>
          <p className="text-gray-600">รางวัลที่ได้รับความนิยมมากที่สุด</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stats.topRewards.map((reward, index) => (
              <div key={reward.rewardId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{reward.rewardName}</h4>
                    <p className="text-sm text-gray-500">{getTypeLabel(reward.rewardType)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{reward.redemptionCount} ครั้ง</p>
                  <p className="text-sm text-gray-500">{reward.totalPointsUsed.toLocaleString()} คะแนน</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">รายละเอียดการแลกรางวัล</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">ข้อมูลลูกค้า</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">ชื่อ</p>
                      <p className="text-sm font-medium text-gray-900">{selectedTransaction.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">เบอร์โทร</p>
                      <p className="text-sm font-medium text-gray-900">{selectedTransaction.customerPhone}</p>
                    </div>
                    {selectedTransaction.customerEmail && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">อีเมล</p>
                        <p className="text-sm font-medium text-gray-900">{selectedTransaction.customerEmail}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reward Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">ข้อมูลรางวัล</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{getTypeIcon(selectedTransaction.rewardType)}</span>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{selectedTransaction.rewardName}</h5>
                      <p className="text-sm text-gray-500">{getTypeLabel(selectedTransaction.rewardType)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{selectedTransaction.rewardDescription}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">รายละเอียดการทำรายการ</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">คะแนนที่ใช้</p>
                      <p className="text-sm font-medium text-gray-900">{selectedTransaction.pointsUsed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">สถานะ</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTransaction.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          getStatusColor(selectedTransaction.status) === 'blue' ? 'bg-blue-100 text-blue-800' :
                            getStatusColor(selectedTransaction.status) === 'green' ? 'bg-green-100 text-green-800' :
                              getStatusColor(selectedTransaction.status) === 'gray' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {getStatusLabel(selectedTransaction.status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">วันที่ทำรายการ</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedTransaction.transactionDate).toLocaleString('th-TH')}
                      </p>
                    </div>
                    {selectedTransaction.redeemedDate && (
                      <div>
                        <p className="text-sm text-gray-500">วันที่ใช้รางวัล</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(selectedTransaction.redeemedDate).toLocaleString('th-TH')}
                        </p>
                      </div>
                    )}
                    {selectedTransaction.originalAmount && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">ราคาเดิม</p>
                          <p className="text-sm font-medium text-gray-900">฿{selectedTransaction.originalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">ส่วนลด</p>
                          <p className="text-sm font-medium text-green-600">-฿{selectedTransaction.discountAmount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">ราคาสุทธิ</p>
                          <p className="text-sm font-medium text-gray-900">฿{selectedTransaction.finalAmount?.toLocaleString()}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedTransaction.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">หมายเหตุ</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{selectedTransaction.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ปิด
              </button>
              {selectedTransaction.status === 'pending' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  อนุมัติ
                </button>
              )}
              {selectedTransaction.status === 'approved' && (
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  ใช้รางวัล
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
