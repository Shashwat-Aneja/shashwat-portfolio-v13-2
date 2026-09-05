# Shashwat Aneja Portfolio / V4

Production-oriented static portfolio build for `https://shashwataneja.com/`.

## Visual/content rule
The existing V4 visual direction, motion language, copy, and approved palette are preserved. This revision is focused on technical SEO, crawlability, accessibility foundations, canonicalization, and deployment correctness rather than redesign.

## SEO implementation
- Descriptive homepage title targeting the personal entity naturally.
- Natural meta description.
- Canonical homepage URL: `https://shashwataneja.com/`.
- Open Graph and X/Twitter metadata.
- `Person`, `WebSite`, and `ProfilePage` JSON-LD connected with `@id` references.
- Verified GitHub profile connected through `sameAs` and `rel="me"`.
- One H1 on the homepage and semantic H2 section headings.
- `robots.txt` with the production sitemap URL.
- `sitemap.xml` containing only the currently indexable canonical homepage.
- Clean trailing-slash project URLs.
- Project placeholders are `noindex,follow` until verified project details are supplied, preventing thin placeholder pages from becoming search results.
- Custom `404.html` with `noindex`.
- `CNAME` for GitHub Pages custom-domain deployment.
- Favicon and Apple touch icon.
- Open Graph preview image.

## Performance/accessibility
- No external JavaScript libraries.
- No external font dependency.
- Decorative effects are CSS-based.
- Reduced-motion handling is included.
- Keyboard focus states and skip link are included.
- Decorative visual layers are `aria-hidden`.
- Scroll-driven CSS animation is progressive enhancement; JavaScript provides the introduction fallback.

## Search Console deployment checklist
1. Deploy the contents of this folder to the GitHub Pages repository configured for `shashwataneja.com`.
2. Confirm `https://shashwataneja.com/` resolves with HTTPS.
3. Add/verify the domain property in Google Search Console. Prefer DNS verification; no fabricated verification token is included in this build.
4. Submit `https://shashwataneja.com/sitemap.xml`.
5. Inspect the homepage URL and request indexing after deployment.
6. Once real project details are added, replace the three placeholder project pages, remove their `noindex`, add their canonical URLs to the sitemap, and add project-specific structured data only where justified.
