import type { CreatePromotionParams, PromotionDTO, PromotionsDataDTO, PromotionStatsDTO, PromotionTypeStatsDTO, UpdatePromotionParams } from '@/src/application/dtos/backend/promotions-dto';
import { PromotionStatus } from '@/src/application/dtos/backend/promotions-dto';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendPromotionsService {
  getPromotionsData(page?: number, perPage?: number): Promise<PromotionsDataDTO>;
  getPromotionStats(): Promise<PromotionStatsDTO>;
  getPromotionTypeStats(): Promise<PromotionTypeStatsDTO>;
  getPromotionById(id: string): Promise<PromotionDTO>;
  createPromotion(params: CreatePromotionParams): Promise<PromotionDTO>;
  updatePromotion(id: string, params: UpdatePromotionParams): Promise<PromotionDTO>;
  deletePromotion(id: string): Promise<boolean>;
}

export class BackendPromotionsService implements IBackendPromotionsService {
  constructor(
    private readonly logger: Logger
  ) { }

  // Mock data
  private mockPromotions: PromotionDTO[] = [
    {
      id: '1',
      shopId: 'shop-1',
      shopName: 'ร้านกาแฟดีดี',
      name: 'ลด 20% เมื่อซื้อครบ 500 บาท',
      description: 'โปรโมชั่นพิเศษสำหรับลูกค้าใหม่',
      type: 'percentage',
      value: 20,
      minPurchaseAmount: 500,
      maxDiscountAmount: 100,
      startAt: '2024-01-01T00:00:00Z',
      endAt: '2024-12-31T23:59:59Z',
      usageLimit: 100,
      status: 'active',
      conditions: [
        { type: 'new_customer', value: true },
        { type: 'min_items', value: 2 }
      ],
      createdBy: 'user-1',
      createdByName: 'ผู้จัดการร้าน',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      shopId: 'shop-1',
      shopName: 'ร้านกาแฟดีดี',
      name: 'ซื้อ 2 แก้วแถม 1 แก้ว',
      description: 'โปรโมชั่นซื้อ 2 แถม 1 สำหรับเครื่องดื่มทุกประเภท',
      type: 'buy_x_get_y',
      value: 1,
      minPurchaseAmount: null,
      maxDiscountAmount: null,
      startAt: '2024-02-01T00:00:00Z',
      endAt: '2024-02-29T23:59:59Z',
      usageLimit: 50,
      status: 'active',
      conditions: [
        { type: 'category', value: 'beverages' },
        { type: 'buy_quantity', value: '2' }
      ],
      createdBy: 'user-1',
      createdByName: 'ผู้จัดการร้าน',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: null
    },
    {
      id: '3',
      shopId: 'shop-2',
      shopName: 'ร้านอาหารอร่อย',
      name: 'ลดทันที 50 บาท',
      description: 'ลดราคาทันที 50 บาท ไม่มีเงื่อนไข',
      type: 'fixed_amount',
      value: 50,
      minPurchaseAmount: 200,
      maxDiscountAmount: null,
      startAt: '2024-03-01T00:00:00Z',
      endAt: '2024-03-31T23:59:59Z',
      usageLimit: null,
      status: 'scheduled',
      conditions: [],
      createdBy: 'user-2',
      createdByName: 'เจ้าของร้าน',
      createdAt: '2024-02-25T00:00:00Z',
      updatedAt: null
    },
    {
      id: '4',
      shopId: 'shop-1',
      shopName: 'ร้านกาแฟดีดี',
      name: 'โปรโมชั่นหมดอายุ',
      description: 'โปรโมชั่นที่หมดอายุแล้ว',
      type: 'percentage',
      value: 15,
      minPurchaseAmount: 300,
      maxDiscountAmount: 75,
      startAt: '2023-12-01T00:00:00Z',
      endAt: '2023-12-31T23:59:59Z',
      usageLimit: 200,
      status: 'expired',
      conditions: [],
      createdBy: 'user-1',
      createdByName: 'ผู้จัดการร้าน',
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      shopId: 'shop-3',
      shopName: 'ร้านเสื้อผ้าแฟชั่น',
      name: 'โปรโมชั่นปิดใช้งาน',
      description: 'โปรโมชั่นที่ปิดใช้งานชั่วคราว',
      type: 'percentage',
      value: 30,
      minPurchaseAmount: 1000,
      maxDiscountAmount: 300,
      startAt: '2024-01-01T00:00:00Z',
      endAt: '2024-06-30T23:59:59Z',
      usageLimit: 150,
      status: 'inactive',
      conditions: [
        { type: 'member_level', value: 'gold' }
      ],
      createdBy: 'user-3',
      createdByName: 'ผู้ดูแลระบบ',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-20T14:15:00Z'
    }
  ];

  /**
   * Get promotions data including paginated promotions and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Promotions data DTO
   */
  async getPromotionsData(page: number = 1, perPage: number = 10): Promise<PromotionsDataDTO> {
    try {
      this.logger.info('Getting promotions data', { page, perPage });

      // Simulate pagination
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedPromotions = this.mockPromotions.slice(startIndex, endIndex);

      // Get stats
      const stats = await this.getPromotionStats();

      return {
        promotions: paginatedPromotions,
        stats,
        totalCount: this.mockPromotions.length,
        currentPage: page,
        perPage
      };
    } catch (error) {
      this.logger.error('Error getting promotions data', { error, page, perPage });
      throw error;
    }
  }

  /**
   * Get promotion statistics
   * @returns Promotion stats DTO
   */
  async getPromotionStats(): Promise<PromotionStatsDTO> {
    try {
      this.logger.info('Getting promotion stats');

      const totalPromotions = this.mockPromotions.length;
      const activePromotions = this.mockPromotions.filter(p => p.status === 'active').length;
      const inactivePromotions = this.mockPromotions.filter(p => p.status === 'inactive').length;
      const expiredPromotions = this.mockPromotions.filter(p => p.status === 'expired').length;
      const scheduledPromotions = this.mockPromotions.filter(p => p.status === 'scheduled').length;

      return {
        totalPromotions,
        activePromotions,
        inactivePromotions,
        expiredPromotions,
        scheduledPromotions,
        totalUsage: 1250, // Mock data
        totalDiscountGiven: 45000, // Mock data
        averageDiscountAmount: 36, // Mock data
        mostUsedPromotionType: 'percentage'
      };
    } catch (error) {
      this.logger.error('Error getting promotion stats', { error });
      throw error;
    }
  }

  /**
   * Get promotion type statistics
   * @returns Promotion type stats DTO
   */
  async getPromotionTypeStats(): Promise<PromotionTypeStatsDTO> {
    try {
      this.logger.info('Getting promotion type stats');

      const totalPromotions = this.mockPromotions.length;
      const percentageCount = this.mockPromotions.filter(p => p.type === 'percentage').length;
      const fixedAmountCount = this.mockPromotions.filter(p => p.type === 'fixed_amount').length;
      const buyXGetYCount = this.mockPromotions.filter(p => p.type === 'buy_x_get_y').length;

      const freeItemCount = this.mockPromotions.filter(p => p.type === 'free_item').length;

      return {
        percentage: {
          count: percentageCount,
          percentage: Math.round((percentageCount / totalPromotions) * 100),
          totalUsage: 800 // Mock data
        },
        fixed_amount: {
          count: fixedAmountCount,
          percentage: Math.round((fixedAmountCount / totalPromotions) * 100),
          totalUsage: 250 // Mock data
        },
        buy_x_get_y: {
          count: buyXGetYCount,
          percentage: Math.round((buyXGetYCount / totalPromotions) * 100),
          totalUsage: 200 // Mock data
        },
        free_item: {
          count: freeItemCount,
          percentage: Math.round((freeItemCount / totalPromotions) * 100),
          totalUsage: 150 // Mock data
        },
        totalPromotions
      };
    } catch (error) {
      this.logger.error('Error getting promotion type stats', { error });
      throw error;
    }
  }

  /**
   * Get a promotion by ID
   * @param id Promotion ID
   * @returns Promotion DTO
   */
  async getPromotionById(id: string): Promise<PromotionDTO> {
    try {
      this.logger.info('Getting promotion by ID', { id });

      const promotion = this.mockPromotions.find(p => p.id === id);
      if (!promotion) {
        throw new Error(`Promotion with ID ${id} not found`);
      }

      return promotion;
    } catch (error) {
      this.logger.error('Error getting promotion by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create a new promotion
   * @param params Promotion creation parameters
   * @returns Created promotion DTO
   */
  async createPromotion(params: CreatePromotionParams): Promise<PromotionDTO> {
    try {
      this.logger.info('Creating promotion', { params });

      const newPromotion: PromotionDTO = {
        id: `promotion-${Date.now()}`,
        shopId: params.shopId,
        shopName: 'ร้านใหม่', // Mock shop name
        name: params.name,
        description: params.description || null,
        type: params.type,
        value: params.value,
        minPurchaseAmount: params.minPurchaseAmount || null,
        maxDiscountAmount: params.maxDiscountAmount || null,
        startAt: params.startAt,
        endAt: params.endAt,
        usageLimit: params.usageLimit || null,
        status: params.status || PromotionStatus.ACTIVE,
        conditions: params.conditions || null,
        createdBy: params.createdBy,
        createdByName: 'ผู้ใช้ใหม่', // Mock creator name
        createdAt: new Date().toISOString(),
        updatedAt: null
      };

      this.mockPromotions.push(newPromotion);
      return newPromotion;
    } catch (error) {
      this.logger.error('Error creating promotion', { error, params });
      throw error;
    }
  }

  /**
   * Update an existing promotion
   * @param id Promotion ID
   * @param params Promotion update parameters
   * @returns Updated promotion DTO
   */
  async updatePromotion(id: string, params: UpdatePromotionParams): Promise<PromotionDTO> {
    try {
      this.logger.info('Updating promotion', { id, params });

      const promotionIndex = this.mockPromotions.findIndex(p => p.id === id);
      if (promotionIndex === -1) {
        throw new Error(`Promotion with ID ${id} not found`);
      }

      const existingPromotion = this.mockPromotions[promotionIndex];
      const updatedPromotion: PromotionDTO = {
        ...existingPromotion,
        ...params,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      };

      this.mockPromotions[promotionIndex] = updatedPromotion;
      return updatedPromotion;
    } catch (error) {
      this.logger.error('Error updating promotion', { error, id, params });
      throw error;
    }
  }

  /**
   * Delete a promotion
   * @param id Promotion ID
   * @returns Success flag
   */
  async deletePromotion(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting promotion', { id });

      const promotionIndex = this.mockPromotions.findIndex(p => p.id === id);
      if (promotionIndex === -1) {
        throw new Error(`Promotion with ID ${id} not found`);
      }

      this.mockPromotions.splice(promotionIndex, 1);
      return true;
    } catch (error) {
      this.logger.error('Error deleting promotion', { error, id });
      throw error;
    }
  }
}
