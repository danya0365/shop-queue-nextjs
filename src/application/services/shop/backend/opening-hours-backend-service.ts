import { CreateOpeningHourData, OpeningHour, UpdateOpeningHourData } from '@/src/application/dtos/shop/backend/shop-opening-hour-dto';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IOpeningHoursBackendService {
  getOpeningHours(shopId: string): Promise<OpeningHour[]>;
  getOpeningHourById(shopId: string, hourId: string): Promise<OpeningHour | null>;
  createOpeningHour(shopId: string, data: CreateOpeningHourData): Promise<OpeningHour>;
  updateOpeningHour(shopId: string, hourId: string, data: UpdateOpeningHourData): Promise<OpeningHour>;
  deleteOpeningHour(shopId: string, hourId: string): Promise<boolean>;
  bulkUpdateOpeningHours(shopId: string, hours: UpdateOpeningHourData[]): Promise<OpeningHour[]>;
  getWeeklySchedule(shopId: string): Promise<Record<string, OpeningHour>>;
}

export class OpeningHoursBackendService implements IOpeningHoursBackendService {
  constructor(private readonly logger: Logger) { }

  async getOpeningHours(shopId: string): Promise<OpeningHour[]> {
    this.logger.info('OpeningHoursBackendService: Getting opening hours', { shopId });

    // Mock data for all days of the week
    const mockOpeningHours: OpeningHour[] = [
      {
        id: '1',
        shopId,
        dayOfWeek: 'monday',
        isOpen: true,
        openTime: '09:00',
        closeTime: '18:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        shopId,
        dayOfWeek: 'tuesday',
        isOpen: true,
        openTime: '09:00',
        closeTime: '18:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '3',
        shopId,
        dayOfWeek: 'wednesday',
        isOpen: true,
        openTime: '09:00',
        closeTime: '18:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '4',
        shopId,
        dayOfWeek: 'thursday',
        isOpen: true,
        openTime: '09:00',
        closeTime: '18:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '5',
        shopId,
        dayOfWeek: 'friday',
        isOpen: true,
        openTime: '09:00',
        closeTime: '18:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '6',
        shopId,
        dayOfWeek: 'saturday',
        isOpen: true,
        openTime: '10:00',
        closeTime: '17:00',
        breakStart: null,
        breakEnd: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '7',
        shopId,
        dayOfWeek: 'sunday',
        isOpen: false,
        openTime: null,
        closeTime: null,
        breakStart: null,
        breakEnd: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    return mockOpeningHours;
  }

  async getOpeningHourById(shopId: string, hourId: string): Promise<OpeningHour | null> {
    this.logger.info('OpeningHoursBackendService: Getting opening hour by ID', { shopId, hourId });

    const hours = await this.getOpeningHours(shopId);
    return hours.find(hour => hour.id === hourId) || null;
  }

  async createOpeningHour(shopId: string, data: CreateOpeningHourData): Promise<OpeningHour> {
    this.logger.info('OpeningHoursBackendService: Creating opening hour', { shopId, data });

    const newHour: OpeningHour = {
      id: Date.now().toString(),
      shopId,
      dayOfWeek: data.dayOfWeek,
      isOpen: data.isOpen,
      openTime: data.openTime || null,
      closeTime: data.closeTime || null,
      breakStart: data.breakStart || null,
      breakEnd: data.breakEnd || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newHour;
  }

  async updateOpeningHour(shopId: string, hourId: string, data: UpdateOpeningHourData): Promise<OpeningHour> {
    this.logger.info('OpeningHoursBackendService: Updating opening hour', { shopId, hourId, data });

    const existingHour = await this.getOpeningHourById(shopId, hourId);
    if (!existingHour) {
      throw new Error(`Opening hour with ID ${hourId} not found`);
    }

    const updatedHour: OpeningHour = {
      ...existingHour,
      isOpen: data.isOpen !== undefined ? data.isOpen : existingHour.isOpen,
      openTime: data.openTime !== undefined ? data.openTime || null : existingHour.openTime,
      closeTime: data.closeTime !== undefined ? data.closeTime || null : existingHour.closeTime,
      breakStart: data.breakStart !== undefined ? data.breakStart || null : existingHour.breakStart,
      breakEnd: data.breakEnd !== undefined ? data.breakEnd || null : existingHour.breakEnd,
      updatedAt: new Date(),
    };

    return updatedHour;
  }

  async deleteOpeningHour(shopId: string, hourId: string): Promise<boolean> {
    this.logger.info('OpeningHoursBackendService: Deleting opening hour', { shopId, hourId });

    const existingHour = await this.getOpeningHourById(shopId, hourId);
    if (!existingHour) {
      return false;
    }

    // In real implementation, delete from database
    return true;
  }

  async bulkUpdateOpeningHours(shopId: string, hours: UpdateOpeningHourData[]): Promise<OpeningHour[]> {
    this.logger.info('OpeningHoursBackendService: Bulk updating opening hours', { shopId, count: hours.length });

    // Mock implementation - in real app, this would be a batch update
    const updatedHours: OpeningHour[] = [];

    for (let i = 0; i < hours.length; i++) {
      const hourData = hours[i];
      const hourId = (i + 1).toString(); // Mock ID mapping

      try {
        const updatedHour = await this.updateOpeningHour(shopId, hourId, hourData);
        updatedHours.push(updatedHour);
      } catch (error) {
        this.logger.error('Error updating opening hour in bulk', { shopId, hourId, error });
      }
    }

    return updatedHours;
  }

  async getWeeklySchedule(shopId: string): Promise<Record<string, OpeningHour>> {
    this.logger.info('OpeningHoursBackendService: Getting weekly schedule', { shopId });

    const hours = await this.getOpeningHours(shopId);
    const schedule: Record<string, OpeningHour> = {};

    hours.forEach(hour => {
      schedule[hour.dayOfWeek] = hour;
    });

    return schedule;
  }
}
