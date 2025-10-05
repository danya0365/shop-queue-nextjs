import type {
  GetQueueAnalyticsInput,
  GetQueuePeakHoursInput,
  GetQueueServiceAnalyticsInput,
  GetQueueTimeAnalyticsInput,
  QueueAnalyticsDTO,
  QueueAnalyticsSummaryDTO,
  QueuePeakHoursDTO,
  QueueServiceAnalyticsDTO,
  QueueTimeAnalyticsDTO,
} from "@/src/application/dtos/shop/backend/queue-analytics-dto";
import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { GetQueueAnalyticsSummaryUseCase } from "@/src/application/usecases/shop/backend/queues/analytics/GetQueueAnalyticsSummaryUseCase";
import { GetQueueAnalyticsUseCase } from "@/src/application/usecases/shop/backend/queues/analytics/GetQueueAnalyticsUseCase";
import { GetQueuePeakHoursUseCase } from "@/src/application/usecases/shop/backend/queues/analytics/GetQueuePeakHoursUseCase";
import { GetQueueServiceAnalyticsUseCase } from "@/src/application/usecases/shop/backend/queues/analytics/GetQueueServiceAnalyticsUseCase";
import { GetQueueTimeAnalyticsUseCase } from "@/src/application/usecases/shop/backend/queues/analytics/GetQueueTimeAnalyticsUseCase";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { ShopBackendQueueAnalyticsRepository } from "@/src/domain/repositories/shop/backend/backend-queue-analytics-repository";
import type { ShopBackendQueueRepository } from "@/src/domain/repositories/shop/backend/backend-queue-repository";

export interface IShopBackendAnalyticsService {
  getSummary(shopId: string): Promise<QueueAnalyticsSummaryDTO>;
  getAnalytics(input: GetQueueAnalyticsInput): Promise<QueueAnalyticsDTO>;
  getTimeAnalytics(input: GetQueueTimeAnalyticsInput): Promise<QueueTimeAnalyticsDTO>;
  getPeakHours(input: GetQueuePeakHoursInput): Promise<QueuePeakHoursDTO>;
  getServiceAnalytics(
    input: GetQueueServiceAnalyticsInput
  ): Promise<QueueServiceAnalyticsDTO>;
}

export class ShopBackendAnalyticsService implements IShopBackendAnalyticsService {
  constructor(
    private readonly getSummaryUseCase: IUseCase<string, QueueAnalyticsSummaryDTO>,
    private readonly getAnalyticsUseCase: IUseCase<
      GetQueueAnalyticsInput,
      QueueAnalyticsDTO
    >,
    private readonly getTimeAnalyticsUseCase: IUseCase<
      GetQueueTimeAnalyticsInput,
      QueueTimeAnalyticsDTO
    >,
    private readonly getPeakHoursUseCase: IUseCase<
      GetQueuePeakHoursInput,
      QueuePeakHoursDTO
    >,
    private readonly getServiceAnalyticsUseCase: IUseCase<
      GetQueueServiceAnalyticsInput,
      QueueServiceAnalyticsDTO
    >,
    private readonly logger: Logger
  ) {}

  async getSummary(shopId: string): Promise<QueueAnalyticsSummaryDTO> {
    try {
      this.logger.info("AnalyticsService: getSummary", { shopId });
      return await this.getSummaryUseCase.execute(shopId);
    } catch (error) {
      this.logger.error("AnalyticsService: getSummary failed", { error, shopId });
      throw error;
    }
  }

  async getAnalytics(input: GetQueueAnalyticsInput): Promise<QueueAnalyticsDTO> {
    try {
      this.logger.info("AnalyticsService: getAnalytics", { input });
      return await this.getAnalyticsUseCase.execute(input);
    } catch (error) {
      this.logger.error("AnalyticsService: getAnalytics failed", { error, input });
      throw error;
    }
  }

  async getTimeAnalytics(
    input: GetQueueTimeAnalyticsInput
  ): Promise<QueueTimeAnalyticsDTO> {
    try {
      this.logger.info("AnalyticsService: getTimeAnalytics", { input });
      return await this.getTimeAnalyticsUseCase.execute(input);
    } catch (error) {
      this.logger.error("AnalyticsService: getTimeAnalytics failed", { error, input });
      throw error;
    }
  }

  async getPeakHours(input: GetQueuePeakHoursInput): Promise<QueuePeakHoursDTO> {
    try {
      this.logger.info("AnalyticsService: getPeakHours", { input });
      return await this.getPeakHoursUseCase.execute(input);
    } catch (error) {
      this.logger.error("AnalyticsService: getPeakHours failed", { error, input });
      throw error;
    }
  }

  async getServiceAnalytics(
    input: GetQueueServiceAnalyticsInput
  ): Promise<QueueServiceAnalyticsDTO> {
    try {
      this.logger.info("AnalyticsService: getServiceAnalytics", { input });
      return await this.getServiceAnalyticsUseCase.execute(input);
    } catch (error) {
      this.logger.error("AnalyticsService: getServiceAnalytics failed", { error, input });
      throw error;
    }
  }
}

export class ShopBackendAnalyticsServiceFactory {
  static create(
    queueRepository: ShopBackendQueueRepository,
    queueAnalyticsRepository: ShopBackendQueueAnalyticsRepository,
    logger: Logger
  ): ShopBackendAnalyticsService {
    const getSummary = new GetQueueAnalyticsSummaryUseCase(
      queueRepository,
      queueAnalyticsRepository,
      logger
    );
    const getAnalytics = new GetQueueAnalyticsUseCase(
      queueRepository,
      queueAnalyticsRepository,
      logger
    );
    const getTime = new GetQueueTimeAnalyticsUseCase(
      queueRepository,
      queueAnalyticsRepository,
      logger
    );
    const getPeak = new GetQueuePeakHoursUseCase(
      queueRepository,
      queueAnalyticsRepository,
      logger
    );
    const getService = new GetQueueServiceAnalyticsUseCase(
      queueRepository,
      queueAnalyticsRepository,
      logger
    );

    return new ShopBackendAnalyticsService(
      getSummary,
      getAnalytics,
      getTime,
      getPeak,
      getService,
      logger
    );
  }
}
