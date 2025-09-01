export interface PaymentDTO {
  id: string;
  queueId: string;
  queueNumber: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number | null;
  paymentMethod: 'cash' | 'card' | 'qr' | 'transfer' | null;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentDate: string | null;
  processedByEmployeeId: string | null;
  processedByEmployeeName: string | null;
  shopId: string;
  shopName: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaymentStatsDTO {
  totalPayments: number;
  totalRevenue: number;
  paidPayments: number;
  unpaidPayments: number;
  partialPayments: number;
  todayRevenue: number;
  averagePaymentAmount: number;
  mostUsedPaymentMethod: string;
}

export interface PaymentsDataDTO {
  payments: PaymentDTO[];
  stats: PaymentStatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}
