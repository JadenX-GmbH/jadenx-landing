const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

class AssetDownloader {
  constructor() {
    this.downloadDir = path.join(__dirname, 'public', 'img');
    this.maxRetries = 3;
    this.timeout = 30000; // 30 seconds
    this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    // Create download directory if it doesn't exist
    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir, { recursive: true });
    }
  }

  // Extract filename from URL
  getFilenameFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = path.basename(pathname);

      // If no extension, try to get from query params or add default
      if (!path.extname(filename)) {
        // Check for common image extensions in URL
        if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.svg') || url.includes('.webp')) {
          const urlParts = url.split('/');
          const lastPart = urlParts[urlParts.length - 1];
          if (lastPart.includes('.')) {
            return lastPart.split('?')[0]; // Remove query params
          }
        }
        return `image_${Date.now()}.png`; // Fallback
      }

      return filename.split('?')[0]; // Remove query params
    } catch (error) {
      console.error(`Error parsing URL ${url}:`, error.message);
      return `image_${Date.now()}.png`;
    }
  }

  // Download single asset with retries
  async downloadAsset(url, filename, retryCount = 0) {
    try {
      console.log(`Downloading: ${filename} (attempt ${retryCount + 1}/${this.maxRetries + 1})`);

      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept 2xx and 3xx
        }
      });

      const filePath = path.join(this.downloadDir, filename);
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`✅ Downloaded: ${filename}`);
          resolve({ success: true, filename, size: response.headers['content-length'] || 'unknown' });
        });

        writer.on('error', (error) => {
          console.error(`❌ Write error for ${filename}:`, error.message);
          reject(error);
        });
      });

    } catch (error) {
      console.error(`❌ Download failed for ${filename}:`, error.message);

      if (retryCount < this.maxRetries) {
        console.log(`🔄 Retrying ${filename} in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.downloadAsset(url, filename, retryCount + 1);
      } else {
        console.error(`💀 Failed to download ${filename} after ${this.maxRetries + 1} attempts`);
        return { success: false, filename, error: error.message };
      }
    }
  }

  // Download all assets from the assets list
  async downloadAllAssets(assets) {
    const results = {
      successful: [],
      failed: [],
      total: 0,
      successCount: 0,
      failCount: 0
    };

    // Combine all images from all pages
    const allImages = [];
    Object.values(assets.pages).forEach(page => {
      if (page.assets && page.assets.images) {
        allImages.push(...page.assets.images);
      }
    });

    // Add icons
    Object.values(assets.pages).forEach(page => {
      if (page.assets && page.assets.icons) {
        allImages.push(...page.assets.icons.map(icon => ({
          src: icon.href,
          description: icon.description || 'icon'
        })));
      }
    });

    results.total = allImages.length;
    console.log(`\n🚀 Starting download of ${results.total} assets...\n`);

    // Download each asset
    for (const asset of allImages) {
      const filename = this.getFilenameFromUrl(asset.src);
      const result = await this.downloadAsset(asset.src, filename);

      if (result.success) {
        results.successful.push(result);
        results.successCount++;
      } else {
        results.failed.push(result);
        results.failCount++;
      }

      // Small delay between downloads to be respectful
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  }

  // Generate download report
  generateReport(results) {
    console.log('\n📊 Download Report');
    console.log('==================');
    console.log(`Total assets: ${results.total}`);
    console.log(`Successful: ${results.successCount}`);
    console.log(`Failed: ${results.failCount}`);

    if (results.failed.length > 0) {
      console.log('\n❌ Failed downloads:');
      results.failed.forEach(fail => {
        console.log(`  - ${fail.filename}: ${fail.error}`);
      });
    }

    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      results: results
    };

    fs.writeFileSync(
      path.join(__dirname, 'docs', 'DOWNLOAD_REPORT.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n📄 Report saved to docs/DOWNLOAD_REPORT.json');
  }
}

// Main execution
async function main() {
  try {
    console.log('🎯 JadenX Asset Downloader');
    console.log('=========================\n');

    // Read assets from the JSON file
    const assetsPath = path.join(__dirname, 'docs', 'ASSETS.json');
    if (!fs.existsSync(assetsPath)) {
      console.error('❌ ASSETS.json not found. Please run asset extraction first.');
      process.exit(1);
    }

    const assets = JSON.parse(fs.readFileSync(assetsPath, 'utf8'));
    const downloader = new AssetDownloader();

    const results = await downloader.downloadAllAssets(assets);
    downloader.generateReport(results);

    console.log('\n🎉 Download process completed!');
    console.log(`📁 Assets saved to: ${downloader.downloadDir}`);

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = AssetDownloader;
