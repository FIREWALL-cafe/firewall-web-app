# Firewall Cafe - Sanity Studio

This directory contains the Sanity Studio configuration for content management.

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the Studio**
   ```bash
   npm run dev
   ```
   Opens at http://localhost:3333

3. **Deploy Studio (for remote access)**
   ```bash
   npx sanity deploy
   ```

## Content Schemas

Located in `schemas/`:

- **event.js** - Event details, locations, images, links
- **pressArticle.js** - Press coverage with thumbnails
- **partner.js** - Partner organizations

## Configuration

Edit `sanity.config.js` to:
- Add plugins
- Customize desk structure
- Add custom components
- Configure document actions

## Common Tasks

### Add a new content type
1. Create schema file in `schemas/`
2. Import in `schemas/index.js`
3. Restart Studio

### Customize the desk
```javascript
// sanity.config.js
import {deskTool} from 'sanity/desk'

export default defineConfig({
  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Events')
              .child(S.documentTypeList('event')),
            // ... more custom structure
          ])
    })
  ]
})
```

## Resources

- [Sanity Studio Docs](https://www.sanity.io/docs/sanity-studio)
- [Schema Reference](https://www.sanity.io/docs/schema-types)
- [Desk Tool](https://www.sanity.io/docs/the-desk-tool)
