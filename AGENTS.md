# AI Agent Instructions for Frontend

## After Making Changes

After any changes to TypeScript, JavaScript, CSS, or test files in this frontend folder, you MUST:

1. **Run linting**: `npm run lint`
   - Fix any linting errors before proceeding
   - Use `npm run lint:fix` for auto-fixable issues

2. **Run unit tests**: `npm run test:run`
   - Ensure all tests pass
   - If tests fail, fix the code or update the tests appropriately

3. **Run E2E tests**: `npm run test:e2e`
   - Ensure all Playwright tests pass
   - If tests fail, fix the code or update the tests appropriately
   - Tests auto-start the fixture server and Vite dev server — no manual setup needed

## Workflow

1. Make code changes
2. Run `npm run lint` (fix any issues)
3. Run `npm run test:run` (verify unit tests pass)
4. Run `npm run test:e2e` (verify E2E tests pass)
5. Confirm all pass before completing the task

## Available Scripts

- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Auto-fix linting errors
- `npm run format` - Format code with Biome
- `npm run test:run` - Run unit tests once
- `npm test` - Run unit tests in watch mode
- `npm run test:ui` - Open Vitest UI
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:server` - Start local fixture server on port 8002
- `npm run dev:test` - Start Vite pointed at fixture server (manual browser testing)
- `npm run build` - Build for production (also runs TypeScript check)

## E2E Test Structure

- Tests live in `e2e/tests/` and use [Playwright](https://playwright.dev/)
- Fixture JSON files live in `e2e/fixtures/` — these are the mock API responses
- The fixture server (`e2e/server/testServer.ts`) serves fixture files over HTTP on port 8002
- Vite proxies `/api/*` requests to the fixture server during testing
- When adding new API endpoints to the app, add a corresponding fixture file and route in `testServer.ts`

## Quality Standards

- All code must pass linting (Biome)
- All unit tests must pass
- All E2E tests must pass
- TypeScript compilation must succeed
- No `any` types without justification
