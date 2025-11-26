import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: [
            "node_modules/",
            "dist/",
            "test-results/",
            "playwright-report/",
            ".playwright/",
        ],
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        plugins: {
            playwright,
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/no-misused-promises": "error",
            '@typescript-eslint/no-namespace': ['error', {
                allowDeclarations: true
            }],

            "object-curly-spacing": ["error", "always"],
            "no-console": "warn",
            "no-debugger": "error",
            "prefer-const": "error",
            "no-var": "error",
            "eqeqeq": ["error", "always"],

            "playwright/no-focused-test": "error",
            "playwright/no-skipped-test": "warn",
            "playwright/valid-expect": "error",
            "playwright/expect-expect": "off",
            "playwright/no-conditional-in-test": "warn",
            "playwright/no-wait-for-timeout": "warn",
        },
    },
];