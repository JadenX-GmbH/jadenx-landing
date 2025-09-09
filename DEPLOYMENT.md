# GitHub Pages Deployment Guide

This guide covers deploying the JadenX Astro website to GitHub Pages with custom domain configuration.

## 🚀 Quick Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The deployment workflow will handle the rest

### 2. Configure Custom Domain

1. In **Settings** → **Pages** → **Custom domain**
2. Enter: `test.jadenx.com`
3. Click **Save**
4. GitHub will automatically generate DNS records

### 3. Enable HTTPS

1. In **Settings** → **Pages** → **Enforce HTTPS**
2. Check the box to enable HTTPS
3. GitHub will provision an SSL certificate automatically

## 🔧 Workflow Configuration

### Deploy Workflow (`.github/workflows/deploy.yml`)

The workflow includes:

- **Build Job**: Compiles Astro site with Node.js 18
- **Deploy Job**: Uploads built files to GitHub Pages
- **Permissions**: Proper GITHUB_TOKEN permissions for Pages deployment
- **Concurrency**: Prevents multiple deployments from running simultaneously

### Key Features

- ✅ Automatic deployment on push to `main` branch
- ✅ Manual deployment trigger via GitHub UI
- ✅ Build artifact upload for faster deployments
- ✅ Custom domain support
- ✅ HTTPS enforcement

## 🌐 Custom Domain Setup

### DNS Configuration

After setting `test.jadenx.com` in GitHub Pages, you'll need to:

1. **Add CNAME Record** (if using a subdomain):
   ```
   Type: CNAME
   Name: test
   Value: jacekjanczura.github.io
   ```

2. **Add A Records** (if using apex domain):
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

### SSL Certificate

GitHub Pages automatically:
- Provisions SSL certificate
- Handles certificate renewals
- Enforces HTTPS redirects

## 📁 Project Structure

### Files Created

```
.github/workflows/deploy.yml    # Deployment workflow
public/.nojekyll               # Disable Jekyll processing
DEPLOYMENT.md                  # This documentation
```

### Build Output

The `npm run build` command generates:
- `dist/` - Built Astro site
- Static HTML, CSS, JS files
- Optimized images and assets
- Sitemap and robots.txt

## 🚀 Deployment Process

### Automatic Deployment

1. Push changes to `main` branch
2. GitHub Actions workflow triggers
3. Site builds in ~2-3 minutes
4. Deploys to `test.jadenx.com`

### Manual Deployment

1. Go to **Actions** tab in GitHub
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Choose branch (usually `main`)

## 🔍 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Check build locally
npm run build

# Check for errors in Actions logs
# Look for Node.js or Astro build errors
```

#### Domain Not Working
```bash
# Check DNS propagation
nslookup test.jadenx.com

# Verify CNAME/A records
dig test.jadenx.com

# Wait for DNS propagation (can take 24-48 hours)
```

#### HTTPS Issues
- Ensure domain is verified
- Check if DNS records are correct
- Wait for SSL certificate provisioning

#### 404 Errors
- Check if `.nojekyll` file exists in `public/`
- Verify build output in `dist/` directory
- Check GitHub Pages deployment status

### Build Logs

Check deployment logs in:
1. **Actions** → **Deploy to GitHub Pages**
2. Click on the running/completed job
3. Review build and deploy steps

## 🌍 Environment Configuration

### Build Environment Variables

```bash
# In workflow or local build
SITE_URL=https://test.jadenx.com
```

### Runtime Configuration

The site automatically:
- Uses the configured SITE_URL
- Generates correct canonical URLs
- Updates sitemap with production URLs
- Configures meta tags for social sharing

## 📊 Monitoring

### Deployment Status

Check deployment status:
- **Settings** → **Pages** - Shows deployment status
- **Actions** → **Deploy to GitHub Pages** - Build logs
- Site URL - Verify live deployment

### Performance

Monitor with:
- Lighthouse CI (already configured)
- Google Search Console
- Google Analytics

## 🔄 Migration to Production

### When Ready for jadenx.com

1. **Update DNS Records**:
   ```bash
   # Point jadenx.com to GitHub Pages
   Type: CNAME (or A records)
   Name: @
   Value: jacekjanczura.github.io
   ```

2. **Update GitHub Pages Settings**:
   - Change custom domain to `jadenx.com`
   - Enable HTTPS enforcement

3. **Update Build Configuration**:
   ```bash
   SITE_URL=https://jadenx.com
   ```

4. **Update Workflow**:
   - Modify `deploy.yml` for production URL
   - Update sitemap configuration

## 📞 Support

### GitHub Pages Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Troubleshooting Guide](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/troubleshooting-jekyll-build-errors-for-github-pages-sites)

### Astro Resources

- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/github-pages/)
- [GitHub Pages Integration](https://docs.astro.build/en/guides/integrations-guide/github-pages/)

## ✅ Checklist

### Pre-deployment
- [ ] Repository pushed to GitHub
- [ ] GitHub Pages enabled in repository settings
- [ ] Custom domain configured (test.jadenx.com)
- [ ] HTTPS enabled
- [ ] DNS records updated

### Post-deployment
- [ ] Site loads at test.jadenx.com
- [ ] HTTPS working (green lock icon)
- [ ] All pages loading correctly
- [ ] Contact form working
- [ ] Links and navigation working
- [ ] Mobile responsive design verified

### Testing
- [ ] Run `npm run test:all` locally
- [ ] Verify Lighthouse scores
- [ ] Check for broken links
- [ ] Test visual regression (when production site available)

Ready for deployment! 🚀
