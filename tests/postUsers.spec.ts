import { test, expect } from 'fixtures/apiFixtures';
import 'utils/customMatchers';
import { User, ErrorResponse } from 'types/userTypes';
import {Endpoint} from "enums/Endpoint";
import {Schema} from "enums/Schema";
import {logger} from "utils/logger";
import {DataGenerator} from "../utils/dataGenerator";

test.describe('POST Requests', () => {
  let createdUserIds: number[] = [];

  test.afterEach(async ({ api }) => {
    for (const userId of createdUserIds) {
      try {
        await api
          .reset()
          .path(`${Endpoint.USERS}/${userId}`)
          .deleteRequest(204);
      } catch (error) {
        logger.warn(`Failed to delete user ${userId}:`, error);
      }
    }
    createdUserIds = [];
  });

  test('POST - Should create user with data generator', async ({ api }) => {
    const newUser = DataGenerator.generateUser();

    const createdUser = await api
      .path(Endpoint.USERS)
      .body(newUser)
      .postRequestJson<User>(201);

    await expect(createdUser).shouldMatchSchema(Schema.POST_USER);
    expect(createdUser.id).toBeDefined();
    expect(createdUser.name).shouldEqual(newUser.name);
    expect(createdUser.email).shouldEqual(newUser.email);
    expect(createdUser.email).shouldBeValidEmail();
    expect(createdUser.gender).shouldEqual(newUser.gender);
    expect(createdUser.status).shouldEqual(newUser.status);

    createdUserIds.push(createdUser.id);
  });

  test('POST - Should create male user using generator', async ({ api }) => {
    const newUser = DataGenerator.generateMaleUser();

    const createdUser = await api
      .path(Endpoint.USERS)
      .body(newUser)
      .postRequestJson<User>(201);

    expect(createdUser.gender).shouldEqual('male');
    createdUserIds.push(createdUser.id);
  });

  test('POST - Should create female user using generator', async ({ api }) => {
    const newUser = DataGenerator.generateFemaleUser();

    const createdUser = await api
      .path(Endpoint.USERS)
      .body(newUser)
      .postRequestJson<User>(201);

    expect(createdUser.gender).shouldEqual('female');
    createdUserIds.push(createdUser.id);
  });

  test('POST - Should create active user', async ({ api }) => {
    const newUser = DataGenerator.generateActiveUser();

    const createdUser = await api
      .path(Endpoint.USERS)
      .body(newUser)
      .postRequestJson<User>(201);

    expect(createdUser.status).shouldEqual('active');
    createdUserIds.push(createdUser.id);
  });

  test('POST - Should fail with 422 when email is missing', async ({ api }) => {
    const invalidUser = {
      name: DataGenerator.generateName(),
      gender: 'male',
      status: 'active'
    };

    const errors = await api
      .path(Endpoint.USERS)
      .body(invalidUser)
      .postRequestJson<ErrorResponse[]>(422);

    await expect(errors).shouldMatchSchema(Schema.POST_ERROR);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.field === 'email')).toBeTruthy();
  });

  test('POST - Should fail with 422 for invalid email format', async ({ api }) => {
    const invalidUser = DataGenerator.generateUser({
      email: DataGenerator.generateInvalidEmail()
    });

    const errors = await api
      .path(Endpoint.USERS)
      .body(invalidUser)
      .postRequestJson<ErrorResponse[]>(422);

    const emailError = errors.find(e => e.field === 'email');
    expect(emailError).toBeDefined();
    expect(emailError?.message).shouldContain('invalid');
  });

  test('POST - Should fail with 422 for duplicate email', async ({ api }) => {
    const userData = DataGenerator.generateUser();
    const firstUser = await api
      .path(Endpoint.USERS)
      .body(userData)
      .postRequestJson<User>(201);
    
    createdUserIds.push(firstUser.id);

    const errors = await api
      .reset()
      .path(Endpoint.USERS)
      .body(userData)
      .postRequestJson<ErrorResponse[]>(422);
    
    const emailError = errors.find(e => e.field === 'email');
    expect(emailError).toBeDefined();
    expect(emailError?.message).shouldContain('taken');
  });

  test('POST - Should fail with 401 when unauthorized', async ({ api }) => {
    const newUser = DataGenerator.generateUser();

    const response = await api
      .path(Endpoint.USERS)
      .body(newUser)
      .withoutAuth()
      .postRequest(401);

    const body = await response.json();
    expect(body.message).toBeDefined();
    expect(body.message.toLowerCase()).shouldContain('authentication');
  });

  test('POST - Should create multiple users in sequence', async ({ api }) => {
    const usersToCreate = DataGenerator.generateUsers(3);
    const createdUsers: User[] = [];

    for (const userData of usersToCreate) {
      const user = await api
        .reset()
        .path(Endpoint.USERS)
        .body(userData)
        .postRequestJson<User>(201);
      
      createdUsers.push(user);
      createdUserIds.push(user.id);
    }

    expect(createdUsers.length).toBe(3);
    createdUsers.forEach(user => {
      expect(user.id).toBeDefined();
      expect(user.email).shouldBeValidEmail();
    });
  });

  test('POST - Should validate all required fields are returned', async ({ api }) => {
    const newUser = DataGenerator.generateUser();

    const createdUser = await api
      .path(Endpoint.USERS)
      .body(newUser)
      .postRequestJson<User>(201);

    // Check all required fields
    expect(createdUser).toHaveProperty('id');
    expect(createdUser).toHaveProperty('name');
    expect(createdUser).toHaveProperty('email');
    expect(createdUser).toHaveProperty('gender');
    expect(createdUser).toHaveProperty('status');

    createdUserIds.push(createdUser.id);
  });
});
