import type { Metadata } from "next";

export interface LandingViewModel {
  title: string;
  description: string;
  features: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  stats: {
    id: string;
    value: string;
    label: string;
  }[];
}

export interface ILandingPresenter {
  getViewModel(): Promise<LandingViewModel>;
  generateMetadata(): Promise<Metadata>;
}

export class LandingPresenter implements ILandingPresenter {
  async getViewModel(): Promise<LandingViewModel> {
    return {
      title: "Shop Queue",
      description: "ระบบจัดการคิวร้านค้าออนไลน์ที่ช่วยให้ลูกค้าจองคิวได้ง่ายๆ และเจ้าของร้านจัดการคิวได้อย่างมีประสิทธิภาพ",
      features: [
        {
          id: "1",
          title: "จองคิวออนไลน์",
          description: "ลูกค้าสามารถจองคิวล่วงหน้าผ่านระบบออนไลน์ ไม่ต้องมารอที่ร้าน",
          icon: "📱"
        },
        {
          id: "2", 
          title: "จัดการคิวอัตโนมัติ",
          description: "ระบบจัดการคิวอัตโนมัติ แจ้งเตือนเมื่อถึงคิว ลดเวลารอคอย",
          icon: "⏰"
        },
        {
          id: "3",
          title: "ติดตามสถานะ",
          description: "ติดตามสถานะคิวแบบเรียลไทม์ รู้ว่าเหลือคิวอีกกี่คน",
          icon: "📊"
        },
        {
          id: "4",
          title: "รายงานและสถิติ",
          description: "ดูรายงานและสถิติการใช้งาน วิเคราะห์ข้อมูลเพื่อปรับปรุงบริการ",
          icon: "📈"
        }
      ],
      stats: [
        {
          id: "1",
          value: "1000+",
          label: "ร้านค้าที่ใช้งาน"
        },
        {
          id: "2", 
          value: "50,000+",
          label: "ลูกค้าที่จองคิว"
        },
        {
          id: "3",
          value: "95%",
          label: "ความพึงพอใจ"
        },
        {
          id: "4",
          value: "24/7",
          label: "บริการตลอดเวลา"
        }
      ]
    };
  }

  async generateMetadata(): Promise<Metadata> {
    return {
      title: "Shop Queue - ระบบจัดการคิวร้านค้า",
      description: "ระบบจัดการคิวร้านค้าออนไลน์ ช่วยให้ลูกค้าจองคิวง่ายๆ และเจ้าของร้านจัดการคิวได้อย่างมีประสิทธิภาพ",
      keywords: [
        "shop queue",
        "queue management", 
        "queue system",
        "ระบบคิวร้านค้า",
        "จองคิวออนไลน์",
        "จัดการคิวร้านค้า",
        "queue app"
      ],
      openGraph: {
        title: "Shop Queue - ระบบจัดการคิวร้านค้า",
        description: "ระบบจัดการคิวร้านค้าออนไลน์ ช่วยให้ลูกค้าจองคิวง่ายๆ และเจ้าของร้านจัดการคิวได้อย่างมีประสิทธิภาพ",
        type: "website"
      }
    };
  }
}
