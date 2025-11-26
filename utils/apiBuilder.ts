import { expect } from '@playwright/test';
import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { RequestBody, RequestHeaders, RequestParams } from "@types/userTypes";

export class ApiBuilder {
  private endpoint: string = '';
  private requestParams?: RequestParams;
  private requestHeaders?: RequestHeaders;
  private requestBody?: RequestBody;
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.requestHeaders = this.getDefaultHeaders();
  }

  /**
   * Set the API endpoint path
   * @param endpoint - API endpoint path
   * @returns this for chaining
   */
  path(endpoint: string): this {
    this.endpoint = `https://gorest.co.in/public/v2${endpoint}`;
    return this;
  }

  /**
   * Set query parameters
   * @param params - Query parameters
   * @returns this for chaining
   */
  params(params: RequestParams): this {
    this.requestParams = params;
    return this;
  }

  /**
   * Set request body
   * @param data - Request body data
   * @returns this for chaining
   */
  body(data: RequestBody): this {
    this.requestBody = data;
    return this;
  }

  /**
   * Set custom headers (merges with default headers)
   * @param headers - Custom headers
   * @returns this for chaining
   */
  headers(headers: RequestHeaders): this {
    this.requestHeaders = { ...this.requestHeaders, ...headers };
    return this;
  }

  /**
   * Remove authorization from headers
   * @returns this for chaining
   */
  withoutAuth(): this {
    if (this.requestHeaders) {
      delete this.requestHeaders['Authorization'];
    }
    return this;
  }

  /**
   * Make a GET request
   * @param expectedStatus - Expected HTTP status code
   * @returns API response
   */
  async getRequest(expectedStatus: number): Promise<APIResponse> {
    const response = await this.request.get(this.endpoint, {
      params: this.requestParams,
      headers: this.requestHeaders
    });
    
    expect(response.status(), `Expected status ${expectedStatus}, got ${response.status()}`)
      .toBe(expectedStatus);
    
    return response;
  }

  /**
   * Make a GET request and return JSON body
   * @param expectedStatus - Expected HTTP status code
   * @returns Parsed JSON response
   */
  async getRequestJson<T>(expectedStatus: number): Promise<T> {
    const response = await this.getRequest(expectedStatus);
    return await response.json() as T;
  }

  /**
   * Make a POST request
   * @param expectedStatus - Expected HTTP status code
   * @returns API response
   */
  async postRequest(expectedStatus: number): Promise<APIResponse> {
    const response = await this.request.post(this.endpoint, {
      data: this.requestBody,
      headers: this.requestHeaders
    });
    
    expect(response.status(), `Expected status ${expectedStatus}, got ${response.status()}`)
      .toBe(expectedStatus);
    
    return response;
  }

  /**
   * Make a POST request and return JSON body
   * @param expectedStatus - Expected HTTP status code
   * @returns Parsed JSON response
   */
  async postRequestJson<T>(expectedStatus: number): Promise<T> {
    const response = await this.postRequest(expectedStatus);
    return await response.json() as T;
  }

  /**
   * Make a PUT request
   * @param expectedStatus - Expected HTTP status code
   * @returns API response
   */
  async putRequest(expectedStatus: number): Promise<APIResponse> {
    const response = await this.request.put(this.endpoint, {
      data: this.requestBody,
      headers: this.requestHeaders
    });
    
    expect(response.status(), `Expected status ${expectedStatus}, got ${response.status()}`)
      .toBe(expectedStatus);
    
    return response;
  }

  /**
   * Make a PUT request and return JSON body
   * @param expectedStatus - Expected HTTP status code
   * @returns Parsed JSON response
   */
  async putRequestJson<T>(expectedStatus: number): Promise<T> {
    const response = await this.putRequest(expectedStatus);
    return await response.json() as T;
  }

  /**
   * Make a PATCH request
   * @param expectedStatus - Expected HTTP status code
   * @returns API response
   */
  async patchRequest(expectedStatus: number): Promise<APIResponse> {
    const response = await this.request.patch(this.endpoint, {
      data: this.requestBody,
      headers: this.requestHeaders
    });
    
    expect(response.status(), `Expected status ${expectedStatus}, got ${response.status()}`)
      .toBe(expectedStatus);
    
    return response;
  }

  /**
   * Make a PATCH request and return JSON body
   * @param expectedStatus - Expected HTTP status code
   * @returns Parsed JSON response
   */
  async patchRequestJson<T>(expectedStatus: number): Promise<T> {
    const response = await this.patchRequest(expectedStatus);
    return await response.json() as T;
  }

  /**
   * Make a DELETE request
   * @param expectedStatus - Expected HTTP status code
   * @returns API response
   */
  async deleteRequest(expectedStatus: number): Promise<APIResponse> {
    const response = await this.request.delete(this.endpoint, {
      headers: this.requestHeaders
    });
    
    expect(response.status(), `Expected status ${expectedStatus}, got ${response.status()}`)
      .toBe(expectedStatus);
    
    return response;
  }

  /**
   * Get default headers including authorization
   * @returns Default headers
   */
  private getDefaultHeaders(): Record<string, string> {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${process.env.GO_REST_API_TOKEN}`
      'Authorization': `Bearer 2059b85dde4dd8b1e494a57cf35008f7909a9c863799e486a2aa030dbecd0c0c`
    };
  }

  /**
   * Reset builder state for reuse
   * @returns this for chaining
   */
  reset(): this {
    this.endpoint = '';
    this.requestParams = undefined;
    this.requestBody = undefined;
    this.requestHeaders = this.getDefaultHeaders();
    return this;
  }
}
