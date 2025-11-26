import { test as base } from '@playwright/test';
import { ApiBuilder } from 'utils/apiBuilder';

type ApiFixtures = {
  api: ApiBuilder;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use, testInfo) => {
    const baseURL = testInfo.project.use.baseURL || '';
    const api = new ApiBuilder(request, baseURL);
    await use(api);
  }
});

export { expect } from '@playwright/test';
