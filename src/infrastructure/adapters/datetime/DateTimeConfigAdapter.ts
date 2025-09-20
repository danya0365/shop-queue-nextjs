import { IDateTimeConfig } from '../../../domain/repositories/DateTimeRepository';
import { 
  DateTimeConfig, 
  DateTimeFormatType, 
  Locale 
} from '../../../domain/entities/datetime/DateTimeEntities';

export class DateTimeConfigAdapter implements IDateTimeConfig {
  private config: DateTimeConfig;

  constructor(initialConfig?: Partial<DateTimeConfig>) {
    this.config = {
      defaultLocale: Locale.THAI,
      defaultFormatType: DateTimeFormatType.DATETIME,
      timezone: 'Asia/Bangkok',
      customFormats: {
        short: 'dd/MM/yyyy',
        long: 'dd MMMM yyyy HH:mm:ss',
        timeOnly: 'HH:mm',
        dateOnly: 'dd MMMM yyyy'
      },
      ...initialConfig
    };
  }

  getConfig(): DateTimeConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<DateTimeConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
  }

  getDefaultOptions() {
    return {
      type: this.config.defaultFormatType,
      locale: this.config.defaultLocale,
      includeSeconds: false,
      includeTimezone: false
    };
  }

  // Additional methods required by IDateTimeConfigService
  getTimezone(): string {
    return this.config.timezone || 'Asia/Bangkok';
  }

  setTimezone(timezone: string): void {
    this.config.timezone = timezone;
  }

  getLocale(): string {
    return this.config.defaultLocale || 'th-TH';
  }

  setLocale(locale: string): void {
    this.config.defaultLocale = locale as Locale;
  }

  getDateFormat(): string {
    return this.config.customFormats?.dateOnly || 'dd MMMM yyyy';
  }

  setDateFormat(format: string): void {
    if (!this.config.customFormats) {
      this.config.customFormats = {};
    }
    this.config.customFormats.dateOnly = format;
  }

  getTimeFormat(): string {
    return this.config.customFormats?.timeOnly || 'HH:mm';
  }

  setTimeFormat(format: string): void {
    if (!this.config.customFormats) {
      this.config.customFormats = {};
    }
    this.config.customFormats.timeOnly = format;
  }

  getCurrency(): string {
    return 'THB'; // Default currency for Thai locale
  }

  setCurrency(currency: string): void {
    // Currency could be stored in config if needed
    // For now, this is a placeholder implementation
    console.log('Currency set to:', currency);
  }
}
