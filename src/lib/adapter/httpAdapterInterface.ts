export interface IHttpAdapter {
    get(url: string, options?: any): Promise<any>;
    post(url: string, data: any, options?: any): Promise<any>;
    callbackGet(url: string, options?: any): Promise<any>;
    callbackPost(url: string, data: any, options?: any): Promise<any>;
  }
  