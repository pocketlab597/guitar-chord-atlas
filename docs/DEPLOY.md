# Deploy Notes

This project is a static site. It can be deployed to Cloudflare Pages without a build step.

## Recommended First Publish

Use Cloudflare Pages connected to a GitHub repository.

Suggested settings:

- Framework preset: None
- Build command: leave empty
- Build output directory: `/`
- Production branch: `master` for the current repository, or `main` if the branch is renamed later
- Environment variables: none

## Before A Custom Domain

It is fine to start on the generated `*.pages.dev` URL for private checks and early feedback.
Do not promote that URL heavily if a custom domain will be purchased soon. Treat it as a temporary preview URL.

## When Adding A Custom Domain

Once a domain is chosen, set it in Cloudflare Pages as the canonical public URL and use that URL in README, social profiles, sitemap, and Search Console.

If the site has already been indexed at another URL, add redirects from the old URL to the custom domain where possible.

## Monetization Notes

The initial MVP does not include analytics, ads, affiliate links, forms, or external scripts.
When adding AdSense or analytics later, update both `index.html` CSP and the Cloudflare `_headers` CSP.

## Current Public-Safety Posture

- No login
- No server-side code
- No user submissions
- No payments
- No external assets
- localStorage only stores recent chords and the local stock list