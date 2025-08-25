import {
  FeatureSectionDto,
  TestimonialDto,
} from '@/src/application/dtos/features-dto';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { FeaturesViewModel } from '../../components/features/FeaturesView';

/**
 * FeaturesPresenter handles business logic for the features page
 * Following SOLID principles and Clean Architecture
 */
export class FeaturesPresenter {
  constructor(private readonly logger: Logger) { }

  /**
   * Get view model for features page
   */
  async getViewModel(): Promise<FeaturesViewModel> {
    try {
      this.logger.info('FeaturesPresenter: Getting features view model');

      const sections = this.getFeatureSections();
      const testimonials = this.getTestimonials();
      const allFeatures = sections.flatMap(section => section.features);
      const popularFeatures = allFeatures.filter(feature => feature.isPopular);

      return {
        sections,
        testimonials,
        totalFeatures: allFeatures.length,
        popularFeatures
      };
    } catch (error) {
      this.logger.error('FeaturesPresenter: Error getting view model', error);
      throw error;
    }
  }

  /**
   * Get feature sections data
   */
  private getFeatureSections(): FeatureSectionDto[] {
    return [
      {
        id: 'queue_management',
        title: 'การจัดการคิวอัจฉริยะ',
        description: 'ระบบจัดการคิวที่ทันสมัยและมีประสิทธิภาพ',
        category: 'queue_management',
        features: [
          {
            id: 'smart_queue',
            title: 'ระบบคิวอัจฉริยะ',
            description: 'จัดการคิวอัตโนมัติด้วย AI',
            longDescription: 'ระบบ AI ช่วยคำนวณเวลารอและจัดลำดับคิวให้เหมาะสมที่สุด ลดเวลารอและเพิ่มความพึงพอใจของลูกค้า',
            icon: 'brain',
            category: 'queue_management',
            benefits: [
              {
                title: 'ลดเวลารอ 40%',
                description: 'AI คำนวณเวลาให้บริการและจัดลำดับคิวอัตโนมัติ',
                icon: 'clock'
              },
              {
                title: 'เพิ่มความพึงพอใจ',
                description: 'ลูกค้าได้รับการบริการที่รวดเร็วและมีประสิทธิภาพ',
                icon: 'heart'
              }
            ],
            isPopular: true,
            isPremium: false
          },
          {
            id: 'qr_code_system',
            title: 'QR Code เข้าคิว',
            description: 'สแกนเข้าคิวง่ายๆ ด้วย QR Code',
            longDescription: 'ลูกค้าสแกน QR Code เพื่อเข้าคิวได้ทันที ไม่ต้องรอในแถว สะดวก รวดเร็ว และปลอดภัย',
            icon: 'qr_code',
            category: 'queue_management',
            benefits: [
              {
                title: 'เข้าคิวทันที',
                description: 'สแกนแล้วได้หมายเลขคิวทันที',
                icon: 'zap'
              },
              {
                title: 'ไม่ต้องรอในแถว',
                description: 'ลูกค้าสามารถทำกิจกรรมอื่นระหว่างรอคิว',
                icon: 'user_check'
              }
            ],
            isPopular: true,
            isPremium: false
          },
          {
            id: 'real_time_updates',
            title: 'อัปเดตแบบเรียลไทม์',
            description: 'ติดตามสถานะคิวแบบเรียลไทม์',
            longDescription: 'ระบบแจ้งเตือนและอัปเดตสถานะคิวแบบเรียลไทม์ ทั้งลูกค้าและเจ้าของร้านสามารถติดตามได้ตลอดเวลา',
            icon: 'refresh',
            category: 'queue_management',
            benefits: [
              {
                title: 'แจ้งเตือนทันที',
                description: 'รับแจ้งเตือนเมื่อใกล้ถึงคิว',
                icon: 'bell'
              },
              {
                title: 'ติดตามได้ตลอดเวลา',
                description: 'ดูสถานะคิวปัจจุบันได้ทุกที่ทุกเวลา',
                icon: 'eye'
              }
            ],
            isPopular: false,
            isPremium: false
          }
        ]
      },
      {
        id: 'analytics',
        title: 'รายงานและการวิเคราะห์',
        description: 'ข้อมูลเชิงลึกเพื่อการตัดสินใจที่ดีขึ้น',
        category: 'analytics',
        features: [
          {
            id: 'advanced_analytics',
            title: 'การวิเคราะห์ขั้นสูง',
            description: 'รายงานและสถิติที่ครบครัน',
            longDescription: 'วิเคราะห์พฤติกรรมลูกค้า ช่วงเวลาที่มีคนมากที่สุด และแนวโน้มการใช้บริการ เพื่อปรับปรุงการดำเนินงาน',
            icon: 'chart_bar',
            category: 'analytics',
            benefits: [
              {
                title: 'เข้าใจลูกค้าดีขึ้น',
                description: 'วิเคราะห์พฤติกรรมและความต้องการของลูกค้า',
                icon: 'users'
              },
              {
                title: 'เพิ่มประสิทธิภาพ',
                description: 'ปรับปรุงการให้บริการจากข้อมูลจริง',
                icon: 'trending_up'
              }
            ],
            isPopular: true,
            isPremium: true
          },
          {
            id: 'revenue_tracking',
            title: 'ติดตามรายได้',
            description: 'จัดการและติดตามรายได้แบบเรียลไทม์',
            longDescription: 'ระบบติดตามรายได้ การชำระเงิน และสถิติทางการเงินแบบเรียลไทม์ พร้อมรายงานที่ละเอียด',
            icon: 'currency_dollar',
            category: 'analytics',
            benefits: [
              {
                title: 'ควบคุมการเงิน',
                description: 'ติดตามรายได้และค่าใช้จ่ายได้แม่นยำ',
                icon: 'calculator'
              },
              {
                title: 'รายงานทางการเงิน',
                description: 'ส่งออกรายงานสำหรับการบัญชี',
                icon: 'document_text'
              }
            ],
            isPopular: false,
            isPremium: true
          }
        ]
      },
      {
        id: 'communication',
        title: 'การสื่อสารและแจ้งเตือน',
        description: 'เชื่อมต่อกับลูกค้าได้อย่างมีประสิทธิภาพ',
        category: 'communication',
        features: [
          {
            id: 'sms_notifications',
            title: 'แจ้งเตือนผ่าน SMS',
            description: 'ส่ง SMS แจ้งเตือนลูกค้าอัตโนมัติ',
            longDescription: 'ระบบส่ง SMS แจ้งเตือนลูกค้าเมื่อใกล้ถึงคิว พร้อมข้อความที่สามารถกำหนดเองได้',
            icon: 'chat_bubble_left_right',
            category: 'communication',
            benefits: [
              {
                title: 'ไม่พลาดคิว',
                description: 'ลูกค้าได้รับแจ้งเตือนก่อนถึงคิว',
                icon: 'exclamation_triangle'
              },
              {
                title: 'ลดการรอคอย',
                description: 'ลูกค้าสามารถเตรียมตัวล่วงหน้า',
                icon: 'clock'
              }
            ],
            isPopular: true,
            isPremium: false
          },
          {
            id: 'custom_messages',
            title: 'ข้อความแนะนำสำเร็จรูป',
            description: 'ข้อความแนะนำที่พร้อมใช้งาน',
            longDescription: 'ข้อความแนะนำสำเร็จรูปสำหรับสถานการณ์ต่างๆ เช่น การขอโทษ การแจ้งข่าวสาร หรือการโปรโมต',
            icon: 'chat_bubble_bottom_center_text',
            category: 'communication',
            benefits: [
              {
                title: 'ประหยัดเวลา',
                description: 'ไม่ต้องพิมพ์ข้อความซ้ำๆ',
                icon: 'lightning_bolt'
              },
              {
                title: 'สื่อสารมืออาชีพ',
                description: 'ข้อความที่เหมาะสมในทุกสถานการณ์',
                icon: 'academic_cap'
              }
            ],
            isPopular: false,
            isPremium: false
          }
        ]
      },
      {
        id: 'business',
        title: 'การจัดการธุรกิจ',
        description: 'เครื่องมือครบครันสำหรับการดำเนินธุรกิจ',
        category: 'business',
        features: [
          {
            id: 'staff_management',
            title: 'จัดการพนักงาน',
            description: 'กำหนดสิทธิ์และบทบาทพนักงาน',
            longDescription: 'ระบบจัดการพนักงานที่ครบครัน กำหนดสิทธิ์การเข้าถึง ติดตามการทำงาน และจัดการกะการทำงาน',
            icon: 'user_group',
            category: 'business',
            benefits: [
              {
                title: 'ควบคุมสิทธิ์',
                description: 'กำหนดสิทธิ์การเข้าถึงแต่ละฟีเจอร์',
                icon: 'shield_check'
              },
              {
                title: 'ติดตามประสิทธิภาพ',
                description: 'วิเคราะห์การทำงานของพนักงาน',
                icon: 'chart_pie'
              }
            ],
            isPopular: false,
            isPremium: true
          },
          {
            id: 'promotions',
            title: 'โปรโมชันและส่วนลด',
            description: 'สร้างโปรโมชันเพื่อดึงดูดลูกค้า',
            longDescription: 'ระบบจัดการโปรโมชันที่หลากหลาย เช่น ส่วนลดตามจำนวน แต้มสะสม หรือโปรโมชันพิเศษ',
            icon: 'gift',
            category: 'business',
            benefits: [
              {
                title: 'เพิ่มยอดขาย',
                description: 'โปรโมชันช่วยดึงดูดลูกค้าใหม่',
                icon: 'arrow_trending_up'
              },
              {
                title: 'สร้างความจงรักภักดี',
                description: 'ระบบแต้มสะสมเพื่อลูกค้าประจำ',
                icon: 'heart'
              }
            ],
            isPopular: true,
            isPremium: true
          }
        ]
      }
    ];
  }

  /**
   * Get testimonials data
   */
  private getTestimonials(): TestimonialDto[] {
    return [
      {
        id: '1',
        name: 'คุณสมชาย ใจดี',
        business: 'ร้านกาแฟดีดี',
        avatar: '/images/testimonials/somchai.jpg',
        rating: 5,
        comment: 'ระบบคิวช่วยให้ร้านกาแฟของเราจัดการลูกค้าได้ดีขึ้นมาก ลูกค้าไม่ต้องยืนรอ และเราสามารถให้บริการได้รวดเร็วขึ้น',
        feature: 'ระบบคิวอัจฉริยะ'
      },
      {
        id: '2',
        name: 'คุณมาลี สวยงาม',
        business: 'คลินิกความงาม มาลี',
        avatar: '/images/testimonials/malee.jpg',
        rating: 5,
        comment: 'การแจ้งเตือนผ่าน SMS ทำให้ลูกค้าไม่พลาดนัดหมาย และเราสามารถจัดการเวลาได้ดีขึ้น รายได้เพิ่มขึ้น 30%',
        feature: 'แจ้งเตือนผ่าน SMS'
      },
      {
        id: '3',
        name: 'คุณวิชัย ขยันทำงาน',
        business: 'ร้านซ่อมรถวิชัย',
        avatar: '/images/testimonials/wichai.jpg',
        rating: 5,
        comment: 'รายงานการวิเคราะห์ช่วยให้เราเข้าใจลูกค้าดีขึ้น สามารถปรับปรุงการให้บริการและเพิ่มประสิทธิภาพได้มาก',
        feature: 'การวิเคราะห์ขั้นสูง'
      }
    ];
  }

  /**
   * Generate metadata for the features page
   */
  generateMetadata() {
    return {
      title: 'ฟีเจอร์ | Shop Queue',
      description: 'ค้นพบฟีเจอร์ครบครันของ Shop Queue ระบบจัดการคิวอัจฉริยะ การวิเคราะห์ขั้นสูง และเครื่องมือธุรกิจที่จะช่วยให้ร้านของคุณเติบโต'
    };
  }
}

export class FeaturesPresenterFactory {
  static async create(): Promise<FeaturesPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    return new FeaturesPresenter(logger);
  }
}
