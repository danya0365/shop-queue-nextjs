import { IDateTimeConfigService } from './DateTimeConfigService';
import { 
  FormatDateTimeUseCase, 
  FormatRelativeDateTimeUseCase, 
  GetDateTimeConfigUseCase, 
  UpdateDateTimeConfigUseCase 
} from '../usecases/datetime/DateTimeUseCases';
import { 
  FormatDateTimeInputDTO, 
  FormattedDateTimeOutputDTO, 
  FormatRelativeDateTimeInputDTO,
  DateTimeConfigOutputDTO,
  UpdateDateTimeConfigInputDTO
} from '../dtos/datetime/DateTimeDTOs';
import { DateTimeConfigAdapter } from '../../infrastructure/adapters/datetime/DateTimeConfigAdapter';
import { IntlDateTimeFormatterAdapter } from '../../infrastructure/adapters/datetime/IntlDateTimeFormatterAdapter';

export interface IDateTimeFormattingService {
  formatDateTime(date: Date | string, options?: any): Promise<FormattedDateTimeOutputDTO>;
  formatRelativeDateTime(date: Date | string, referenceDate?: Date): Promise<FormattedDateTimeOutputDTO>;
  getDateTimeConfig(): Promise<DateTimeConfigOutputDTO>;
  updateDateTimeConfig(config: UpdateDateTimeConfigInputDTO): Promise<DateTimeConfigOutputDTO>;
}

export class DateTimeFormattingService implements IDateTimeFormattingService {
  private readonly formatDateTimeUseCase: FormatDateTimeUseCase;
  private readonly formatRelativeDateTimeUseCase: FormatRelativeDateTimeUseCase;
  private readonly getDateTimeConfigUseCase: GetDateTimeConfigUseCase;
  private readonly updateDateTimeConfigUseCase: UpdateDateTimeConfigUseCase;
  private readonly dateTimeConfigService: IDateTimeConfigService;

  constructor(
    dateTimeConfigService: IDateTimeConfigService
  ) {
    this.dateTimeConfigService = dateTimeConfigService;
    
    const dateTimeConfigAdapter = new DateTimeConfigAdapter();
    const dateTimeFormatter = new IntlDateTimeFormatterAdapter(dateTimeConfigAdapter);
    
    this.formatDateTimeUseCase = new FormatDateTimeUseCase(dateTimeFormatter, dateTimeConfigAdapter);
    this.formatRelativeDateTimeUseCase = new FormatRelativeDateTimeUseCase(dateTimeFormatter);
    this.getDateTimeConfigUseCase = new GetDateTimeConfigUseCase(dateTimeConfigAdapter);
    this.updateDateTimeConfigUseCase = new UpdateDateTimeConfigUseCase(dateTimeConfigAdapter);
  }

  async formatDateTime(date: Date | string, options?: Record<string, unknown>): Promise<FormattedDateTimeOutputDTO> {
    const input = new FormatDateTimeInputDTO(date, options);
    return this.formatDateTimeUseCase.execute(input);
  }

  async formatRelativeDateTime(date: Date | string, referenceDate?: Date): Promise<FormattedDateTimeOutputDTO> {
    const input = new FormatRelativeDateTimeInputDTO(date, referenceDate);
    return this.formatRelativeDateTimeUseCase.execute(input);
  }

  async getDateTimeConfig(): Promise<DateTimeConfigOutputDTO> {
    return this.getDateTimeConfigUseCase.execute();
  }

  async updateDateTimeConfig(config: UpdateDateTimeConfigInputDTO): Promise<DateTimeConfigOutputDTO> {
    return this.updateDateTimeConfigUseCase.execute(config);
  }
}
