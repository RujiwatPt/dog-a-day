# Contributing

## Development Workflow

1. **Create a branch** for your feature or fix

   ```bash
   git checkout -b feature/description
   ```

2. **Make changes** and ensure tests pass

   ```bash
   pnpm test
   ```

3. **Build and verify** locally

   ````bash
   pnpm dev

   ```bash
   git commit -m "feat: add new feature"
   ````

4. **Push and create a pull request**

## Code Standards

### TypeScript

- Use strict mode
- Provide explicit types for function parameters and returns
- Use interfaces for object shapes
- Avoid `any` types

### Testing

- Write tests for new features
- Ensure all tests pass: `pnpm test`
- Aim for meaningful test coverage

### Naming

- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use UPPER_SNAKE_CASE for constants

### Comments

- Document public APIs with JSDoc comments
- Explain the "why", not just the "what"
- Keep comments up-to-date with code

## Pull Request Guidelines

- Clear PR title and description
- Reference related issues
- Ensure all tests pass
- Update documentation if needed
- Keep commits logical and well-organized

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run specific test file
pnpm test -- index.spec.ts
```

## Local Development

1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm dev`
3. Server runs at `http://localhost:8787`
4. Changes hot-reload automatically

## Type Generation

After updating `wrangler.jsonc` bindings, regenerate types:

```bash
pnpm cf-typegen
```

This updates `worker-configuration.d.ts` with new bindings.

## Deployment

Test before deploying:

```bash
pnpm deploy
```

This publishes to Cloudflare Workers.
