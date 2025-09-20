import { IDateTimeFormatter, IDateTimeConfig } from '../../../domain/repositories/DateTimeRepository';
import { 
  DateTimeFormatOptions, 
  FormattedDateTime, 
  DateTimeFormatType, 
  Locale 
} from '../../../domain/entities/datetime/DateTimeEntities';
import { InvalidDateError, InvalidFormatError } from '../../../domain/errors/DateTimeError';

export class IntlDateTimeFormatterAdapter implements IDateTimeFormatter {
  private readonly config: IDateTimeConfig;

  constructor(config: IDateTimeConfig) {
    this.config = config;
  }

  format(date: Date | string, options: DateTimeFormatOptions): FormattedDateTime {
    const dateObj = this.parseDate(date);
    const config = this.config.getConfig();
    
    const locale = options.locale || config.defaultLocale;
    const formatType = options.type || config.defaultFormatType;

    let formattedString: string;

    switch (formatType) {
      case DateTimeFormatType.DATE:
        formattedString = this.formatDate(dateObj, locale, options);
        break;
      case DateTimeFormatType.TIME:
        formattedString = this.formatTime(dateObj, locale, options);
        break;
      case DateTimeFormatType.DATETIME:
        formattedString = this.formatDateTime(dateObj, locale, options);
        break;
      case DateTimeFormatType.SHORT:
        formattedString = this.formatShort(dateObj, locale, options);
        break;
      case DateTimeFormatType.LONG:
        formattedString = this.formatLong(dateObj, locale, options);
        break;
      case DateTimeFormatType.RELATIVE:
        formattedString = this.formatRelativeInternal(dateObj);
        break;
      default:
        throw new InvalidFormatError(formatType);
    }

    return {
      value: formattedString,
      timestamp: dateObj,
      formatType: formatType,
      locale: locale
    };
  }

  formatRelative(date: Date | string, referenceDate?: Date): FormattedDateTime {
    const dateObj = this.parseDate(date);
    const referenceObj = referenceDate ? this.parseDate(referenceDate) : new Date();
    const config = this.config.getConfig();

    const rtf = new Intl.RelativeTimeFormat(config.defaultLocale, { numeric: 'auto' });
    const diffInSeconds = Math.floor((dateObj.getTime() - referenceObj.getTime()) / 1000);

    let unit: Intl.RelativeTimeFormatUnit;
    let formattedString: string;

    if (Math.abs(diffInSeconds) < 60) {
      unit = 'second';
      formattedString = rtf.format(diffInSeconds, unit);
    } else if (Math.abs(diffInSeconds) < 3600) {
      unit = 'minute';
      formattedString = rtf.format(Math.floor(diffInSeconds / 60), unit);
    } else if (Math.abs(diffInSeconds) < 86400) {
      unit = 'hour';
      formattedString = rtf.format(Math.floor(diffInSeconds / 3600), unit);
    } else if (Math.abs(diffInSeconds) < 2592000) {
      unit = 'day';
      formattedString = rtf.format(Math.floor(diffInSeconds / 86400), unit);
    } else if (Math.abs(diffInSeconds) < 31536000) {
      unit = 'month';
      formattedString = rtf.format(Math.floor(diffInSeconds / 2592000), unit);
    } else {
      unit = 'year';
      formattedString = rtf.format(Math.floor(diffInSeconds / 31536000), unit);
    }

    return {
      value: formattedString,
      timestamp: dateObj,
      formatType: DateTimeFormatType.RELATIVE,
      locale: config.defaultLocale
    };
  }

  isValidDate(date: Date | string): boolean {
    try {
      const dateObj = this.parseDate(date);
      return !isNaN(dateObj.getTime());
    } catch {
      return false;
    }
  }

  private parseDate(date: Date | string): Date {
    if (date instanceof Date) {
      return new Date(date.getTime());
    }
    
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new InvalidDateError(date);
    }
    
    return parsedDate;
  }

  private formatDate(date: Date, locale: Locale, options: DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: options.includeTimezone ? this.config.getConfig().timezone : undefined
    }).format(date);
  }

  private formatTime(date: Date, locale: Locale, options: DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: options.includeSeconds ? '2-digit' : undefined,
      timeZone: options.includeTimezone ? this.config.getConfig().timezone : undefined
    }).format(date);
  }

  private formatDateTime(date: Date, locale: Locale, options: DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: options.includeSeconds ? '2-digit' : undefined,
      timeZone: options.includeTimezone ? this.config.getConfig().timezone : undefined
    }).format(date);
  }

  private formatShort(date: Date, locale: Locale, options: DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(locale, {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: options.includeTimezone ? this.config.getConfig().timezone : undefined
    }).format(date);
  }

  private formatLong(date: Date, locale: Locale, options: DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: options.includeSeconds ? '2-digit' : undefined,
      weekday: 'long',
      timeZone: options.includeTimezone ? this.config.getConfig().timezone : undefined
    }).format(date);
  }

  private formatRelativeInternal(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
    
    if (Math.abs(diffInSeconds) < 60) {
      return 'เมื่อสักครู่';
    } else if (Math.abs(diffInSeconds) < 3600) {
      const minutes = Math.floor(Math.abs(diffInSeconds) / 60);
      return diffInSeconds < 0 ? `${minutes} นาทีที่แล้ว` : `อีก ${minutes} นาที`;
    } else if (Math.abs(diffInSeconds) < 86400) {
      const hours = Math.floor(Math.abs(diffInSeconds) / 3600);
      return diffInSeconds < 0 ? `${hours} ชั่วโมงที่แล้ว` : `อีก ${hours} ชั่วโมง`;
    } else if (Math.abs(diffInSeconds) < 2592000) {
      const days = Math.floor(Math.abs(diffInSeconds) / 86400);
      return diffInSeconds < 0 ? `${days} วันที่แล้ว` : `อีก ${days} วัน`;
    } else {
      return this.formatDateTime(date, Locale.THAI, { type: DateTimeFormatType.DATETIME });
    }
  }
}
