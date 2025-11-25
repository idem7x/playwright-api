import { test as base } from '@playwright/test';
import { ApiBuilder } from '../utils/apiBuilder';
import { DataGenerator } from '../utils/dataGenerator';

/**
 * Custom fixtures for API testing
 * Provides dependency injection for test utilities
 */

type ApiFixtures = {
  api: ApiBuilder;
  dataGenerator: typeof DataGenerator;
};

/**
 * Extended test with API fixtures
 * Usage: import { test, expect } from './fixtures/api-fixtures'
 * 
 * @example
 * test('Create user', async ({ api, dataGenerator }) => {
 *   const userData = dataGenerator.generateUser();
 *   const response = await api
 *     .path('/users')
 *     .body(userData)
 *     .postRequestJson(201);
 * });
 */
export const test = base.extend<ApiFixtures>({
  /**
   * API Builder fixture
   * Provides fluent API for making HTTP requests
   */
  api: async ({ request }, use, testInfo) => {
    const baseURL = testInfo.project.use.baseURL || '';
    const api = new ApiBuilder(request);
    await use(api);
  },

  /**
   * Data Generator fixture
   * Provides methods for generating test data
   */
  dataGenerator: async ({}, use) => {
    await use(DataGenerator);
  }
});

// Re-export expect for convenience
export { expect } from '@playwright/test';
