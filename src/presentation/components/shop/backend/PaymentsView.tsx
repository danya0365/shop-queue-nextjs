'use client';

import { PaymentsViewModel } from '@/src/presentation/presenters/shop/backend/PaymentsPresenter';
import { usePaymentsPresenter } from '@/src/presentation/presenters/shop/backend/usePaymentsPresenter';
import { PaymentMethod, PaymentStatus } from '@/src/application/dtos/shop/backend/payments-dto';
import { useState } from 'react';

interface PaymentsViewProps {
  viewModel: PaymentsViewModel;
}

export function PaymentsView({ viewModel }: PaymentsViewProps) {
  const [state, actions] = usePaymentsPresenter();
  const [searchTerm, setSearchTerm] = useState('');

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'ชำระแล้ว';
      case 'partial':
        return 'ชำระบางส่วน';
      case 'unpaid':
        return 'ยังไม่ชำระ';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string | null) => {
    switch (method) {
      case 'cash':
        return 'เงินสด';
      case 'card':
        return 'บัตรเครดิต';
      case 'qr':
        return 'QR Code';
      case 'transfer':
        return 'โอนเงิน';
      default:
        return '-';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">จัดการการชำระเงิน</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">ติดตามและจัดการการชำระเงินของลูกค้า</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={actions.openCreateModal}
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            ➕ เพิ่มการชำระเงิน
          </button>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{state.error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => actions.setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <span className="sr-only">ปิด</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ยอดรวมทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(viewModel.stats.totalRevenue)}
              </p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ชำระแล้ว</p>
              <p className="text-2xl font-bold text-green-600">
                {viewModel.stats.paidPayments}
              </p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ชำระบางส่วน</p>
              <p className="text-2xl font-bold text-yellow-600">
                {viewModel.stats.partialPayments}
              </p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ยังไม่ชำระ</p>
              <p className="text-2xl font-bold text-red-600">
                {viewModel.stats.unpaidPayments}
              </p>
            </div>
            <div className="text-2xl">❌</div>
          </div>
        </div>
      </div>

      {/* Payment Method Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">สถิติการชำระเงินตามช่องทาง</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">เงินสด 💵</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{viewModel.methodStats.cash.count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{viewModel.methodStats.cash.percentage.toFixed(1)}%</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">บัตรเครดิต 💳</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{viewModel.methodStats.card.count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{viewModel.methodStats.card.percentage.toFixed(1)}%</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">QR Code 📱</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{viewModel.methodStats.qr.count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{viewModel.methodStats.qr.percentage.toFixed(1)}%</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">โอนเงิน 🏦</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{viewModel.methodStats.transfer.count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{viewModel.methodStats.transfer.percentage.toFixed(1)}%</p>
            </div>
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
              placeholder="ค้นหาตามชื่อลูกค้าหรือหมายเลขคิว..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={state.filters.paymentStatus || ''}
              onChange={(e) => actions.setFilters({ ...state.filters, paymentStatus: e.target.value as PaymentStatus || undefined })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">สถานะทั้งหมด</option>
              <option value="paid">ชำระแล้ว</option>
              <option value="partial">ชำระบางส่วน</option>
              <option value="unpaid">ยังไม่ชำระ</option>
            </select>
          </div>

          {/* Method Filter */}
          <div className="lg:w-48">
            <select
              value={state.filters.paymentMethod || ''}
              onChange={(e) => actions.setFilters({ ...state.filters, paymentMethod: e.target.value as PaymentMethod || undefined })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">ช่องทางทั้งหมด</option>
              <option value="cash">เงินสด</option>
              <option value="card">บัตรเครดิต</option>
              <option value="qr">QR Code</option>
              <option value="transfer">โอนเงิน</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  หมายเลขคิว
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ลูกค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  จำนวนเงิน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ช่องทางชำระ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  วันที่ชำระ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {viewModel.payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-4">💳</div>
                      <p className="text-lg">ไม่พบรายการการชำระเงินที่ตรงกับเงื่อนไขการค้นหา</p>
                    </div>
                  </td>
                </tr>
              ) : (
                viewModel.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{payment.queueNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {payment.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>
                        <p className="font-medium">{formatCurrency(payment.totalAmount)}</p>
                        {payment.paidAmount && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ชำระแล้ว: {formatCurrency(payment.paidAmount)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getPaymentMethodText(payment.paymentMethod)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.paymentStatus)}`}>
                        {getPaymentStatusText(payment.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => actions.openEditModal(payment.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => actions.openDeleteModal(payment.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {viewModel.totalCount > viewModel.perPage && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                แสดง {((viewModel.currentPage - 1) * viewModel.perPage) + 1} ถึง{' '}
                {Math.min(viewModel.currentPage * viewModel.perPage, viewModel.totalCount)} จาก{' '}
                {viewModel.totalCount} รายการ
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => actions.setCurrentPage(viewModel.currentPage - 1)}
                  disabled={viewModel.currentPage <= 1}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  ก่อนหน้า
                </button>
                <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg">
                  {viewModel.currentPage}
                </span>
                <button
                  onClick={() => actions.setCurrentPage(viewModel.currentPage + 1)}
                  disabled={viewModel.currentPage >= Math.ceil(viewModel.totalCount / viewModel.perPage)}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {state.isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900 dark:text-white">กำลังดำเนินการ...</span>
          </div>
        </div>
      )}
    </div>
  );
}
