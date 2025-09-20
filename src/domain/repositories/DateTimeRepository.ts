import { DateTimeFormatOptions, DateTimeConfig, FormattedDateTime } from '../entities/datetime/DateTimeEntities';

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

export interface IDateTimeRepository {
  getConfig(): Promise<DateTimeConfig>;
  saveConfig(config: DateTimeConfig): Promise<void>;
}
