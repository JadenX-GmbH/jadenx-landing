import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

/**
 * Visual Regression Testing Utilities
 */

/**
 * Load PNG image from file
 */
export async function loadPNG(filePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`File not found: ${filePath}`));
      return;
    }

    const png = new PNG();
    const stream = fs.createReadStream(filePath);
    stream.pipe(png)
      .on('parsed', () => resolve(png))
      .on('error', reject);
  });
}

/**
 * Save PNG to file
 */
export function savePNG(png, filePath) {
  return new Promise((resolve, reject) => {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    png.pack().pipe(stream)
      .on('finish', resolve)
      .on('error', reject);
  });
}

/**
 * Compare two PNG images using pixelmatch
 */
export function compareImages(img1, img2, options = {}) {
  const { threshold = 0.1, includeAA = false, alpha = 0.1 } = options;

  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold, includeAA, alpha }
  );

  const totalPixels = width * height;
  const diffPercentage = numDiffPixels / totalPixels;

  return {
    diff,
    numDiffPixels,
    diffPercentage,
    width,
    height,
    totalPixels
  };
}

/**
 * Generate visual regression report
 */
export function generateReport(comparison, options = {}) {
  const {
    route,
    viewport,
    browser,
    threshold = 0.05,
    localPath,
    productionPath,
    diffPath
  } = options;

  const { diffPercentage, numDiffPixels, totalPixels } = comparison;

  return {
    route,
    viewport,
    browser,
    threshold,
    diffPercentage,
    numDiffPixels,
    totalPixels,
    isDifferent: diffPercentage > threshold,
    localPath,
    productionPath,
    diffPath,
    status: diffPercentage > threshold ? 'FAILED' : 'PASSED'
  };
}

/**
 * Clean up old diff files
 */
export function cleanupOldDiffs(diffDir = 'tests/__diff__') {
  if (fs.existsSync(diffDir)) {
    const files = fs.readdirSync(diffDir);
    files.forEach(file => {
      if (file.endsWith('_diff.png')) {
        fs.unlinkSync(path.join(diffDir, file));
      }
    });
  }
}

/**
 * Get file size in human readable format
 */
export function formatFileSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Create HTML report for visual regression results
 */
export function createHTMLReport(results, outputPath = 'tests/__diff__/report.html') {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Regression Test Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
        }
        .summary-item {
            text-align: center;
        }
        .summary-value {
            font-size: 2em;
            font-weight: bold;
            color: #495057;
        }
        .summary-label {
            color: #6c757d;
            margin-top: 5px;
        }
        .results {
            padding: 20px;
        }
        .test-case {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
        }
        .test-header {
            background: #f8f9fa;
            padding: 15px;
            border-bottom: 1px solid #dee2e6;
        }
        .test-title {
            margin: 0;
            font-size: 1.1em;
            color: #495057;
        }
        .test-meta {
            color: #6c757d;
            font-size: 0.9em;
            margin-top: 5px;
        }
        .test-status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-passed {
            background: #d4edda;
            color: #155724;
        }
        .status-failed {
            background: #f8d7da;
            color: #721c24;
        }
        .comparison {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            padding: 15px;
        }
        .comparison img {
            width: 100%;
            height: auto;
            border: 1px solid #dee2e6;
            border-radius: 4px;
        }
        .comparison-label {
            text-align: center;
            font-size: 0.9em;
            color: #6c757d;
            margin-top: 5px;
        }
        .metrics {
            padding: 15px;
            background: #f8f9fa;
            border-top: 1px solid #dee2e6;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
        }
        .metric {
            text-align: center;
        }
        .metric-value {
            font-weight: bold;
            color: #495057;
        }
        .metric-label {
            font-size: 0.8em;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Visual Regression Test Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>

        <div class="summary">
            <div class="summary-item">
                <div class="summary-value">${results.length}</div>
                <div class="summary-label">Total Tests</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">${results.filter(r => r.status === 'PASSED').length}</div>
                <div class="summary-label">Passed</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">${results.filter(r => r.status === 'FAILED').length}</div>
                <div class="summary-label">Failed</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">${(results.reduce((sum, r) => sum + r.diffPercentage, 0) / results.length * 100).toFixed(2)}%</div>
                <div class="summary-label">Avg Difference</div>
            </div>
        </div>

        <div class="results">
            ${results.map(result => `
                <div class="test-case">
                    <div class="test-header">
                        <h3 class="test-title">${result.route} - ${result.viewport}</h3>
                        <div class="test-meta">
                            Browser: ${result.browser} |
                            Diff: ${(result.diffPercentage * 100).toFixed(2)}% |
                            Pixels: ${result.numDiffPixels}
                        </div>
                        <span class="test-status status-${result.status.toLowerCase()}">${result.status}</span>
                    </div>

                    ${result.isDifferent ? `
                        <div class="comparison">
                            <div>
                                <img src="../__screenshots__/${path.basename(result.localPath)}" alt="Local">
                                <div class="comparison-label">Local</div>
                            </div>
                            <div>
                                <img src="../__production__/${path.basename(result.productionPath)}" alt="Production">
                                <div class="comparison-label">Production</div>
                            </div>
                            <div>
                                <img src="${path.basename(result.diffPath)}" alt="Difference">
                                <div class="comparison-label">Difference</div>
                            </div>
                        </div>
                    ` : ''}

                    <div class="metrics">
                        <div class="metrics-grid">
                            <div class="metric">
                                <div class="metric-value">${(result.diffPercentage * 100).toFixed(2)}%</div>
                                <div class="metric-label">Difference</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">${result.numDiffPixels}</div>
                                <div class="metric-label">Diff Pixels</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">${result.totalPixels}</div>
                                <div class="metric-label">Total Pixels</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">${(result.threshold * 100).toFixed(2)}%</div>
                                <div class="metric-label">Threshold</div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, html);
  console.log(`📊 Visual regression report generated: ${outputPath}`);
}
