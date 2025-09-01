import type { ProfileDTO, ProfilesDataDTO, ProfileStatsDTO } from '@/src/application/dtos/backend/profiles-dto';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetProfilesUseCase {
  execute(): Promise<ProfilesDataDTO>;
}

export class GetMockProfilesUseCase implements IGetProfilesUseCase {
  constructor(
    private readonly logger: Logger
  ) { }

  async execute(): Promise<ProfilesDataDTO> {
    try {
      this.logger.info('GetProfilesUseCase: Getting profiles data');

      // Mock data - replace with actual repository calls
      const mockProfiles: ProfileDTO[] = [
        {
          id: '1',
          authId: 'user_1',
          username: 'somchai',
          fullName: 'นาย สมชาย ใสใจ',
          phone: '081-234-5678',
          email: 'somchai@example.com',
          dateOfBirth: '1985-05-15',
          gender: 'male',
          address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110',
          bio: 'นักธุรกิจที่ชื่นชอบการใช้เทคโนโลยีเพื่อความสะดวกสบาย',
          preferences: {
            language: 'th',
            notifications: true,
            theme: 'light'
          },
          socialLinks: {
            facebook: 'https://facebook.com/somchai',
            line: '@somchai123'
          },
          verificationStatus: 'verified',
          privacySettings: {
            showPhone: true,
            showEmail: false,
            showAddress: false
          },
          lastLogin: '2024-01-15T10:30:00Z',
          loginCount: 45,
          isActive: true,
          createdAt: '2023-06-15T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          authId: 'user_2',
          username: 'malee',
          fullName: 'นางสาว มาลี ดีใจ',
          phone: '082-345-6789',
          email: 'malee@example.com',
          dateOfBirth: '1990-08-22',
          gender: 'female',
          address: '456 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
          bio: 'รักการช้อปปิ้งและการใช้บริการที่สะดวกรวดเร็ว',
          preferences: {
            language: 'th',
            notifications: true,
            theme: 'auto'
          },
          socialLinks: {
            instagram: '@malee_shopping',
            line: '@malee456'
          },
          verificationStatus: 'verified',
          privacySettings: {
            showPhone: false,
            showEmail: true,
            showAddress: false
          },
          lastLogin: '2024-01-14T14:15:00Z',
          loginCount: 32,
          isActive: true,
          createdAt: '2023-08-20T00:00:00Z',
          updatedAt: '2024-01-14T14:15:00Z'
        },
        {
          id: '3',
          authId: 'user_3',
          username: 'wichai',
          fullName: 'นาย วิชัย เก่งดี',
          phone: '083-456-7890',
          email: 'wichai@example.com',
          dateOfBirth: '1988-12-10',
          gender: 'male',
          bio: 'ผู้จัดการฝ่ายขายที่ใช้เทคโนโลยีในการทำงาน',
          preferences: {
            language: 'en',
            notifications: false,
            theme: 'dark'
          },
          socialLinks: {
            facebook: 'https://facebook.com/wichai.pro',
            instagram: '@wichai_business'
          },
          verificationStatus: 'verified',
          privacySettings: {
            showPhone: true,
            showEmail: true,
            showAddress: true
          },
          lastLogin: '2024-01-15T09:00:00Z',
          loginCount: 78,
          isActive: true,
          createdAt: '2023-03-10T00:00:00Z',
          updatedAt: '2024-01-15T09:00:00Z'
        },
        {
          id: '4',
          authId: 'user_4',
          username: 'suda',
          fullName: 'นางสาว สุดา จริงใจ',
          phone: '084-567-8901',
          email: 'suda@example.com',
          dateOfBirth: '1992-02-28',
          gender: 'female',
          bio: 'นักศึกษาที่ชอบความสะดวกสบายในการใช้บริการ',
          preferences: {
            language: 'th',
            notifications: true,
            theme: 'light'
          },
          verificationStatus: 'pending',
          privacySettings: {
            showPhone: false,
            showEmail: false,
            showAddress: false
          },
          lastLogin: '2024-01-10T16:20:00Z',
          loginCount: 12,
          isActive: true,
          createdAt: '2023-12-05T00:00:00Z',
          updatedAt: '2024-01-10T16:20:00Z'
        },
        {
          id: '5',
          authId: 'user_5',
          username: 'prayut',
          fullName: 'นาย ประยุทธ มั่นใจ',
          phone: '085-678-9012',
          email: 'prayut@example.com',
          gender: 'male',
          bio: 'ผู้ใช้ใหม่ที่สนใจระบบจัดคิว',
          preferences: {
            language: 'th',
            notifications: true,
            theme: 'auto'
          },
          verificationStatus: 'rejected',
          privacySettings: {
            showPhone: true,
            showEmail: true,
            showAddress: false
          },
          lastLogin: '2024-01-08T11:45:00Z',
          loginCount: 3,
          isActive: false,
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-08T11:45:00Z'
        }
      ];

      const mockStats: ProfileStatsDTO = {
        totalProfiles: 2847,
        verifiedProfiles: 2156,
        pendingVerification: 234,
        activeProfilesToday: 156,
        newProfilesThisMonth: 89,
        profilesByGender: {
          male: 1423,
          female: 1298,
          other: 45,
          notSpecified: 81
        }
      };

      const profilesData: ProfilesDataDTO = {
        profiles: mockProfiles,
        stats: mockStats,
        totalCount: mockProfiles.length,
        currentPage: 1,
        perPage: 10
      };

      this.logger.info('GetProfilesUseCase: Successfully retrieved profiles data');
      return profilesData;
    } catch (error) {
      this.logger.error('GetProfilesUseCase: Error getting profiles data', error);
      throw error;
    }
  }
}
