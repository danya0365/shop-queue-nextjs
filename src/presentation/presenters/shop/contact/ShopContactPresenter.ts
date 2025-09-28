import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseSubscriptionPresenter } from "@/src/presentation/presenters/base/BaseSubscriptionPresenter";

// Define interfaces and types for contact page
export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  website: string;
  businessHours: {
    weekdays: string;
    weekends: string;
    holidays: string;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface ContactMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  available: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: string;
}

export interface ShopContactViewModel {
  contactInfo: ContactInfo;
  contactMethods: ContactMethod[];
  faqs: FAQ[];
  categories: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

/**
 * Presenter for Shop Contact page
 * Follows Clean Architecture with proper separation of concerns
 */
export class ShopContactPresenter extends BaseSubscriptionPresenter {
  constructor(
    logger: Logger,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService
  ) {
    super(logger, authService, profileService, subscriptionService);
  }

  /**
   * Get view model for the contact page
   */
  async getViewModel(): Promise<ShopContactViewModel> {
    try {
      this.logger.info("ShopContactPresenter: Getting view model");

      const contactInfo: ContactInfo = {
        address: "123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110",
        phone: "+66 2 123 4567",
        email: "contact@shopqueue.co.th",
        website: "https://shopqueue.co.th",
        businessHours: {
          weekdays: "จันทร์ - ศุกร์: 09:00 - 18:00 น.",
          weekends: "เสาร์ - อาทิตย์: 10:00 - 16:00 น.",
          holidays: "วันหยุดนักขัตฤกษ์: ปิดทำการ",
        },
        socialMedia: {
          facebook: "https://facebook.com/shopqueue",
          twitter: "https://twitter.com/shopqueue",
          instagram: "https://instagram.com/shopqueue",
          linkedin: "https://linkedin.com/company/shopqueue",
          youtube: "https://youtube.com/@shopqueue",
        },
      };

      const contactMethods: ContactMethod[] = [
        {
          id: "phone",
          title: "โทรศัพท์",
          description: "ติดต่อทีมสนับสนุนโดยตรง",
          icon: "📞",
          action: "tel:+6621234567",
          available: true,
        },
        {
          id: "email",
          title: "อีเมล",
          description: "ส่งข้อความถึงเรา",
          icon: "📧",
          action: "mailto:contact@shopqueue.co.th",
          available: true,
        },
        {
          id: "chat",
          title: "แชทสด",
          description: "พูดคุยกับเราแบบเรียลไทม์",
          icon: "💬",
          action: "#chat",
          available: true,
        },
        {
          id: "line",
          title: "LINE Official",
          description: "ติดต่อผ่าน LINE",
          icon: "💚",
          action: "https://line.me/R/ti/p/@shopqueue",
          available: true,
        },
      ];

      const faqs: FAQ[] = [
        {
          id: "1",
          question: "Shop Queue คืออะไร?",
          answer:
            "Shop Queue เป็นแพลตฟอร์มจัดการคิวร้านค้าที่ช่วยให้ธุรกิจสามารถจัดการลูกค้าได้อย่างมีประสิทธิภาพ และลูกค้าสามารถจองคิวล่วงหน้าได้",
          category: "ทั่วไป",
        },
        {
          id: "2",
          question: "การใช้งานมีค่าใช้จ่ายหรือไม่?",
          answer:
            "เรามีแพ็กเกจที่หลากหลาย เริ่มตั้งแต่แพ็กเกจฟรีสำหรับร้านค้าขนาดเล็ก ไปจนถึงแพ็กเกจระดับองค์กรสำหรับธุรกิจขนาดใหญ่",
          category: "ราคา",
        },
        {
          id: "3",
          question: "สามารถทดลองใช้ฟรีได้หรือไม่?",
          answer:
            "ได้ครับ เรามีช่วงทดลองใช้ฟรี 30 วัน พร้อมฟีเจอร์ครบครันทุกอย่าง ไม่มีข้อจำกัด",
          category: "ทดลองใช้",
        },
        {
          id: "4",
          question: "รองรับร้านค้าประเภทไหนบ้าง?",
          answer:
            "รองรับร้านค้าทุกประเภท เช่น ร้านอาหาร คลินิก ร้านเสื้อผ้า ร้านตัดผม สปา และอื่นๆ อีกมากมาย",
          category: "ทั่วไป",
        },
        {
          id: "5",
          question: "มีการสนับสนุนลูกค้าอย่างไร?",
          answer:
            "เรามีทีมสนับสนุนลูกค้า 24/7 ผ่านโทรศัพท์ อีเมล แชทสด และ LINE Official Account",
          category: "สนับสนุน",
        },
        {
          id: "6",
          question: "ข้อมูลปลอดภัยหรือไม่?",
          answer:
            "ข้อมูลของคุณปลอดภัยด้วยระบบเข้ารหัส SSL และเก็บข้อมูลบนเซิร์ฟเวอร์ที่ได้มาตรฐานสากล",
          category: "ความปลอดภัย",
        },
      ];

      const categories = [
        {
          id: "general",
          name: "คำถามทั่วไป",
          description: "คำถามเกี่ยวกับการใช้งานทั่วไป",
        },
        {
          id: "technical",
          name: "ปัญหาทางเทคนิค",
          description: "ปัญหาการใช้งานระบบ",
        },
        {
          id: "billing",
          name: "การเรียกเก็บเงิน",
          description: "คำถามเกี่ยวกับค่าบริการ",
        },
        {
          id: "feature",
          name: "ขอฟีเจอร์ใหม่",
          description: "เสนอแนะฟีเจอร์ใหม่",
        },
        {
          id: "partnership",
          name: "ความร่วมมือ",
          description: "ข้อเสนอความร่วมมือทางธุรกิจ",
        },
        {
          id: "other",
          name: "อื่นๆ",
          description: "เรื่องอื่นๆ ที่ไม่อยู่ในหมวดหมู่ข้างต้น",
        },
      ];

      return {
        contactInfo,
        contactMethods,
        faqs,
        categories,
      };
    } catch (error: any) {
      this.logger.error("ShopContactPresenter: Error getting view model", {
        error,
      });

      // Return minimal data on error
      return {
        contactInfo: {
          address: "กรุงเทพมหานคร, ประเทศไทย",
          phone: "+66 2 123 4567",
          email: "contact@shopqueue.co.th",
          website: "https://shopqueue.co.th",
          businessHours: {
            weekdays: "จันทร์ - ศุกร์: 09:00 - 18:00 น.",
            weekends: "เสาร์ - อาทิตย์: 10:00 - 16:00 น.",
            holidays: "วันหยุดนักขัตฤกษ์: ปิดทำการ",
          },
          socialMedia: {},
        },
        contactMethods: [],
        faqs: [],
        categories: [],
      };
    }
  }

  /**
   * Submit contact form
   */
  async submitContactForm(
    formData: ContactFormData
  ): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.info("ShopContactPresenter: Submitting contact form", {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        category: formData.category,
      });

      // In a real implementation, this would send to an email service or save to database
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      return {
        success: true,
        message:
          "ข้อความของคุณถูกส่งเรียบร้อยแล้ว เราจะติดต่อกลับภายใน 24 ชั่วโมง",
      };
    } catch (error: any) {
      this.logger.error("ShopContactPresenter: Error submitting contact form", {
        error,
      });
      return {
        success: false,
        message: "เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง",
      };
    }
  }

  /**
   * Get FAQs by category
   */
  async getFAQsByCategory(category?: string): Promise<FAQ[]> {
    try {
      this.logger.info("ShopContactPresenter: Getting FAQs by category", {
        category,
      });

      const viewModel = await this.getViewModel();

      if (!category || category === "all") {
        return viewModel.faqs;
      }

      return viewModel.faqs.filter((faq) => faq.category === category);
    } catch (error: any) {
      this.logger.error(
        "ShopContactPresenter: Error getting FAQs by category",
        { error }
      );
      return [];
    }
  }
}

/**
 * Factory for creating ShopContactPresenter instances
 */
export class ShopContactPresenterFactory {
  static async create(): Promise<ShopContactPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");

    return new ShopContactPresenter(
      logger,
      authService,
      profileService,
      subscriptionService
    );
  }
}

/**
 * Factory for creating client-side ShopContactPresenter instances
 */
export class ClientShopContactPresenterFactory {
  static create(): ShopContactPresenter {
    const clientContainer = getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");

    return new ShopContactPresenter(
      logger,
      authService,
      profileService,
      subscriptionService
    );
  }
}
