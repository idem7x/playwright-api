import { test, expect } from '../fixtures/apiFixtures';
import '../utils/customMatchers';
import { User } from '@types/userTypes';
import {EndpointEnum} from "../enums/EndpointEnum";
import * as console from "console";

test.describe('GET Requests - Users API (Fluent API)', () => {
  test('GET - Should retrieve all users with pagination and schema validation', async ({ api }) => {
    const response = await api
      .path(EndpointEnum.USERS)
      .params({ page: 1, per_page: 10 })
      .getRequestJson<User[]>(200);

    console.log('Retrieved Users:', JSON.stringify(response));
    await expect(response).shouldMatchSchema('user', 'GET_users');
    
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBeGreaterThan(0);
    expect(response.length).toBeLessThanOrEqual(10);
  });

  test('GET - Should retrieve single user by ID with custom matchers', async ({ api }) => {
    // First get a user to get valid ID
    const users = await api
      .path(EndpointEnum.USERS)
      .params({ page: 1, per_page: 1 })
      .getRequestJson<User[]>(200);
    
    expect(users.length).toBeGreaterThan(0);
    const userId = users[0].id;

    // Get specific user
    const user = await api
      .path(`${EndpointEnum.USERS}/${userId}`)
      .getRequestJson<User>(200);

    await expect(user).shouldMatchSchema('user', 'GET_user');
    expect(user.id).shouldEqual(userId);
    expect(user.email).shouldBeValidEmail();
    expect(user.gender).shouldBeOneOf(['male', 'female']);
    expect(user.status).shouldBeOneOf(['active', 'inactive']);
  });

  test('GET - Should return 404 for non-existent user', async ({ api }) => {
    const nonExistentId = 999999999;
    
    const response = await api
      .path(`${EndpointEnum.USERS}/${nonExistentId}`)
      .getRequest(404);

    const body = await response.json();
    expect(body.message).toBeDefined();
  });

  test('GET - Should filter users by gender using fluent API', async ({ api }) => {
    const users = await api
      .path(EndpointEnum.USERS)
      .params({ gender: 'male', per_page: 5 })
      .getRequestJson<User[]>(200);

    await expect(users).shouldMatchSchema('user', 'GET_users');
    users.forEach(user => {
      expect(user.gender).shouldEqual('male');
    });
  });

  test('GET - Should filter users by status', async ({ api }) => {
    const users = await api
      .path(EndpointEnum.USERS)
      .params({ status: 'active', per_page: 5 })
      .getRequestJson<User[]>(200);

    users.forEach(user => {
      expect(user.status).shouldEqual('active');
    });
  });

  test('GET - Should handle pagination correctly', async ({ api }) => {
    const page1Users = await api
      .reset()
      .path(EndpointEnum.USERS)
      .params({ page: 1, per_page: 5 })
      .getRequestJson<User[]>(200);
    
    const page2Users = await api
      .reset()
      .path(EndpointEnum.USERS)
      .params({ page: 2, per_page: 5 })
      .getRequestJson<User[]>(200);

    // Verify different results
    const page1Ids = page1Users.map(u => u.id);
    const page2Ids = page2Users.map(u => u.id);
    
    const hasOverlap = page1Ids.some(id => page2Ids.includes(id));
    expect(hasOverlap).toBeFalsy();
  });

  test('GET - Should search users by name', async ({ api }) => {
    // Get first user
    const users = await api
      .path(EndpointEnum.USERS)
      .params({ page: 1, per_page: 1 })
      .getRequestJson<User[]>(200);
    
    if (users.length === 0) {
      test.skip();
    }

    const searchName = users[0].name;
    
    // Search for that user
    const searchResults = await api
      .reset()
      .path(EndpointEnum.USERS)
      .params({ name: searchName })
      .getRequestJson<User[]>(200);

    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults[0].name).shouldContain(searchName);
  });
});
