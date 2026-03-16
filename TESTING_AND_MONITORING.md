# Testing & Monitoring Setup Guide

This document covers the testing infrastructure and error monitoring setup for the Code Library UI project.

## Testing with Vitest

### Installation

Testing dependencies have been added to `package.json`. Install them:

```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm test -- --watch

# Run tests with UI dashboard
npm test:ui

# Generate coverage report
npm test:coverage
```

### Test Files

Unit tests have been created for critical utility functions:

- **`src/utils/validators.test.js`** - Tests for form validation utilities
  - Email, password, username validation
  - Full form validation
  - Required field handling

- **`src/utils/apiCache.test.js`** - Tests for API caching utility
  - Cache set/get operations
  - TTL (time-to-live) expiration
  - Cache clearing and cleanup

- **`src/hooks/useDebounceCallback.test.js`** - Tests for debounce functionality
  - Debounce timing
  - Multiple calls handling
  - Custom delay support

### Writing New Tests

When creating new test files, follow this pattern:

```javascript
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("MyModule", () => {
  beforeEach(() => {
    // Setup before each test
  });

  it("should do something", () => {
    // Arrange
    const input = "test";

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe("expected");
  });

  it("should handle errors", () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

### Test Coverage Goals

- **Utilities:** 80%+ coverage (validators, cache, hooks)
- **Services:** 70%+ coverage (API calls, data transformations)
- **Components:** 60%+ coverage (critical user flows)

Run coverage reports:
```bash
npm test:coverage
```

---

## Error Tracking with Sentry

### Setup

1. **Create a Sentry account:**
   - Go to https://sentry.io
   - Sign up and create a new project for React

2. **Get your DSN:**
   - Copy your project's DSN from Sentry settings

3. **Configure environment variable:**
   - Add to `.env` or `.env.local`:
   ```
   VITE_SENTRY_DSN=https://your-key@sentry.io/your-project-id
   ```

4. **Optional: Set app version:**
   ```
   VITE_APP_VERSION=1.0.0
   ```

### How It Works

Sentry automatically:
- **Captures unhandled exceptions** in React components
- **Tracks performance metrics** (page load, API calls)
- **Records session replays** (useful for debugging)
- **Groups similar errors** for easier triage

### Using Sentry in Code

#### 1. Set User Context (after login)

```javascript
import { sentrySetUserContext } from "@utils/sentry";

// After successful login
sentrySetUserContext({
  id: user._id,
  email: user.email,
  username: user.username,
});
```

#### 2. Capture Custom Messages

```javascript
import { sentryAddBreadcrumb } from "@utils/sentry";

// Log important actions
sentryAddBreadcrumb(
  "User saved solution",
  "user-action",
  "info",
  { problemId: "123", language: "javascript" }
);
```

#### 3. Capture Errors Manually

```javascript
import Sentry from "@sentry/react";

try {
  await saveSolution(data);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: "solution-editor",
    },
  });
}
```

### Sentry Dashboard Features

- **Issues:** Groups similar errors, shows frequency
- **Releases:** Track errors by app version
- **Performance:** Monitor slow API calls and page loads
- **Replays:** Watch user sessions that had errors
- **Alerts:** Get notified of critical errors

### Configuration

Environment-specific settings in `src/utils/sentry.js`:

- **Development:** 100% transaction sampling (see all performance data)
- **Production:** 10% transaction sampling (lower overhead)
- **All environments:** 100% error session replays

Adjust these values based on your needs and Sentry quota.

---

## TypeScript Support (Gradual)

### Setup

A `jsconfig.json` has been created to enable TypeScript features in JavaScript:

- **Path aliases:** Auto-completion for `@utils/...`, `@services/...`, etc.
- **Type checking:** Enable `checkJs: true` in `jsconfig.json` when ready
- **IntelliSense:** Better IDE support for imports

### Gradual Migration

When ready to add TypeScript:

1. Enable JSDoc checking:
   ```json
   "checkJs": true,  // in jsconfig.json
   ```

2. Rename files gradually: `file.js` → `file.ts` or `file.jsx` → `file.tsx`

3. Add JSDoc type hints:
   ```javascript
   /**
    * Validates email format
    * @param {string} email - Email address to validate
    * @returns {{ isValid: boolean, message: string }}
    */
   export const validateEmail = (email) => {
     // ...
   };
   ```

---

## CI/CD Integration

### GitHub Actions Example

Add to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test -- --run
      - run: npm run lint
```

---

## Best Practices

1. **Write tests for:**
   - Utility functions
   - Complex business logic
   - Critical user flows
   - Edge cases and error handling

2. **Use Sentry for:**
   - Tracking production errors
   - Monitoring performance
   - Understanding user behavior
   - Debugging reported issues

3. **Keep tests fast:**
   - Mock API calls
   - Use `vi.useFakeTimers()` for time-based tests
   - Avoid unnecessary wait times

4. **Maintain TypeScript compatibility:**
   - Add types as you go
   - Use JSDoc comments
   - Enable stricter type checking gradually

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [TypeScript JSDoc Handbook](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
