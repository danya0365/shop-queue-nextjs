import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { EmailDataSource } from "../../domain/interfaces/datasources/email-datasource";

/**
 * SendGrid implementation of EmailDataSource
 */
export class SendGridEmailDataSource implements EmailDataSource {
  private from: string;

  /**
   * Constructor for SendGridEmailDataSource
   * @param apiKey SendGrid API key
   * @param fromEmail Email address to send from
   */
  constructor(apiKey: string, fromEmail: string) {
    sgMail.setApiKey(apiKey);
    this.from = fromEmail;
  }

  /**
   * Send an email using SendGrid
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
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Create a properly typed message object
      const msg: MailDataRequired = {
        to,
        from: this.from,
        subject,
        ...(isHtml ? { html: content } : { text: content }),
      };

      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error("SendGrid error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error sending email",
      };
    }
  }

  /**
   * Send a template-based email using SendGrid
   * @param to Recipient email address
   * @param templateId ID of the SendGrid template
   * @param dynamicData Dynamic template data
   * @returns Promise with success status and optional error message
   */
  async sendTemplateEmail(
    to: string,
    templateId: string,
    dynamicData: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const msg: MailDataRequired = {
        to,
        from: this.from,
        templateId,
        dynamicTemplateData: dynamicData,
      };

      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error("SendGrid template error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error sending template email",
      };
    }
  }
}
