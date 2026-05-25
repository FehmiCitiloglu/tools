---
description: "One-time foundation setup: installs Astro integrations (React, Tailwind, MDX, sitemap), configures Content Collections with Zod schemas, sets up path aliases, creates shared primitives (SEO component, layouts, utility components), and configures site URL. Run once at project start."
name: "Scaffold Foundation"
tools: [read, search, edit, execute, todo]
agent: "agent"
---

You are scaffolding the foundational infrastructure for this Astro-based developer tools platform. This is a **one-time setup** that establishes the primitives all other work depends on.

## What to build

1. **Install integrations**
   - `@astrojs/react` — for interactive tool islands
   - `@astrojs/tailwind` — for styling
   - `@astrojs/mdx` — for content collections
   - `@astrojs/sitemap` — for SEO
   - `tailwindcss`, `react`, `react-dom` — peer dependencies

2. **Configure Astro** (`astro.config.mjs`)
   - Enable integrations: react, tailwind, mdx, sitemap
   - Set `site: "https://yourdomain.com"` (placeholder for user to replace)
   - Configure path aliases in `vite.resolve.alias`:
     - `@/` → `src/`
     - `@components/` → `src/components/`
     - `@layouts/` → `src/layouts/`
     - `@content/` → `src/content/`
     - `@lib/` → `src/lib/`
     - `@assets/` → `src/assets/`

3. **Configure TypeScript** (`tsconfig.json`)
   - Add matching path aliases in `compilerOptions.paths`
   - Keep `extends: "astro/tsconfigs/strict"`

4. **Setup Content Collections** (`src/content/config.ts`)
   - Define Zod schemas for:
     - `blog`: title, description, slug, tags, publishedAt, updatedAt, author, coverImage, relatedPosts
     - `tools`: title, description, slug, category, tags, icon, keywords, relatedTools, publishedAt, updatedAt
     - `comparisons`: title, description, slug, entities (array), tags, relatedComparisons, publishedAt, updatedAt
   - All collections support MDX

5. **Create SEO component** (`src/components/seo/SEO.astro`)
   - Props: title, description, canonical, ogImage, type (default "website")
   - Renders: `<title>`, meta description, canonical, OG tags, Twitter cards
   - Reusable across all page types

6. **Create JSON-LD helpers** (`src/lib/schema.ts`)
   - Pure functions that generate JSON-LD for:
     - `WebSite` + `Organization` (homepage)
     - `SoftwareApplication` (tools)
     - `BlogPosting` + `BreadcrumbList` (blog)
     - `Article` + `BreadcrumbList` + `FAQPage` (comparisons)

7. **Create base layout** (`src/layouts/BaseLayout.astro`)
   - Accepts: title, description, canonical, ogImage, jsonLd
   - Uses SEO component in `<head>`
   - Injects JSON-LD script
   - Provides `<slot />` for body content
   - Minimal structure (no nav/footer yet — those come later)

8. **Create Tailwind config** (`tailwind.config.mjs`)
   - Content paths: `./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}`
   - Theme: CSS variables for colors (define in `src/styles/global.css`)
   - Dark mode: `class` strategy

9. **Create global CSS** (`src/styles/global.css`)
   - Tailwind directives: `@tailwind base; @tailwind components; @tailwind utilities;`
   - CSS variables for theme tokens (primary, secondary, background, text, etc.)
   - Dark mode overrides via `.dark` class

10. **Create example content**
    - One stub file in each collection to validate schema works:
      - `src/content/blog/welcome.mdx`
      - `src/content/tools/example-tool.mdx`
      - `src/content/comparisons/example-comparison.mdx`

11. **Verify**
    - Run `npm install` (or appropriate package manager)
    - Run `astro check` to validate types
    - Run `npm run dev` and confirm dev server starts without errors

## Constraints

- DO NOT modify `src/pages/index.astro` yet — that comes after primitives exist.
- DO NOT create tool/blog/comparison pages — agents handle those.
- DO NOT add nav/footer/analytics — those are separate TODO items.
- Keep primitives minimal. If you're unsure whether something belongs here, leave it out.

## Definition of done

Foundation is ready when:
1. All integrations installed and configured.
2. Content Collections schema validates.
3. Path aliases resolve in both TS and Astro.
4. SEO component + JSON-LD helpers exist and export correctly.
5. BaseLayout exists and uses SEO + JSON-LD.
6. `astro check` passes.
7. `npm run dev` starts successfully.
