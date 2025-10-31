# Firewall Cafe Web App

A React-based web application that helps researchers, journalists, and educators understand internet censorship by providing side-by-side search comparisons between Google and Baidu with geographic visualization and analytics.

## Features

- **Dual Search Engine Comparison**: Compare Google and Baidu image search results side-by-side
- **Multilingual Support**: Full English/Chinese localization powered by Sanity CMS
- **Search Archive**: Browse and filter historical search queries with advanced filtering
- **Geographic Analytics**: Visualize search patterns across countries and regions
- **Community Voting**: Assess search result quality with 7 vote categories
- **Interactive Dashboard**: Data visualization with Chart.js and geographic heatmaps
- **Event & Partner Pages**: CMS-managed content with localization support

## Architecture

### Frontend
- **React 18.2** with functional components and hooks
- **React Router v6** for client-side routing
- **Tailwind CSS** for styling
- **Vercel Serverless Functions** for API integration

### Backend Services
- **Sanity CMS**: Headless CMS for content management and localization
- **Backend API**: Node.js/Express API with PostgreSQL (separate repository)
- **External APIs**: Serper.dev (Google), Baidu scraping, Google Translate

### Deployment
- **Vercel**: Serverless hosting and automatic deployments
- **Sanity Studio**: Hosted CMS interface for content editing

## Prerequisites

- [Node.js](https://nodejs.org/en/download) v20.x.x (specified in package.json)
- [nvm](https://github.com/nvm-sh/nvm) for Node version management
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) package manager
- [Vercel CLI](https://vercel.com/docs/cli) for local development and deployment

## Installation

1. **Install Node.js version manager (nvm)**
   ```bash
   # Follow installation guide at https://github.com/nvm-sh/nvm
   ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/FIREWALL-cafe/firewall-web-app.git
   cd firewall-web-app
   ```

3. **Use correct Node version**
   ```bash
   nvm use
   # If Node 20 is not installed, run: nvm install 20
   ```

4. **Install dependencies**
   ```bash
   yarn install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API keys and configuration
   ```

   Required environment variables:
   - `REACT_APP_SANITY_PROJECT_ID`: Sanity project ID
   - `REACT_APP_SANITY_DATASET`: Sanity dataset (usually "production")
   - `SERPER_API_KEY`: Serper.dev API key for Google searches
   - `BACKEND_API_URL`: Backend API endpoint
   - `API_SECRET`: Backend API authentication secret
   - `SHARED_SECRET`: Translation service shared secret

6. **Start development server**
   ```bash
   vercel dev
   ```

   Visit http://localhost:3000/

   **Note**: Use `vercel dev` (not `yarn dev` or `npm start`) to ensure serverless functions run correctly.

## Development

### Available Scripts

```bash
# Start Vercel development environment with serverless functions
vercel dev

# Build for production
yarn build

# Run tests
yarn test                # Watch mode
yarn test:ci             # Single run for CI
yarn test:minimal        # Run minimal test suite

# Code quality
yarn lint                # Check for linting errors
yarn lint:fix            # Auto-fix linting issues
yarn format              # Format code with Prettier
yarn format:check        # Check formatting without changes

# Deployment preparation
yarn predeploy           # Runs format, lint, and build
```

### Project Structure

```
firewall-web-app/
├── api/                          # Vercel serverless functions
│   ├── images.js                 # Image search endpoint
│   ├── proxy.js                  # Backend API proxy
│   ├── proxy-image.js            # Image CORS proxy
│   ├── searches.js               # Search filtering
│   └── search-locations.js       # Location data
├── src/
│   ├── components/               # React components
│   │   ├── Dashboard/            # Dashboard modules
│   │   ├── Events.jsx            # Events page (localized)
│   │   ├── Partners.jsx          # Partners page (localized)
│   │   ├── Navigation.jsx        # Site navigation with language switcher
│   │   └── ...
│   ├── context/                  # React contexts
│   │   ├── ApiContext.js         # API integration context
│   │   └── LanguageContext.jsx   # Localization context
│   ├── lib/
│   │   └── sanity.js             # Sanity CMS client and queries
│   ├── assets/                   # Images, icons, static files
│   └── index.js                  # App entry point
├── studio/                       # Sanity Studio configuration
│   ├── schemas/                  # CMS schemas
│   │   ├── eventLocalized.js     # Localized events schema
│   │   ├── partnerLocalized.js   # Localized partners schema
│   │   ├── navigationSettings.js # Navigation menu schema
│   │   └── localeTypes.js        # Localization utilities
│   └── sanity.config.js          # Sanity configuration
├── .claude/                      # Development session documentation
└── docs/                         # Additional documentation
```

### Working with Sanity CMS

#### Start Sanity Studio

```bash
cd studio
npx sanity dev
```

Visit http://localhost:3333/ to access the CMS interface.

#### Localization

The app supports English and Chinese through Sanity CMS:

- **Navigation Menu**: Fully managed through CMS (labels, order, visibility)
- **Events & Partners**: Content with field-level localization
- **Language Switcher**: Site-wide toggle in navigation bar

#### Creating Localized Content

1. Open Sanity Studio (http://localhost:3333)
2. Create a new document in a localized schema (e.g., "Event (Localized)")
3. Fill in English and Chinese fields side-by-side
4. Publish the document
5. Changes appear on the website within ~60 seconds (CDN cache)

See `docs/sanity-cms/` for detailed CMS documentation.

### Common Development Tasks

#### Adding a New Page

1. Create component in `src/components/`
2. Add route in `src/index.js`
3. (Optional) Add to navigation menu via Sanity Studio

#### Updating Navigation Menu

**Via Sanity Studio (Recommended):**
1. Open "Navigation Menu" document
2. Edit labels, reorder items, or toggle visibility
3. Publish changes

**Via Code (For structure changes):**
1. Edit `studio/schemas/navigationSettings.js`
2. Update `src/components/Navigation.jsx`

#### Working with Search Filters

Filter logic is in `src/components/FilterControls.jsx`:
- Geographic filters: countries, US states, search locations
- Temporal filters: date ranges
- Content filters: vote categories, search terms

## Deployment

### Vercel (Current Platform)

The app is deployed on Vercel with automatic deployments from the `main` branch.

**Production URL**: https://firewall-frontend-kvfqd8qds-firewall-cafe.vercel.app

#### Deploy to Production

1. **Automatic Deployment** (Recommended)
   ```bash
   git push origin main
   # Vercel automatically builds and deploys
   ```

2. **Manual Deployment**
   ```bash
   yarn predeploy    # Run checks and build
   vercel --prod     # Deploy to production
   ```

#### Environment Variables

Set environment variables in Vercel dashboard:
1. Visit https://vercel.com/dashboard
2. Select project "firewall-frontend"
3. Settings → Environment Variables
4. Add/update variables
5. Redeploy for changes to take effect

### Google App Engine (Legacy)

**Note**: The app was previously deployed to Google App Engine but has migrated to Vercel.

**Legacy URL**: https://fwc-2023.ue.r.appspot.com/

If you need to deploy to GAE:
1. Install [Cloud SDK](https://cloud.google.com/sdk?hl=en)
2. Set GCP project: `gcloud config set project [PROJECT_ID]`
3. Deploy: `gcloud app deploy`

Contact the code owner for GAE access permissions.

## Backend API

The web app connects to a separate backend API service for data persistence.

**Repository**: `/Users/ummonai/dev/firewall/server/api`  
**Production URL**: https://api.firewallcafe.com  
**Local Port**: 11458

### Backend Features
- PostgreSQL database
- Search data and analytics
- Image storage and retrieval
- Vote management
- Geographic enrichment (IP → location)

See backend repository for setup and API documentation.

## Testing

```bash
# Run tests in watch mode
yarn test

# Run tests once (for CI)
yarn test:ci

# Run minimal test suite
yarn test:minimal
```

Tests use:
- Jest
- React Testing Library
- Mock data in `spec/mocks/`

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -m "description"`
3. Run checks: `yarn predeploy`
4. Push and create pull request
5. Wait for CI checks to pass
6. Request code review

### Code Standards

- Use functional React components with hooks
- Follow existing naming conventions
- Run `yarn lint:fix` and `yarn format` before committing
- Write tests for new features
- Update documentation for significant changes

## Troubleshooting

### "Module not found" errors in production
- Ensure all new files are committed to git
- Run `git status` to check for untracked files
- Vercel builds from git repository, not local filesystem

### Search functionality not working locally
- Use `vercel dev` instead of `react-scripts start`
- Serverless functions in `/api` directory require Vercel dev server

### Language switching not updating content
- Clear browser cache
- Check Sanity Studio for published (not draft) content
- Verify `REACT_APP_SANITY_PROJECT_ID` in `.env.local`

### Navigation menu not showing
- Create "Navigation Menu" document in Sanity Studio
- Ensure document is published
- Check browser console for fetch errors

## Resources

### Documentation
- [Project Architecture](CLAUDE.md) - Detailed technical documentation
- [Sanity CMS Guide](SANITY_CMS.md) - CMS integration and localization
- [Session Notes](.claude/sessions/) - Development session history

### External Services
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Sanity Studio](http://localhost:3333) (local)
- [Sanity Project](https://www.sanity.io/manage)

### API Documentation
- [Serper.dev](https://serper.dev/docs) - Google search API
- [Vercel Functions](https://vercel.com/docs/functions) - Serverless functions

## License

[Add license information]

## Contact

For questions or access requests, please contact the code owner.

---

**Last Updated**: October 2025  
**Node Version**: 20.x.x  
**React Version**: 18.2  
**Deployment Platform**: Vercel
