import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'owner' | 'staff' | 'customer';
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface QueueDemo {
  currentQueue: QueueItem[];
  stats: {
    totalToday: number;
    averageWaitTime: string;
    currentlyServing: number;
  };
}

export interface QueueItem {
  id: string;
  number: number;
  customerName: string;
  status: 'waiting' | 'confirmed' | 'served' | 'canceled';
  estimatedTime: string;
  priority: boolean;
}

export interface LandingViewModel {
  features: Feature[];
  stats: Stat[];
  benefits: Benefit[];
  queueDemo: QueueDemo;
}

export class LandingPresenter {
  constructor(private readonly logger: Logger) { }

  async getViewModel(): Promise<LandingViewModel> {
    try {
      this.logger.info('Generating landing page data');

      const features = this.getFeatures();
      const stats = this.getStats();
      const benefits = this.getBenefits();
      const queueDemo = this.getQueueDemo();

      return {
        features,
        stats,
        benefits,
        queueDemo,
      };
    } catch (error) {
      this.logger.error('Error generating landing page data', { error });
      throw error;
    }
  }

  private getFeatures(): Feature[] {
    return [
      // เจ้าของร้าน
      {
        id: 'shop-management',
        title: 'จัดการร้านค้า',
        description: 'สร้างและจัดการข้อมูลร้านค้า รวมถึงชื่อ ที่อยู่ และคำอธิบาย',
        icon: '🏪',
        category: 'owner',
      },
      {
        id: 'qr-code',
        title: 'QR Code สำหรับร้าน',
        description: 'ระบบสร้าง QR Code ให้ลูกค้าสแกนเพื่อเข้าคิว',
        icon: '📱',
        category: 'owner',
      },
      {
        id: 'realtime-dashboard',
        title: 'แดชบอร์ดแบบเรียลไทม์',
        description: 'ติดตามสถานะคิวและการให้บริการแบบเรียลไทม์',
        icon: '📊',
        category: 'owner',
      },
      {
        id: 'staff-management',
        title: 'จัดการพนักงาน',
        description: 'กำหนดสิทธิ์และบทบาทให้พนักงานในร้าน',
        icon: '👥',
        category: 'owner',
      },
      // พนักงาน
      {
        id: 'queue-management',
        title: 'จัดการคิว',
        description: 'เรียกคิว อัปเดตสถานะ และบันทึกข้อมูลการให้บริการ',
        icon: '📋',
        category: 'staff',
      },
      {
        id: 'payment-tracking',
        title: 'บันทึกการชำระเงิน',
        description: 'จัดการข้อมูลการชำระเงินของลูกค้า',
        icon: '💳',
        category: 'staff',
      },
      // ลูกค้า
      {
        id: 'online-booking',
        title: 'จองคิวออนไลน์',
        description: 'จองคิวล่วงหน้าหรือเข้าคิวผ่านการสแกน QR Code',
        icon: '📲',
        category: 'customer',
      },
      {
        id: 'queue-tracking',
        title: 'ติดตามสถานะคิว',
        description: 'ดูสถานะคิวและเวลารอโดยประมาณ',
        icon: '⏱️',
        category: 'customer',
      },
      {
        id: 'notifications',
        title: 'รับการแจ้งเตือน',
        description: 'รับแจ้งเตือนเมื่อใกล้ถึงคิว',
        icon: '🔔',
        category: 'customer',
      },
    ];
  }

  private getStats(): Stat[] {
    return [
      {
        id: 'shops',
        label: 'ร้านค้าที่ใช้บริการ',
        value: '500+',
        description: 'ร้านค้าทั่วประเทศไทย',
        icon: '🏪',
      },
      {
        id: 'customers',
        label: 'ลูกค้าที่ใช้บริการ',
        value: '50,000+',
        description: 'ลูกค้าที่ประหยัดเวลารอคอย',
        icon: '👥',
      },
      {
        id: 'queues',
        label: 'คิวที่จัดการแล้ว',
        value: '1M+',
        description: 'คิวที่ผ่านระบบของเรา',
        icon: '📊',
      },
      {
        id: 'time-saved',
        label: 'เวลาที่ประหยัดได้',
        value: '10,000+',
        description: 'ชั่วโมงที่ลูกค้าประหยัดได้',
        icon: '⏰',
      },
    ];
  }

  private getBenefits(): Benefit[] {
    return [
      {
        id: 'reduce-wait-time',
        title: 'ลดเวลารอคอย',
        description: 'ลูกค้าไม่จำเป็นต้องยืนรอในแถว สามารถทำกิจกรรมอื่นระหว่างรอคิว',
        icon: '⏱️',
      },
      {
        id: 'increase-efficiency',
        title: 'เพิ่มประสิทธิภาพ',
        description: 'ร้านค้าสามารถจัดการลูกค้าได้อย่างมีระบบและมีประสิทธิภาพมากขึ้น',
        icon: '📈',
      },
      {
        id: 'data-insights',
        title: 'ข้อมูลเชิงลึก',
        description: 'เก็บข้อมูลการใช้บริการเพื่อวิเคราะห์และปรับปรุงธุรกิจ',
        icon: '📊',
      },
      {
        id: 'customer-satisfaction',
        title: 'สร้างความประทับใจ',
        description: 'เพิ่มความพึงพอใจของลูกค้าด้วยระบบที่ทันสมัย',
        icon: '⭐',
      },
      {
        id: 'reduce-errors',
        title: 'ลดความผิดพลาด',
        description: 'ลดความผิดพลาดจากการจัดการคิวด้วยมือ',
        icon: '✅',
      },
      {
        id: 'cost-effective',
        title: 'ประหยัดค่าใช้จ่าย',
        description: 'ลดต้นทุนในการจัดการคิวและเพิ่มรายได้จากการบริการที่ดีขึ้น',
        icon: '💰',
      },
    ];
  }

  private getQueueDemo(): QueueDemo {
    return {
      currentQueue: [
        {
          id: '1',
          number: 1,
          customerName: 'คุณสมชาย',
          status: 'served',
          estimatedTime: 'กำลังให้บริการ',
          priority: false,
        },
        {
          id: '2',
          number: 2,
          customerName: 'คุณสมหญิง',
          status: 'confirmed',
          estimatedTime: '5 นาที',
          priority: true,
        },
        {
          id: '3',
          number: 3,
          customerName: 'คุณประชา',
          status: 'confirmed',
          estimatedTime: '10 นาที',
          priority: false,
        },
        {
          id: '4',
          number: 4,
          customerName: 'คุณมาลี',
          status: 'waiting',
          estimatedTime: '15 นาที',
          priority: false,
        },
        {
          id: '5',
          number: 5,
          customerName: 'คุณสมศักดิ์',
          status: 'waiting',
          estimatedTime: '20 นาที',
          priority: false,
        },
      ],
      stats: {
        totalToday: 47,
        averageWaitTime: '12 นาที',
        currentlyServing: 1,
      },
    };
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'Shop Queue - ระบบจัดการคิวร้านค้าอัจฉริยะ | Shop Queue',
      description: 'ระบบจัดการคิวสำหรับร้านค้าและธุรกิจขนาดเล็กถึงขนาดกลาง ช่วยให้ร้านค้าสามารถจัดการลูกค้าได้อย่างมีประสิทธิภาพ ลดความแออัด และเพิ่มความพึงพอใจของลูกค้า',
    };
  }
}

// Factory class
export class LandingPresenterFactory {
  static async create(): Promise<LandingPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new LandingPresenter(logger);
  }
}
