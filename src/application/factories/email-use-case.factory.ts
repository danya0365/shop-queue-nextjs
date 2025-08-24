import { EmailDataSource } from '@/src/domain/interfaces/datasources/email-datasource';
import { Logger } from '@/src/domain/interfaces/logger';
import { SendEmailUseCase } from '../usecases/email/send-email';
import { SendTemplateEmailUseCase } from '../usecases/email/send-template-email';

/**
 * Factory for creating email-related use cases
 * Follows the Factory pattern to create different email use cases
 * with proper dependency injection
 */
export class EmailUseCaseFactory {
  /**
   * Create a SendEmailUseCase with proper dependencies
   * @param emailDataSource The email data source implementation
   * @param logger Optional logger for error logging
   * @returns SendEmailUseCase instance
   */
  static createSendEmailUseCase(
    emailDataSource: EmailDataSource,
    logger?: Logger
  ): SendEmailUseCase {
    return new SendEmailUseCase(emailDataSource, logger);
  }

  /**
   * Create a SendTemplateEmailUseCase with proper dependencies
   * @param emailDataSource The email data source implementation
   * @param logger Optional logger for error logging
   * @returns SendTemplateEmailUseCase instance
   */
  static createSendTemplateEmailUseCase(
    emailDataSource: EmailDataSource,
    logger?: Logger
  ): SendTemplateEmailUseCase {
    return new SendTemplateEmailUseCase(emailDataSource, logger);
  }
}
