import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpClient, HttpRequestConfig } from '../../domain/interfaces/http-client';

/**
 * Axios implementation of HttpClient interface
 * This follows the Adapter pattern to adapt Axios to our HttpClient interface
 */
export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;

  /**
   * Create a new AxiosHttpClient
   * @param config Optional Axios configuration
   */
  constructor(config?: AxiosRequestConfig) {
    this.axiosInstance = axios.create(config);
    
    // Add response interceptor to extract data
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error) => Promise.reject(error)
    );
  }

  /**
   * Send a GET request
   * @param url URL to send request to
   * @param config Optional configuration
   * @returns Promise with response data
   */
  async get<T>(url: string, config?: HttpRequestConfig): Promise<T> {
    return this.axiosInstance.get<T, T>(url, config);
  }

  /**
   * Send a POST request
   * @param url URL to send request to
   * @param data Data to send
   * @param config Optional configuration
   * @returns Promise with response data
   */
  async post<T, D = unknown>(url: string, data?: D, config?: HttpRequestConfig): Promise<T> {
    return this.axiosInstance.post<T, T>(url, data, config);
  }

  /**
   * Send a PUT request
   * @param url URL to send request to
   * @param data Data to send
   * @param config Optional configuration
   * @returns Promise with response data
   */
  async put<T, D = unknown>(url: string, data?: D, config?: HttpRequestConfig): Promise<T> {
    return this.axiosInstance.put<T, T>(url, data, config);
  }

  /**
   * Send a DELETE request
   * @param url URL to send request to
   * @param config Optional configuration
   * @returns Promise with response data
   */
  async delete<T>(url: string, config?: HttpRequestConfig): Promise<T> {
    return this.axiosInstance.delete<T, T>(url, config);
  }
}
