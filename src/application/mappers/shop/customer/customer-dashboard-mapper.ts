import type {
  CustomerDashboardDataDTO,
  PopularServiceDTO,
  PromotionDTO,
  QueueStatusStatsDTO,
} from "@/src/application/dtos/shop/customer/customer-dashboard-dto";
import type {
  CustomerDashboardEntity,
  PopularServiceEntity,
  PromotionEntity,
  QueueStatusStatsEntity,
} from "@/src/domain/entities/shop/customer/customer-dashboard.entity";

export class QueueStatusStatsMapper {
  static toDTO(entity: QueueStatusStatsEntity): QueueStatusStatsDTO {
    return {
      currentNumber: entity.currentNumber,
      totalConfirmed: entity.totalConfirmed,
      totalWaiting: entity.totalWaiting,
      estimatedWaitTime: entity.estimatedWaitTime,
      averageServiceTime: entity.averageServiceTime,
    };
  }

  static toEntity(dto: QueueStatusStatsDTO): QueueStatusStatsEntity {
    return {
      currentNumber: dto.currentNumber,
      totalConfirmed: dto.totalConfirmed,
      totalWaiting: dto.totalWaiting,
      estimatedWaitTime: dto.estimatedWaitTime,
      averageServiceTime: dto.averageServiceTime,
    };
  }
}

export class PopularServiceMapper {
  static toDTO(entity: PopularServiceEntity): PopularServiceDTO {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      revenue: entity.revenue,
      description: entity.description,
      estimatedTime: entity.estimatedTime,
      icon: entity.icon,
      category: entity.category,
    };
  }

  static toEntity(dto: PopularServiceDTO): PopularServiceEntity {
    return {
      id: dto.id,
      name: dto.name,
      price: dto.price,
      revenue: dto.revenue,
      description: dto.description,
      estimatedTime: dto.estimatedTime,
      icon: dto.icon,
      category: dto.category,
    };
  }
}

export class PromotionMapper {
  static toDTO(entity: PromotionEntity): PromotionDTO {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      discount: entity.discount,
      validUntil: entity.validUntil,
      icon: entity.icon,
    };
  }

  static toEntity(dto: PromotionDTO): PromotionEntity {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      discount: dto.discount,
      validUntil: dto.validUntil,
      icon: dto.icon,
    };
  }
}

export class CustomerDashboardMapper {
  static toDTO(entity: CustomerDashboardEntity): CustomerDashboardDataDTO {
    return {
      queueStatus: QueueStatusStatsMapper.toDTO(entity.queueStatus),
      popularServices: entity.popularServices.map((service) =>
        PopularServiceMapper.toDTO(service)
      ),
      promotions: entity.promotions.map((promotion) =>
        PromotionMapper.toDTO(promotion)
      ),
      canJoinQueue: entity.canJoinQueue,
      announcement: entity.announcement,
    };
  }

  static toEntity(dto: CustomerDashboardDataDTO): CustomerDashboardEntity {
    return {
      queueStatus: QueueStatusStatsMapper.toEntity(dto.queueStatus),
      popularServices: dto.popularServices.map((service) =>
        PopularServiceMapper.toEntity(service)
      ),
      promotions: dto.promotions.map((promotion) =>
        PromotionMapper.toEntity(promotion)
      ),
      canJoinQueue: dto.canJoinQueue,
      announcement: dto.announcement,
    };
  }
}
