import { IDateTimeFormatter, IDateTimeConfig } from '../../../domain/repositories/DateTimeRepository';
import { 
  FormatDateTimeInputDTO, 
  FormattedDateTimeOutputDTO, 
  FormatRelativeDateTimeInputDTO,
  DateTimeConfigOutputDTO,
  UpdateDateTimeConfigInputDTO
} from '../../dtos/datetime/DateTimeDTOs';
import { InvalidDateError } from '../../../domain/errors/DateTimeError';
import { DateTimeFormatOptions, DateTimeConfig, FormattedDateTime } from '../../../domain/entities/datetime/DateTimeEntities';

export class FormatDateTimeUseCase {
  constructor(
    private readonly dateTimeFormatter: IDateTimeFormatter,
    private readonly dateTimeConfig: IDateTimeConfig
  ) {}

  async execute(input: FormatDateTimeInputDTO): Promise<FormattedDateTimeOutputDTO> {
    try {
      const defaultOptions = this.dateTimeConfig.getDefaultOptions();
      const options: DateTimeFormatOptions = {
        ...defaultOptions,
        ...input.options
      };

      if (!this.dateTimeFormatter.isValidDate(input.date)) {
        throw new InvalidDateError(input.date);
      }

      const formattedDateTime = this.dateTimeFormatter.format(input.date, options);
      
      return new FormattedDateTimeOutputDTO(
        formattedDateTime.value,
        formattedDateTime.timestamp,
        formattedDateTime.formatType,
        formattedDateTime.locale
      );
    } catch (error) {
      if (error instanceof InvalidDateError) {
        throw error;
      }
      throw new Error(`Failed to format date time: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export class FormatRelativeDateTimeUseCase {
  constructor(
    private readonly dateTimeFormatter: IDateTimeFormatter
  ) {}

  async execute(input: FormatRelativeDateTimeInputDTO): Promise<FormattedDateTimeOutputDTO> {
    try {
      if (!this.dateTimeFormatter.isValidDate(input.date)) {
        throw new InvalidDateError(input.date);
      }

      if (input.referenceDate && !this.dateTimeFormatter.isValidDate(input.referenceDate)) {
        throw new InvalidDateError(input.referenceDate);
      }

      const formattedDateTime = this.dateTimeFormatter.formatRelative(input.date, input.referenceDate);
      
      return new FormattedDateTimeOutputDTO(
        formattedDateTime.value,
        formattedDateTime.timestamp,
        formattedDateTime.formatType,
        formattedDateTime.locale
      );
    } catch (error) {
      if (error instanceof InvalidDateError) {
        throw error;
      }
      throw new Error(`Failed to format relative date time: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export class GetDateTimeConfigUseCase {
  constructor(
    private readonly dateTimeConfig: IDateTimeConfig
  ) {}

  async execute(): Promise<DateTimeConfigOutputDTO> {
    try {
      const config = this.dateTimeConfig.getConfig();
      
      return new DateTimeConfigOutputDTO(
        config.defaultLocale,
        config.defaultFormatType,
        config.timezone,
        config.customFormats
      );
    } catch (error) {
      throw new Error(`Failed to get date time config: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export class UpdateDateTimeConfigUseCase {
  constructor(
    private readonly dateTimeConfig: IDateTimeConfig
  ) {}

  async execute(input: UpdateDateTimeConfigInputDTO): Promise<DateTimeConfigOutputDTO> {
    try {
      this.dateTimeConfig.updateConfig({
        defaultLocale: input.defaultLocale,
        defaultFormatType: input.defaultFormatType,
        timezone: input.timezone,
        customFormats: input.customFormats
      });

      const config = this.dateTimeConfig.getConfig();
      
      return new DateTimeConfigOutputDTO(
        config.defaultLocale,
        config.defaultFormatType,
        config.timezone,
        config.customFormats
      );
    } catch (error) {
      throw new Error(`Failed to update date time config: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
