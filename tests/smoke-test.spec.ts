import { test, expect } from '../fixtures/apiFixtures';
import '../utils/customMatchers';
import { User } from '@types/userTypes';
import { logger } from '../utils/logger';
import {EndpointEnum} from "../enums/EndpointEnum";

test.describe('Smoke Tests - Critical User Flows', () => {
  test('Create, Verify, Update, and Delete User - Full CRUD Flow', async ({ api, dataGenerator }) => {
    logger.step('Generate test user data');
    const userData = dataGenerator.generateUser();

    // CREATE
    logger.step('Create new user');
    const createdUser = await api
      .path(EndpointEnum.USERS)
      .body(userData)
      .postRequestJson<User>(201);

    await expect(createdUser).shouldMatchSchema('user', 'POST_user');
    expect(createdUser.name).shouldEqual(userData.name);
    expect(createdUser.email).shouldEqual(userData.email);
    const userId = createdUser.id;
    logger.info('User created', { userId, email: createdUser.email });

    // READ - Verify in list
    logger.step('Verify user appears in users list');
    const usersList = await api
      .reset()
      .path(EndpointEnum.USERS)
      .params({ page: 1, per_page: 10 })
      .getRequestJson<User[]>(200);

    await expect(usersList).shouldMatchSchema('user', 'GET_users');
    const foundUser = usersList.find(u => u.id === userId);
    expect(foundUser).toBeDefined();
    expect(foundUser?.email).shouldEqual(createdUser.email);

    // UPDATE
    logger.step('Update user information');
    const updateData = {
      name: dataGenerator.generateName(),
      status: 'inactive' as const
    };

    const updatedUser = await api
      .reset()
      .path(`${EndpointEnum.USERS}/${userId}`)
      .body(updateData)
      .putRequestJson<User>(200);

    await expect(updatedUser).shouldMatchSchema('user', 'PUT_user');
    expect(updatedUser.name).shouldEqual(updateData.name);
    expect(updatedUser.status).shouldEqual(updateData.status);
    logger.info('User updated', { userId, newName: updatedUser.name });

    // DELETE
    logger.step('Delete user');
    await api
      .reset()
      .path(`${EndpointEnum.USERS}/${userId}`)
      .deleteRequest(204);

    logger.info('User deleted', { userId });

    // VERIFY DELETION
    logger.step('Verify user no longer exists');
    await api
      .reset()
      .path(`${EndpointEnum.USERS}/${userId}`)
      .getRequest(404);

    logger.info('Smoke test completed successfully');
  });

  test('Create and Delete User - Quick Smoke Test', async ({ api, dataGenerator }) => {
    // Similar to the screenshot example
    const userRequest = dataGenerator.generateUser();
    
    // Create user
    const createUserResponse = await api
      .path(EndpointEnum.USERS)
      .body(userRequest)
      .postRequestJson<User>(201);

    await expect(createUserResponse).shouldMatchSchema('user', 'POST_user');
    expect(createUserResponse.email).shouldEqual(userRequest.email);
    const userId = createUserResponse.id;

    // Get users list
    const usersResponse = await api
      .reset()
      .path(EndpointEnum.USERS)
      .params({ page: 1, per_page: 10 })
      .getRequestJson<User[]>(200);

    await expect(usersResponse).shouldMatchSchema('user', 'GET_users');
    expect(usersResponse.some(u => u.id === userId)).toBeTruthy();

    // Delete user
    await api
      .reset()
      .path(`${EndpointEnum.USERS}/${userId}`)
      .deleteRequest(204);

    // Verify deletion
    const usersResponseAfterDelete = await api
      .reset()
      .path(EndpointEnum.USERS)
      .params({ page: 1, per_page: 10 })
      .getRequestJson<User[]>(200);

    await expect(usersResponseAfterDelete).shouldMatchSchema('user', 'GET_users');
    expect(usersResponseAfterDelete.some(u => u.id === userId)).toBeFalsy();
  });

  test('Multiple users creation and cleanup', async ({ api, dataGenerator }) => {
    logger.step('Create multiple users');
    const usersCount = 3;
    const createdIds: number[] = [];

    for (let i = 0; i < usersCount; i++) {
      const userData = dataGenerator.generateUser();
      const user = await api
        .reset()
        .path(EndpointEnum.USERS)
        .body(userData)
        .postRequestJson<User>(201);
      
      createdIds.push(user.id);
      logger.debug(`User ${i + 1} created`, { id: user.id });
    }

    expect(createdIds.length).toBe(usersCount);

    // Cleanup all users
    logger.step('Cleanup - delete all created users');
    for (const userId of createdIds) {
      await api
        .reset()
        .path(`${EndpointEnum.USERS}/${userId}`)
        .deleteRequest(204);
    }

    // Verify all deleted
    logger.step('Verify all users deleted');
    for (const userId of createdIds) {
      await api
        .reset()
        .path(`${EndpointEnum.USERS}/${userId}`)
        .getRequest(404);
    }

    logger.info('Multiple users smoke test completed');
  });

  test('User filtering smoke test', async ({ api, dataGenerator }) => {
    // Create male user
    const maleUser = dataGenerator.generateMaleUser();
    const createdMale = await api
      .path(EndpointEnum.USERS)
      .body(maleUser)
      .postRequestJson<User>(201);

    // Create female user
    const femaleUser = dataGenerator.generateFemaleUser();
    const createdFemale = await api
      .reset()
      .path(EndpointEnum.USERS)
      .body(femaleUser)
      .postRequestJson<User>(201);

    // Filter by male
    const maleUsers = await api
      .reset()
      .path(EndpointEnum.USERS)
      .params({ gender: 'male', per_page: 20 })
      .getRequestJson<User[]>(200);

    expect(maleUsers.some(u => u.id === createdMale.id)).toBeTruthy();

    // Filter by female
    const femaleUsers = await api
      .reset()
      .path(EndpointEnum.USERS)
      .params({ gender: 'female', per_page: 20 })
      .getRequestJson<User[]>(200);

    expect(femaleUsers.some(u => u.id === createdFemale.id)).toBeTruthy();

    // Cleanup
    await api.reset().path(`${EndpointEnum.USERS}/${createdMale.id}`).deleteRequest(204);
    await api.reset().path(`${EndpointEnum.USERS}/${createdFemale.id}`).deleteRequest(204);
  });
});
