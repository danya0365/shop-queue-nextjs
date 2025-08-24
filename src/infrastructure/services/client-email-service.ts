import { EmailError, EmailErrorType, EmailResult, IEmailService } from "@/src/domain/interfaces/email-service";
import axios from "axios";
import type { ILogger } from "../../application/interfaces/logger.interface";
import type { HttpClient } from "../../domain/interfaces/http-client";
import { HttpClientFactory } from "../factories/http-client-factory";

/**
 * Client-side email service that sends requests to the API endpoint
 * This service has the same interface as EmailService but works on the client-side
 * by sending HTTP requests to the server API instead of using environment variables directly
 *
 * Follows the SOLID principles:
 * - Single Responsibility: Only handles email sending via API
 * - Open/Closed: Open for extension (can add new email methods) but closed for modification
 * - Liskov Substitution: Can be used in place of EmailService
 * - Interface Segregation: Uses only the methods it needs from HttpClient
 * - Dependency Inversion: Depends on HttpClient abstraction, not concrete implementation
 */
export class ClientEmailService implements IEmailService {

  /**
   * Create a new ClientEmailService
   * @param httpClient Optional HttpClient instance, will use default if not provided
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly httpClient: HttpClient,
    private readonly logger?: ILogger
  ) {
    this.httpClient = httpClient || HttpClientFactory.createHttpClient();
  }

  /**
   * Send an email via API endpoint
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
    try {
      const response = await this.httpClient.post<{
        success: boolean;
        error?: string;
      }>("/api/send-email", {
        to,
        subject,
        content,
        isHtml,
      });

      return response;
    } catch (error) {
      this.logger?.error("Error sending email", error as Error, { to, subject });

      // Convert to domain error
      const emailError = this.handleError(error, "Failed to send email");

      return {
        success: false,
        error: emailError.message,
      };
    }
  }

  /**
   * Send a template-based email via API endpoint
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
    try {
      const response = await this.httpClient.post<{
        success: boolean;
        error?: string;
      }>("/api/send-email", {
        to,
        templateId,
        dynamicData,
      });

      return response;
    } catch (error) {
      this.logger?.error("Error sending template email", error as Error, { to, templateId });

      // Convert to domain error
      const emailError = this.handleError(error, "Failed to send template email");

      return {
        success: false,
        error: emailError.message,
      };
    }
  }

  /**
   * Handle error and convert to domain error
   * @param error Original error
   * @param defaultMessage Default message if error is not an Error instance
   * @returns EmailError instance
   */
  private handleError(error: unknown, defaultMessage: string): EmailError {
    // Network error
    if (axios.isAxiosError(error) && !error.response) {
      return new EmailError(
        EmailErrorType.NETWORK_ERROR,
        "Network error: Unable to connect to email service"
      );
    }

    // Server error
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 400) {
        return new EmailError(
          EmailErrorType.INVALID_RECIPIENT,
          "Invalid recipient email address"
        );
      }

      if (status === 404 && error.response.data?.error?.includes("template")) {
        return new EmailError(
          EmailErrorType.INVALID_TEMPLATE,
          "Email template not found"
        );
      }

      if (status >= 500) {
        return new EmailError(
          EmailErrorType.SERVER_ERROR,
          `Server error (${status}): ${error.response.data?.error || "Unknown server error"}`
        );
      }
    }

    // Generic error
    return new EmailError(
      EmailErrorType.UNKNOWN_ERROR,
      error instanceof Error ? error.message : defaultMessage
    );
  }
}
