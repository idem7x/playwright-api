# Playwright API Testing Framework

A comprehensive API testing framework built with Playwright and TypeScript, featuring schema validation, type safety, and best practices for REST API testing.

## Features

- ✅ **TypeScript** - Full type safety and IntelliSense support
- ✅ **Schema Validation** - JSON schema validation using AJV
- ✅ **CRUD Operations** - Complete test coverage for GET, POST, PUT, DELETE
- ✅ **Authentication** - Bearer token authentication testing
- ✅ **Response Validation** - Status codes, headers, response time, and schema validation
- ✅ **Test Helpers** - Reusable utilities for common testing tasks
- ✅ **API Client** - Clean abstraction layer for HTTP requests
- ✅ **Best Practices** - Following industry standards for API testing

## Test API

This framework uses [GoREST API](https://gorest.co.in/) which provides:
- RESTful endpoints for Users, Posts, Comments, and Todos
- Bearer token authentication
- Full CRUD operations support
- Realistic error responses

## Project Structure

```
.
├── config/
│   └── config.ts              # API configuration and test data
├── helpers/
│   ├── api-client.ts          # HTTP request wrapper
│   ├── schemaValidator.ts    # JSON schema validation
│   └── test-helpers.ts        # Common test utilities
├── schemas/
│   └── user.schema.ts         # JSON schemas for validation
├── tests/
│   ├── auth.spec.ts           # Authentication tests
│   ├── get-users.spec.ts      # GET request tests
│   ├── post-users.spec.ts     # POST request tests
│   ├── put-users.spec.ts      # PUT request tests
│   └── delete-users.spec.ts   # DELETE request tests
├── types/
│   └── userTypes.ts          # TypeScript type definitions
├── package.json
├── playwright.config.ts        # Playwright configuration
└── tsconfig.json              # TypeScript configuration
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playwright-api-testing-framework
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright:
```bash
npx playwright install
```

4. Set up your environment:
   - Copy `.env.example` to `.env`
   - Get your access token from [GoREST](https://gorest.co.in/)
   - Sign in with GitHub and generate an access token
   - Add your token to `.env`:
   ```
   GOREST_TOKEN=your_actual_token_here
   ```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in headed mode (visible browser):
```bash
npm run test:headed
```

Run tests in UI mode (interactive):
```bash
npm run test:ui
```

Run tests in debug mode:
```bash
npm run test:debug
```

View test report:
```bash
npm run report
```

Run specific test file:
```bash
npx playwright test tests/get-users.spec.ts
```

Run tests by tag/name:
```bash
npx playwright test --grep "GET"
npx playwright test --grep "authentication"
```

## Test Coverage

### Authentication Tests (`auth.spec.ts`)
- ✅ Valid Bearer token authentication
- ✅ Missing authorization header
- ✅ Invalid token format
- ✅ Malformed authorization header
- ✅ Empty authorization header
- ✅ Token case sensitivity
- ✅ Multiple consecutive authenticated requests

### GET Requests (`get-users.spec.ts`)
- ✅ Retrieve all users with pagination
- ✅ Retrieve single user by ID
- ✅ Handle 404 for non-existent user
- ✅ Filter users by gender
- ✅ Filter users by status
- ✅ Pagination validation
- ✅ Response schema validation
- ✅ Response time validation

### POST Requests (`post-users.spec.ts`)
- ✅ Create user with valid data
- ✅ Create male and female users
- ✅ Validation for missing email
- ✅ Validation for invalid email format
- ✅ Duplicate email handling
- ✅ Missing required fields
- ✅ Invalid gender values
- ✅ Unauthorized request handling

### PUT Requests (`put-users.spec.ts`)
- ✅ Update user name
- ✅ Update user email
- ✅ Update user status
- ✅ Update user gender
- ✅ Update multiple fields simultaneously
- ✅ Handle 404 for non-existent user
- ✅ Invalid email format validation
- ✅ Duplicate email validation
- ✅ Unauthorized update attempts

### DELETE Requests (`delete-users.spec.ts`)
- ✅ Delete existing user
- ✅ Verify user deletion
- ✅ Handle 404 for non-existent user
- ✅ Double deletion handling
- ✅ Unauthorized deletion attempts
- ✅ Idempotent delete operations
- ✅ Rapid sequential deletes

## Key Components

### API Client (`helpers/api-client.ts`)
Provides clean methods for HTTP operations:
```typescript
await apiClient.get('/users');
await apiClient.post('/users', userData);
await apiClient.put('/users/123', updateData);
await apiClient.delete('/users/123');
```

### Schema Validator (`helpers/schemaValidator.ts`)
Validates responses against JSON schemas:
```typescript
const validation = validator.validate(userSchema, responseData);
if (!validation.valid) {
  console.log(validation.errors);
}
```

### Test Helpers (`helpers/test-helpers.ts`)
Common assertions and utilities:
```typescript
await testHelpers.assertStatusCode(response, 200);
await testHelpers.assertResponseSchema(response, schema);
testHelpers.assertResponseTime(response, 3000);
```

## Best Practices Implemented

1. **Type Safety**: Full TypeScript implementation with strict types
2. **Schema Validation**: JSON schema validation for all responses
3. **Separation of Concerns**: Clear separation between API client, helpers, and tests
4. **DRY Principle**: Reusable components and helpers
5. **Clean Test Data**: Automatic cleanup after tests
6. **Unique Data**: Generated unique emails to avoid conflicts
7. **Comprehensive Coverage**: Testing happy paths and error scenarios
8. **Performance Testing**: Response time assertions
9. **Authentication**: Proper authorization testing
10. **Error Handling**: Validation of error responses

## Configuration

### Playwright Config (`playwright.config.ts`)
- Base URL configuration
- Test timeout settings
- Reporter configuration
- Parallel execution settings

### TypeScript Config (`tsconfig.json`)
- Strict mode enabled
- Path aliases for imports
- ES2022 target

## Extending the Framework

### Adding New Endpoints

1. Create types in `types/`:
```typescript
export interface Post {
  id: number;
  title: string;
  body: string;
}
```

2. Create schemas in `schemas/`:
```typescript
export const postSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    body: { type: 'string' }
  },
  required: ['id', 'title', 'body']
};
```

3. Add tests in `tests/`:
```typescript
test('should create post', async () => {
  const response = await apiClient.post('/posts', postData);
  await testHelpers.assertResponseSchema(response, postSchema);
});
```

## CI/CD Integration

The framework is ready for CI/CD integration:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: npm ci
  
- name: Install Playwright
  run: npx playwright install
  
- name: Run tests
  run: npm test
  env:
    GOREST_TOKEN: ${{ secrets.GOREST_TOKEN }}
```

## Troubleshooting

### Token Issues
- Ensure your token is valid and not expired
- Check the token has proper permissions
- Verify the token is correctly set in `.env` or environment variables

### Test Failures
- Check API rate limits (GoREST has rate limiting)
- Verify network connectivity
- Review test logs in `test-results/`

### Schema Validation Errors
- Check response structure matches schema
- Verify API hasn't changed
- Review error details in test output

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure they pass
5. Submit a pull request

## License

ISC

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [GoREST API Documentation](https://gorest.co.in/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [AJV JSON Schema Validator](https://ajv.js.org/)
