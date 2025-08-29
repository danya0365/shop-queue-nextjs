import type { PosterTemplate, PosterTemplateBackendService, PosterTemplateFilters, PosterTemplateStats } from '@/src/application/services/shop/backend/poster-templates-backend-service';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { Metadata } from 'next';
import { BaseShopPresenter } from '../BaseShopPresenter';

export interface PosterTemplatesViewModel {
  templates: PosterTemplate[];
  stats: PosterTemplateStats;
  categoryOptions: CategoryOption[];
  orientationOptions: OrientationOption[];
  difficultyOptions: DifficultyOption[];
  filters: PosterTemplateFilters;
}

export interface CategoryOption {
  value: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export interface OrientationOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export interface DifficultyOption {
  value: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export class PosterTemplatesPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    private readonly posterTemplateService: PosterTemplateBackendService,
  ) {
    super(logger);
  }

  async getViewModel(shopId: string, filters?: PosterTemplateFilters): Promise<PosterTemplatesViewModel> {
    this.logger.info('PosterTemplatesPresenter: Getting view model', { shopId, filters });

    try {
      const [templates, stats] = await Promise.all([
        this.posterTemplateService.getPosterTemplates(shopId, filters),
        this.posterTemplateService.getPosterTemplateStats(shopId, filters),
      ]);

      const categoryOptions = this.getCategoryOptions();
      const orientationOptions = this.getOrientationOptions();
      const difficultyOptions = this.getDifficultyOptions();

      this.logger.info('PosterTemplatesPresenter: View model created', {
        shopId,
        templatesCount: templates.length,
        totalTemplates: stats.totalTemplates,
        activeTemplates: stats.activeTemplates,
      });

      return {
        templates,
        stats,
        categoryOptions,
        orientationOptions,
        difficultyOptions,
        filters: filters || {},
      };
    } catch (error) {
      this.logger.error('PosterTemplatesPresenter: Error getting view model', {
        shopId,
        filters,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private getCategoryOptions(): CategoryOption[] {
    return [
      {
        value: 'promotion',
        label: 'โปรโมชั่น',
        icon: '🎯',
        description: 'เทมเพลตสำหรับโปรโมชั่นและส่วนลด',
        color: 'red',
      },
      {
        value: 'service',
        label: 'บริการ',
        icon: '✨',
        description: 'เทมเพลตแนะนำบริการใหม่',
        color: 'blue',
      },
      {
        value: 'announcement',
        label: 'ประกาศ',
        icon: '📢',
        description: 'เทมเพลตสำหรับประกาศข่าวสาร',
        color: 'yellow',
      },
      {
        value: 'event',
        label: 'งานอีเวนต์',
        icon: '🎉',
        description: 'เทมเพลตสำหรับงานอีเวนต์พิเศษ',
        color: 'purple',
      },
      {
        value: 'seasonal',
        label: 'ตามเทศกาล',
        icon: '🎄',
        description: 'เทมเพลตสำหรับเทศกาลต่างๆ',
        color: 'green',
      },
      {
        value: 'custom',
        label: 'กำหนดเอง',
        icon: '🎨',
        description: 'เทมเพลตที่สร้างขึ้นเอง',
        color: 'gray',
      },
    ];
  }

  private getOrientationOptions(): OrientationOption[] {
    return [
      {
        value: 'portrait',
        label: 'แนวตั้ง',
        icon: '📱',
        description: 'เหมาะสำหรับโซเชียลมีเดียและสมาร์ทโฟน',
      },
      {
        value: 'landscape',
        label: 'แนวนอน',
        icon: '🖥️',
        description: 'เหมาะสำหรับเว็บไซต์และหน้าจอคอมพิวเตอร์',
      },
      {
        value: 'square',
        label: 'สี่เหลี่ยมจัตุรัส',
        icon: '⬜',
        description: 'เหมาะสำหรับ Instagram และโซเชียลมีเดีย',
      },
    ];
  }

  private getDifficultyOptions(): DifficultyOption[] {
    return [
      {
        value: 'beginner',
        label: 'ง่าย',
        icon: '🟢',
        description: 'เหมาะสำหรับผู้เริ่มต้น',
        color: 'green',
      },
      {
        value: 'intermediate',
        label: 'ปานกลาง',
        icon: '🟡',
        description: 'ต้องการทักษะระดับกลาง',
        color: 'yellow',
      },
      {
        value: 'advanced',
        label: 'ยาก',
        icon: '🔴',
        description: 'ต้องการทักษะระดับสูง',
        color: 'red',
      },
    ];
  }

  async generateMetadata(shopId: string): Promise<Metadata> {
    return this.generateShopMetadata(
      shopId,
      'เทมเพลตโปสเตอร์',
      'จัดการเทมเพลตโปสเตอร์สำหรับการโปรโมต สร้างและแก้ไขเทมเพลตได้ง่ายๆ',
    );
  }
}

// Factory class
export class PosterTemplatesPresenterFactory {
  static async create(): Promise<PosterTemplatesPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const posterTemplateService = serverContainer.resolve<PosterTemplateBackendService>('PosterTemplateBackendService');
    return new PosterTemplatesPresenter(logger, posterTemplateService);
  }
}
