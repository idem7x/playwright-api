import { expect } from '@playwright/test';
import { SchemaValidator } from './schemaValidator';
import * as path from "path";

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      shouldMatchSchema(resource: string, operation: string): R;
      shouldEqual(expected: any): R;
      shouldContain(expected: any): R;
      shouldBeValidEmail(): R;
      shouldBeOneOf(values: any[]): R;
    }
  }
}

/**
 * Custom matchers for API testing
 * Extends Playwright's expect with domain-specific assertions
 */
expect.extend({
  /**
   * Validate response against JSON schema
   * @param received - The response object to validate
   * @param resource - Resource name (e.g., 'user', 'users')
   * @param operation - Operation name (e.g., 'GET_users', 'POST_user')
   */
  async shouldMatchSchema(received: any, resource: string, operation: string) {
    try {
      const schemas = path.resolve(`../schemas/${resource}.schema`);
      const schema = schemas[operation] || schemas[`${operation}Schema`];
      
      if (!schema) {
        return {
          pass: false,
          message: () => `Schema '${operation}' not found in ${resource}.schema.ts`
        };
      }

      const validator = new SchemaValidator();
      const result = validator.validate(schema, received);

      return {
        pass: result.valid,
        message: () => result.valid
          ? `Expected response NOT to match schema ${resource}.${operation}`
          : `Schema validation failed for ${resource}.${operation}:\n${result.errors.join('\n')}`
      };
    } catch (error: any) {
      return {
        pass: false,
        message: () => `Error loading schema: ${error.message}`
      };
    }
  },

  /**
   * Assert equality with better error messages
   * @param received - Actual value
   * @param expected - Expected value
   */
  shouldEqual(received: any, expected: any) {
    const pass = received === expected || 
                 JSON.stringify(received) === JSON.stringify(expected);

    return {
      pass,
      message: () => pass
        ? `Expected ${received} NOT to equal ${expected}`
        : `Expected ${received} to equal ${expected}`
    };
  },

  /**
   * Assert value contains substring or element
   * @param received - Actual value (string or array)
   * @param expected - Expected substring or element
   */
  shouldContain(received: any, expected: any) {
    let pass = false;

    if (typeof received === 'string') {
      pass = received.includes(expected);
    } else if (Array.isArray(received)) {
      pass = received.includes(expected) || 
             received.some(item => JSON.stringify(item) === JSON.stringify(expected));
    } else if (typeof received === 'object') {
      pass = JSON.stringify(received).includes(expected);
    }

    return {
      pass,
      message: () => pass
        ? `Expected ${JSON.stringify(received)} NOT to contain ${expected}`
        : `Expected ${JSON.stringify(received)} to contain ${expected}`
    };
  },

  /**
   * Validate email format
   * @param received - Email string to validate
   */
  shouldBeValidEmail(received: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = typeof received === 'string' && emailRegex.test(received);

    return {
      pass,
      message: () => pass
        ? `Expected ${received} NOT to be a valid email`
        : `Expected ${received} to be a valid email format`
    };
  },

  /**
   * Assert value is one of the provided options
   * @param received - Actual value
   * @param values - Array of acceptable values
   */
  shouldBeOneOf(received: any, values: any[]) {
    const pass = values.includes(received) ||
                 values.some(v => JSON.stringify(v) === JSON.stringify(received));

    return {
      pass,
      message: () => pass
        ? `Expected ${received} NOT to be one of ${JSON.stringify(values)}`
        : `Expected ${received} to be one of ${JSON.stringify(values)}, but it wasn't`
    };
  }
});

export {};
