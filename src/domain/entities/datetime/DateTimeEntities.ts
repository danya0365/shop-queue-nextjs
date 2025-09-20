export enum DateTimeFormatType {
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  RELATIVE = 'relative',
  SHORT = 'short',
  LONG = 'long'
}

export enum Locale {
  THAI = 'th-TH',
  ENGLISH = 'en-US'
}

export interface DateTimeFormatOptions {
  type: DateTimeFormatType;
  locale?: Locale;
  includeSeconds?: boolean;
  includeTimezone?: boolean;
  customFormat?: string;
}

export interface DateTimeConfig {
  defaultLocale: Locale;
  defaultFormatType: DateTimeFormatType;
  timezone: string;
  customFormats: Record<string, string>;
}

export interface FormattedDateTime {
  value: string;
  timestamp: Date;
  formatType: DateTimeFormatType;
  locale: Locale;
}

export interface IDateTimeFormatter {
  format(date: Date | string, options: DateTimeFormatOptions): FormattedDateTime;
  formatRelative(date: Date | string, referenceDate?: Date): FormattedDateTime;
  isValidDate(date: Date | string): boolean;
}

export interface IDateTimeConfig {
  getConfig(): DateTimeConfig;
  updateConfig(config: Partial<DateTimeConfig>): void;
  getDefaultOptions(): DateTimeFormatOptions;
}
