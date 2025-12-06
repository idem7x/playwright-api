declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GO_REST_API_TOKEN: string;
            LOG_LEVEL: string;
            CI: boolean;
        }
    }

    namespace PlaywrightTest {
        interface Matchers<R> {
            shouldMatchSchema(schema: string): Promise<R>;
            shouldEqual(expected: unknown): R;
            shouldContain(expected: unknown): R;
            shouldBeValidEmail(): R;
            shouldBeOneOf(values: unknown[]): R;
            shouldBeArray(): R;
        }
    }
}

export {};
