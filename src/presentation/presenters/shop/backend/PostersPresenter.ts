import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface PosterTemplate {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'colorful' | 'professional' | 'creative';
  isPremium: boolean;
  previewImage: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  layout: 'portrait' | 'landscape';
  features: string[];
}

export interface ShopInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  qrCodeUrl: string;
  logo?: string;
  openingHours: string;
  services: string[];
}

export interface PosterCustomization {
  templateId: string;
  shopInfo: ShopInfo;
  customText?: string;
  showServices: boolean;
  showOpeningHours: boolean;
  showPhone: boolean;
  showAddress: boolean;
  qrCodeSize: 'small' | 'medium' | 'large';
}

export interface UserSubscription {
  isPremium: boolean;
  planName: string;
  expiresAt?: string;
}

// Define ViewModel interface
export interface PostersViewModel {
  templates: PosterTemplate[];
  shopInfo: ShopInfo;
  userSubscription: UserSubscription;
  selectedTemplate: PosterTemplate | null;
  customization: PosterCustomization | null;
}

// Main Presenter class
export class PostersPresenter {
  constructor(private readonly logger: Logger) { }

  async getViewModel(shopId: string): Promise<PostersViewModel> {
    try {
      this.logger.info(`PostersPresenter: Getting view model for shop ${shopId}`);

      // Mock data - replace with actual service calls
      const templates = this.getPosterTemplates();
      const shopInfo = await this.getShopInfo(shopId);
      const userSubscription = await this.getUserSubscription();

      return {
        templates,
        shopInfo,
        userSubscription,
        selectedTemplate: null,
        customization: null,
      };
    } catch (error) {
      this.logger.error('PostersPresenter: Error getting view model', error);
      throw error;
    }
  }

  private getPosterTemplates(): PosterTemplate[] {
    return [
      {
        id: 'minimal-1',
        name: 'Minimal Clean',
        description: 'ดีไซน์เรียบง่าย สะอาดตา เหมาะกับทุกประเภทธุรกิจ',
        category: 'minimal',
        isPremium: false,
        previewImage: '/images/posters/minimal-1.png',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        accentColor: '#3b82f6',
        layout: 'portrait',
        features: ['QR Code ขนาดใหญ่', 'ข้อมูลร้านครบถ้วน', 'อ่านง่าย']
      },
      {
        id: 'minimal-2',
        name: 'Minimal Dark',
        description: 'โทนสีเข้ม ดูหรูหรา เหมาะกับร้านอาหารและคาเฟ่',
        category: 'minimal',
        isPremium: false,
        previewImage: '/images/posters/minimal-2.png',
        backgroundColor: '#1f2937',
        textColor: '#ffffff',
        accentColor: '#10b981',
        layout: 'portrait',
        features: ['โทนสีเข้ม', 'ดูหรูหรา', 'เหมาะกับร้านอาหาร']
      },
      {
        id: 'colorful-1',
        name: 'Vibrant Blue',
        description: 'สีสันสดใส โทนสีน้ำเงิน เหมาะกับธุรกิจเทคโนโลยี',
        category: 'colorful',
        isPremium: true,
        previewImage: '/images/posters/colorful-1.png',
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        accentColor: '#fbbf24',
        layout: 'portrait',
        features: ['สีสันสดใส', 'โทนสีน้ำเงิน', 'ดูทันสมัย']
      },
      {
        id: 'colorful-2',
        name: 'Warm Orange',
        description: 'โทนสีส้มอบอุ่น เหมาะกับร้านอาหารและเบเกอรี่',
        category: 'colorful',
        isPremium: true,
        previewImage: '/images/posters/colorful-2.png',
        backgroundColor: '#f97316',
        textColor: '#ffffff',
        accentColor: '#fbbf24',
        layout: 'portrait',
        features: ['โทนสีอบอุ่น', 'เหมาะกับร้านอาหาร', 'ดึงดูดสายตา']
      },
      {
        id: 'professional-1',
        name: 'Corporate Blue',
        description: 'ดีไซน์มืออาชีพ เหมาะกับธุรกิจบริการและสำนักงาน',
        category: 'professional',
        isPremium: true,
        previewImage: '/images/posters/professional-1.png',
        backgroundColor: '#1e40af',
        textColor: '#ffffff',
        accentColor: '#60a5fa',
        layout: 'portrait',
        features: ['ดีไซน์มืออาชีพ', 'เหมาะกับธุรกิจบริการ', 'ดูน่าเชื่อถือ']
      },
      {
        id: 'professional-2',
        name: 'Executive Gray',
        description: 'โทนสีเทาหรูหรา เหมาะกับธุรกิจระดับผู้บริหาร',
        category: 'professional',
        isPremium: true,
        previewImage: '/images/posters/professional-2.png',
        backgroundColor: '#374151',
        textColor: '#ffffff',
        accentColor: '#9ca3af',
        layout: 'portrait',
        features: ['โทนสีหรูหรา', 'ดูมีระดับ', 'เหมาะกับผู้บริหาร']
      },
      {
        id: 'creative-1',
        name: 'Gradient Magic',
        description: 'ไล่เฉดสีสวยงาม ดูทันสมัย เหมาะกับธุรกิจสร้างสรรค์',
        category: 'creative',
        isPremium: true,
        previewImage: '/images/posters/creative-1.png',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#ffffff',
        accentColor: '#fbbf24',
        layout: 'portrait',
        features: ['ไล่เฉดสีสวยงาม', 'ดูทันสมัย', 'เหมาะกับธุรกิจสร้างสรรค์']
      },
      {
        id: 'creative-2',
        name: 'Sunset Vibes',
        description: 'โทนสีพระอาทิตย์ตก อบอุ่นและดึงดูดสายตา',
        category: 'creative',
        isPremium: true,
        previewImage: '/images/posters/creative-2.png',
        backgroundColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        textColor: '#1f2937',
        accentColor: '#f97316',
        layout: 'portrait',
        features: ['โทนสีพระอาทิตย์ตก', 'อบอุ่น', 'ดึงดูดสายตา']
      },
      {
        id: 'landscape-1',
        name: 'Wide Minimal',
        description: 'แนวนอน เรียบง่าย เหมาะสำหรับติดผนังกว้าง',
        category: 'minimal',
        isPremium: false,
        previewImage: '/images/posters/landscape-1.png',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        accentColor: '#3b82f6',
        layout: 'landscape',
        features: ['แนวนอน', 'เหมาะติดผนังกว้าง', 'อ่านง่าย']
      },
      {
        id: 'landscape-2',
        name: 'Wide Professional',
        description: 'แนวนอนมืออาชีพ เหมาะกับร้านบริการและคลินิก',
        category: 'professional',
        isPremium: true,
        previewImage: '/images/posters/landscape-2.png',
        backgroundColor: '#1e40af',
        textColor: '#ffffff',
        accentColor: '#60a5fa',
        layout: 'landscape',
        features: ['แนวนอนมืออาชีพ', 'เหมาะกับร้านบริการ', 'ดูน่าเชื่อถือ']
      },
      {
        id: 'special-1',
        name: 'Festival Theme',
        description: 'ธีมเทศกาล สีสันสดใส เหมาะกับช่วงโปรโมชั่น',
        category: 'creative',
        isPremium: true,
        previewImage: '/images/posters/special-1.png',
        backgroundColor: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
        textColor: '#ffffff',
        accentColor: '#fbbf24',
        layout: 'portrait',
        features: ['ธีมเทศกาล', 'สีสันสดใส', 'เหมาะช่วงโปรโมชั่น']
      },
      {
        id: 'special-2',
        name: 'Premium Gold',
        description: 'โทนสีทองหรูหรา เหมาะกับธุรกิจพรีเมียม',
        category: 'professional',
        isPremium: true,
        previewImage: '/images/posters/special-2.png',
        backgroundColor: '#1f2937',
        textColor: '#fbbf24',
        accentColor: '#f59e0b',
        layout: 'portrait',
        features: ['โทนสีทองหรูหรา', 'เหมาะธุรกิจพรีเมียม', 'ดูมีระดับ']
      }
    ];
  }

  private async getShopInfo(shopId: string): Promise<ShopInfo> {
    // Mock data - replace with actual service call
    return {
      id: shopId,
      name: 'กาแฟดีดี',
      description: 'ร้านกาแฟและเบเกอรี่คุณภาพ',
      address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
      phone: '02-123-4567',
      qrCodeUrl: `https://shopqueue.app/shop/${shopId}`,
      logo: '/images/shop-logo.png',
      openingHours: 'จันทร์-อาทิตย์ 07:00-20:00',
      services: ['กาแฟสด', 'เบเกอรี่', 'เค้กสั่งทำ', 'เครื่องดื่มเย็น']
    };
  }

  private async getUserSubscription(): Promise<UserSubscription> {
    // Mock data - replace with actual service call
    return {
      isPremium: false,
      planName: 'Basic',
      expiresAt: undefined
    };
  }

  /**
   * Generate metadata for the posters page
   */
  generateMetadata() {
    return {
      title: 'จัดการโปสเตอร์ | Shop Queue',
      description: 'สร้างและปรินต์โปสเตอร์พร้อม QR Code สำหรับร้านค้าของคุณ',
    };
  }
}

export class PostersPresenterFactory {
  static async create(): Promise<PostersPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    return new PostersPresenter(logger);
  }
}
