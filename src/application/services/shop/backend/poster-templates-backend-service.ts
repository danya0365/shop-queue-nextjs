import type { Logger } from '@/src/domain/interfaces/logger';

export interface PosterTemplate {
  id: string;
  shopId: string;
  name: string;
  description: string;
  category: 'promotion' | 'service' | 'announcement' | 'event' | 'seasonal' | 'custom';
  tags: string[];
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape' | 'square';
  backgroundColor: string;
  backgroundImage?: string;
  elements: PosterElement[];
  isActive: boolean;
  isPublic: boolean;
  isPremium: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  usageCount: number;
  lastUsed?: Date;
  rating: number;
  ratingCount: number;
  status: 'active' | 'inactive' | 'draft';
  variables: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PosterElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'qr_code' | 'logo' | 'icon';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  content?: string;
  imageUrl?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | 'light';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity: number;
  isVariable: boolean;
  variableName?: string;
  defaultValue?: string;
}

export interface PosterTemplateStats {
  totalTemplates: number;
  activeTemplates: number;
  totalUsage: number;
  averageRating: number;
  categoryBreakdown: Record<string, number>;
  popularTemplates: Array<{
    id: string;
    name: string;
    category: string;
    usageCount: number;
    rating: number;
    thumbnail?: string;
  }>;
  recentTemplates: PosterTemplate[];
  monthlyUsage: Array<{
    month: string;
    usage: number;
    newTemplates: number;
  }>;
}

export interface PosterTemplateFilters {
  category?: string;
  orientation?: string;
  difficulty?: string;
  isActive?: boolean;
  isPublic?: boolean;
  isPremium?: boolean;
  minRating?: number;
  tags?: string[];
  status?: string;
  searchTerm?: string;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'usageCount' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IPosterTemplateBackendService {
  getPosterTemplates(shopId: string, filters?: PosterTemplateFilters): Promise<PosterTemplate[]>;
  getPosterTemplateById(shopId: string, templateId: string): Promise<PosterTemplate | null>;
  createPosterTemplate(shopId: string, data: Omit<PosterTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsed' | 'rating' | 'ratingCount'>): Promise<PosterTemplate>;
  updatePosterTemplate(shopId: string, templateId: string, data: Partial<PosterTemplate>): Promise<PosterTemplate>;
  deletePosterTemplate(shopId: string, templateId: string): Promise<boolean>;
  duplicatePosterTemplate(shopId: string, templateId: string, newName: string): Promise<PosterTemplate>;
  toggleTemplateStatus(shopId: string, templateId: string): Promise<PosterTemplate>;
  ratePosterTemplate(shopId: string, templateId: string, rating: number): Promise<PosterTemplate>;
  incrementUsage(shopId: string, templateId: string): Promise<PosterTemplate>;
  getPosterTemplateStats(shopId: string, filters?: PosterTemplateFilters): Promise<PosterTemplateStats>;
  exportPosterTemplate(shopId: string, templateId: string): Promise<string>;
  importPosterTemplate(shopId: string, templateData: string): Promise<PosterTemplate>;
}

export class PosterTemplateBackendService implements IPosterTemplateBackendService {
  private mockTemplates: PosterTemplate[] = [
    {
      id: 'template_001',
      shopId: 'shop1',
      name: 'โปรโมชั่นตัดผม 50% Off',
      description: 'เทมเพลตโปรโมชั่นส่วนลดตัดผม สำหรับใช้ในช่วงเทศกาล',
      category: 'promotion',
      tags: ['ส่วนลด', 'ตัดผม', 'โปรโมชั่น'],
      width: 1080,
      height: 1350,
      orientation: 'portrait',
      backgroundColor: '#FF6B6B',
      backgroundImage: 'https://example.com/bg1.jpg',
      elements: [
        {
          id: 'elem_001',
          type: 'text',
          x: 100,
          y: 200,
          width: 880,
          height: 120,
          rotation: 0,
          zIndex: 2,
          content: 'ส่วนลด 50%',
          fontSize: 72,
          fontFamily: 'Kanit',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#FFFFFF',
          opacity: 1,
          isVariable: false,
        },
        {
          id: 'elem_002',
          type: 'qr_code',
          x: 400,
          y: 1000,
          width: 280,
          height: 280,
          rotation: 0,
          zIndex: 1,
          content: 'https://shop.example.com/booking',
          backgroundColor: '#FFFFFF',
          opacity: 1,
          isVariable: true,
          variableName: 'bookingUrl',
          defaultValue: 'https://shop.example.com/booking',
        },
      ],
      isActive: true,
      isPublic: true,
      isPremium: false,
      difficulty: 'beginner',
      usageCount: 25,
      lastUsed: new Date('2024-01-15T10:30:00Z'),
      rating: 4.5,
      ratingCount: 89,
      status: 'active',
      variables: ['{{shop_name}}', '{{announcement_title}}', '{{announcement_text}}'],
      createdBy: 'admin',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
    },
    {
      id: 'template_002',
      shopId: 'shop1',
      name: 'ประกาศเวลาทำการใหม่',
      description: 'เทมเพลตสำหรับประกาศเวลาทำการ เหมาะสำหรับติดหน้าร้าน',
      category: 'announcement',
      tags: ['เวลาทำการ', 'ประกาศ', 'ข้อมูลร้าน'],
      width: 1080,
      height: 1080,
      orientation: 'square',
      backgroundColor: '#4ECDC4',
      elements: [
        {
          id: 'elem_004',
          type: 'text',
          x: 100,
          y: 150,
          width: 880,
          height: 100,
          rotation: 0,
          zIndex: 2,
          content: 'เวลาทำการใหม่',
          fontSize: 48,
          fontFamily: 'Kanit',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#2C3E50',
          opacity: 1,
          isVariable: false,
        },
      ],
      isActive: true,
      isPublic: false,
      isPremium: false,
      difficulty: 'beginner',
      usageCount: 12,
      lastUsed: new Date('2024-01-10T14:20:00Z'),
      rating: 4.8,
      ratingCount: 156,
      status: 'active',
      variables: ['{{shop_name}}', '{{discount_amount}}', '{{service_name}}'],
      createdBy: 'admin',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
    },
  ];

  constructor(private readonly logger: Logger) { }

  async getPosterTemplates(shopId: string, filters?: PosterTemplateFilters): Promise<PosterTemplate[]> {
    try {
      this.logger.info('PosterTemplateBackendService: Getting poster templates', { shopId, filters });

      let templates = this.mockTemplates.filter(t => t.shopId === shopId);

      if (filters) {
        if (filters.category) templates = templates.filter(t => t.category === filters.category);
        if (filters.orientation) templates = templates.filter(t => t.orientation === filters.orientation);
        if (filters.difficulty) templates = templates.filter(t => t.difficulty === filters.difficulty);
        if (filters.isActive !== undefined) templates = templates.filter(t => t.isActive === filters.isActive);
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          templates = templates.filter(t =>
            t.name.toLowerCase().includes(searchLower) ||
            t.description.toLowerCase().includes(searchLower)
          );
        }
      }

      return templates;
    } catch (err) {
      this.logger.error('PosterTemplateBackendService: Error getting poster templates', {
        shopId,
        filters,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
      throw err;
    }
  }

  async getPosterTemplateById(shopId: string, templateId: string): Promise<PosterTemplate | null> {
    this.logger.info('PosterTemplateBackendService: Getting poster template by ID', { shopId, templateId });
    return this.mockTemplates.find(t => t.id === templateId && t.shopId === shopId) || null;
  }

  async createPosterTemplate(shopId: string, data: Omit<PosterTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsed' | 'rating' | 'ratingCount'>): Promise<PosterTemplate> {
    this.logger.info('PosterTemplateBackendService: Creating poster template', { shopId, data });

    const newTemplate: PosterTemplate = {
      ...data,
      id: `template_${Date.now()}`,
      usageCount: 0,
      rating: 0,
      ratingCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockTemplates.push(newTemplate);
    return newTemplate;
  }

  async updatePosterTemplate(shopId: string, templateId: string, data: Partial<PosterTemplate>): Promise<PosterTemplate> {
    const index = this.mockTemplates.findIndex(t => t.id === templateId && t.shopId === shopId);
    if (index === -1) throw new Error('Template not found');

    this.mockTemplates[index] = { ...this.mockTemplates[index], ...data, updatedAt: new Date() };
    return this.mockTemplates[index];
  }

  async deletePosterTemplate(shopId: string, templateId: string): Promise<boolean> {
    const index = this.mockTemplates.findIndex(t => t.id === templateId && t.shopId === shopId);
    if (index === -1) return false;

    this.mockTemplates.splice(index, 1);
    return true;
  }

  async duplicatePosterTemplate(shopId: string, templateId: string, newName: string): Promise<PosterTemplate> {
    const original = await this.getPosterTemplateById(shopId, templateId);
    if (!original) throw new Error('Original template not found');

    return this.createPosterTemplate(shopId, { ...original, name: newName });
  }

  async toggleTemplateStatus(shopId: string, templateId: string): Promise<PosterTemplate> {
    const template = await this.getPosterTemplateById(shopId, templateId);
    if (!template) throw new Error('Template not found');

    return this.updatePosterTemplate(shopId, templateId, { isActive: !template.isActive });
  }

  async ratePosterTemplate(shopId: string, templateId: string, rating: number): Promise<PosterTemplate> {
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');

    const template = await this.getPosterTemplateById(shopId, templateId);
    if (!template) throw new Error('Template not found');

    const newRatingCount = template.ratingCount + 1;
    const newRating = ((template.rating * template.ratingCount) + rating) / newRatingCount;

    return this.updatePosterTemplate(shopId, templateId, {
      rating: Math.round(newRating * 10) / 10,
      ratingCount: newRatingCount,
    });
  }

  async incrementUsage(shopId: string, templateId: string): Promise<PosterTemplate> {
    const template = await this.getPosterTemplateById(shopId, templateId);
    if (!template) throw new Error('Template not found');

    return this.updatePosterTemplate(shopId, templateId, {
      usageCount: template.usageCount + 1,
      lastUsed: new Date(),
    });
  }

  async getPosterTemplateStats(shopId: string, filters?: PosterTemplateFilters): Promise<PosterTemplateStats> {
    const templates = await this.getPosterTemplates(shopId, filters);

    return {
      totalTemplates: templates.length,
      activeTemplates: templates.filter(t => t.isActive).length,
      totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
      averageRating: templates.length > 0 ? templates.reduce((sum, t) => sum + t.rating, 0) / templates.length : 0,
      categoryBreakdown: templates.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      popularTemplates: templates.sort((a, b) => b.usageCount - a.usageCount).slice(0, 5).map(t => ({
        id: t.id,
        name: t.name,
        category: t.category,
        usageCount: t.usageCount,
        rating: t.rating,
        thumbnail: t.backgroundImage,
      })),
      recentTemplates: templates.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5),
      monthlyUsage: [
        { month: '2024-01', usage: 80, newTemplates: 2 },
        { month: '2023-12', usage: 65, newTemplates: 1 },
        { month: '2023-11', usage: 45, newTemplates: 1 },
      ],
    };
  }

  async exportPosterTemplate(shopId: string, templateId: string): Promise<string> {
    const template = await this.getPosterTemplateById(shopId, templateId);
    if (!template) throw new Error('Template not found');

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      template: { ...template, shopId: undefined, id: undefined },
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importPosterTemplate(shopId: string, templateData: string): Promise<PosterTemplate> {
    try {
      const importData = JSON.parse(templateData);
      const template = importData.template;

      return this.createPosterTemplate(shopId, {
        ...template,
        name: `${template.name} (นำเข้า)`,
      });
    } catch (error) {
      this.logger.error('PosterTemplateBackendService: Importing poster template failed', { shopId, templateData, error });
      throw new Error('Invalid template data format');
    }
  }
}
