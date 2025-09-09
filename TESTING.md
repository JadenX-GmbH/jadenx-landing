# Testing Documentation

This document outlines the comprehensive testing setup for the JadenX website, including visual regression testing, performance monitoring, accessibility checks, and link validation.

## 🧪 Test Suite Overview

The testing suite includes:

- **Visual Regression Testing** - Screenshots comparison with pixelmatch
- **Lighthouse CI** - Performance, accessibility, and SEO audits
- **Link Checking** - Broken link detection
- **CI/CD Integration** - Automated testing in GitHub Actions

## 📋 Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run playwright:install

# Optional: Install system dependencies for browsers
npm run playwright:install-deps
```

## 🖼️ Visual Regression Testing

### Overview
Visual regression tests capture screenshots of your website and compare them against production or baseline versions using pixelmatch for pixel-perfect comparisons.

### Configuration
- **Viewports**: 390x844 (mobile), 1440x900 (desktop)
- **Routes**: `/`, `/contact`
- **Threshold**: 5% difference allowed
- **Output**: Diffs saved to `tests/__diff__/`

### Running Tests

```bash
# Run all visual regression tests
npm run test:visual

# Run tests in headed mode (visible browser)
npm run test:visual:headed

# Debug tests
npm run test:visual:debug

# Update baseline screenshots (after intentional changes)
npm run test:visual:update
```

### Test Structure

```
tests/
├── visual-regression.spec.js      # Main test file
├── utils/
│   └── visual-regression-utils.js # Helper utilities
├── __screenshots__/               # Local screenshots
├── __production__/                # Production screenshots
└── __diff__/                      # Difference images
```

### Customizing Tests

Edit `tests/visual-regression.spec.js` to:

- Add new routes to test
- Modify viewport sizes
- Adjust comparison threshold
- Configure browser settings

## 🚀 Lighthouse CI

### Overview
Lighthouse CI runs automated audits for performance, accessibility, best practices, and SEO.

### Targets
- **Performance**: ≥95
- **Accessibility**: ≥95
- **Best Practices**: ≥90
- **SEO**: ≥90

### Running Lighthouse Tests

```bash
# Run Lighthouse CI
npm run test:lighthouse

# Run with custom config
npm run test:lighthouse:desktop
```

### Configuration
The `lighthouserc.js` file contains:
- URLs to audit
- Performance budgets
- Assertion rules
- Server startup configuration

### Key Metrics Monitored
- First Contentful Paint (FCP) < 2000ms
- Largest Contentful Paint (LCP) < 3000ms
- Cumulative Layout Shift (CLS) < 0.1
- Total Blocking Time (TBT) < 300ms

## 🔗 Link Checking

### Overview
Automated link checking ensures no broken links exist on your website.

### Configuration
- **Base URL**: Configurable via `BASE_URL` environment variable
- **Routes**: `/`, `/contact`
- **Concurrent Connections**: 5
- **Timeout**: 30 seconds

### Running Link Checks

```bash
# Check links on local server
npm run test:links

# Check links on staging/production
npm run test:links:ci
```

### Features
- ✅ Detects 404 errors
- ✅ Validates external links
- ✅ Excludes mailto/tel links
- ✅ Generates detailed reports
- ✅ Fails CI on broken links

## 🔄 CI/CD Integration

### GitHub Actions Workflows

#### Main CI Pipeline (`.github/workflows/ci.yml`)
- Runs on push/PR to main/develop
- Executes all test suites
- Deploys to staging on success
- Uploads test artifacts

#### Visual Regression (`.github/workflows/visual-regression.yml`)
- Manual trigger via GitHub UI
- Scheduled weekly runs
- Environment-specific testing
- PR comments with results

### Environment Variables

```bash
# Base URL for testing
BASE_URL=http://localhost:4321

# Production URL for comparison
PRODUCTION_URL=https://www.jadenx.com

# Enable visual regression mode
VISUAL_REGRESSION=true
```

## 📊 Reports and Artifacts

### Test Results Location

```
test-results/
├── junit.xml              # JUnit test results
├── broken-links.json      # Link checker results
└── lighthouse/            # Lighthouse reports

tests/
├── __screenshots__/       # Local screenshots
├── __diff__/             # Difference images
└── __production__/       # Production screenshots
```

### HTML Reports
- Playwright: `playwright-report/index.html`
- Lighthouse: `lighthouseci/index.html`
- Visual Regression: `tests/__diff__/report.html`

## 🛠️ Development Workflow

### Local Development

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Run tests in another terminal**
   ```bash
   npm run test:all
   ```

3. **Debug failing tests**
   ```bash
   npm run test:visual:debug
   ```

### Pre-commit Testing

```bash
# Run all tests before committing
npm run test:ci

# Clean test results
npm run clean:test-results
```

### Updating Baselines

When you make intentional visual changes:

1. Update screenshots
   ```bash
   npm run test:visual:update
   ```

2. Verify changes
   ```bash
   npm run test:visual
   ```

3. Commit updated baselines
   ```bash
   git add tests/__screenshots__/
   git commit -m "Update visual regression baselines"
   ```

## 🔧 Troubleshooting

### Common Issues

#### Playwright Browser Installation
```bash
# Reinstall browsers
npm run playwright:install

# Install system dependencies
npm run playwright:install-deps
```

#### Lighthouse Timeout
- Increase timeout in `lighthouserc.js`
- Check server startup time
- Verify network connectivity

#### Visual Regression Failures
- Check viewport sizes match
- Verify font loading consistency
- Review dynamic content timing
- Update baseline if changes are intentional

#### Link Checker Issues
- Verify `BASE_URL` is accessible
- Check for rate limiting
- Review excluded link patterns

### Debug Mode

```bash
# Debug Playwright tests
npm run test:visual:debug

# Verbose Lighthouse output
DEBUG=lhci npm run test:lighthouse

# Detailed link checker logs
DEBUG=blc npm run test:links
```

## 📈 Performance Optimization

### Lighthouse Score Targets

| Metric | Target | Current |
|--------|--------|---------|
| Performance | ≥95 | - |
| Accessibility | ≥95 | - |
| Best Practices | ≥90 | - |
| SEO | ≥90 | - |

### Common Performance Issues

1. **Large Images** - Optimize and compress images
2. **Unused CSS/JS** - Remove unused code
3. **Slow Server Response** - Optimize backend/API calls
4. **Render-blocking Resources** - Optimize loading order

### Accessibility Improvements

1. **Color Contrast** - Ensure WCAG compliance
2. **Alt Text** - Add descriptive alt attributes
3. **Keyboard Navigation** - Test with keyboard only
4. **Screen Reader** - Verify with screen readers

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Visual Regression Testing Guide](https://playwright.dev/docs/test-screenshots)
- [Lighthouse Scoring Guide](https://web.dev/performance-scoring/)

## 🤝 Contributing

1. Write tests for new features
2. Update baselines for visual changes
3. Ensure all tests pass before merging
4. Review test failures in CI/CD pipeline

## 📞 Support

For testing-related issues:
1. Check this documentation
2. Review CI/CD logs
3. Check test artifacts
4. Create an issue with reproduction steps
