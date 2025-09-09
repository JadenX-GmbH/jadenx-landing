module.exports = {
  ci: {
    collect: {
      // Collect Lighthouse reports for the specified URLs
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/contact'
      ],
      // Number of times to run Lighthouse
      numberOfRuns: 3,
      // Start the server before collecting
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'ready in',
      // Server ready timeout
      startServerReadyTimeout: 60000,
    },
    upload: {
      // Upload results to temporary public storage
      target: 'temporary-public-storage',
    },
    assert: {
      // Assert that all categories meet the specified scores
      assertions: {
        // Performance score must be >= 95
        'categories:performance': ['error', { minScore: 0.95 }],
        // Accessibility score must be >= 95
        'categories:accessibility': ['error', { minScore: 0.95 }],
        // Best practices score should be good
        'categories:best-practices': ['error', { minScore: 0.9 }],
        // SEO score should be good
        'categories:seo': ['error', { minScore: 0.9 }],

        // Specific performance metrics
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],

        // Accessibility specific checks
        'axe/aria-allowed-attr': 'error',
        'axe/aria-required-attr': 'error',
        'axe/aria-required-children': 'error',
        'axe/aria-required-parent': 'error',
        'axe/aria-roles': 'error',
        'axe/aria-valid-attr-value': 'error',
        'axe/aria-valid-attr': 'error',
        'axe/button-name': 'error',
        'axe/image-alt': 'error',
        'axe/link-name': 'error',
        'axe/list': 'error',
        'axe/listitem': 'error',

        // Link checking - fail on any broken links
        'link-checker': 'error',
      },
    },
  },
};
