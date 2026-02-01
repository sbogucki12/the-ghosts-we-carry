# The Ghosts We Carry

Marketing website for "The Ghosts We Carry" - a memoir by Steve Bogucki.

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
- `SITE_URL` - Full site URL

## Structure

```
/
├── index.html              # Homepage
├── excerpt.html            # Excerpts page
├── changelog.html          # Latest updates
├── changelog-archive.html  # Historical updates
├── success.html            # Form submission success
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
│       ├── form-submission.js  # Email automation
│       └── test-function.js    # Health check
└── [config files]
```

## Online Reader

The `/read/` directory contains the complete book available for online reading. Accessible from the success page after form submission, it includes:

- Table of contents with all chapters
- Progress bar showing reading position
- Chapter-to-chapter navigation
- Responsive design for all devices

## Crisis Resources

Every page includes crisis resources in the footer:
- Veterans Crisis Line: 988 (press 1)
- Crisis Text Line: Text HOME to 741741
