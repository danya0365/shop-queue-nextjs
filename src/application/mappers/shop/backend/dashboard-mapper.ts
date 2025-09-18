import type {
  DashboardDataDTO,
  PopularServicesDTO,
  QueueStatusDistributionDTO,
  RecentActivityDTO,
  ShopDashboardStatsDTO,
} from "@/src/application/dtos/shop/backend/dashboard-stats-dto";

export class DashboardMapper {
  static toDashboardData(
    stats: ShopDashboardStatsDTO,
    recentActivities: RecentActivityDTO[],
    queueDistribution: QueueStatusDistributionDTO,
    popularServices: PopularServicesDTO[]
  ): DashboardDataDTO {
    return {
      stats,
      recentActivities,
      queueDistribution,
      popularServices,
      lastUpdated: new Date().toISOString(),
    };
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static formatNumber(number: number): string {
    return new Intl.NumberFormat("th-TH").format(number);
  }

  static formatWaitTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} นาที`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} ชั่วโมง ${remainingMinutes} นาที`
      : `${hours} ชั่วโมง`;
  }

  static formatRelativeTime(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "เมื่อสักครู่";
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} วันที่แล้ว`;
  }

  static getActivityIcon(type: RecentActivityDTO["type"]): string {
    switch (type) {
      case "queue_created":
        return "🎫";
      case "queue_completed":
        return "✅";
      case "customer_registered":
        return "👤";
      case "shop_created":
        return "🏪";
      default:
        return "📋";
    }
  }

  static getActivityColor(type: RecentActivityDTO["type"]): string {
    switch (type) {
      case "queue_created":
        return "text-blue-600 bg-blue-50";
      case "queue_completed":
        return "text-green-600 bg-green-50";
      case "customer_registered":
        return "text-purple-600 bg-purple-50";
      case "shop_created":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  }
}
