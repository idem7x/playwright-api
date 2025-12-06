import { expect } from '@playwright/test';
import SchemaValidator from '@utils/schemaValidator';

expect.extend({
  async shouldMatchSchema(received: unknown, schema: string) {
    let pass: boolean;
    let message: string;

    try {
      const result = SchemaValidator.validate(schema, received);
      pass = result.valid;
      message = pass
          ? 'Schema validation passed'
          : `Schema validation failed for ${schema}:\n${result.errors}\n\nActual body:\n${JSON.stringify(received, null, 2)}`;
    } catch (e: unknown) {
      pass = false;
      const errorMessage = e instanceof Error ? e.message : String(e);
      message = `Failed to validate schema: ${errorMessage}`;
    }

    return {
      message: () => message,
      pass
    };
  },

  shouldEqual(received: unknown, expected: unknown) {
    const pass = received === expected ||
        JSON.stringify(received) === JSON.stringify(expected);

    return {
      pass,
      message: () => pass
          ? `Expected ${JSON.stringify(received)} NOT to equal ${JSON.stringify(expected)}`
          : `Expected ${JSON.stringify(received)} to equal ${JSON.stringify(expected)}`
    };
  },

  shouldContain(received: unknown, expected: unknown) {
    let pass = false;

    if (typeof received === 'string' && typeof expected === 'string') {
      pass = received.includes(expected);
    } else if (Array.isArray(received)) {
      pass = received.includes(expected) ||
          received.some(item => JSON.stringify(item) === JSON.stringify(expected));
    } else if (typeof received === 'object' && received !== null) {
      pass = JSON.stringify(received).includes(String(expected));
    }

    return {
      pass,
      message: () => pass
          ? `Expected ${JSON.stringify(received)} NOT to contain ${JSON.stringify(expected)}`
          : `Expected ${JSON.stringify(received)} to contain ${JSON.stringify(expected)}`
    };
  },

  shouldBeValidEmail(received: unknown) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = typeof received === 'string' && emailRegex.test(received);

    return {
      pass,
      message: () => pass
          ? `Expected ${String(received)} NOT to be a valid email`
          : `Expected ${String(received)} to be a valid email format`
    };
  },

  shouldBeOneOf(received: unknown, values: unknown[]) {
    const pass = values.includes(received) ||
        values.some(v => JSON.stringify(v) === JSON.stringify(received));

    return {
      pass,
      message: () => pass
          ? `Expected ${JSON.stringify(received)} NOT to be one of ${JSON.stringify(values)}`
          : `Expected ${JSON.stringify(received)} to be one of ${JSON.stringify(values)}, but it wasn't`
    };
  },

  shouldBeArray(received: unknown) {
    const pass = Array.isArray(received);

    return {
      pass,
      message: () => pass
          ? `Expected value NOT to be an array`
          : `Expected array but got ${typeof received}`
    };
  }
});

export {};
