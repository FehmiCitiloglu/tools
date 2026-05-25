# Copilot Instructions — Developer Utility Platform

SEO-first, performance-first static site built with **Astro 6** (strict TS, Node ≥ 22.12). Hosts developer tools, a blog, comparison pages, and snippets. These rules apply to all work in this repo.

## Stack (authoritative)

- **Framework**: Astro (static output). No SSR/server endpoints/server actions. Static GitHub Pages deployment only.
- **Language**: TypeScript, `astro/tsconfigs/strict`. No `any`, no `// @ts-ignore` without a comment explaining why.
- **Styling**: TailwindCSS via `@astrojs/tailwind`. No global CSS files except `src/styles/global.css` (Tailwind directives + CSS variables for theme tokens). No inline `style=` attributes in components — use Tailwind classes.
- **Islands**: React via `@astrojs/react`. Prefer static Astro components; use React islands only for interactive features (JSON formatter, JWT decoder, regex, live previews, search UI). No Vue/Svelte/Solid.
- **Content**: Astro **Content Collections** with Zod schemas for `blog`, `tools`, `comparisons`, `snippets`. MDX enabled via `@astrojs/mdx`. All content lives in `src/content/`, never hardcoded in pages.
- **Search**: Pagefind, built post-`astro build`.
- **Package manager**: whichever lockfile exists; do not switch.

## Path aliases

Use these everywhere — never write relative `../../..` chains across `src/`:

| Alias | Target |
|---|---|
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@layouts/*` | `src/layouts/*` |
| `@content/*` | `src/content/*` |
| `@lib/*` | `src/lib/*` |
| `@assets/*` | `src/assets/*` |

Keep `tsconfig.json` `compilerOptions.paths` and `astro.config.mjs` `vite.resolve.alias` in sync.

## Project layout

```
src/
  components/      # Reusable .astro and framework islands
    seo/           # SEO, JSON-LD, OG helpers
    tool/          # ToolLayout, ToolHeader, CopyButton, etc.
  layouts/         # BaseLayout, ArticleLayout, ToolLayout
  content/         # Content collections (config.ts + folders)
    blog/ tools/ comparisons/ snippets/
  lib/             # Pure TS utilities (no Astro imports). Tested.
  pages/
    index.astro
    blog/ tools/ compare/ snippets/
  styles/global.css
```

New top-level folders require justification.

## SEO — non-negotiable

Every page (tool, blog, comparison, snippet, index) MUST render through a layout that produces:

1. `<title>` — unique, ≤ 60 chars, page-specific (no "Astro Basics").
2. `<meta name="description">` — unique, 140–160 chars.
3. `<link rel="canonical">` — absolute URL built from `Astro.site` + pathname.
4. OpenGraph: `og:title`, `og:description`, `og:url`, `og:type`, `og:image`.
5. Twitter: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`.
6. JSON-LD via `<script type="application/ld+json">`:
   - Tools → `SoftwareApplication`
   - Blog posts → `BlogPosting` (+ `BreadcrumbList`)
   - Comparisons → `Article` (+ `BreadcrumbList`)
   - Homepage / site-wide → `WebSite` + `Organization`
7. Exactly one `<h1>` per page. Heading levels never skip.
8. URLs are kebab-case, lowercase, no trailing slash inconsistency, no stop words ("the", "a", "and") in slugs unless semantically required.

`astro.config.mjs` must set `site`, and `@astrojs/sitemap` must be enabled. `public/robots.txt` must reference the sitemap.

Never hand-roll the head — always use `@components/seo/SEO.astro`. If it doesn't exist yet, create it before the page that needs it.

## Performance — no client JS unless justified

- Default to **zero client-side JS**. Pages are static HTML + CSS.
- Interactivity requires a React island with the narrowest directive that works: `client:visible` > `client:idle` > `client:load`. Never use `client:only` unless SSR truly cannot render it.
- In every PR that adds a `client:*` directive, leave a one-line comment above it explaining *why* it must hydrate. Examples: JSON formatter, JWT decoder, regex playground, live preview, search UI.
- Images: use `astro:assets` `<Image />` / `<Picture />` with explicit `width`/`height`, `loading="lazy"` (except above-the-fold), `decoding="async"`, and modern formats (AVIF/WebP).
- Fonts: self-host via `@fontsource-variable/*`, `font-display: swap`, preload only the primary weight.
- No new runtime dependencies for problems solvable with platform APIs (`crypto.subtle`, `Intl`, `TextEncoder`, `structuredClone`, `URL`, `URLSearchParams`).
- No moment.js, no lodash (use native or per-function imports), no jQuery, no axios (use `fetch`).
- Lighthouse budget: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100 on `astro build && astro preview`.

## Accessibility

- Semantic HTML first (`<button>`, `<nav>`, `<main>`, `<article>`). Never `<div onclick>`.
- All interactive elements keyboard-reachable with visible focus styles (Tailwind `focus-visible:` ring).
- Form inputs have associated `<label>`; icon-only buttons have `aria-label`.
- Color contrast ≥ WCAG AA. Dark mode via `class="dark"` strategy.
- No `alert()`, `confirm()`, `prompt()` — render inline messages.

## Content collections — schema rules

Each collection has a `src/content/config.ts` with a Zod schema enforcing at minimum:

- `title: string` (≤ 60)
- `description: string` (140–160)
- `slug` derived from filename (kebab-case)
- `tags: string[]`
- `publishedAt: date`, `updatedAt: date`
- Tools also require: `category`, `keywords`, `relatedTools`, `icon`.

Never bypass the schema. If you need a new field, update the schema first. All content lives in `src/content/<collection>/`, never hardcoded in pages.

## Code style

- Prettier + ESLint (Astro plugin). Run `npm run lint` / format before declaring work done.
- Astro components: PascalCase filenames. Utilities: kebab-case filenames, named exports.
- Prefer pure functions in `src/lib/`. Side effects live in pages/components only.
- No default exports for utilities (only for Astro components, which require them implicitly).
- Comments explain *why*, not *what*. Delete dead code instead of commenting it out.

## Routing

- Tools: `/tools/<slug>` → `src/pages/tools/[...slug].astro` reading from `tools` collection.
- Blog: `/blog/<slug>`, index at `/blog`.
- Comparisons: `/compare/<a>-vs-<b>`.
- Snippets: `/snippets/<slug>`.
- Breadcrumbs are generated, not hand-written.

## Things to never do

- Don't add SSR, server endpoints, server actions, or runtime APIs — this is a static GitHub Pages site.
- Don't add React/Vue/Svelte outside of islands. React is the only island framework; use it sparingly.
- Don't inline `<script>` blocks for analytics or ads in components — use the centralized loader in the base layout, gated by an env flag.
- Don't commit secrets, API keys, or `.env` files. Only `.env.example` is tracked.
- Don't bypass content collections by hardcoding tool/blog metadata in pages.
- Don't run destructive git commands (`reset --hard`, `push --force`, branch deletion) without explicit user approval.

## Definition of done

A change is done when:
1. `npx astro check` passes (no TS errors).
2. Lint/format pass.
3. The affected page renders correctly in `npm run dev`.
4. SEO checklist above is satisfied for any new/edited page.
5. No new `client:*` directive is unjustified.
