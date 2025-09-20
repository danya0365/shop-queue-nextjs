import { IDateTimeFormattingService } from '../../application/services/DateTimeFormattingService';
import { DateTimeFormatType, Locale } from '../../domain/entities/datetime/DateTimeEntities';

export const formatDateTimeHelper = async (
  service: IDateTimeFormattingService,
  date: Date | string,
  options?: {
    formatType?: DateTimeFormatType;
    locale?: Locale;
    includeSeconds?: boolean;
    includeTimezone?: boolean;
  }
): Promise<string> => {
  try {
    const result = await service.formatDateTime(date, options);
    return result.formattedString;
  } catch (error) {
    console.error('Failed to format date time:', error);
    return '-';
  }
};

export const formatRelativeDateTimeHelper = async (
  service: IDateTimeFormattingService,
  date: Date | string,
  referenceDate?: Date
): Promise<string> => {
  try {
    const result = await service.formatRelativeDateTime(date, referenceDate);
    return result.formattedString;
  } catch (error) {
    console.error('Failed to format relative date time:', error);
    return '-';
  }
};

export const createDateTimeFormatter = (service: IDateTimeFormattingService) => {
  return {
    format: (date: Date | string, options?: Parameters<typeof formatDateTimeHelper>[2]) => 
      formatDateTimeHelper(service, date, options),
    
    formatRelative: (date: Date | string, referenceDate?: Date) => 
      formatRelativeDateTimeHelper(service, date, referenceDate),
    
    formatDateTime: (date: Date | string, options?: Parameters<typeof formatDateTimeHelper>[2]) => 
      formatDateTimeHelper(service, date, options),
    
    formatRelativeDateTime: (date: Date | string, referenceDate?: Date) => 
      formatRelativeDateTimeHelper(service, date, referenceDate),
  };
};
