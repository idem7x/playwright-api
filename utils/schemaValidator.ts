import Ajv, { ValidateFunction } from 'ajv';

export class SchemaValidator {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({ allErrors: true, verbose: true });
    
    // Add custom format for email if needed
    this.ajv.addFormat('email', {
      type: 'string',
      validate: (data: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
      }
    });
  }

  /**
   * Validates data against a JSON schema
   * @param schema - JSON schema to validate against
   * @param data - Data to validate
   * @returns Validation result with errors if any
   */
  validate(schema: object, data: unknown): {
    valid: boolean;
    errors: string[];
  } {
    const validate: ValidateFunction = this.ajv.compile(schema);
    const valid = validate(data);

    if (!valid && validate.errors) {
      const errors = validate.errors.map(
        (error) => `${error.instancePath} ${error.message}`
      );
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };
  }

  /**
   * Validates headers against expected schema
   * @param expectedHeaders - Expected headers schema
   * @param actualHeaders - Actual headers received
   * @returns Validation result
   */
  validateHeaders(
    expectedHeaders: Record<string, { type: string }>,
    actualHeaders: Record<string, string>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [key, schema] of Object.entries(expectedHeaders)) {
      const headerValue = actualHeaders[key.toLowerCase()];
      
      if (!headerValue) {
        errors.push(`Missing header: ${key}`);
        continue;
      }

      if (schema.type === 'string' && typeof headerValue !== 'string') {
        errors.push(`Header ${key} should be string, got ${typeof headerValue}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
