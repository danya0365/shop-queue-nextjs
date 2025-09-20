import { DateTimeConfigAdapter } from "../../infrastructure/adapters/datetime/DateTimeConfigAdapter";

export interface IDateTimeConfigService {
  getTimezone(): string;
  getLocale(): string;
  getDateFormat(): string;
  getTimeFormat(): string;
  getCurrency(): string;
  setTimezone(timezone: string): void;
  setLocale(locale: string): void;
  setDateFormat(format: string): void;
  setTimeFormat(format: string): void;
  setCurrency(currency: string): void;
  getConfig(): {
    timezone: string;
    locale: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
  };
}

export class DateTimeConfigService implements IDateTimeConfigService {
  private configAdapter: DateTimeConfigAdapter;

  constructor() {
    this.configAdapter = new DateTimeConfigAdapter();
  }

  getTimezone(): string {
    return this.configAdapter.getTimezone();
  }

  getLocale(): string {
    return this.configAdapter.getLocale();
  }

  getDateFormat(): string {
    return this.configAdapter.getDateFormat();
  }

  getTimeFormat(): string {
    return this.configAdapter.getTimeFormat();
  }

  getCurrency(): string {
    return this.configAdapter.getCurrency();
  }

  setTimezone(timezone: string): void {
    this.configAdapter.setTimezone(timezone);
  }

  setLocale(locale: string): void {
    this.configAdapter.setLocale(locale);
  }

  setDateFormat(format: string): void {
    this.configAdapter.setDateFormat(format);
  }

  setTimeFormat(format: string): void {
    this.configAdapter.setTimeFormat(format);
  }

  setCurrency(currency: string): void {
    this.configAdapter.setCurrency(currency);
  }

  getConfig() {
    const config = this.configAdapter.getConfig();
    return {
      timezone: config.timezone || 'Asia/Bangkok',
      locale: config.defaultLocale || 'th-TH',
      dateFormat: config.customFormats?.dateOnly || 'dd MMMM yyyy',
      timeFormat: config.customFormats?.timeOnly || 'HH:mm',
      currency: 'THB'
    };
  }
}
