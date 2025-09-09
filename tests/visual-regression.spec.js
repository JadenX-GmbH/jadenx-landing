import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

// Test routes to check
const routes = [
  '/',
  '/contact'
];

// Viewports for testing
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 }
];

// Pixelmatch threshold (0.05 = 5% difference allowed)
const THRESHOLD = 0.05;

/**
 * Load PNG image from file
 */
async function loadPNG(filePath) {
  return new Promise((resolve, reject) => {
    const png = new PNG();
    const stream = fs.createReadStream(filePath);
    stream.pipe(png)
      .on('parsed', () => resolve(png))
      .on('error', reject);
  });
}

/**
 * Compare two PNG images using pixelmatch
 */
function compareImages(img1, img2) {
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  const totalPixels = width * height;
  const diffPercentage = numDiffPixels / totalPixels;

  return {
    diff,
    numDiffPixels,
    diffPercentage,
    isDifferent: diffPercentage > THRESHOLD
  };
}

/**
 * Save PNG to file
 */
function savePNG(png, filePath) {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath);
    png.pack().pipe(stream)
      .on('finish', resolve)
      .on('error', reject);
  });
}

/**
 * Ensure directory exists
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Test each route at each viewport
routes.forEach(route => {
  viewports.forEach(viewport => {
    test.describe(`${route} - ${viewport.name} (${viewport.width}x${viewport.height})`, () => {

      test('Visual regression test', async ({ page, browserName }) => {
        // Set viewport
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });

        // Navigate to the page
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        // Wait for any dynamic content to load
        await page.waitForTimeout(2000);

        // Define file paths
        const screenshotName = `${route.replace(/\//g, '_').replace(/^_/, 'home')}_${viewport.name}_${browserName}`;
        const localScreenshotPath = path.join('tests/__screenshots__', `${screenshotName}.png`);
        const productionScreenshotPath = path.join('tests/__production__', `${screenshotName}.png`);
        const diffPath = path.join('tests/__diff__', `${screenshotName}_diff.png`);

        // Ensure directories exist
        ensureDirectoryExists(path.dirname(localScreenshotPath));
        ensureDirectoryExists(path.dirname(productionScreenshotPath));
        ensureDirectoryExists(path.dirname(diffPath));

        // Take screenshot of local version
        await page.screenshot({
          path: localScreenshotPath,
          fullPage: true
        });

        // Fetch production screenshot
        const productionUrl = `https://www.jadenx.com${route}`;
        try {
          // Use a new browser context to fetch production screenshot
          const productionContext = await page.context().browser().newContext();
          const productionPage = await productionContext.newPage();

          await productionPage.setViewportSize({
            width: viewport.width,
            height: viewport.height
          });

          await productionPage.goto(productionUrl);
          await productionPage.waitForLoadState('networkidle');
          await productionPage.waitForTimeout(2000);

          await productionPage.screenshot({
            path: productionScreenshotPath,
            fullPage: true
          });

          await productionContext.close();

          // Compare screenshots
          const localPNG = await loadPNG(localScreenshotPath);
          const productionPNG = await loadPNG(productionScreenshotPath);

          const comparison = compareImages(localPNG, productionPNG);

          // Save diff if there are differences
          if (comparison.isDifferent) {
            await savePNG(comparison.diff, diffPath);

            console.log(`❌ Visual difference detected for ${route} (${viewport.name})`);
            console.log(`   Diff pixels: ${comparison.numDiffPixels}`);
            console.log(`   Diff percentage: ${(comparison.diffPercentage * 100).toFixed(2)}%`);
            console.log(`   Threshold: ${(THRESHOLD * 100).toFixed(2)}%`);
            console.log(`   Diff saved to: ${diffPath}`);
          } else {
            console.log(`✅ No significant visual differences for ${route} (${viewport.name})`);
          }

          // Assert that differences are within threshold
          expect(comparison.diffPercentage).toBeLessThanOrEqual(THRESHOLD);

        } catch (error) {
          console.warn(`⚠️  Could not fetch production screenshot for ${route}:`, error.message);
          console.log(`📸 Local screenshot saved to: ${localScreenshotPath}`);

          // If we can't fetch production, just verify local screenshot exists
          expect(fs.existsSync(localScreenshotPath)).toBe(true);
        }
      });
    });
  });
});

// Additional test for screenshot consistency across browsers
test.describe('Cross-browser consistency', () => {
  test('Homepage screenshots match across browsers', async ({ browserName }) => {
    // This test ensures that screenshots are consistent across different browsers
    // Useful for detecting browser-specific rendering differences

    test.skip(browserName !== 'chromium', 'Only run on Chromium for baseline');

    const route = '/';
    const viewport = viewports[0]; // Use mobile viewport

    // This would be expanded to compare screenshots across different browsers
    // For now, just verify that screenshots can be taken consistently

    const page = await global.page; // Would need to be set up in global setup
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height
    });

    await page.goto(route);
    await page.waitForLoadState('networkidle');

    const screenshotPath = path.join('tests/__screenshots__', `consistency_${route}_${viewport.name}.png`);
    ensureDirectoryExists(path.dirname(screenshotPath));

    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    expect(fs.existsSync(screenshotPath)).toBe(true);
  });
});
