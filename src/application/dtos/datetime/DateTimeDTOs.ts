import { DateTimeFormatType, Locale, DateTimeFormatOptions, DateTimeConfig } from '../../../domain/entities/datetime/DateTimeEntities';

export class FormatDateTimeInputDTO {
  constructor(
    public readonly date: Date | string,
    public readonly options?: Partial<DateTimeFormatOptions>
  ) {}
}

export class FormatRelativeDateTimeInputDTO {
  constructor(
    public readonly date: Date | string,
    public readonly referenceDate?: Date
  ) {}
}

export class FormattedDateTimeOutputDTO {
  constructor(
    public readonly formattedString: string,
    public readonly timestamp: Date,
    public readonly formatType: DateTimeFormatType,
    public readonly locale: Locale
  ) {}
}

export class DateTimeConfigOutputDTO {
  constructor(
    public readonly defaultLocale: Locale,
    public readonly defaultFormatType: DateTimeFormatType,
    public readonly timezone: string,
    public readonly customFormats: Record<string, string>
  ) {}
}

export class UpdateDateTimeConfigInputDTO {
  constructor(
    public readonly defaultLocale?: Locale,
    public readonly defaultFormatType?: DateTimeFormatType,
    public readonly timezone?: string,
    public readonly customFormats?: Record<string, string>
  ) {}
}
