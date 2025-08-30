import { EmailDataSource } from '@/src/domain/interfaces/datasources/email-datasource';
import { Logger } from '@/src/domain/interfaces/logger';
import { EmailUseCaseFactory } from '../../application/factories/email-use-case.factory';
import { SendEmailUseCase } from '../../application/usecases/email/send-email';
import { SendTemplateEmailUseCase } from '../../application/usecases/email/send-template-email';
import { EmailResult, IEmailService } from '../../domain/interfaces/email-service';

/**
 * Service for handling email-related operations
 * Follows the SOLID principles and Clean Architecture pattern
 */
export class EmailService implements IEmailService {
  private sendEmailUseCase: SendEmailUseCase;
  private sendTemplateEmailUseCase: SendTemplateEmailUseCase;

  constructor(
    private emailDataSource: EmailDataSource,
    private logger?: Logger
  ) {
    // Use factory to create use cases with proper dependency injection
    this.sendEmailUseCase = EmailUseCaseFactory.createSendEmailUseCase(
      emailDataSource,
      logger
    );

    // Use factory to create SendTemplateEmailUseCase with logger
    this.sendTemplateEmailUseCase = EmailUseCaseFactory.createSendTemplateEmailUseCase(
      emailDataSource,
      logger
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
