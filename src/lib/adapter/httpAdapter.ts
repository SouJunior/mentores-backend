import axios, { AxiosInstance } from 'axios';
import { IHttpAdapter } from './httpAdapterInterface';

class HttpAdapter implements IHttpAdapter {
  private axiosInstance: AxiosInstance;
  private axiosCallback: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.calendly.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this.axiosCallback = axios.create({
      baseURL: 'https://auth.calendly.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  public async get(url: string, options?: any) {
    try {
      const response = await this.axiosInstance.get(url, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async post(url: string, data: any, options?: any) {
    try {
      const response = await this.axiosInstance.post(url, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async callbackGet(url: string, options?: any) {
    try {
      const response = await this.axiosCallback.get(url, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async callbackPost(url: string, data: any, options?: any) {
    try {
      const response = await this.axiosCallback.post(url, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default HttpAdapter;
