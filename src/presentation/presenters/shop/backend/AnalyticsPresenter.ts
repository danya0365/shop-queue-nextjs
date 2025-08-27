import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface ServiceStats {
  serviceId: string;
  serviceName: string;
  totalOrders: number;
  totalRevenue: number;
  avgRating: number;
  popularityRank: number;
}

export interface EmployeePerformance {
  employeeId: string;
  employeeName: string;
  totalQueues: number;
  totalRevenue: number;
  avgServiceTime: number;
  customerRating: number;
  efficiency: number;
}

export interface CustomerInsights {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  avgVisitsPerCustomer: number;
  customerSatisfaction: number;
  peakHours: Array<{
    hour: number;
    queueCount: number;
  }>;
}

export interface AnalyticsFilters {
  dateRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  compareWith?: 'previous_period' | 'last_year' | 'none';
}

// Define ViewModel interface
export interface AnalyticsViewModel {
  revenueData: RevenueData[];
  serviceStats: ServiceStats[];
  employeePerformance: EmployeePerformance[];
  customerInsights: CustomerInsights;
  filters: AnalyticsFilters;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  growthRate: number;
}

// Main Presenter class
export class AnalyticsPresenter {
  constructor(private readonly logger: Logger) {}

  async getViewModel(shopId: string): Promise<AnalyticsViewModel> {
    try {
      this.logger.info('AnalyticsPresenter: Getting view model for shop', { shopId });
      
      // Mock data - replace with actual service calls
      const revenueData = this.getRevenueData();
      const serviceStats = this.getServiceStats();
      const employeePerformance = this.getEmployeePerformance();
      const customerInsights = this.getCustomerInsights();
      
      const totalRevenue = revenueData.reduce((sum, data) => sum + data.revenue, 0);
      const totalOrders = revenueData.reduce((sum, data) => sum + data.orders, 0);
      
      return {
        revenueData,
        serviceStats,
        employeePerformance,
        customerInsights,
        filters: {
          dateRange: 'month',
          compareWith: 'previous_period',
        },
        totalRevenue,
        totalOrders,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        growthRate: 12.5, // Mock growth rate
      };
    } catch (error) {
      this.logger.error('AnalyticsPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getRevenueData(): RevenueData[] {
    return [
      { date: '2024-01-01', revenue: 12500, orders: 85, avgOrderValue: 147 },
      { date: '2024-01-02', revenue: 15200, orders: 92, avgOrderValue: 165 },
      { date: '2024-01-03', revenue: 18300, orders: 108, avgOrderValue: 169 },
      { date: '2024-01-04', revenue: 14800, orders: 89, avgOrderValue: 166 },
      { date: '2024-01-05', revenue: 22100, orders: 125, avgOrderValue: 177 },
      { date: '2024-01-06', revenue: 25400, orders: 142, avgOrderValue: 179 },
      { date: '2024-01-07', revenue: 19800, orders: 115, avgOrderValue: 172 },
      { date: '2024-01-08', revenue: 16900, orders: 98, avgOrderValue: 173 },
      { date: '2024-01-09', revenue: 20500, orders: 118, avgOrderValue: 174 },
      { date: '2024-01-10', revenue: 23200, orders: 135, avgOrderValue: 172 },
      { date: '2024-01-11', revenue: 21800, orders: 128, avgOrderValue: 170 },
      { date: '2024-01-12', revenue: 26500, orders: 152, avgOrderValue: 174 },
      { date: '2024-01-13', revenue: 24300, orders: 140, avgOrderValue: 174 },
      { date: '2024-01-14', revenue: 27800, orders: 158, avgOrderValue: 176 },
      { date: '2024-01-15', revenue: 29200, orders: 165, avgOrderValue: 177 },
    ];
  }

  private getServiceStats(): ServiceStats[] {
    return [
      {
        serviceId: '1',
        serviceName: 'กาแฟลาเต้',
        totalOrders: 245,
        totalRevenue: 20825,
        avgRating: 4.8,
        popularityRank: 1,
      },
      {
        serviceId: '2',
        serviceName: 'กาแฟอเมริกาโน่',
        totalOrders: 198,
        totalRevenue: 12870,
        avgRating: 4.6,
        popularityRank: 2,
      },
      {
        serviceId: '3',
        serviceName: 'เค้กช็อกโกแลต',
        totalOrders: 156,
        totalRevenue: 18720,
        avgRating: 4.9,
        popularityRank: 3,
      },
      {
        serviceId: '4',
        serviceName: 'แซนด์วิชไก่',
        totalOrders: 134,
        totalRevenue: 12730,
        avgRating: 4.5,
        popularityRank: 4,
      },
      {
        serviceId: '5',
        serviceName: 'สมูทตี้ผลไม้',
        totalOrders: 98,
        totalRevenue: 8330,
        avgRating: 4.7,
        popularityRank: 5,
      },
    ];
  }

  private getEmployeePerformance(): EmployeePerformance[] {
    return [
      {
        employeeId: '1',
        employeeName: 'สมชาย ใจดี',
        totalQueues: 156,
        totalRevenue: 28420,
        avgServiceTime: 8.5,
        customerRating: 4.8,
        efficiency: 92,
      },
      {
        employeeId: '2',
        employeeName: 'สมหญิง รักงาน',
        totalQueues: 142,
        totalRevenue: 26180,
        avgServiceTime: 9.2,
        customerRating: 4.9,
        efficiency: 89,
      },
      {
        employeeId: '3',
        employeeName: 'สมศรี ขยันทำงาน',
        totalQueues: 189,
        totalRevenue: 31250,
        avgServiceTime: 7.8,
        customerRating: 4.7,
        efficiency: 95,
      },
      {
        employeeId: '4',
        employeeName: 'สมปอง มีความสุข',
        totalQueues: 98,
        totalRevenue: 18940,
        avgServiceTime: 10.1,
        customerRating: 4.6,
        efficiency: 85,
      },
    ];
  }

  private getCustomerInsights(): CustomerInsights {
    return {
      totalCustomers: 1248,
      newCustomers: 186,
      returningCustomers: 1062,
      avgVisitsPerCustomer: 2.8,
      customerSatisfaction: 4.7,
      peakHours: [
        { hour: 7, queueCount: 12 },
        { hour: 8, queueCount: 28 },
        { hour: 9, queueCount: 45 },
        { hour: 10, queueCount: 38 },
        { hour: 11, queueCount: 52 },
        { hour: 12, queueCount: 68 },
        { hour: 13, queueCount: 72 },
        { hour: 14, queueCount: 58 },
        { hour: 15, queueCount: 42 },
        { hour: 16, queueCount: 35 },
        { hour: 17, queueCount: 48 },
        { hour: 18, queueCount: 55 },
        { hour: 19, queueCount: 38 },
        { hour: 20, queueCount: 22 },
        { hour: 21, queueCount: 15 },
      ],
    };
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'รายงานและวิเคราะห์ - เจ้าของร้าน | Shop Queue',
      description: 'ดูรายงานยอดขาย สถิติการใช้งาน และวิเคราะห์ประสิทธิภาพของร้าน',
    };
  }
}

// Factory class
export class AnalyticsPresenterFactory {
  static async create(): Promise<AnalyticsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new AnalyticsPresenter(logger);
  }
}
