#!/usr/bin/env node

/**
 * Testing Setup Script
 * Helps set up the testing environment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up JadenX testing environment...\n');

// Check if dependencies are installed
try {
  console.log('📦 Checking dependencies...');
  execSync('npm list @playwright/test pixelmatch lighthouse', { stdio: 'pipe' });
  console.log('✅ Dependencies are installed\n');
} catch (error) {
  console.log('❌ Dependencies missing. Installing...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
}

// Install Playwright browsers
try {
  console.log('🌐 Installing Playwright browsers...');
  execSync('npm run playwright:install', { stdio: 'inherit' });
  console.log('✅ Playwright browsers installed\n');
} catch (error) {
  console.log('⚠️  Playwright browser installation failed. You may need to install system dependencies manually.\n');
  console.log('Run: npm run playwright:install-deps\n');
}

// Create test directories
console.log('📁 Creating test directories...');
const dirs = [
  'tests/__screenshots__',
  'tests/__diff__',
  'tests/__production__',
  'test-results'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
console.log('✅ Test directories created\n');

// Check configuration files
console.log('⚙️  Checking configuration files...');
const configFiles = [
  'playwright.config.js',
  'lighthouserc.js',
  '.github/workflows/ci.yml',
  '.github/workflows/visual-regression.yml'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});
console.log();

// Final instructions
console.log('🎉 Testing environment setup complete!\n');
console.log('📋 Next steps:');
console.log('1. Start the development server: npm run dev');
console.log('2. Run all tests: npm run test:all');
console.log('3. Run visual regression tests: npm run test:visual');
console.log('4. Run Lighthouse CI: npm run test:lighthouse');
console.log('5. Check for broken links: npm run test:links');
console.log();
console.log('📚 For detailed documentation, see TESTING.md');
console.log('🔧 For troubleshooting, check the GitHub Actions logs');
