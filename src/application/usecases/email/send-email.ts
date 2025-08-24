import { EmailDataSource } from '@/src/domain/interfaces/datasources/email-datasource';
import { Logger } from '@/src/domain/interfaces/logger';

/**
 * Use case for sending an email
 * Following the Clean Architecture pattern
 */
export class SendEmailUseCase {
  constructor(
    private emailDataSource: EmailDataSource,
    private logger?: Logger
  ) {}

  /**
   * Execute the use case to send an email
   * @param to Recipient email address
   * @param subject Email subject
   * @param content Email content (HTML or plain text)
   * @param isHtml Whether the content is HTML (true) or plain text (false)
   * @returns Promise with success status and optional error message
   */
  async execute(
    to: string,
    subject: string,
    content: string,
    isHtml = true
  ): Promise<{ success: boolean; error?: string }> {
    try {
      return await this.emailDataSource.sendEmail(to, subject, content, isHtml);
    } catch (err) {
      this.logger?.error('Error sending email', err, { to, subject });
      return { success: false, error: 'Failed to send email' };
    }
  }
}
