import { EmailDataSource } from '@/src/domain/interfaces/datasources/email-datasource';
import { Logger } from '@/src/domain/interfaces/logger';

/**
 * Use case for sending a template-based email
 * Following the Clean Architecture pattern
 */
export class SendTemplateEmailUseCase {
  constructor(
    private emailDataSource: EmailDataSource,
    private logger?: Logger
  ) {}

  /**
   * Execute the use case to send a template-based email
   * @param to Recipient email address
   * @param templateId ID of the email template
   * @param dynamicData Dynamic data to be inserted into the template
   * @returns Promise with success status and optional error message
   */
  async execute(
    to: string,
    templateId: string,
    dynamicData: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      return await this.emailDataSource.sendTemplateEmail(to, templateId, dynamicData);
    } catch (err) {
      this.logger?.error('Error sending template email', err, { to, templateId });
      return { success: false, error: 'Failed to send template email' };
    }
  }
}
