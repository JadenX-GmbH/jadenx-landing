#!/usr/bin/env node

/**
 * Link Checker Script
 * Checks for broken links and reports failures
 */

import blc from 'broken-link-checker';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const ROUTES_TO_CHECK = ['/', '/contact'];
const CONCURRENT_CONNECTIONS = 5;
const TIMEOUT = 30000; // 30 seconds

let brokenLinks = [];
let totalLinks = 0;
let checkedLinks = 0;

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

function createSiteChecker() {
  return new blc.SiteChecker({
    filterLevel: 3, // Check all links
    acceptedSchemes: ['http', 'https'],
    excludedKeywords: [
      'mailto:',
      'tel:',
      'javascript:',
      '#'
    ],
    maxSockets: CONCURRENT_CONNECTIONS,
    maxSocketsPerHost: 2,
    requestMethod: 'get',
    userAgent: 'JadenX-LinkChecker/1.0',
    timeout: TIMEOUT,
  }, {
    link: (result, customData) => {
      totalLinks++;
      checkedLinks++;

      if (result.broken) {
        brokenLinks.push({
          url: result.url.original,
          brokenReason: result.brokenReason,
          httpStatusCode: result.http.response ? result.http.response.statusCode : null,
          baseUrl: result.base.original,
        });

        log(`Broken link found: ${result.url.original} (${result.brokenReason})`, 'error');
      } else {
        log(`Link OK: ${result.url.original}`, 'success');
      }
    },
    page: (error, pageUrl, customData) => {
      if (error) {
        log(`Error checking page ${pageUrl}: ${error.message}`, 'error');
      } else {
        log(`Page checked: ${pageUrl}`);
      }
    },
    site: (error, siteUrl, customData) => {
      if (error) {
        log(`Site check error for ${siteUrl}: ${error.message}`, 'error');
      }
    },
    end: () => {
      log(`Link checking completed. Total links: ${totalLinks}, Broken links: ${brokenLinks.length}`);

      if (brokenLinks.length > 0) {
        log('Broken links summary:', 'error');
        brokenLinks.forEach(link => {
          console.log(`  - ${link.url} (${link.brokenReason})`);
        });

        // Write broken links to file for CI artifacts
        const reportPath = path.join('test-results', 'broken-links.json');
        if (!fs.existsSync('test-results')) {
          fs.mkdirSync('test-results', { recursive: true });
        }

        fs.writeFileSync(reportPath, JSON.stringify({
          timestamp: new Date().toISOString(),
          totalLinks,
          brokenLinks: brokenLinks.length,
          brokenLinksDetails: brokenLinks
        }, null, 2));

        log(`Broken links report saved to: ${reportPath}`, 'error');

        // Exit with error code for CI
        process.exit(1);
      } else {
        log('All links are working! 🎉', 'success');
        process.exit(0);
      }
    }
  });
}

async function checkLinks() {
  log(`Starting link check for ${BASE_URL}`);
  log(`Routes to check: ${ROUTES_TO_CHECK.join(', ')}`);

  const siteChecker = createSiteChecker();

  // Check each route
  ROUTES_TO_CHECK.forEach(route => {
    const fullUrl = `${BASE_URL}${route}`;
    log(`Enqueuing: ${fullUrl}`);
    siteChecker.enqueue(fullUrl);
  });
}

// Handle process termination
process.on('SIGINT', () => {
  log('Link checking interrupted by user');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`, 'error');
  process.exit(1);
});

// Start the link checking
checkLinks().catch(error => {
  log(`Fatal error: ${error.message}`, 'error');
  process.exit(1);
});
