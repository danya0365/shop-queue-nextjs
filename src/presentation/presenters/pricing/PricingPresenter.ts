import { PricingPlanDto, PricingComparisonDto, PlanLimits } from '@/src/application/dtos/pricing-dto';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

/**
 * ViewModel for Pricing page
 */
export interface PricingViewModel {
  plans: PricingPlanDto[];
  comparison: PricingComparisonDto;
  currency: string;
}

/**
 * PricingPresenter handles business logic for the pricing page
 * Following SOLID principles and Clean Architecture
 */
export class PricingPresenter {
  constructor(private readonly logger: Logger) {}

  /**
   * Get view model for pricing page
   */
  async getViewModel(): Promise<PricingViewModel> {
    try {
      this.logger.info('PricingPresenter: Getting pricing view model');

      const plans = this.getPricingPlans();
      const comparison = this.getPricingComparison();

      return {
        plans,
        comparison,
        currency: 'THB'
      };
    } catch (error) {
      this.logger.error('PricingPresenter: Error getting view model', error);
      throw error;
    }
  }

  /**
   * Get pricing plans data
   */
  private getPricingPlans(): PricingPlanDto[] {
    const freeLimits: PlanLimits = {
      maxShops: 1,
      maxQueuesPerDay: 50,
      dataRetentionMonths: 1,
      maxStaff: 1,
      maxSmsPerMonth: 10,
      maxPromotions: 0,
      hasAdvancedReports: false,
      hasCustomQrCode: false,
      hasApiAccess: false,
      hasPrioritySupport: false,
      hasCustomBranding: false
    };

    const proLimits: PlanLimits = {
      maxShops: 3,
      maxQueuesPerDay: 200,
      dataRetentionMonths: 12,
      maxStaff: 5,
      maxSmsPerMonth: 100,
      maxPromotions: 10,
      hasAdvancedReports: true,
      hasCustomQrCode: true,
      hasApiAccess: false,
      hasPrioritySupport: false,
      hasCustomBranding: false
    };

    const enterpriseLimits: PlanLimits = {
      maxShops: null,
      maxQueuesPerDay: null,
      dataRetentionMonths: null,
      maxStaff: null,
      maxSmsPerMonth: null,
      maxPromotions: null,
      hasAdvancedReports: true,
      hasCustomQrCode: true,
      hasApiAccess: true,
      hasPrioritySupport: true,
      hasCustomBranding: true
    };

    return [
      {
        id: 'free',
        type: 'free',
        name: 'ฟรี',
        nameEn: 'Free',
        price: 0,
        currency: 'THB',
        billingPeriod: 'monthly',
        description: 'เหมาะสำหรับร้านเล็กที่เริ่มต้นใช้งาน',
        descriptionEn: 'Perfect for small shops getting started',
        features: [
          'ร้านค้า 1 ร้าน',
          'คิวสูงสุด 50 คิว/วัน',
          'เก็บข้อมูล 1 เดือน',
          'พนักงาน 1 คน',
          'รายงานพื้นฐาน',
          'SMS 10 ข้อความ/เดือน'
        ],
        featuresEn: [
          '1 Shop',
          'Up to 50 queues/day',
          '1 month data retention',
          '1 Staff member',
          'Basic reports',
          '10 SMS/month'
        ],
        limits: freeLimits,
        isPopular: false,
        isRecommended: false,
        buttonText: 'เริ่มใช้ฟรี',
        buttonTextEn: 'Start Free'
      },
      {
        id: 'pro',
        type: 'pro',
        name: 'Pro',
        nameEn: 'Pro',
        price: 20,
        currency: 'THB',
        billingPeriod: 'monthly',
        description: 'เหมาะสำหรับร้านขนาดกลางที่ต้องการฟีเจอร์ครบครัน',
        descriptionEn: 'Perfect for medium-sized shops needing full features',
        features: [
          'ร้านค้า 3 ร้าน',
          'คิวสูงสุด 200 คิว/วัน',
          'เก็บข้อมูล 1 ปี',
          'พนักงาน 5 คน',
          'รายงานขั้นสูง + ส่งออก Excel',
          'SMS 100 ข้อความ/เดือน',
          'QR Code แบบกำหนดเอง',
          'โปรโมชัน 10 รายการ'
        ],
        featuresEn: [
          '3 Shops',
          'Up to 200 queues/day',
          '1 year data retention',
          '5 Staff members',
          'Advanced reports + Excel export',
          '100 SMS/month',
          'Custom QR Code',
          '10 Promotions'
        ],
        limits: proLimits,
        isPopular: true,
        isRecommended: true,
        buttonText: 'เริ่มใช้ Pro',
        buttonTextEn: 'Start Pro'
      },
      {
        id: 'enterprise',
        type: 'enterprise',
        name: 'Enterprise',
        nameEn: 'Enterprise',
        price: 150,
        currency: 'THB',
        billingPeriod: 'monthly',
        description: 'เหมาะสำหรับธุรกิจขนาดใหญ่และเครือข่ายร้านค้า',
        descriptionEn: 'Perfect for large businesses and shop networks',
        features: [
          'ร้านค้าไม่จำกัด',
          'คิวไม่จำกัด',
          'เก็บข้อมูลตลอดชีพ',
          'พนักงานไม่จำกัด',
          'รายงานแบบกำหนดเอง + API',
          'SMS ไม่จำกัด',
          'QR Code แบรนด์ของคุณเอง',
          'โปรโมชันไม่จำกัด',
          'การสนับสนุน 24/7',
          'API Access เต็มรูปแบบ'
        ],
        featuresEn: [
          'Unlimited Shops',
          'Unlimited Queues',
          'Lifetime data retention',
          'Unlimited Staff',
          'Custom reports + API',
          'Unlimited SMS',
          'Custom branded QR Code',
          'Unlimited Promotions',
          '24/7 Priority Support',
          'Full API Access'
        ],
        limits: enterpriseLimits,
        isPopular: false,
        isRecommended: false,
        buttonText: 'ติดต่อเรา',
        buttonTextEn: 'Contact Us'
      }
    ];
  }

  /**
   * Get pricing comparison data
   */
  private getPricingComparison(): PricingComparisonDto {
    return {
      plans: this.getPricingPlans(),
      comparisonFeatures: [
        {
          category: 'การจัดการร้านค้า',
          categoryEn: 'Shop Management',
          features: [
            {
              name: 'จำนวนร้านค้า',
              nameEn: 'Number of Shops',
              free: '1 ร้าน',
              pro: '3 ร้าน',
              enterprise: 'ไม่จำกัด'
            },
            {
              name: 'คิวต่อวัน',
              nameEn: 'Queues per Day',
              free: '50 คิว',
              pro: '200 คิว',
              enterprise: 'ไม่จำกัด'
            },
            {
              name: 'จำนวนพนักงาน',
              nameEn: 'Staff Members',
              free: '1 คน',
              pro: '5 คน',
              enterprise: 'ไม่จำกัด'
            }
          ]
        },
        {
          category: 'ข้อมูลและรายงาน',
          categoryEn: 'Data & Reports',
          features: [
            {
              name: 'เก็บข้อมูล',
              nameEn: 'Data Retention',
              free: '1 เดือน',
              pro: '1 ปี',
              enterprise: 'ตลอดชีพ'
            },
            {
              name: 'รายงานขั้นสูง',
              nameEn: 'Advanced Reports',
              free: false,
              pro: true,
              enterprise: true
            },
            {
              name: 'ส่งออก Excel',
              nameEn: 'Excel Export',
              free: false,
              pro: true,
              enterprise: true
            },
            {
              name: 'API Access',
              nameEn: 'API Access',
              free: false,
              pro: false,
              enterprise: true
            }
          ]
        },
        {
          category: 'การแจ้งเตือนและการสื่อสาร',
          categoryEn: 'Notifications & Communication',
          features: [
            {
              name: 'SMS ต่อเดือน',
              nameEn: 'SMS per Month',
              free: '10 ข้อความ',
              pro: '100 ข้อความ',
              enterprise: 'ไม่จำกัด'
            },
            {
              name: 'QR Code กำหนดเอง',
              nameEn: 'Custom QR Code',
              free: false,
              pro: true,
              enterprise: true
            },
            {
              name: 'แบรนด์ของคุณเอง',
              nameEn: 'Custom Branding',
              free: false,
              pro: false,
              enterprise: true
            }
          ]
        },
        {
          category: 'การสนับสนุน',
          categoryEn: 'Support',
          features: [
            {
              name: 'การสนับสนุนพื้นฐาน',
              nameEn: 'Basic Support',
              free: true,
              pro: true,
              enterprise: true
            },
            {
              name: 'การสนับสนุน 24/7',
              nameEn: '24/7 Priority Support',
              free: false,
              pro: false,
              enterprise: true
            }
          ]
        }
      ]
    };
  }

  /**
   * Generate metadata for the pricing page
   */
  generateMetadata() {
    return {
      title: 'แผนราคา | Shop Queue',
      description: 'เลือกแผนราคาที่เหมาะสมกับธุรกิจของคุณ เริ่มต้นฟรี หรือเลือกแผน Pro และ Enterprise สำหรับฟีเจอร์ครบครัน'
    };
  }
}

export class PricingPresenterFactory {
  static async create(): Promise<PricingPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    return new PricingPresenter(logger);
  }
}
