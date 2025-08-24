import type { MergeVar, MessageRecipientType } from "@mailchimp/mailchimp_transactional";
import mailchimpModule from "@mailchimp/mailchimp_transactional";
import { EmailDataSource } from "../../domain/interfaces/datasources/email-datasource";

/**
 * Mailchimp Transactional (Mandrill) implementation of EmailDataSource
 */
export class MailchimpEmailDataSource implements EmailDataSource {
  // Using specific interface for client to avoid any
  private client: ReturnType<typeof mailchimpModule>;
  private from: string;
  private fromName: string;

  /**
   * Constructor for MailchimpEmailDataSource
   * @param apiKey Mailchimp Transactional API key
   * @param fromEmail Email address to send from
   * @param fromName Name to send from
   */
  constructor(apiKey: string, fromEmail: string, fromName: string) {
    this.client = mailchimpModule(apiKey);
    this.from = fromEmail;
    this.fromName = fromName;
  }

  /**
   * Send an email using Mailchimp Transactional
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
      const message = {
        html: isHtml ? content : undefined,
        text: !isHtml ? content : undefined,
        subject: subject,
        from_email: this.from,
        from_name: this.fromName,
        to: [
          {
            email: to,
            type: "to" as MessageRecipientType,
          },
        ],
      };

      const response = await this.client.messages.send({ message });

      // Mailchimp returns an array of responses, one per recipient
      // Check if any of them failed
      if (!Array.isArray(response)) {
        throw new Error('Unexpected response format from Mailchimp API');
      }

      const failed = response.some(
        (item) => item.status === "rejected" || item.status === "invalid"
      );

      if (failed) {
        const errorMessages = response
          .filter((item) => item.status === "rejected" || item.status === "invalid")
          .map((item) => item.reject_reason || "Unknown error")
          .join(", ");

        return { success: false, error: errorMessages };
      }

      return { success: true };
    } catch (error) {
      console.error("Mailchimp error:", error);
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
   * Send a template-based email using Mailchimp Transactional
   * @param to Recipient email address
   * @param templateId ID of the Mailchimp template
   * @param dynamicData Dynamic template data
   * @returns Promise with success status and optional error message
   */
  async sendTemplateEmail(
    to: string,
    templateId: string,
    dynamicData: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const message = {
        template_name: templateId,
        template_content: [], // Required for API but not used
        message: {
          from_email: this.from,
          from_name: this.fromName,
          to: [
            {
              email: to,
              type: "to" as MessageRecipientType,
            },
          ],
          global_merge_vars: Object.entries(dynamicData).map(([name, content]) => ({
            name,
            content: String(content),
          })) as MergeVar[],
        },
      };

      const response = await this.client.messages.sendTemplate(message);

      // Mailchimp returns an array of responses, one per recipient
      // Check if any of them failed
      if (!Array.isArray(response)) {
        throw new Error('Unexpected response format from Mailchimp API');
      }

      const failed = response.some(
        (item) => item.status === "rejected" || item.status === "invalid"
      );

      if (failed) {
        const errorMessages = response
          .filter((item) => item.status === "rejected" || item.status === "invalid")
          .map((item) => item.reject_reason || "Unknown error")
          .join(", ");

        return { success: false, error: errorMessages };
      }

      return { success: true };
    } catch (error) {
      console.error("Mailchimp template error:", error);
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
