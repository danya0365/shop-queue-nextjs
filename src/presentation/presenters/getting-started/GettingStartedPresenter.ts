import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for tutorial steps
export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

export interface TutorialSection {
  title: string;
  description: string;
  steps: TutorialStep[];
}

// Define ViewModel interface
export interface GettingStartedViewModel {
  sections: TutorialSection[];
  quickStart: TutorialStep[];
  tips: string[];
}

// Main Presenter class
export class GettingStartedPresenter {
  constructor(private readonly logger: Logger) {}

  async getViewModel(): Promise<GettingStartedViewModel> {
    try {
      this.logger.info('GettingStartedPresenter: Getting view model');
      
      const sections = this.getTutorialSections();
      const quickStart = this.getQuickStartSteps();
      const tips = this.getUsefulTips();
      
      return {
        sections,
        quickStart,
        tips
      };
    } catch (error) {
      this.logger.error('GettingStartedPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getTutorialSections(): TutorialSection[] {
    return [
      {
        title: 'การเริ่มต้นใช้งาน',
        description: 'ขั้นตอนพื้นฐานในการตั้งค่าและใช้งานระบบจัดการคิวร้านค้า',
        steps: [
          {
            id: 1,
            title: 'สมัครสมาชิกและตั้งค่าร้านค้า',
            description: 'สร้างบัญชีและกำหนดข้อมูลพื้นฐานของร้านค้า',
            icon: '🏪',
            details: [
              'สมัครสมาชิกด้วยอีเมลหรือ Google Account',
              'กรอกข้อมูลร้านค้า เช่น ชื่อร้าน ที่อยู่ เบอร์โทร',
              'ตั้งค่าเวลาทำการและวันหยุด',
              'อัปโหลดโลโก้และรูปภาพร้านค้า'
            ]
          },
          {
            id: 2,
            title: 'สร้างบริการและกำหนดราคา',
            description: 'เพิ่มบริการที่ร้านค้าให้บริการและกำหนดราคา',
            icon: '💼',
            details: [
              'เพิ่มรายการบริการ เช่น ตัดผม สระผม',
              'กำหนดราคาและระยะเวลาของแต่ละบริการ',
              'จัดหมวดหมู่บริการสำหรับง่ายต่อการค้นหา',
              'ตั้งค่าบริการพิเศษและโปรโมชั่น'
            ]
          },
          {
            id: 3,
            title: 'เปิดใช้งานระบบคิว',
            description: 'เริ่มรับคิวจากลูกค้าและจัดการคิว',
            icon: '🎯',
            details: [
              'เปิดสถานะร้านค้าเป็น "เปิดรับคิว"',
              'แชร์ QR Code หรือลิงก์ให้ลูกค้าจองคิว',
              'ติดตั้งแอปพลิเคชันบนมือถือสำหรับจัดการคิว',
              'ทดสอบระบบด้วยการสร้างคิวทดลอง'
            ]
          }
        ]
      },
      {
        title: 'การจัดการคิวประจำวัน',
        description: 'วิธีการใช้งานระบบในแต่ละวันเพื่อให้บริการลูกค้าอย่างมีประสิทธิภาพ',
        steps: [
          {
            id: 4,
            title: 'เปิดร้านและรับคิว',
            description: 'ขั้นตอนการเปิดร้านและเริ่มรับคิวในแต่ละวัน',
            icon: '🌅',
            details: [
              'เปิดแอปพลิเคชันและเข้าสู่ระบบ',
              'ตรวจสอบตารางนัดหมายของวันนั้น',
              'เปิดสถานะร้าน "เปิดรับคิว"',
              'ตรวจสอบอุปกรณ์และเครื่องมือที่จำเป็น'
            ]
          },
          {
            id: 5,
            title: 'จัดการคิวและให้บริการ',
            description: 'การเรียกคิว ให้บริการ และอัปเดตสถานะ',
            icon: '👥',
            details: [
              'เรียกลูกค้าตามลำดับคิว',
              'อัปเดตสถานะเป็น "กำลังให้บริการ"',
              'บันทึกบริการที่ให้และเวลาที่ใช้',
              'เสร็จสิ้นคิวและเรียกคิวถัดไป'
            ]
          },
          {
            id: 6,
            title: 'ปิดร้านและสรุปยอด',
            description: 'ขั้นตอนการปิดร้านและดูสรุปผลการดำเนินงาน',
            icon: '🌙',
            details: [
              'ปิดสถานะ "หยุดรับคิวใหม่"',
              'ให้บริการคิวที่เหลืออยู่จนหมด',
              'ดูสรุปยอดขายและจำนวนลูกค้า',
              'ปิดแอปพลิเคชันและเก็บอุปกรณ์'
            ]
          }
        ]
      }
    ];
  }

  private getQuickStartSteps(): TutorialStep[] {
    return [
      {
        id: 1,
        title: 'สมัครสมาชิก',
        description: 'สร้างบัญชีใหม่',
        icon: '📝',
        details: ['คลิก "สมัครสมาชิก"', 'กรอกข้อมูลพื้นฐาน', 'ยืนยันอีเมล']
      },
      {
        id: 2,
        title: 'ตั้งค่าร้านค้า',
        description: 'เพิ่มข้อมูลร้านค้า',
        icon: '⚙️',
        details: ['กรอกชื่อร้าน', 'เพิ่มที่อยู่', 'ตั้งเวลาทำการ']
      },
      {
        id: 3,
        title: 'เพิ่มบริการ',
        description: 'สร้างรายการบริการ',
        icon: '➕',
        details: ['คลิก "เพิ่มบริการ"', 'กำหนดชื่อและราคา', 'บันทึกข้อมูล']
      },
      {
        id: 4,
        title: 'เริ่มรับคิว',
        description: 'เปิดใช้งานระบบ',
        icon: '🚀',
        details: ['เปิดสถานะร้าน', 'แชร์ QR Code', 'รอรับคิวแรก']
      }
    ];
  }

  private getUsefulTips(): string[] {
    return [
      'ตั้งเวลาทำการให้ตรงกับความเป็นจริงเพื่อลูกค้าจะได้ทราบเวลาที่ถูกต้อง',
      'อัปเดตสถานะคิวให้เป็นปัจจุบันเสมอเพื่อลูกค้าจะได้ทราบคิวของตนเอง',
      'ใช้ฟีเจอร์แจ้งเตือนเพื่อแจ้งลูกค้าเมื่อถึงคิวของพวกเขา',
      'ตรวจสอบรีวิวและความคิดเห็นจากลูกค้าเป็นประจำ',
      'ใช้ข้อมูลสถิติเพื่อปรับปรุงการให้บริการ',
      'เก็บข้อมูลลูกค้าประจำเพื่อให้บริการที่ดีขึ้น'
    ];
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'คู่มือการใช้งาน | Shop Queue',
      description: 'เรียนรู้วิธีการใช้งานระบบจัดการคิวร้านค้าอย่างละเอียด พร้อมคำแนะนำทีละขั้นตอน',
      keywords: 'คู่มือใช้งาน, ระบบคิว, จัดการร้านค้า, tutorial, getting started',
    };
  }
}

// Factory class
export class GettingStartedPresenterFactory {
  static async create(): Promise<GettingStartedPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new GettingStartedPresenter(logger);
  }
}
