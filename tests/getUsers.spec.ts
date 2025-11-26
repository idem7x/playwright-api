import { test, expect } from 'fixtures/apiFixtures';
import 'utils/customMatchers';
import type { User } from 'types/userTypes';
import { Endpoint } from "enums/Endpoint";
import { Schema } from "enums/Schema";

test.describe('GET Requests', () => {
    test('GET - Should retrieve all users with pagination and schema validation', async ({ api }) => {
        const response = await api
            .path(Endpoint.USERS)
            .params({ page: 1, per_page: 10 })
            .getRequestJson<User[]>(200);

        await expect(response).shouldMatchSchema(Schema.GET_USERS);

        expect(Array.isArray(response)).toBe(true);
        expect(response.length).toBeGreaterThan(0);
        expect(response.length).toBeLessThanOrEqual(10);
    });

    test('GET - Should retrieve single user by ID with custom matchers', async ({ api }) => {
        const users = await api
            .path(Endpoint.USERS)
            .params({ page: 1, per_page: 1 })
            .getRequestJson<User[]>(200);

        expect(users.length).toBeGreaterThan(0);
        const userId = users[0].id;

        const user = await api
            .path(`${Endpoint.USERS}/${userId}`)
            .getRequestJson<User>(200);

        await expect(user).shouldMatchSchema(Schema.GET_USER);
        expect(user.id).shouldEqual(userId);
        expect(user.email).shouldBeValidEmail();
        expect(user.gender).shouldBeOneOf(['male', 'female']);
        expect(user.status).shouldBeOneOf(['active', 'inactive']);
    });

    test('GET - Should return 404 for non-existent user', async ({ api }) => {
        const nonExistentId = 999999999;

        const response = await api
            .path(`${Endpoint.USERS}/${nonExistentId}`)
            .getRequest(404);

        const body = await response.json();
        expect(body.message).toBeDefined();
    });

    test('GET - Should filter users by gender using fluent API', async ({ api }) => {
        const users = await api
            .path(Endpoint.USERS)
            .params({ gender: 'male', per_page: 5 })
            .getRequestJson<User[]>(200);

        await expect(users).shouldMatchSchema(Schema.GET_USERS);
        users.forEach(user => {
            expect(user.gender).shouldEqual('male');
        });
    });

    test('GET - Should filter users by status', async ({ api }) => {
        const users = await api
            .path(Endpoint.USERS)
            .params({ status: 'active', per_page: 5 })
            .getRequestJson<User[]>(200);

        users.forEach(user => {
            expect(user.status).shouldEqual('active');
        });
    });

    test('GET - Should handle pagination correctly', async ({ api }) => {
        const page1Users = await api
            .reset()
            .path(Endpoint.USERS)
            .params({ page: 1, per_page: 5 })
            .getRequestJson<User[]>(200);

        const page2Users = await api
            .reset()
            .path(Endpoint.USERS)
            .params({ page: 2, per_page: 5 })
            .getRequestJson<User[]>(200);

        const page1Ids = page1Users.map(u => u.id);
        const page2Ids = page2Users.map(u => u.id);

        const hasOverlap = page1Ids.some(id => page2Ids.includes(id));
        expect(hasOverlap).toBeFalsy();
    });

    test('GET - Should search users by name', async ({ api }) => {
        const users = await api
            .path(Endpoint.USERS)
            .params({ page: 1, per_page: 1 })
            .getRequestJson<User[]>(200);

        const searchName = users[0].name;
        const searchResults = await api
            .reset()
            .path(Endpoint.USERS)
            .params({ name: searchName })
            .getRequestJson<User[]>(200);

        expect(searchResults.length).toBeGreaterThan(0);
        expect(searchResults[0].name).shouldContain(searchName);
    });
});
