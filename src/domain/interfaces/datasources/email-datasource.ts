/**
 * Interface for email data source
 * Defines methods for sending emails
 */
export interface EmailDataSource {
  /**
   * Send an email
   * @param to Recipient email address
   * @param subject Email subject
   * @param content Email content (HTML or plain text)
   * @param isHtml Whether the content is HTML (true) or plain text (false)
   * @returns Promise with success status and optional error message
   */
  sendEmail(
    to: string,
    subject: string,
    content: string,
    isHtml?: boolean
  ): Promise<{ success: boolean; error?: string }>;

  /**
   * Send a template-based email
   * @param to Recipient email address
   * @param templateId ID of the email template
   * @param dynamicData Dynamic data to be inserted into the template
   * @returns Promise with success status and optional error message
   */
  sendTemplateEmail(
    to: string,
    templateId: string,
    dynamicData: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }>;
}
