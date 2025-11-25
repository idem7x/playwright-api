import { APIRequestContext, APIResponse, expect } from '@playwright/test';

/**
 * Fluent API Builder for making HTTP requests
 * Uses Builder/Fluent pattern for chainable method calls
 * 
 * @example
 * await api
 *   .path('/users')
 *   .body(userData)
 *   .postRequest(201)
 */
export class ApiBuilder {
  private endpoint: string = '';
  private requestParams?: Record<string, any>;
  private requestHeaders?: Record<string, string>;
  private requestBody?: any;
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
  params(params: Record<string, any>): this {
    this.requestParams = params;
    return this;
  }

  /**
   * Set request body
   * @param data - Request body data
   * @returns this for chaining
   */
  body(data: any): this {
    this.requestBody = data;
    return this;
  }

  /**
   * Set custom headers (merges with default headers)
   * @param headers - Custom headers
   * @returns this for chaining
   */
  headers(headers: Record<string, string>): this {
    this.requestHeaders = { ...this.requestHeaders, ...headers };
    return this;
  }

  /**
   * Remove authorization from headers
   * @returns this for chaining
   */
  withoutAuth(): this {
    const { Authorization, ...rest } = this.requestHeaders || {};
    this.requestHeaders = rest;
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
  async getRequestJson<T = any>(expectedStatus: number): Promise<T> {
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
  async postRequestJson<T = any>(expectedStatus: number): Promise<T> {
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
  async putRequestJson<T = any>(expectedStatus: number): Promise<T> {
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
  async patchRequestJson<T = any>(expectedStatus: number): Promise<T> {
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
      'Authorization': `Bearer ${process.env.GO_REST_API_TOKEN}`
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
