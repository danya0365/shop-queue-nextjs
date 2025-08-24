import { EmailDataSource } from '@/src/domain/interfaces/datasources/email-datasource';
import { EmailUseCaseFactory } from '../../application/factories/email-use-case.factory';
import type { ILogger } from '../../application/interfaces/logger.interface';
import { SendEmailUseCase } from '../../application/usecases/email/send-email';
import { SendTemplateEmailUseCase } from '../../application/usecases/email/send-template-email';
import { EmailResult, IEmailService } from '../../domain/interfaces/email-service';
import { LoggerAdapter } from '../adapters/logger-adapter';

/**
 * Service for handling email-related operations
 * Follows the SOLID principles and Clean Architecture pattern
 */
export class EmailService implements IEmailService {
  private sendEmailUseCase: SendEmailUseCase;
  private sendTemplateEmailUseCase: SendTemplateEmailUseCase;

  constructor(
    private emailDataSource: EmailDataSource,
    private logger?: ILogger
  ) {
    // Create logger adapter if logger is provided
    const loggerAdapter = logger ? new LoggerAdapter(logger) : undefined;

    // Use factory to create use cases with proper dependency injection
    this.sendEmailUseCase = EmailUseCaseFactory.createSendEmailUseCase(
      emailDataSource,
      loggerAdapter
    );

    // Use factory to create SendTemplateEmailUseCase with logger
    this.sendTemplateEmailUseCase = EmailUseCaseFactory.createSendTemplateEmailUseCase(
      emailDataSource,
      loggerAdapter
    );
  }

  /**
   * Send an email
   * @param to Recipient email address
   * @param subject Email subject
   * @param content Email content (HTML or plain text)
   * @param isHtml Whether the content is HTML (true) or plain text (false)
   * @returns Promise with success status and optional error message
   */
  async sendEmail(
    to: string,
    subject: string,
    content: string,
    isHtml = true
  ): Promise<EmailResult> {
    return this.sendEmailUseCase.execute(to, subject, content, isHtml);
  }

  /**
   * Send a template-based email
   * @param to Recipient email address
   * @param templateId ID of the email template
   * @param dynamicData Dynamic data to be inserted into the template
   * @returns Promise with success status and optional error message
   */
  async sendTemplateEmail(
    to: string,
    templateId: string,
    dynamicData: Record<string, unknown>
  ): Promise<EmailResult> {
    return this.sendTemplateEmailUseCase.execute(to, templateId, dynamicData);
  }
}
