# The Ghosts We Carry

Marketing website for "The Ghosts We Carry" - a memoir by Steve Bogucki.

Production: https://the-ghosts-we-carry.com

## Overview

This is a static website hosted on Netlify with serverless functions for email automation.

## Local Development

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Run `npm install` to install dependencies
4. Use Netlify CLI for local development: `netlify dev`

## Deployment

The site automatically deploys to Netlify when changes are pushed to the `main` branch.

## Environment Variables

Set these in the Netlify dashboard:

- `EMAIL_HOST` - SMTP host (e.g., smtp.gmail.com)
- `EMAIL_PORT` - SMTP port (e.g., 587)
- `EMAIL_SECURE` - Use TLS (false for port 587)
- `EMAIL_USER` - Email address for sending
- `EMAIL_PASS` - App password for email
- `SITE_URL` - Optional. Email links always use https://the-ghosts-we-carry.com (set in the function).

Never commit `.env`. It is git-ignored.

## Structure

```
/
├── index.html              # Homepage
├── excerpt.html            # Excerpts page
├── changelog.html          # Latest updates
├── changelog-archive.html  # Historical updates
├── success.html            # Subscribe confirmation (noindex)
├── 404.html                # Not-found page
├── robots.txt              # Search/AI crawler policy
├── sitemap.xml             # Indexable pages
├── llms.txt                # Plain-text summary for AI search tools
├── og-image.jpg            # 1200x630 social share image
├── author_image.jpg        # Author photo (800x1200)
├── styles.css              # Main stylesheet
├── script.js               # JavaScript functionality
├── favicon.svg             # Site favicon
├── read/                   # Online reader
│   ├── index.html          # Table of contents
│   ├── authors-note.html   # Author's note
│   ├── prologue.html       # Prologue
│   └── part-[1-16].html    # All 16 parts
├── netlify/
│   └── functions/
│       └── submission-created.js  # Subscribe confirmation email (Netlify event-triggered)
└── [config files]
```

## Online Reader

The `/read/` directory contains the complete book, free to read with no sign-up. Chapters are indexable and listed in `sitemap.xml`; AI training crawlers are disallowed in `robots.txt`. It includes:

- Table of contents with all chapters
- Progress bar showing reading position
- Chapter-to-chapter navigation
- Responsive design for all devices

## Crawling Policy

`robots.txt` allows search engines and AI search/answer agents everywhere. AI model-training
crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot, anthropic-ai, Omgili, and others) are
blocked from `/read/` and the PDF.

## Security

- Security headers (CSP, HSTS, etc.) and redirects live in `netlify.toml`.
- Repository files (`package.json`, `README.md`, `netlify/`) are forced to 404 because Netlify publishes the repo root.
- `submission-created.js` cannot be called directly (Netlify returns 403) and only mails a single valid address from a genuine `download-form` submission. It never logs addresses.

## Crisis Resources

Every page includes crisis resources in the footer:
- Veterans Crisis Line: 988 (press 1)
- Crisis Text Line: Text HOME to 741741
