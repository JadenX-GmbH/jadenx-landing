# JadenX - Enterprise Software Development

A modern, high-performance website built with Astro for JadenX, a leading provider of custom software development and digital transformation solutions.

## 🌟 Features

- ⚡ **High Performance** - Built with Astro for optimal loading speeds
- 🎨 **Modern Design** - Clean, professional design with dark theme
- 📱 **Responsive** - Mobile-first approach with perfect mobile experience
- ♿ **Accessible** - WCAG compliant with screen reader support
- 🔍 **SEO Optimized** - Comprehensive SEO setup with structured data
- 🧪 **Well Tested** - Complete testing suite with visual regression
- 🚀 **CI/CD Ready** - Automated deployment to GitHub Pages

## 🏗️ Tech Stack

- **[Astro](https://astro.build/)** - Modern web framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)** - Performance monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/jadenx-landing.git
cd jadenx-landing

# Install dependencies
npm install

# Setup testing environment
npm run setup:testing
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:4321 in your browser
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Run specific test suites
npm run test:visual      # Visual regression tests
npm run test:lighthouse  # Performance & accessibility
npm run test:links       # Broken link detection

# Setup testing environment
npm run setup:testing
```

See [TESTING.md](./TESTING.md) for comprehensive testing documentation.

## 🚀 Deployment

### GitHub Pages (Automatic)

The project includes automated deployment to GitHub Pages:

1. **Enable GitHub Pages** in repository settings
2. **Set custom domain** to `test.jadenx.com`
3. **Enable HTTPS** enforcement
4. **Push to main branch** - deployment happens automatically

### Manual Deployment

```bash
# Build the site
npm run build

# The dist/ folder contains the built site
# Upload contents to your hosting provider
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
/
├── public/                    # Static assets
│   ├── .nojekyll             # Disable Jekyll for GitHub Pages
│   ├── favicon.svg           # Site favicon
│   └── robots.txt            # Search engine crawling rules
├── src/
│   ├── components/           # Reusable Astro components
│   │   ├── ContactForm.astro # Contact form with validation
│   │   ├── Header.astro      # Site navigation
│   │   ├── Footer.astro      # Site footer
│   │   ├── JsonLd.astro      # Structured data (SEO)
│   │   └── Tabs.astro        # Interactive tabs component
│   ├── layouts/              # Page layouts
│   │   └── BaseLayout.astro  # Main layout with SEO
│   ├── pages/                # Route pages
│   │   ├── index.astro       # Homepage
│   │   ├── contact.astro     # Contact page
│   │   └── 404.astro         # 404 error page
│   ├── sections/             # Page sections
│   │   ├── Hero.astro        # Hero section
│   │   ├── ValueTriplet.astro# Feature highlights
│   │   └── CTA.astro         # Call-to-action
│   └── styles/               # Global styles
├── tests/                    # Test files
│   ├── visual-regression.spec.js
│   └── utils/
├── .github/workflows/        # GitHub Actions
│   ├── ci.yml               # Main CI pipeline
│   ├── deploy.yml           # GitHub Pages deployment
│   └── visual-regression.yml # Visual regression tests
├── scripts/                  # Utility scripts
│   ├── link-checker.js      # Broken link detection
│   └── setup-testing.js     # Test environment setup
└── astro.config.mjs         # Astro configuration
```

## 🧞 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run test:all`        | Run all tests (visual, lighthouse, links)        |
| `npm run test:visual`     | Run visual regression tests                      |
| `npm run test:lighthouse` | Run Lighthouse performance tests                 |
| `npm run test:links`      | Check for broken links                           |
| `npm run setup:testing`   | Setup testing environment                        |

## 🌐 Environment Variables

Create a `.env` file for local development:

```bash
# Site configuration
SITE_URL=http://localhost:4321

# Optional: API endpoints, analytics, etc.
# Add your environment variables here
```

## 📊 Performance

The site is optimized for:

- **Performance Score**: ≥95 (Lighthouse)
- **Accessibility Score**: ≥95 (Lighthouse)
- **SEO Score**: ≥90 (Lighthouse)
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `npm run test:all`
5. Commit changes: `git commit -m 'Add your feature'`
6. Push to branch: `git push origin feature/your-feature`
7. Create a Pull Request

## 📚 Documentation

- [TESTING.md](./TESTING.md) - Comprehensive testing guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- [Astro Documentation](https://docs.astro.build/) - Framework docs
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling docs

## 📞 Support

For questions or issues:
- Create an issue in this repository
- Check the documentation
- Review the testing artifacts in GitHub Actions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

Built with ❤️ by JadenX | [test.jadenx.com](https://test.jadenx.com)
