/**
 * Interface for email service
 * This follows the Dependency Inversion Principle from SOLID
 * Both server-side EmailService and client-side ClientEmailService will implement this interface
 */
export interface IEmailService {
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
  ): Promise<EmailResult>;

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
  ): Promise<EmailResult>;
}

/**
 * Result of email sending operation
 */
export type EmailResult = {
  success: boolean;
  error?: string;
};

/**
 * Domain error types for email operations
 */
export enum EmailErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_RECIPIENT = 'INVALID_RECIPIENT',
  INVALID_TEMPLATE = 'INVALID_TEMPLATE',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Domain error for email operations
 */
export class EmailError extends Error {
  constructor(
    public readonly type: EmailErrorType,
    message: string
  ) {
    super(message);
    this.name = 'EmailError';
  }
}
