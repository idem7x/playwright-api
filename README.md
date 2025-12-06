# Playwright API Testing Framework

A TypeScript-based API testing framework using Playwright for testing REST APIs with schema validation and comprehensive test coverage.

## Features

- TypeScript with full type safety
- JSON schema validation using AJV
- Complete CRUD operations testing
- Bearer token authentication
- Reusable test helpers and utilities
- ESLint code quality checks

## Installation

```bash
npm install
npx playwright install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Get your access token from [GoREST](https://gorest.co.in/)
3. Add token to `.env`:

```env
GOREST_TOKEN=your_token_here
LOG_LEVEL=info
CI=false
```

## Running Tests

```bash
npm test               # Run all tests
npm run test:ui        # Interactive UI mode
npm run report         # View test report
```

## Project Structure

```
├── constants/         # App constants
├── fixtures/          # Test fixtures
├── schemas/           # JSON validation schemas
├── tests/             # Test specifications
├── types/             # TypeScript types
└── utils/             # Helpers and API client
```

## Test Coverage

- **Authentication**: Token validation, authorization headers
- **GET**: Retrieve users, pagination, filtering
- **POST**: Create users, validation, error handling
- **PUT**: Update users, partial updates
- **DELETE**: Delete users, idempotency

## Key Components

**API Builder** (`utils/apiBuilder.ts`):
```typescript
await api
    .path(Endpoint.USERS)
    .params({ page: 1, per_page: 10 })
    .getRequestJson<User[]>(200);;
```

**Schema Validator** (`utils/schemaValidator.ts`):
```typescript
const validation = validator.validate(userSchema, responseData);
```

## License

ISC
