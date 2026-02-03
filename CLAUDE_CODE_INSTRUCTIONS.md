# CLAUDE CODE INSTRUCTIONS
## The Ghosts We Carry - Complete Website Build

**Document Version:** 1.0  
**Created:** January 25, 2026  
**Purpose:** Complete instructions for Claude Code to build the marketing website from scratch

---

# OVERVIEW

You are building a complete marketing website for "The Ghosts We Carry," a memoir by Steve Bogucki. This document contains every instruction you need to create the entire project from scratch.

**Key Requirements:**
- Modern, atmospheric design with dark-to-warm color progression
- Netlify hosting with serverless functions for email automation  
- Full SEO optimization including JSON-LD schema
- Mobile-responsive design
- Email collection form with automatic PDF delivery

**The author will manually add `The Ghosts We Carry.pdf` to the root directory. Do not create this file.**

---

# STEP 1: INITIALIZE PROJECT AND VERSION CONTROL

Execute these commands in order:

```bash
git init
git remote add origin https://github.com/sbogucki12/the-ghosts-we-carry.git
git branch -M main
```

After all files are created, push to remote:
```bash
git add .
git commit -m "Complete website build"
git push -u origin main
```

---

# STEP 2: FILE STRUCTURE

Create this exact structure:

```
/
├── index.html
├── excerpt.html
├── changelog.html
├── changelog-archive.html
├── success.html
├── styles.css
├── script.js
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── netlify.toml
├── package.json
├── README.md
├── .gitignore
├── .env.example
├── _redirects
└── netlify/
    └── functions/
        ├── form-submission.js
        └── test-function.js
```

---

# STEP 3: DESIGN SPECIFICATIONS

## Color Palette (CSS Variables)

```css
:root {
    --color-deep: #1a1a2e;
    --color-charcoal: #16213e;
    --color-sand: #c9b99a;
    --color-amber: #d4a853;
    --color-olive: #4a5240;
    --color-cream: #f5f5f0;
    --color-warm-bg: #2d2a24;
    --color-warm-light: #3d3830;
    --color-dark-footer: #0f0f1a;
}
```

## Typography

```css
--font-display: 'Libre Baskerville', serif;  /* Headlines */
--font-body: 'Source Serif 4', serif;        /* Body text */
--font-ui: 'Outfit', sans-serif;             /* UI elements */
```

Google Fonts URL:
```
https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&display=swap
```

## Design Philosophy

The visual journey mirrors the book's arc:
- **Hero (top):** Dark, isolated, desert atmosphere
- **Middle:** Gradual warming, emerging from darkness
- **Download section:** Warm amber, hope, connection
- **Footer:** Dark but warm (closure, not isolation)

Include subtle grain texture overlay via SVG data URI.

---

# STEP 4: CONTENT SPECIFICATIONS

## Hero Section
- Title: "The Ghosts We Carry"
- Subtitle: "From Combat to the Disconnected Generation"
- Quote: "At forty-two, he mastered the art of the exit. Now he's learning something harder: how to stay in the room."
- CTA: "Download Free Draft" → links to #download

## Premise Section (after hero)
```
This is not a war story.
It's a story about what happens after.
About a generation more connected than ever—and more alone.
About patterns carved so deep they feel like fate.
About the love that finally said: don't quit on me.
```

## Three Threads Section
Three cards: Combat, Isolation, Redemption
Each with Part number, title, excerpt quote, and link to excerpt.html

### Combat (Part III)
"The missile screamed at him before ending in a massive explosion. The 2nd Brigade TOC was completely disintegrated. Armored vehicles had simply disappeared."

### Isolation (Part XI)
"Three men in three separate units, experiencing three variations of the same millennial condition—never more connected, never more alone."

### Redemption (Part XVII)
"For the first time in his life, the pain of leaving would exceed the pain of staying. She became the immovable object his pattern couldn't overcome."

## Featured Excerpt Section
Title: "The Ghosts"
Content: The survivor's guilt passage about Kuhns (from Part IV)

## Download Section
- Title: "Download the Free Draft"
- Subtitle: "The foundational content is complete. Your feedback shapes what it becomes."
- Email form with Netlify integration
- Trust badges: No spam, Rare updates, Direct PDF access

## About Section
- Name: Steve Bogucki
- Bio: Combat veteran. OIF I with 2nd Brigade, 3rd Infantry Division during the invasion. Ramadi 2004-2005 with 1/503rd Infantry as a Forward Observer.
- Current: FAA Division Manager for AI & Data Analytics. Long Beach, California.
- Note: This is his first book.
- Credentials: Two combat deployments, Presidential guest (Storm the Hill 2007), Federal service since 2010
- Links: LinkedIn (sbogucki12), Instagram (bogoodskighosts)

## Updates Section
- Status: Preliminary Final Draft
- Date: January 11, 2026
- Link to changelog.html

## Footer (all pages)
- Crisis resources: Veterans Crisis Line 988 (press 1), Crisis Text Line: Text HOME to 741741
- Links: Home, Excerpt, Changelog, Contact (LinkedIn)
- Copyright: © 2026 Steve Bogucki

---

# STEP 5: TECHNICAL SPECIFICATIONS

## Netlify Form Configuration

Hidden form for detection:
```html
<form name="download-form" netlify netlify-honeypot="bot-field" hidden>
    <input type="email" name="email">
</form>
```

Visible form:
```html
<form id="download-form" name="download-form" method="POST" 
      data-netlify="true" data-netlify-honeypot="bot-field" 
      action="/success.html" class="download-form">
    <input type="hidden" name="form-name" value="download-form">
    <p style="display: none;">
        <label>Don't fill this out: <input name="bot-field"></label>
    </p>
    <input type="email" name="email" placeholder="Your email address" required>
    <p class="form-error" role="alert"></p>
    <button type="submit" class="btn-primary">Send Me the Manuscript</button>
</form>
```

## Environment Variables (Netlify Dashboard)

| Variable | Value |
|----------|-------|
| EMAIL_HOST | smtp.gmail.com |
| EMAIL_PORT | 587 |
| EMAIL_SECURE | false |
| EMAIL_USER | (author's email) |
| EMAIL_PASS | (author's app password) |
| SITE_URL | https://the-ghosts-we-carry.netlify.app |

## SEO Requirements

Every page needs:
- Meta description
- Open Graph tags (og:title, og:description, og:type, og:url, og:image)
- Twitter Card tags
- Canonical URL
- JSON-LD schema (index.html only - Book type)

## Accessibility Requirements
- Semantic HTML (nav, main, section, article, footer)
- ARIA labels on navigation, sections, forms
- role="alert" on form errors
- aria-hidden on decorative elements
- Proper heading hierarchy

---

# STEP 6: FILE CONTENTS

## .gitignore
```
.DS_Store
Thumbs.db
.idea/
.vscode/
node_modules/
npm-debug.log*
.env
.env.local
.netlify/
*.docx
*.doc
!The Ghosts We Carry.pdf
!robots.txt
!sitemap.xml
```

## .env.example
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SITE_URL=https://the-ghosts-we-carry.netlify.app
```

## package.json
```json
{
  "name": "the-ghosts-we-carry",
  "version": "2.0.0",
  "description": "Marketing website for The Ghosts We Carry memoir",
  "dependencies": {
    "@netlify/functions": "^2.0.0",
    "nodemailer": "^6.9.7"
  }
}
```

## netlify.toml
```toml
[build]
  publish = "/"
  functions = "netlify/functions"

[[forms]]
  name = "download-form"

[context.production.environment]
  SITE_URL = "https://the-ghosts-we-carry.netlify.app"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

## _redirects
```
/.netlify/functions/form-submission  200!
```

## robots.txt
```
User-agent: *
Allow: /
Sitemap: https://the-ghosts-we-carry.netlify.app/sitemap.xml

User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /
```

## sitemap.xml
Include URLs for: /, /excerpt.html, /changelog.html, /changelog-archive.html, /success.html
All with lastmod: 2026-01-25

## favicon.svg
Book icon with gradient from deep (#1a1a2e) to amber (#d4a853)

---

# STEP 7: SERVERLESS FUNCTION

## netlify/functions/form-submission.js

The function should:
1. Parse POST request body
2. Extract email from various payload structures
3. Use nodemailer to send styled HTML email
4. Include download link to PDF
5. Include crisis resources in footer
6. Log appropriately for debugging

Email should include:
- Styled header with book title
- Download button linking to PDF
- Note about draft status (January 11, 2026)
- The opening quote
- Request for feedback
- Footer with privacy note and crisis resources

---

# STEP 8: PAGE-SPECIFIC NOTES

## index.html
- Full homepage with all sections
- JSON-LD Book schema
- Primary conversion page

## excerpt.html
- Three excerpts: Ghosts, Isolation, Redemption (with anchors #ghosts, #isolation, #redemption)
- Download form at bottom
- Navigation back to home

## changelog.html
- January 11, 2026 entry (Preliminary Final Draft)
- Key changes summary
- Link to archive

## changelog-archive.html
- December 20, 2025 entry
- April 7, 2025 entry
- March 2025 entries

## success.html
- Thank you message
- Direct download button for PDF
- Note about email
- Link back to home
- noindex meta tag

---

# STEP 9: CSS STRUCTURE

Organize styles in this order:
1. CSS Variables
2. Reset & Base
3. Grain Texture Overlay
4. Navigation (fixed, scroll effect)
5. Hero Section (animations)
6. Buttons
7. Each content section
8. Footer
9. Page-specific styles (changelog, success)
10. Animations (@keyframes)
11. Responsive (768px, 480px)
12. Utility classes

Key animations:
- fadeInUp for hero content (staggered delays)
- bounce for scroll indicator

---

# STEP 10: JAVASCRIPT FEATURES

1. Navigation scroll effect (add .scrolled class)
2. Mobile nav toggle
3. Smooth scroll for anchor links
4. Form validation (email regex)
5. Form error display
6. Thread card click-to-link
7. Scroll indicator fade
8. Keyboard navigation for cards
9. Local dev form handling

---

# STEP 11: VERIFICATION CHECKLIST

Before pushing:
- [ ] All HTML files have proper meta tags
- [ ] Forms have Netlify attributes
- [ ] Hidden honeypot fields present
- [ ] Crisis resources in all footers
- [ ] Mobile nav toggle works
- [ ] External links have target="_blank" rel="noopener"
- [ ] JSON-LD schema valid
- [ ] All internal links use relative paths

---

# STEP 12: FINAL COMMANDS

```bash
npm install
git add .
git commit -m "Complete website build with new design"
git push -u origin main
```

---

# IMPORTANT NOTES

1. **DO NOT create The Ghosts We Carry.pdf** - author adds manually
2. **Site URL:** https://the-ghosts-we-carry.netlify.app
3. **Crisis resources on EVERY page footer**
4. **Grain overlay** via SVG data URI in CSS body::before
5. **Typography hierarchy:** Libre Baskerville (headlines), Source Serif 4 (body), Outfit (UI)
6. **Mobile breakpoints:** 768px (tablet), 480px (mobile)

---

# END OF INSTRUCTIONS

Execute each step in order. Create all files exactly as specified. Result: production-ready website for "The Ghosts We Carry."
