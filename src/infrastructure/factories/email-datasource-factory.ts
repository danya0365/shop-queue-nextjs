import { EmailDataSource } from '../../domain/interfaces/datasources/email-datasource';
import { MailchimpEmailDataSource } from '../datasources/mailchimp-email-datasource';
import { SendGridEmailDataSource } from '../datasources/sendgrid-email-datasource';

/**
 * Factory for creating EmailDataSource instances
 * Follows the Factory pattern to create different implementations of EmailDataSource
 */
export class EmailDataSourceFactory {
  /**
   * Create a SendGrid email datasource
   * @param apiKey SendGrid API key
   * @param fromEmail Email address to send from
   * @returns SendGridEmailDataSource instance
   */
  static createSendGridDataSource(
    apiKey: string,
    fromEmail: string
  ): EmailDataSource {
    return new SendGridEmailDataSource(apiKey, fromEmail);
  }

  /**
   * Create a Mailchimp email datasource
   * @param apiKey Mailchimp API key
   * @param fromEmail Email address to send from
   * @param fromName Name to send from
   * @returns MailchimpEmailDataSource instance
   */
  static createMailchimpDataSource(
    apiKey: string,
    fromEmail: string,
    fromName: string
  ): EmailDataSource {
    return new MailchimpEmailDataSource(apiKey, fromEmail, fromName);
  }

  /**
   * Create an email datasource based on the provider
   * @param provider Email provider (sendgrid or mailchimp)
   * @param apiKey API key for the provider
   * @param fromEmail Email address to send from
   * @param fromName Name to send from (only used for Mailchimp)
   * @returns EmailDataSource instance
   */
  static createEmailDataSource(
    provider: 'sendgrid' | 'mailchimp',
    apiKey: string,
    fromEmail: string,
    fromName?: string
  ): EmailDataSource {
    switch (provider) {
      case 'sendgrid':
        return this.createSendGridDataSource(apiKey, fromEmail);
      case 'mailchimp':
        if (!fromName) {
          throw new Error('fromName is required for Mailchimp');
        }
        return this.createMailchimpDataSource(apiKey, fromEmail, fromName);
      default:
        throw new Error(`Unsupported email provider: ${provider}`);
    }
  }
}
