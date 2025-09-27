import type { Logger } from "@/src/domain/interfaces/logger";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { BaseSubscriptionPresenter } from "@/src/presentation/presenters/base/BaseSubscriptionPresenter";
import { getServerContainer } from "@/src/di/server-container";
import { getClientContainer } from "@/src/di/client-container";

// Define interfaces and types for about page
export interface CompanyInfo {
  name: string;
  description: string;
  mission: string;
  vision: string;
  founded: string;
  location: string;
  employees: string;
  website: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface CompanyStats {
  totalShops: number;
  totalCustomers: number;
  totalQueues: number;
  yearsOfService: number;
}

export interface ShopAboutViewModel {
  companyInfo: CompanyInfo;
  teamMembers: TeamMember[];
  companyValues: CompanyValue[];
  stats: CompanyStats;
  achievements: string[];
  timeline: Array<{
    year: string;
    title: string;
    description: string;
  }>;
}

/**
 * Presenter for Shop About page
 * Follows Clean Architecture with proper separation of concerns
 */
export class ShopAboutPresenter extends BaseSubscriptionPresenter {
  constructor(
    logger: Logger,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService
  ) {
    super(logger, authService, profileService, subscriptionService);
  }

  /**
   * Get view model for the about page
   */
  async getViewModel(): Promise<ShopAboutViewModel> {
    try {
      this.logger.info("ShopAboutPresenter: Getting view model");

      // Use mock data for demonstration
      const companyInfo: CompanyInfo = {
        name: "Shop Queue",
        description: "แพลตฟอร์มจัดการคิวร้านค้าที่ทันสมัย ช่วยให้ธุรกิจของคุณเติบโตและลูกค้าได้รับประสบการณ์ที่ดีที่สุด",
        mission: "เราตั้งใจที่จะปฏิวัติวิธีการจัดการคิวในร้านค้า ด้วยเทคโนโลยีที่ใช้งานง่ายและมีประสิทธิภาพ",
        vision: "เป็นแพลตฟอร์มจัดการคิวอันดับ 1 ในประเทศไทย ที่ช่วยให้ธุรกิจทุกขนาดสามารถให้บริการลูกค้าได้อย่างมีประสิทธิภาพ",
        founded: "2024",
        location: "กรุงเทพมหานคร, ประเทศไทย",
        employees: "50+",
        website: "https://shopqueue.co.th"
      };

      const teamMembers: TeamMember[] = [
        {
          id: "1",
          name: "นายสมชาย ใจดี",
          position: "Chief Executive Officer",
          description: "ผู้นำทีมที่มีประสบการณ์กว่า 15 ปีในด้านเทคโนโลジีและธุรกิจ",
          image: "/images/team/ceo.jpg",
          social: {
            linkedin: "https://linkedin.com/in/somchai",
            twitter: "https://twitter.com/somchai"
          }
        },
        {
          id: "2",
          name: "นางสาวสุดา เก่งมาก",
          position: "Chief Technology Officer",
          description: "ผู้เชี่ยวชาญด้านเทคโนโลยีที่มีประสบการณ์ในการพัฒนาระบบขนาดใหญ่",
          image: "/images/team/cto.jpg",
          social: {
            linkedin: "https://linkedin.com/in/suda",
            github: "https://github.com/suda"
          }
        },
        {
          id: "3",
          name: "นายวิชัย นักคิด",
          position: "Head of Product",
          description: "ผู้เชี่ยวชาญด้าน UX/UI ที่มุ่งมั่นสร้างประสบการณ์ที่ดีที่สุดให้ผู้ใช้",
          image: "/images/team/product.jpg",
          social: {
            linkedin: "https://linkedin.com/in/wichai"
          }
        }
      ];

      const companyValues: CompanyValue[] = [
        {
          id: "1",
          title: "ใช้งานง่าย",
          description: "เราออกแบบระบบให้ใช้งานง่าย เข้าใจได้ทันที ไม่ซับซ้อน",
          icon: "🎯"
        },
        {
          id: "2",
          title: "เชื่อถือได้",
          description: "ระบบมีความเสถียรสูง พร้อมให้บริการ 24/7 ตลอดเวลา",
          icon: "🛡️"
        },
        {
          id: "3",
          title: "นวัตกรรม",
          description: "เราพัฒนาเทคโนโลยีใหม่ๆ อย่างต่อเนื่องเพื่อตอบโจทย์ธุรกิจ",
          icon: "💡"
        },
        {
          id: "4",
          title: "ใส่ใจลูกค้า",
          description: "เราให้ความสำคัญกับความต้องการของลูกค้าเป็นอันดับแรก",
          icon: "❤️"
        }
      ];

      const stats: CompanyStats = {
        totalShops: 1250,
        totalCustomers: 45000,
        totalQueues: 125000,
        yearsOfService: 1
      };

      const achievements = [
        "รางวัลสตาร์ทอัพยอดเยี่ยมแห่งปี 2024",
        "รางวัลนวัตกรรมเทคโนโลยีดีเด่น",
        "ได้รับการลงทุนจากกองทุน Venture Capital ชั้นนำ",
        "มีผู้ใช้งานกว่า 45,000 คนทั่วประเทศ"
      ];

      const timeline = [
        {
          year: "2024",
          title: "ก่อตั้งบริษัท",
          description: "เริ่มต้นด้วยทีมเล็กๆ และความฝันใหญ่ในการปฏิวัติระบบจัดการคิว"
        },
        {
          year: "2024 Q2",
          title: "เปิดตัว MVP",
          description: "เปิดตัวเวอร์ชันแรกของแพลตฟอร์ม Shop Queue"
        },
        {
          year: "2024 Q3",
          title: "ขยายทีม",
          description: "เพิ่มทีมพัฒนาและทีมขายเพื่อรองรับการเติบโต"
        },
        {
          year: "2024 Q4",
          title: "ขยายฟีเจอร์",
          description: "เพิ่มฟีเจอร์ใหม่ๆ ตามความต้องการของลูกค้า"
        }
      ];

      return {
        companyInfo,
        teamMembers,
        companyValues,
        stats,
        achievements,
        timeline
      };
    } catch (error: any) {
      this.logger.error("ShopAboutPresenter: Error getting view model", { error });
      
      // Return minimal data on error
      return {
        companyInfo: {
          name: "Shop Queue",
          description: "แพลตฟอร์มจัดการคิวร้านค้าที่ทันสมัย",
          mission: "ปฏิวัติการจัดการคิวด้วยเทคโนโลยี",
          vision: "เป็นแพลตฟอร์มจัดการคิวอันดับ 1",
          founded: "2024",
          location: "กรุงเทพมหานคร",
          employees: "50+",
          website: "https://shopqueue.co.th"
        },
        teamMembers: [],
        companyValues: [],
        stats: {
          totalShops: 0,
          totalCustomers: 0,
          totalQueues: 0,
          yearsOfService: 1
        },
        achievements: [],
        timeline: []
      };
    }
  }

  /**
   * Get company statistics
   */
  async getCompanyStats(): Promise<CompanyStats> {
    try {
      this.logger.info("ShopAboutPresenter: Getting company stats");

      // In a real implementation, this would fetch from analytics service
      return {
        totalShops: 1250,
        totalCustomers: 45000,
        totalQueues: 125000,
        yearsOfService: 1
      };
    } catch (error: any) {
      this.logger.error("ShopAboutPresenter: Error getting company stats", { error });
      return {
        totalShops: 0,
        totalCustomers: 0,
        totalQueues: 0,
        yearsOfService: 1
      };
    }
  }

  /**
   * Get team members
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      this.logger.info("ShopAboutPresenter: Getting team members");

      const viewModel = await this.getViewModel();
      return viewModel.teamMembers;
    } catch (error: any) {
      this.logger.error("ShopAboutPresenter: Error getting team members", { error });
      return [];
    }
  }
}

/**
 * Factory for creating ShopAboutPresenter instances
 */
export class ShopAboutPresenterFactory {
  static async create(): Promise<ShopAboutPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService = serverContainer.resolve<IProfileService>("ProfileService");

    return new ShopAboutPresenter(
      logger,
      authService,
      profileService,
      subscriptionService
    );
  }
}

/**
 * Factory for creating client-side ShopAboutPresenter instances
 */
export class ClientShopAboutPresenterFactory {
  static async create(): Promise<ShopAboutPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService = clientContainer.resolve<IProfileService>("ProfileService");

    return new ShopAboutPresenter(
      logger,
      authService,
      profileService,
      subscriptionService
    );
  }
}
