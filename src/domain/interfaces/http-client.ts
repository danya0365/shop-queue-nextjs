/**
 * Type for HTTP request configuration
 */
export type HttpRequestConfig = {
  headers?: Record<string, string>;
  timeout?: number;
  params?: Record<string, string | number | boolean | null | undefined>;
  [key: string]: unknown;
};

/**
 * Interface for HTTP client
 * This follows the Dependency Inversion Principle from SOLID
 * High-level modules should not depend on low-level modules
 */
export interface HttpClient {
  /**
   * Send a GET request
   * @param url URL to send request to
   * @param config Optional configuration
   * @returns Promise with response data
   */
  get<T>(url: string, config?: HttpRequestConfig): Promise<T>;

  /**
   * Send a POST request
   * @param url URL to send request to
   * @param data Data to send
   * @param config Optional configuration
   * @returns Promise with response data
   */
  post<T, D = unknown>(url: string, data?: D, config?: HttpRequestConfig): Promise<T>;

  /**
   * Send a PUT request
   * @param url URL to send request to
   * @param data Data to send
   * @param config Optional configuration
   * @returns Promise with response data
   */
  put<T, D = unknown>(url: string, data?: D, config?: HttpRequestConfig): Promise<T>;

  /**
   * Send a DELETE request
   * @param url URL to send request to
   * @param config Optional configuration
   * @returns Promise with response data
   */
  delete<T>(url: string, config?: HttpRequestConfig): Promise<T>;
}
