'use client';

import { PaymentsViewModel } from '@/src/presentation/presenters/backend/payments/PaymentsPresenter';
import { usePaymentsPresenter } from '@/src/presentation/presenters/backend/payments/usePaymentsPresenter';

interface PaymentsViewProps {
  viewModel: PaymentsViewModel;
}

export function PaymentsView({ viewModel }: PaymentsViewProps) {
  const [state, actions] = usePaymentsPresenter();
  const { paymentsData, paymentMethodStats } = viewModel;

  const getStatusColor = (status: 'unpaid' | 'partial' | 'paid') => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'unpaid':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: 'unpaid' | 'partial' | 'paid') => {
    switch (status) {
      case 'paid':
        return 'ชำระแล้ว';
      case 'partial':
        return 'ชำระบางส่วน';
      case 'unpaid':
        return 'ยังไม่ชำระ';
      default:
        return 'ไม่ทราบสถานะ';
    }
  };

  const getPaymentMethodText = (method: string | null) => {
    switch (method) {
      case 'cash':
        return 'เงินสด';
      case 'card':
        return 'บัตรเครดิต/เดบิต';
      case 'qr':
        return 'QR Code';
      case 'transfer':
        return 'โอนเงิน';
      default:
        return '-';
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  const handleProcessPayment = async (paymentId: string) => {
    actions.selectPayment(paymentId);
    // In a real app, this would open a modal or navigate to payment processing page
    const success = await actions.processPayment({
      paymentId,
      paidAmount: 1000, // This would come from user input
      paymentMethod: 'cash'
    });
    if (success) {
      window.location.reload();
    }
  };

  const handleUpdateStatus = async (paymentId: string, status: 'unpaid' | 'partial' | 'paid') => {
    const success = await actions.updatePaymentStatus({
      paymentId,
      status
    });
    if (success) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold backend-text">จัดการการชำระเงิน</h1>
          <p className="backend-text-muted mt-2">ติดตามและจัดการสถานะการชำระเงินของลูกค้า</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            ส่งออกรายงาน
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            ประมวลผลการชำระเงิน
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">การชำระเงินทั้งหมด</h3>
          <p className="text-2xl font-bold backend-text mt-2">{paymentsData.stats.totalPayments}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">รายได้รวม</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(paymentsData.stats.totalRevenue)}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">รายได้วันนี้</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(paymentsData.stats.todayRevenue)}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">ค่าเฉลี่ยต่อรายการ</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">{formatCurrency(paymentsData.stats.averagePaymentAmount)}</p>
        </div>
      </div>

      {/* Payment Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">ชำระแล้ว</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{paymentsData.stats.paidPayments}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">✓</span>
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">ชำระบางส่วน</h3>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{paymentsData.stats.partialPayments}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⚠</span>
            </div>
          </div>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="backend-text-muted text-sm font-medium">ยังไม่ชำระ</h3>
              <p className="text-2xl font-bold text-red-600 mt-2">{paymentsData.stats.unpaidPayments}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-xl">✗</span>
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
              placeholder="ค้นหาด้วยหมายเลขคิว, ชื่อลูกค้า, หรือร้านค้า..."
              className="w-full px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
            />
          </div>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">ทุกสถานะ</option>
            <option value="paid">ชำระแล้ว</option>
            <option value="partial">ชำระบางส่วน</option>
            <option value="unpaid">ยังไม่ชำระ</option>
          </select>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">วิธีชำระเงิน</option>
            <option value="cash">เงินสด</option>
            <option value="card">บัตรเครดิต/เดบิต</option>
            <option value="qr">QR Code</option>
            <option value="transfer">โอนเงิน</option>
          </select>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">เรียงตาม</option>
            <option value="payment_date">วันที่ชำระ</option>
            <option value="amount">จำนวนเงิน</option>
            <option value="status">สถานะ</option>
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

      {/* Payments Table */}
      <div className="backend-sidebar-bg rounded-lg backend-sidebar-border border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold backend-text">รายการการชำระเงิน</h2>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm">รีเฟรช</button>
              <button className="text-green-600 hover:text-green-800 text-sm">ส่งออก Excel</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b backend-sidebar-border">
                  <th className="text-left py-3 px-4 backend-text font-medium">หมายเลขคิว</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ลูกค้า</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ร้านค้า</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">จำนวนเงิน</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ชำระแล้ว</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">วิธีชำระ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">สถานะ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">วันที่ชำระ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ผู้ดำเนินการ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {paymentsData.payments.map((payment) => (
                  <tr key={payment.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <span className="backend-text font-medium">{payment.queueNumber}</span>
                    </td>
                    <td className="py-3 px-4 backend-text">{payment.customerName}</td>
                    <td className="py-3 px-4 backend-text-muted">{payment.shopName}</td>
                    <td className="py-3 px-4 backend-text font-medium">{formatCurrency(payment.totalAmount)}</td>
                    <td className="py-3 px-4 backend-text">
                      {payment.paidAmount ? formatCurrency(payment.paidAmount) : '-'}
                    </td>
                    <td className="py-3 px-4 backend-text-muted">{getPaymentMethodText(payment.paymentMethod)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                        {getStatusText(payment.paymentStatus)}
                      </span>
                    </td>
                    <td className="py-3 px-4 backend-text-muted">
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('th-TH') : '-'}
                    </td>
                    <td className="py-3 px-4 backend-text-muted">
                      {payment.processedByEmployeeName || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {payment.paymentStatus === 'unpaid' && (
                          <button 
                            onClick={() => handleProcessPayment(payment.id)}
                            disabled={state.isProcessingPayment}
                            className="text-green-600 hover:text-green-800 text-sm disabled:opacity-50"
                          >
                            ประมวลผล
                          </button>
                        )}
                        {payment.paymentStatus === 'partial' && (
                          <button 
                            onClick={() => handleUpdateStatus(payment.id, 'paid')}
                            disabled={state.isLoading}
                            className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                          >
                            ชำระเต็ม
                          </button>
                        )}
                        <button className="text-purple-600 hover:text-purple-800 text-sm">ดูรายละเอียด</button>
                        <button className="text-orange-600 hover:text-orange-800 text-sm">พิมพ์ใบเสร็จ</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Method Statistics */}
      <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
        <h2 className="text-xl font-semibold backend-text mb-4">สถิติวิธีการชำระเงิน</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <div className="text-2xl mb-2">💵</div>
            <p className="text-sm backend-text-muted">เงินสด</p>
            <p className="text-lg font-bold backend-text">{paymentMethodStats.cash.percentage}%</p>
            <p className="text-xs backend-text-muted">{paymentMethodStats.cash.count} รายการ</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <div className="text-2xl mb-2">💳</div>
            <p className="text-sm backend-text-muted">บัตรเครดิต/เดบิต</p>
            <p className="text-lg font-bold backend-text">{paymentMethodStats.card.percentage}%</p>
            <p className="text-xs backend-text-muted">{paymentMethodStats.card.count} รายการ</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
            <div className="text-2xl mb-2">📱</div>
            <p className="text-sm backend-text-muted">QR Code</p>
            <p className="text-lg font-bold backend-text">{paymentMethodStats.qr.percentage}%</p>
            <p className="text-xs backend-text-muted">{paymentMethodStats.qr.count} รายการ</p>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900 rounded-lg">
            <div className="text-2xl mb-2">🏦</div>
            <p className="text-sm backend-text-muted">โอนเงิน</p>
            <p className="text-lg font-bold backend-text">{paymentMethodStats.transfer.percentage}%</p>
            <p className="text-xs backend-text-muted">{paymentMethodStats.transfer.count} รายการ</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm backend-text-muted">รวมทั้งหมด: {paymentMethodStats.totalTransactions} รายการ</p>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="backend-text-muted text-sm">
          แสดง 1-{paymentsData.payments.length} จาก {paymentsData.totalCount} รายการ
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
