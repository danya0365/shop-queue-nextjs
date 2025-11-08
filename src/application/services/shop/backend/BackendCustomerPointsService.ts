import type {
  CustomerPointsEntity,
  CustomerPointsStatsEntity,
  CustomerPointsWithCustomerEntity,
} from "@/src/domain/entities/backend/backend-customer-points.entity";
import { MembershipTier } from "@/src/domain/entities/backend/backend-customer.entity";
import type { Logger } from "@/src/domain/interfaces/logger";
import {
  CustomerPointsRepository,
  CustomerPointsRepositoryError,
  CustomerPointsRepositoryErrorType,
  type CustomerPointsListFilters,
} from "@/src/domain/repositories/backend/backend-customer-points-repository";

export type CustomerPointsSortByOption =
  | "currentPoints"
  | "totalEarned"
  | "name"
  | "tier"
  | "updatedAt";

export type CustomerPointsSortOrder = "asc" | "desc";

export interface CustomerPointsFilters {
  searchQuery?: string;
  membershipTier?: string;
  minCurrentPoints?: number;
  maxCurrentPoints?: number;
  minTotalEarned?: number;
  maxTotalEarned?: number;
  sortBy?: CustomerPointsSortByOption;
  sortOrder?: CustomerPointsSortOrder;
}

export interface CustomerPoints {
  id: string;
  shopId: string;
  customerId: string;
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  membershipTier: MembershipTier;
  tierBenefits: string[];
  createdAt: Date;
  updatedAt: Date;
  customerName?: string;
  customerPhone?: string;
  pointsToNextTier?: number;
  nextTier?: MembershipTier;
}

export interface CreateCustomerPointsData {
  customerId: string;
  currentPoints?: number;
}

export interface UpdateCustomerPointsData {
  currentPoints?: number;
}

export interface IShopBackendCustomerPointsService {
  getCustomerPoints(
    shopId: string,
    filters?: CustomerPointsFilters
  ): Promise<CustomerPoints[]>;
  getCustomerPointsById(
    shopId: string,
    pointsId: string
  ): Promise<CustomerPoints | null>;
  getCustomerPointsByCustomerId(
    shopId: string,
    customerId: string
  ): Promise<CustomerPoints | null>;
  createCustomerPoints(
    shopId: string,
    data: CreateCustomerPointsData
  ): Promise<CustomerPoints>;
  updateCustomerPoints(
    shopId: string,
    pointsId: string,
    data: UpdateCustomerPointsData
  ): Promise<CustomerPoints>;
  deleteCustomerPoints(shopId: string, pointsId: string): Promise<boolean>;
  addPoints(
    shopId: string,
    customerId: string,
    points: number,
    description: string
  ): Promise<CustomerPoints>;
  redeemPoints(
    shopId: string,
    customerId: string,
    points: number,
    description: string
  ): Promise<CustomerPoints>;
  getPointsStats(shopId: string): Promise<{
    totalCustomers: number;
    totalPointsIssued: number;
    totalPointsRedeemed: number;
    averagePointsPerCustomer: number;
    tierDistribution: Record<MembershipTier, number>;
  }>;
}

export class ShopBackendCustomerPointsService
  implements IShopBackendCustomerPointsService
{
  private static readonly PAGE_SIZE = 100;

  constructor(
    private readonly repository: CustomerPointsRepository,
    private readonly logger: Logger
  ) {}

  async getCustomerPoints(
    shopId: string,
    filters?: CustomerPointsFilters
  ): Promise<CustomerPoints[]> {
    try {
      this.logger.info(
        "ShopBackendCustomerPointsService: Fetching customer points",
        { shopId, filters }
      );
      const repositoryFilters = this.mapToRepositoryFilters(filters);
      const entities = await this.fetchAllCustomerPointsEntities(
        shopId,
        repositoryFilters
      );
      return entities.map((entity) => this.mapToServiceModel(entity));
    } catch (error) {
      this.handleError(error, "getCustomerPoints", { shopId, filters });
    }
  }

  async getCustomerPointsById(
    shopId: string,
    pointsId: string
  ): Promise<CustomerPoints | null> {
    try {
      this.logger.info(
        "ShopBackendCustomerPointsService: Fetching customer points by ID",
        { shopId, pointsId }
      );
      const entities = await this.fetchAllCustomerPointsEntities(shopId);
      const match = entities.find((entity) => entity.id === pointsId);
      return match ? this.mapToServiceModel(match) : null;
    } catch (error) {
      this.handleError(error, "getCustomerPointsById", { shopId, pointsId });
    }
  }

  async getCustomerPointsByCustomerId(
    shopId: string,
    customerId: string
  ): Promise<CustomerPoints | null> {
    try {
      this.logger.info(
        "ShopBackendCustomerPointsService: Fetching customer points by customer ID",
        { shopId, customerId }
      );
      const entity = await this.repository.getCustomerPointsByCustomerId(
        shopId,
        customerId
      );
      return entity ? this.mapToServiceModel(entity) : null;
    } catch (error) {
      this.handleError(error, "getCustomerPointsByCustomerId", {
        shopId,
        customerId,
      });
    }
  }

  async createCustomerPoints(
    shopId: string,
    data: CreateCustomerPointsData
  ): Promise<CustomerPoints> {
    try {
      this.logger.info(
        "ShopBackendCustomerPointsService: Creating customer points",
        {
          shopId,
          data,
        }
      );
      const existing = await this.repository.getCustomerPointsByCustomerId(
        shopId,
        data.customerId
      );
      if (existing) {
        return this.mapToServiceModel(existing);
      }

      const initialPoints = data.currentPoints ?? 0;
      if (initialPoints <= 0) {
        throw new CustomerPointsRepositoryError(
          CustomerPointsRepositoryErrorType.VALIDATION_ERROR,
          "ต้องระบุจำนวนแต้มเริ่มต้นมากกว่า 0 เพื่อสร้างข้อมูลแต้มลูกค้า",
          "createCustomerPoints",
          { shopId, data }
        );
      }

      await this.repository.addPoints(
        shopId,
        data.customerId,
        initialPoints,
        "Initial points allocation"
      );

      const created = await this.repository.getCustomerPointsByCustomerId(
        shopId,
        data.customerId
      );
      if (!created) {
        throw new CustomerPointsRepositoryError(
          CustomerPointsRepositoryErrorType.OPERATION_FAILED,
          "ไม่สามารถสร้างข้อมูลแต้มลูกค้าตามที่ร้องขอได้",
          "createCustomerPoints",
          { shopId, data }
        );
      }

      return this.mapToServiceModel(created);
    } catch (error) {
      this.handleError(error, "createCustomerPoints", { shopId, data });
    }
  }

  async updateCustomerPoints(
    shopId: string,
    pointsId: string,
    data: UpdateCustomerPointsData
  ): Promise<CustomerPoints> {
    try {
      this.logger.info(
        "ShopBackendCustomerPointsService: Updating customer points",
        {
          shopId,
          pointsId,
          data,
        }
      );
      const existing = await this.getCustomerPointsById(shopId, pointsId);
      if (!existing) {
        throw new CustomerPointsRepositoryError(
          CustomerPointsRepositoryErrorType.NOT_FOUND,
          "ไม่พบข้อมูลแต้มลูกค้าที่ต้องการปรับปรุง",
          "updateCustomerPoints",
          { shopId, pointsId }
        );
      }

      if (data.currentPoints === undefined) {
        return existing;
      }

      const difference = data.currentPoints - existing.currentPoints;
      if (difference > 0) {
        await this.repository.addPoints(
          shopId,
          existing.customerId,
          difference,
          "Manual adjustment"
        );
      } else if (difference < 0) {
        await this.repository.redeemPoints(
          shopId,
          existing.customerId,
          Math.abs(difference),
          "Manual adjustment"
        );
      }

      const updated = await this.repository.getCustomerPointsByCustomerId(
        shopId,
        existing.customerId
      );
      if (!updated) {
        throw new CustomerPointsRepositoryError(
          CustomerPointsRepositoryErrorType.OPERATION_FAILED,
          "ไม่สามารถดึงข้อมูลแต้มลูกค้าหลังการปรับปรุงได้",
          "updateCustomerPoints",
          { shopId, pointsId }
        );
      }

      return this.mapToServiceModel(updated);
    } catch (error) {
      this.handleError(error, "updateCustomerPoints", {
        shopId,
        pointsId,
        data,
      });
    }
  }

  async deleteCustomerPoints(
    shopId: string,
    pointsId: string
  ): Promise<boolean> {
    this.logger.warn(
      "ShopBackendCustomerPointsService: deleteCustomerPoints is not supported",
      {
        shopId,
        pointsId,
      }
    );
    throw new CustomerPointsRepositoryError(
      CustomerPointsRepositoryErrorType.OPERATION_FAILED,
      "ยังไม่รองรับการลบข้อมูลแต้มลูกค้า",
      "deleteCustomerPoints",
      { shopId, pointsId }
    );
  }

  async addPoints(
    shopId: string,
    customerId: string,
    points: number,
    description: string
  ): Promise<CustomerPoints> {
    try {
      this.logger.info("ShopBackendCustomerPointsService: Adding points", {
        shopId,
        customerId,
        points,
        description,
      });
      if (points <= 0) {
        throw new CustomerPointsRepositoryError(
          CustomerPointsRepositoryErrorType.VALIDATION_ERROR,
          "จำนวนแต้มที่เพิ่มต้องมากกว่า 0",
          "addPoints",
          { shopId, customerId, points }
        );
      }

      await this.repository.addPoints(shopId, customerId, points, description);
      const updated = await this.repository.getCustomerPointsByCustomerId(
        shopId,
        customerId
      );
      if (!updated) {
        throw new CustomerPointsRepositoryError(
          CustomerPointsRepositoryErrorType.NOT_FOUND,
          "ไม่พบข้อมูลแต้มลูกค้าหลังเพิ่มแต้ม",
          "addPoints",
          { shopId, customerId }
        );
      }

      return this.mapToServiceModel(updated);
    } catch (error) {
      this.handleError(error, "addPoints", { shopId, customerId, points });
    }
  }

  async redeemPoints(
    shopId: string,
    customerId: string,
    points: number,
    description: string
  ): Promise<CustomerPoints> {
    try {
      this.logger.info("ShopBackendCustomerPointsService: Redeeming points", {
        shopId,
        customerId,
        points,
        description,
      });
      if (points <= 0) {
        throw new CustomerPointsRepositoryError(
          CustomerPointsRepositoryErrorType.VALIDATION_ERROR,
          "จำนวนแต้มที่แลกต้องมากกว่า 0",
          "redeemPoints",
          { shopId, customerId, points }
        );
      }

      await this.repository.redeemPoints(
        shopId,
        customerId,
        points,
        description
      );
      const updated = await this.repository.getCustomerPointsByCustomerId(
        shopId,
        customerId
      );
      if (!updated) {
        throw new CustomerPointsRepositoryError(
          CustomerPointsRepositoryErrorType.NOT_FOUND,
          "ไม่พบข้อมูลแต้มลูกค้าหลังแลกแต้ม",
          "redeemPoints",
          { shopId, customerId }
        );
      }

      return this.mapToServiceModel(updated);
    } catch (error) {
      this.handleError(error, "redeemPoints", { shopId, customerId, points });
    }
  }

  async getPointsStats(shopId: string): Promise<{
    totalCustomers: number;
    totalPointsIssued: number;
    totalPointsRedeemed: number;
    averagePointsPerCustomer: number;
    tierDistribution: Record<MembershipTier, number>;
  }> {
    try {
      this.logger.info(
        "ShopBackendCustomerPointsService: Fetching point statistics",
        {
          shopId,
        }
      );
      const [stats, entities] = await Promise.all([
        this.repository.getCustomerPointsStats(shopId),
        this.fetchAllCustomerPointsEntities(shopId),
      ]);

      const tierDistribution = entities.reduce<Record<MembershipTier, number>>(
        (acc, entity) => {
          const tier = entity.membershipTier ?? MembershipTier.BRONZE;
          acc[tier] = (acc[tier] ?? 0) + 1;
          return acc;
        },
        {} as Record<MembershipTier, number>
      );

      return this.composeStats(stats, tierDistribution);
    } catch (error) {
      this.handleError(error, "getPointsStats", { shopId });
    }
  }

  private mapToServiceModel(
    entity: CustomerPointsWithCustomerEntity | CustomerPointsEntity
  ): CustomerPoints {
    const membershipTier = entity.membershipTier ?? MembershipTier.BRONZE;
    const tierProgress = this.calculateTierProgress(entity.totalEarned ?? 0);

    return {
      id: entity.id,
      shopId: entity.shopId,
      customerId: entity.customerId,
      currentPoints: entity.currentPoints ?? 0,
      totalEarned: entity.totalEarned ?? 0,
      totalRedeemed: entity.totalRedeemed ?? 0,
      membershipTier,
      tierBenefits:
        entity.tierBenefits && entity.tierBenefits.length > 0
          ? entity.tierBenefits
          : this.getTierBenefits(membershipTier),
      createdAt: entity.createdAt ? new Date(entity.createdAt) : new Date(),
      updatedAt: entity.updatedAt ? new Date(entity.updatedAt) : new Date(),
      customerName:
        "customerName" in entity ? entity.customerName ?? undefined : undefined,
      customerPhone:
        "customerPhone" in entity
          ? entity.customerPhone ?? undefined
          : undefined,
      pointsToNextTier: tierProgress.pointsToNextTier,
      nextTier: tierProgress.nextTier,
    };
  }

  private async fetchAllCustomerPointsEntities(
    shopId: string,
    filters?: CustomerPointsListFilters
  ): Promise<CustomerPointsWithCustomerEntity[]> {
    const results: CustomerPointsWithCustomerEntity[] = [];
    let page = 1;

    while (true) {
      const { data } = await this.repository.getCustomerPointsList(
        shopId,
        { page, limit: ShopBackendCustomerPointsService.PAGE_SIZE },
        filters
      );
      results.push(...data);
      if (data.length < ShopBackendCustomerPointsService.PAGE_SIZE) {
        break;
      }
      page += 1;
    }

    return results;
  }

  private calculateTierProgress(totalEarned: number): {
    nextTier?: MembershipTier;
    pointsToNextTier?: number;
  } {
    const thresholds: Array<{ tier: MembershipTier; min: number }> = [
      { tier: MembershipTier.BRONZE, min: 0 },
      { tier: MembershipTier.SILVER, min: 250 },
      { tier: MembershipTier.GOLD, min: 500 },
      { tier: MembershipTier.PLATINUM, min: 2000 },
    ];

    for (let index = 0; index < thresholds.length; index += 1) {
      const threshold = thresholds[index];
      const next = thresholds[index + 1];
      if (totalEarned >= threshold.min && (!next || totalEarned < next.min)) {
        if (next) {
          return {
            nextTier: next.tier,
            pointsToNextTier: next.min - totalEarned,
          };
        }
        return {};
      }
    }

    return {};
  }

  private getTierBenefits(tier: MembershipTier): string[] {
    switch (tier) {
      case MembershipTier.PLATINUM:
        return [
          "ส่วนลด 15%",
          "แต้มพิเศษ x2.0",
          "บริการพิเศษ",
          "ของขวัญวันเกิด",
        ];
      case MembershipTier.GOLD:
        return ["ส่วนลด 10%", "แต้มพิเศษ x1.5", "บริการพิเศษ"];
      case MembershipTier.SILVER:
        return ["ส่วนลด 5%", "แต้มพิเศษ x1.2"];
      case MembershipTier.BRONZE:
      case MembershipTier.REGULAR:
      default:
        return ["แต้มพิเศษ x1.0"];
    }
  }

  private composeStats(
    stats: CustomerPointsStatsEntity,
    tierDistribution: Record<MembershipTier, number>
  ) {
    return {
      totalCustomers: stats.totalCustomers,
      totalPointsIssued: stats.totalPointsIssued,
      totalPointsRedeemed: stats.totalPointsRedeemed,
      averagePointsPerCustomer: stats.averagePointsPerCustomer,
      tierDistribution,
    };
  }

  private mapToRepositoryFilters(
    filters?: CustomerPointsFilters
  ): CustomerPointsListFilters | undefined {
    if (!filters) {
      return undefined;
    }

    return {
      searchQuery: filters.searchQuery,
      membershipTier: filters.membershipTier,
      minCurrentPoints: filters.minCurrentPoints,
      maxCurrentPoints: filters.maxCurrentPoints,
      minTotalEarned: filters.minTotalEarned,
      maxTotalEarned: filters.maxTotalEarned,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
  }

  private handleError(
    error: unknown,
    operation: string,
    context: Record<string, unknown>
  ): never {
    this.logger.error("ShopBackendCustomerPointsService: Operation failed", {
      operation,
      error,
      context,
    });

    if (error instanceof CustomerPointsRepositoryError) {
      throw error;
    }

    throw new CustomerPointsRepositoryError(
      CustomerPointsRepositoryErrorType.UNKNOWN,
      "เกิดข้อผิดพลาดในการจัดการแต้มลูกค้า",
      operation,
      context,
      error
    );
  }
}
