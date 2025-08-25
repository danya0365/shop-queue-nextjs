import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define FAQ interface
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Define help section interface
export interface HelpSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}

// Define ViewModel interface
export interface HelpViewModel {
  faqs: FAQ[];
  helpSections: HelpSection[];
  contactInfo: {
    email: string;
    phone: string;
    hours: string;
  };
}

// Main Presenter class
export class HelpPresenter {
  constructor(private readonly logger: Logger) {}

  async getViewModel(): Promise<HelpViewModel> {
    try {
      this.logger.info('HelpPresenter: Getting view model');
      
      const faqs = this.getFAQs();
      const helpSections = this.getHelpSections();
      const contactInfo = this.getContactInfo();
      
      return {
        faqs,
        helpSections,
        contactInfo,
      };
    } catch (error) {
      this.logger.error('HelpPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getFAQs(): FAQ[] {
    return [
      {
        id: '1',
        question: 'ระบบคิวร้านค้าคืออะไร?',
        answer: 'ระบบคิวร้านค้าเป็นแพลตฟอร์มที่ช่วยให้ลูกค้าสามารถจองคิวออนไลน์ได้ โดยไม่ต้องมาต่อแถวที่ร้าน ลูกค้าสามารถติดตามสถานะคิวแบบเรียลไทม์และรับการแจ้งเตือนเมื่อถึงคิวของตน',
        category: 'ทั่วไป'
      },
      {
        id: '2',
        question: 'วิธีการจองคิวออนไลน์?',
        answer: '1. สมัครสมาชิกหรือเข้าสู่ระบบ\n2. เลือกร้านค้าที่ต้องการ\n3. เลือกประเภทบริการ\n4. เลือกวันและเวลาที่สะดวก\n5. ยืนยันการจองคิว\n6. รับหมายเลขคิวและติดตามสถานะ',
        category: 'การใช้งาน'
      },
      {
        id: '3',
        question: 'สามารถยกเลิกคิวได้หรือไม่?',
        answer: 'สามารถยกเลิกคิวได้ก่อนเวลานัดหมาย 30 นาที โดยเข้าไปที่หน้าคิวของฉันและกดปุ่มยกเลิก หากยกเลิกหลังจากเวลาที่กำหนดอาจมีค่าปรับตามนโยบายของร้านค้า',
        category: 'การใช้งาน'
      },
      {
        id: '4',
        question: 'จะรู้ได้อย่างไรว่าถึงคิวแล้ว?',
        answer: 'ระบบจะส่งการแจ้งเตือนผ่านหลายช่องทาง:\n- แจ้งเตือนผ่านแอป\n- SMS\n- อีเมล\n- Line Notify (หากเชื่อมต่อ)\nนอกจากนี้สามารถติดตามสถานะคิวแบบเรียลไทม์ในแอปได้',
        category: 'การแจ้งเตือน'
      },
      {
        id: '5',
        question: 'ค่าใช้จ่ายในการใช้บริการ?',
        answer: 'สำหรับลูกค้า: ใช้บริการฟรี ไม่มีค่าใช้จ่าย\nสำหรับร้านค้า: มีแพ็กเกจต่างๆ เริ่มต้น 299 บาท/เดือน รวมคุณสมบัติครบครัน',
        category: 'ราคา'
      },
      {
        id: '6',
        question: 'ร้านค้าสามารถปรับแต่งระบบคิวได้หรือไม่?',
        answer: 'ได้ครับ ร้านค้าสามารถ:\n- กำหนดประเภทบริการ\n- ตั้งเวลาทำการ\n- จำกัดจำนวนคิวต่อช่วงเวลา\n- ปรับแต่งข้อความแจ้งเตือน\n- ตั้งค่าการยกเลิกคิว\n- เพิ่มข้อมูลร้านและรูปภาพ',
        category: 'ร้านค้า'
      }
    ];
  }

  private getHelpSections(): HelpSection[] {
    return [
      {
        id: '1',
        title: 'การเริ่มต้นใช้งาน',
        description: 'เรียนรู้วิธีการสมัครสมาชิก เข้าสู่ระบบ และการตั้งค่าบัญชีผู้ใช้',
        icon: '🚀',
        link: '/help/getting-started'
      },
      {
        id: '2',
        title: 'การจองคิว',
        description: 'คู่มือการจองคิวออนไลน์ การเลือกเวลา และการติดตามสถานะ',
        icon: '📅',
        link: '/help/booking'
      },
      {
        id: '3',
        title: 'การจัดการคิว',
        description: 'วิธีการดู แก้ไข ยกเลิก และจัดการคิวของคุณ',
        icon: '⚙️',
        link: '/help/queue-management'
      },
      {
        id: '4',
        title: 'การแจ้งเตือน',
        description: 'ตั้งค่าการแจ้งเตือนผ่าน SMS, อีเมล และแอปพลิเคชัน',
        icon: '🔔',
        link: '/help/notifications'
      },
      {
        id: '5',
        title: 'สำหรับร้านค้า',
        description: 'คู่มือการใช้งานสำหรับเจ้าของร้านค้าและผู้ดูแลระบบ',
        icon: '🏪',
        link: '/help/business'
      },
      {
        id: '6',
        title: 'แก้ไขปัญหา',
        description: 'วิธีแก้ไขปัญหาที่พบบ่อยและการติดต่อฝ่ายสนับสนุน',
        icon: '🛠️',
        link: '/help/troubleshooting'
      }
    ];
  }

  private getContactInfo() {
    return {
      email: 'support@shopqueue.com',
      phone: '02-123-4567',
      hours: 'จันทร์-ศุกร์ 9:00-18:00 น.'
    };
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'ศูนย์ช่วยเหลือ | Shop Queue',
      description: 'ศูนย์ช่วยเหลือและคำถามที่พบบ่อยสำหรับระบบคิวร้านค้าออนไลน์ Shop Queue',
    };
  }
}

// Factory class
export class HelpPresenterFactory {
  static async create(): Promise<HelpPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new HelpPresenter(logger);
  }
}
