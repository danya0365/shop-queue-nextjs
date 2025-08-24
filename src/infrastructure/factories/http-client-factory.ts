import { HttpClient } from '../../domain/interfaces/http-client';
import { AxiosHttpClient } from '../http/axios-http-client';

/**
 * Interface for HttpClient factory
 * This follows the Factory pattern and Dependency Inversion Principle
 */
export interface IHttpClientFactory {
  /**
   * Create a HttpClient instance
   * @returns HttpClient instance
   */
  createHttpClient(): HttpClient;
}

/**
 * Default implementation of HttpClientFactory
 * Creates AxiosHttpClient instances
 */
export class DefaultHttpClientFactory implements IHttpClientFactory {
  /**
   * Create a default HttpClient instance using Axios
   * @returns HttpClient instance
   */
  createHttpClient(): HttpClient {
    return new AxiosHttpClient({
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * Singleton instance of DefaultHttpClientFactory
 * For convenience in places where DI is not available
 */
export const HttpClientFactory = new DefaultHttpClientFactory();
