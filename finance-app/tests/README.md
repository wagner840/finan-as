# E2E Testing with Playwright

This directory contains end-to-end tests for the Finance App using Playwright.

## Setup

Playwright has been configured with the following features:
- **Cross-browser testing**: Chromium, Firefox, and WebKit
- **Automatic dev server**: Starts the Vite dev server before running tests
- **HTML reporting**: Generates detailed test reports
- **Mobile testing**: Includes responsive design tests

## Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI mode (interactive)
npm run test:ui

# Show test report
npm run test:report

# Run specific test file
npx playwright test finance-app.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

## Test Coverage

The current test suite covers:

### Core Functionality
- ✅ App loading and navigation
- ✅ Dark mode toggle functionality
- ✅ Transaction form opening and interaction
- ✅ Currency input validation and formatting
- ✅ Category color preview display

### UI/UX Features
- ✅ Responsive design (mobile/desktop)
- ✅ Form validation
- ✅ Navigation between views
- ✅ Modal interactions

### Currency Input Tests
- ✅ "30" becomes "30,00" formatting
- ✅ Value deletion and editing
- ✅ Decimal input handling ("30,5" → "30,50")
- ✅ Form blur and focus behavior

### Dark Mode Tests
- ✅ Toggle between light/dark modes
- ✅ State persistence verification
- ✅ UI elements respond to theme changes

## System Dependencies

If you encounter browser launch issues, install system dependencies:

```bash
# Install system dependencies
sudo npx playwright install-deps

# Or install manually
sudo apt-get install libnspr4 libnss3 libasound2t64
```

## Configuration

- **Base URL**: http://127.0.0.1:5173 (Vite dev server)
- **Test timeout**: Default Playwright settings
- **Retry strategy**: 2 retries on CI, none locally
- **Parallel execution**: Enabled for faster test runs

## Writing New Tests

Follow the existing patterns in `finance-app.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.getByRole('button', { name: 'Button' })).toBeVisible();
  });
});
```

## Debugging

- Use `page.pause()` to debug interactively
- Enable tracing with `trace: 'on'` in config
- Use VS Code Playwright extension for better debugging experience