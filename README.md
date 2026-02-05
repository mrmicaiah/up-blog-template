# UP Blog Template

A reusable 11ty blog template for UP Blogs with full theming support, API integration, and automatic deployment.

## Features

- **11ty Static Site Generator** with Nunjucks templates
- **Single config file theming** via `src/_data/site.json`
- **Responsive design** with customizable colors and fonts
- **Blog functionality**: Posts, archive, RSS feed, sitemap
- **Interactive features**: Subscribe form, likes, comments, share buttons
- **SEO optimized**: Schema.org JSON-LD, Open Graph, Twitter Cards
- **Analytics ready**: Google Analytics 4 + Facebook Pixel support
- **Auto-deploy**: GitHub Actions workflow for GitHub Pages

## Quick Start

1. **Clone or fork this template**
2. **Edit `src/_data/site.json`** with your site details
3. **Add posts** as markdown files in `src/posts/`
4. **Push to main branch** - GitHub Actions will build and deploy

## Configuration

All site configuration lives in `src/_data/site.json`:

```json
{
  "name": "Your Blog Name",
  "tagline": "Your tagline here",
  "description": "SEO description",
  "url": "https://yourdomain.com",
  
  "colors": {
    "primary": "#E07020",
    "primaryDark": "#C45F18",
    "background": "#F5EDE0",
    "surface": "#FFFFFF",
    "text": "#2D2A26",
    "textMuted": "#6B6560",
    "border": "#E0D5C5"
  },
  
  "fonts": {
    "serif": "Libre Baskerville",
    "sans": "Inter"
  },
  
  "analytics": {
    "ga4Id": "G-XXXXXXXXXX",
    "facebookPixelId": "1234567890"
  },
  
  "api": {
    "blogId": "your-blog-id",
    "workerUrl": "https://up-blogs-1.micaiah-tasks.workers.dev",
    "courierListId": "your-courier-list-id"
  }
}
```

## Writing Posts

Create markdown files in `src/posts/` with frontmatter:

```markdown
---
title: My Post Title
date: 2025-02-05
excerpt: A short summary for post cards
image: https://example.com/featured-image.jpg
author: Author Name
tags:
  - topic
  - another-topic
---

Your post content here...
```

## Directory Structure

```
up-blog-template/
├── src/
│   ├── _data/
│   │   └── site.json        # Site configuration
│   ├── _layouts/
│   │   ├── base.njk         # Base HTML template
│   │   ├── home.njk         # Homepage layout
│   │   ├── post.njk         # Blog post layout
│   │   ├── page.njk         # Static page layout
│   │   └── archive.njk      # Archive page layout
│   ├── css/
│   │   └── styles.css       # Stylesheet
│   ├── js/
│   │   └── main.js          # JavaScript (subscribe, likes, comments)
│   ├── images/              # Site images (logo, favicon)
│   ├── posts/               # Blog posts (markdown)
│   ├── index.njk            # Homepage
│   ├── archive.njk          # Archive page
│   ├── about.njk            # About page
│   ├── feed.njk             # RSS feed
│   ├── sitemap.njk          # XML sitemap
│   └── robots.txt           # Robots file
├── .eleventy.js             # 11ty configuration
├── package.json
└── build-deploy.yml         # GitHub Actions (move to .github/workflows/)
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server with live reload
npm run dev

# Build for production
npm run build
```

## Deployment

### GitHub Pages (Automatic)

1. Move `build-deploy.yml` to `.github/workflows/build-deploy.yml`
2. Enable GitHub Pages in repo settings (Settings → Pages → Source: GitHub Actions)
3. Push to main branch - site will auto-build and deploy

### Manual Deployment

Run `npm run build` and upload the `_site/` folder to any static host.

## API Integration

The template integrates with the UP Blogs Worker API for:

- **Email subscriptions** - Connects to Courier email lists
- **Post likes** - Stored in the blog's database
- **Comments** - Submitted and retrieved via API

Configure your `api` settings in `site.json` to connect.

## Customization

### Colors

Change `colors` in `site.json`. The CSS uses CSS custom properties that are set from your config.

### Fonts

Change `fonts.serif` and `fonts.sans` in `site.json`. Google Fonts are loaded automatically.

### Navigation

Edit the `navigation` array in `site.json`:

```json
"navigation": [
  { "label": "Home", "url": "/" },
  { "label": "Archive", "url": "/archive/" },
  { "label": "About", "url": "/about/" }
]
```

### Add New Pages

Create a `.njk` file in `src/`:

```njk
---
layout: page
title: Contact
permalink: /contact/
---

Your page content here.
```

## License

MIT License - Use freely for your own blogs.

---

Built for [Untitled Publishers](https://untitledpublishers.com)
