# AI Agent Instructions for Frontend

## After Making Changes

After any changes to TypeScript, JavaScript, CSS, or test files in this frontend folder, you MUST:

1. **Run linting**: `npm run lint`
   - Fix any linting errors before proceeding
   - Use `npm run lint:fix` for auto-fixable issues

2. **Run tests**: `npm run test:run`
   - Ensure all tests pass
   - If tests fail, fix the code or update the tests appropriately

## Workflow

1. Make code changes
2. Run `npm run lint` (fix any issues)
3. Run `npm run test:run` (verify all tests pass)
4. Confirm both pass before completing the task

## Available Scripts

- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Auto-fix linting errors
- `npm run format` - Format code with Biome
- `npm run test:run` - Run all tests once
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Open Vitest UI
- `npm run build` - Build for production (also runs TypeScript check)

## Quality Standards

- All code must pass linting (Biome)
- All tests must pass
- TypeScript compilation must succeed
- No `any` types without justification
