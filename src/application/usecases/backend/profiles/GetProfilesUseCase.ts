import type { ProfileDTO, ProfilesDataDTO, ProfileStatsDTO } from '@/src/application/dtos/backend/ProfilesDTO';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetProfilesUseCase {
  execute(): Promise<ProfilesDataDTO>;
}

export class GetProfilesUseCase implements IGetProfilesUseCase {
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
          user_id: 'user_1',
          name: 'นาย สมชาย ใสใจ',
          phone: '081-234-5678',
          email: 'somchai@example.com',
          date_of_birth: '1985-05-15',
          gender: 'male',
          address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110',
          bio: 'นักธุรกิจที่ชื่นชอบการใช้เทคโนโลยีเพื่อความสะดวกสบาย',
          preferences: {
            language: 'th',
            notifications: true,
            theme: 'light'
          },
          social_links: {
            facebook: 'https://facebook.com/somchai',
            line: '@somchai123'
          },
          verification_status: 'verified',
          privacy_settings: {
            show_phone: true,
            show_email: false,
            show_address: false
          },
          last_login: '2024-01-15T10:30:00Z',
          login_count: 45,
          is_active: true,
          created_at: '2023-06-15T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          user_id: 'user_2',
          name: 'นางสาว มาลี ดีใจ',
          phone: '082-345-6789',
          email: 'malee@example.com',
          date_of_birth: '1990-08-22',
          gender: 'female',
          address: '456 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
          bio: 'รักการช้อปปิ้งและการใช้บริการที่สะดวกรวดเร็ว',
          preferences: {
            language: 'th',
            notifications: true,
            theme: 'auto'
          },
          social_links: {
            instagram: '@malee_shopping',
            line: '@malee456'
          },
          verification_status: 'verified',
          privacy_settings: {
            show_phone: false,
            show_email: true,
            show_address: false
          },
          last_login: '2024-01-14T14:15:00Z',
          login_count: 32,
          is_active: true,
          created_at: '2023-08-20T00:00:00Z',
          updated_at: '2024-01-14T14:15:00Z'
        },
        {
          id: '3',
          user_id: 'user_3',
          name: 'นาย วิชัย เก่งดี',
          phone: '083-456-7890',
          email: 'wichai@example.com',
          date_of_birth: '1988-12-10',
          gender: 'male',
          bio: 'ผู้จัดการฝ่ายขายที่ใช้เทคโนโลยีในการทำงาน',
          preferences: {
            language: 'en',
            notifications: false,
            theme: 'dark'
          },
          social_links: {
            facebook: 'https://facebook.com/wichai.pro',
            instagram: '@wichai_business'
          },
          verification_status: 'verified',
          privacy_settings: {
            show_phone: true,
            show_email: true,
            show_address: true
          },
          last_login: '2024-01-15T09:00:00Z',
          login_count: 78,
          is_active: true,
          created_at: '2023-03-10T00:00:00Z',
          updated_at: '2024-01-15T09:00:00Z'
        },
        {
          id: '4',
          user_id: 'user_4',
          name: 'นางสาว สุดา จริงใจ',
          phone: '084-567-8901',
          email: 'suda@example.com',
          date_of_birth: '1992-02-28',
          gender: 'female',
          bio: 'นักศึกษาที่ชอบความสะดวกสบายในการใช้บริการ',
          preferences: {
            language: 'th',
            notifications: true,
            theme: 'light'
          },
          verification_status: 'pending',
          privacy_settings: {
            show_phone: false,
            show_email: false,
            show_address: false
          },
          last_login: '2024-01-10T16:20:00Z',
          login_count: 12,
          is_active: true,
          created_at: '2023-12-05T00:00:00Z',
          updated_at: '2024-01-10T16:20:00Z'
        },
        {
          id: '5',
          user_id: 'user_5',
          name: 'นาย ประยุทธ มั่นใจ',
          phone: '085-678-9012',
          email: 'prayut@example.com',
          gender: 'male',
          bio: 'ผู้ใช้ใหม่ที่สนใจระบบจัดคิว',
          preferences: {
            language: 'th',
            notifications: true,
            theme: 'auto'
          },
          verification_status: 'rejected',
          privacy_settings: {
            show_phone: true,
            show_email: true,
            show_address: false
          },
          last_login: '2024-01-08T11:45:00Z',
          login_count: 3,
          is_active: false,
          created_at: '2024-01-05T00:00:00Z',
          updated_at: '2024-01-08T11:45:00Z'
        }
      ];

      const mockStats: ProfileStatsDTO = {
        total_profiles: 2847,
        verified_profiles: 2156,
        pending_verification: 234,
        active_profiles_today: 156,
        new_profiles_this_month: 89,
        profiles_by_gender: {
          male: 1423,
          female: 1298,
          other: 45,
          not_specified: 81
        }
      };

      const profilesData: ProfilesDataDTO = {
        profiles: mockProfiles,
        stats: mockStats,
        total_count: mockProfiles.length,
        current_page: 1,
        per_page: 10
      };

      this.logger.info('GetProfilesUseCase: Successfully retrieved profiles data');
      return profilesData;
    } catch (error) {
      this.logger.error('GetProfilesUseCase: Error getting profiles data', error);
      throw error;
    }
  }
}
