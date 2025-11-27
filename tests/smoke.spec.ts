import { test, expect } from 'fixtures/apiFixtures';
import 'utils/customMatchers';
import type { User } from 'types/userTypes';
import { logger } from 'utils/logger';
import { Endpoint } from "enums/Endpoint";
import { Schema } from "enums/Schema";
import { DataGenerator } from "utils/dataGenerator";

test.describe('Smoke Tests - Critical User Flows', () => {
  test('Create, Verify, Update, and Delete User - Full CRUD Flow', async ({ api }) => {
    logger.info('Generate test user data');
    const userData = DataGenerator.generateUser();

    logger.info('Create new user');
    const createdUser = await api
      .path(Endpoint.USERS)
      .body(userData)
      .postRequestJson<User>(201);

    await expect(createdUser).shouldMatchSchema(Schema.USER);
    expect(createdUser.name).shouldEqual(userData.name);
    expect(createdUser.email).shouldEqual(userData.email);
    const userId = createdUser.id;
    logger.info('User created', { userId, email: createdUser.email });

    logger.info('Verify user appears in users list');
    const usersList = await api
      .reset()
      .path(Endpoint.USERS)
      .params({ page: 1, per_page: 10 })
      .getRequestJson<User[]>(200);

    await expect(usersList).shouldMatchSchema(Schema.USERS);
    const foundUser = usersList.find(u => u.id === userId);
    expect(foundUser).toBeDefined();
    expect(foundUser?.email).shouldEqual(createdUser.email);

    logger.info('Update user information');
    const updateData = {
      name: DataGenerator.generateName(),
      status: 'inactive' as const
    };

    const updatedUser = await api
      .reset()
      .path(`${Endpoint.USERS}/${userId}`)
      .body(updateData)
      .putRequestJson<User>(200);

    await expect(updatedUser).shouldMatchSchema(Schema.USER);
    expect(updatedUser.name).shouldEqual(updateData.name);
    expect(updatedUser.status).shouldEqual(updateData.status);
    logger.info('User updated', { userId, newName: updatedUser.name });

    logger.info('Delete user');
    await api
      .reset()
      .path(`${Endpoint.USERS}/${userId}`)
      .deleteRequest(204);

    logger.info('User deleted', { userId });

    logger.info('Verify user no longer exists');
    await api
      .reset()
      .path(`${Endpoint.USERS}/${userId}`)
      .getRequest(404);

    logger.info('Smoke test completed successfully');
  });

  test('Create and Delete User - Quick Smoke Test', async ({ api }) => {
    const userRequest = DataGenerator.generateUser();

    const createUserResponse = await api
      .path(Endpoint.USERS)
      .body(userRequest)
      .postRequestJson<User>(201);

    await expect(createUserResponse).shouldMatchSchema(Schema.USER);
    expect(createUserResponse.email).shouldEqual(userRequest.email);
    const userId = createUserResponse.id;

    const usersResponse = await api
      .reset()
      .path(Endpoint.USERS)
      .params({ page: 1, per_page: 10 })
      .getRequestJson<User[]>(200);

    await expect(usersResponse).shouldMatchSchema(Schema.USERS);
    expect(usersResponse.some(u => u.id === userId)).toBeTruthy();

    await api
      .reset()
      .path(`${Endpoint.USERS}/${userId}`)
      .deleteRequest(204);

    const usersResponseAfterDelete = await api
      .reset()
      .path(Endpoint.USERS)
      .params({ page: 1, per_page: 10 })
      .getRequestJson<User[]>(200);

    await expect(usersResponseAfterDelete).shouldMatchSchema(Schema.USERS);
    expect(usersResponseAfterDelete.some(u => u.id === userId)).toBeFalsy();
  });

  test('Multiple users creation and cleanup', async ({ api }) => {
    logger.info('Create multiple users');
    const usersCount = 3;
    const createdIds: number[] = [];

    for (let i = 0; i < usersCount; i++) {
      const userData = DataGenerator.generateUser();
      const user = await api
        .reset()
        .path(Endpoint.USERS)
        .body(userData)
        .postRequestJson<User>(201);
      
      createdIds.push(user.id);
      logger.debug(`User ${i + 1} created`, { id: user.id });
    }

    expect(createdIds.length).toBe(usersCount);

    logger.info('Cleanup - delete all created users');
    for (const userId of createdIds) {
      await api
        .reset()
        .path(`${Endpoint.USERS}/${userId}`)
        .deleteRequest(204);
    }

    logger.info('Verify all users deleted');
    for (const userId of createdIds) {
      await api
        .reset()
        .path(`${Endpoint.USERS}/${userId}`)
        .getRequest(404);
    }

    logger.info('Multiple users smoke test completed');
  });

  test('User filtering smoke test', async ({ api }) => {
    const maleUser = DataGenerator.generateMaleUser();
    const createdMale = await api
      .path(Endpoint.USERS)
      .body(maleUser)
      .postRequestJson<User>(201);

    const femaleUser = DataGenerator.generateFemaleUser();
    const createdFemale = await api
      .reset()
      .path(Endpoint.USERS)
      .body(femaleUser)
      .postRequestJson<User>(201);

    const maleUsers = await api
      .reset()
      .path(Endpoint.USERS)
      .params({ gender: 'male', per_page: 20 })
      .getRequestJson<User[]>(200);

    expect(maleUsers.some(u => u.id === createdMale.id)).toBeTruthy();

    const femaleUsers = await api
      .reset()
      .path(Endpoint.USERS)
      .params({ gender: 'female', per_page: 20 })
      .getRequestJson<User[]>(200);

    expect(femaleUsers.some(u => u.id === createdFemale.id)).toBeTruthy();

    await api.reset().path(`${Endpoint.USERS}/${createdMale.id}`).deleteRequest(204);
    await api.reset().path(`${Endpoint.USERS}/${createdFemale.id}`).deleteRequest(204);
  });
});
