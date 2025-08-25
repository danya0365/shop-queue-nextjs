import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

/**
 * Contact information interface
 */
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  businessHours: {
    weekdays: string;
    weekends: string;
  };
  socialMedia: {
    facebook?: string;
    line?: string;
    instagram?: string;
  };
}

/**
 * Contact form field interface
 */
export interface ContactFormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

/**
 * FAQ item interface
 */
export interface ContactFAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'billing' | 'features';
}

/**
 * ViewModel for Contact page
 */
export interface ContactViewModel {
  contactInfo: ContactInfo;
  formFields: ContactFormField[];
  faqs: ContactFAQ[];
  supportChannels: {
    id: string;
    name: string;
    description: string;
    icon: string;
    available: boolean;
    responseTime: string;
  }[];
}

/**
 * ContactPresenter handles business logic for the contact page
 * Following SOLID principles and Clean Architecture
 */
export class ContactPresenter {
  constructor(private readonly logger: Logger) {}

  /**
   * Get view model for contact page
   */
  async getViewModel(): Promise<ContactViewModel> {
    try {
      this.logger.info('ContactPresenter: Getting contact view model');

      const contactInfo = this.getContactInfo();
      const formFields = this.getContactFormFields();
      const faqs = this.getContactFAQs();
      const supportChannels = this.getSupportChannels();

      return {
        contactInfo,
        formFields,
        faqs,
        supportChannels,
      };
    } catch (error) {
      this.logger.error('ContactPresenter: Error getting view model', error);
      throw error;
    }
  }

  /**
   * Get contact information
   */
  private getContactInfo(): ContactInfo {
    return {
      phone: '02-123-4567',
      email: 'support@shopqueue.co.th',
      address: '123/45 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110',
      businessHours: {
        weekdays: 'จันทร์ - ศุกร์: 09:00 - 18:00 น.',
        weekends: 'เสาร์ - อาทิตย์: 10:00 - 16:00 น.',
      },
      socialMedia: {
        facebook: 'https://facebook.com/shopqueue',
        line: '@shopqueue',
        instagram: '@shopqueue_th',
      },
    };
  }

  /**
   * Get contact form fields
   */
  private getContactFormFields(): ContactFormField[] {
    return [
      {
        id: 'name',
        label: 'ชื่อ-นามสกุล',
        type: 'text',
        placeholder: 'กรุณากรอกชื่อ-นามสกุล',
        required: true,
      },
      {
        id: 'email',
        label: 'อีเมล',
        type: 'email',
        placeholder: 'example@email.com',
        required: true,
      },
      {
        id: 'phone',
        label: 'เบอร์โทรศัพท์',
        type: 'tel',
        placeholder: '08X-XXX-XXXX',
        required: false,
      },
      {
        id: 'business_type',
        label: 'ประเภทธุรกิจ',
        type: 'select',
        placeholder: 'เลือกประเภทธุรกิจ',
        required: true,
        options: [
          { value: 'restaurant', label: 'ร้านอาหาร/เครื่องดื่ม' },
          { value: 'clinic', label: 'คลินิก/โรงพยาบาล' },
          { value: 'salon', label: 'ร้านเสริมสวย/สปา' },
          { value: 'service', label: 'ธุรกิจบริการ' },
          { value: 'retail', label: 'ร้านค้าปลีก' },
          { value: 'other', label: 'อื่นๆ' },
        ],
      },
      {
        id: 'subject',
        label: 'หัวข้อ',
        type: 'select',
        placeholder: 'เลือกหัวข้อที่ต้องการสอบถาม',
        required: true,
        options: [
          { value: 'general', label: 'สอบถามทั่วไป' },
          { value: 'pricing', label: 'สอบถามราคา' },
          { value: 'demo', label: 'ขอดูการสาธิต' },
          { value: 'technical', label: 'ปัญหาทางเทคนิค' },
          { value: 'billing', label: 'เรื่องการเรียกเก็บเงิน' },
          { value: 'partnership', label: 'ความร่วมมือทางธุรกิจ' },
        ],
      },
      {
        id: 'message',
        label: 'ข้อความ',
        type: 'textarea',
        placeholder: 'กรุณาระบุรายละเอียดที่ต้องการสอบถาม...',
        required: true,
      },
    ];
  }

  /**
   * Get contact FAQs
   */
  private getContactFAQs(): ContactFAQ[] {
    return [
      {
        id: '1',
        question: 'ติดต่อฝ่ายสนับสนุนได้อย่างไร?',
        answer: 'สามารถติดต่อได้ผ่านอีเมล support@shopqueue.co.th โทรศัพท์ 02-123-4567 หรือแชท Live Chat ในระบบ',
        category: 'general',
      },
      {
        id: '2',
        question: 'เวลาทำการของฝ่ายสนับสนุนคือเมื่อไร?',
        answer: 'จันทร์-ศุกร์ 09:00-18:00 น. และเสาร์-อาทิตย์ 10:00-16:00 น. สำหรับปัญหาเร่งด่วนมี Live Chat 24/7',
        category: 'general',
      },
      {
        id: '3',
        question: 'ใช้เวลานานแค่ไหนในการตอบกลับ?',
        answer: 'อีเมลและแบบฟอร์มติดต่อ: ภายใน 24 ชั่วโมง, โทรศัพท์: ทันที, Live Chat: ภายใน 5 นาที',
        category: 'general',
      },
      {
        id: '4',
        question: 'สามารถขอดูการสาธิตได้หรือไม่?',
        answer: 'ได้ครับ สามารถจองเวลาดูการสาธิตแบบ 1:1 ผ่านทีมขายหรือทดลองใช้ฟรี 14 วันได้เลย',
        category: 'general',
      },
      {
        id: '5',
        question: 'มีการฝึกอบรมการใช้งานหรือไม่?',
        answer: 'มีครับ ทั้งการฝึกอบรมออนไลน์ฟรี วิดีโอสอนใช้งาน และการสนับสนุนแบบ 1:1 สำหรับลูกค้าใหม่',
        category: 'technical',
      },
      {
        id: '6',
        question: 'หากมีปัญหาเร่งด่วนติดต่ออย่างไร?',
        answer: 'สำหรับปัญหาเร่งด่วนให้ใช้ Live Chat ในระบบ หรือโทร 02-123-4567 กด 1 เพื่อติดต่อฝ่ายเทคนิค',
        category: 'technical',
      },
    ];
  }

  /**
   * Get support channels
   */
  private getSupportChannels() {
    return [
      {
        id: 'phone',
        name: 'โทรศัพท์',
        description: 'ติดต่อโดยตรงกับทีมสนับสนุน',
        icon: 'phone',
        available: true,
        responseTime: 'ทันที',
      },
      {
        id: 'email',
        name: 'อีเมล',
        description: 'ส่งคำถามและรับคำตอบที่ละเอียด',
        icon: 'envelope',
        available: true,
        responseTime: 'ภายใน 24 ชม.',
      },
      {
        id: 'chat',
        name: 'Live Chat',
        description: 'แชทสดกับทีมสนับสนุน',
        icon: 'chat',
        available: true,
        responseTime: 'ภายใน 5 นาที',
      },
      {
        id: 'line',
        name: 'LINE Official',
        description: 'ติดต่อผ่าน LINE @shopqueue',
        icon: 'message',
        available: true,
        responseTime: 'ภายใน 30 นาที',
      },
    ];
  }

  /**
   * Generate metadata for the contact page
   */
  generateMetadata() {
    return {
      title: 'ติดต่อเรา | Shop Queue',
      description: 'ติดต่อทีมงาน Shop Queue สำหรับการสนับสนุน คำถาม หรือขอข้อมูลเพิ่มเติม พร้อมให้บริการทุกวัน',
    };
  }
}

export class ContactPresenterFactory {
  static async create(): Promise<ContactPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new ContactPresenter(logger);
  }
}
