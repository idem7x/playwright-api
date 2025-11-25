export const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    gender: { type: 'string', enum: ['male', 'female'] },
    status: { type: 'string', enum: ['active', 'inactive'] }
  },
  required: ['id', 'name', 'email', 'gender', 'status'],
  additionalProperties: false
};

export const userArraySchema = {
  type: 'array',
  items: userSchema
};

// Add this schema for GET /users endpoint
export const GET_users = {
  type: 'array',
  items: userSchema,
  minItems: 0
};

// Alternative naming convention (in case your matcher looks for this pattern)
export const GET_usersSchema = GET_users;

export const errorResponseSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      field: { type: 'string' },
      message: { type: 'string' }
    },
    required: ['field', 'message']
  }
};

export const paginationHeaders = {
  type: 'object',
  properties: {
    'x-pagination-limit': { type: 'string' },
    'x-pagination-page': { type: 'string' },
    'x-pagination-pages': { type: 'string' },
    'x-pagination-total': { type: 'string' }
  },
  required: ['x-pagination-limit', 'x-pagination-page', 'x-pagination-pages', 'x-pagination-total']
};