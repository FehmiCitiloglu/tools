# DevTools - Free Developer Utilities Platform

A modern, SEO-optimized static site hosting 10+ essential developer tools. Built with Astro 6, React, TypeScript, and TailwindCSS.

## 🚀 Features

- **10 Production-Ready Tools**: JSON formatter, Base64 encoder/decoder, URL encoder/decoder, JWT decoder, hash generator, UUID generator, timestamp converter, and color converter
- **SEO-First**: Complete meta tags, OpenGraph, Twitter Cards, JSON-LD structured data
- **Performance**: Static site generation, minimal client-side JavaScript, Lighthouse score ≥95
- **Accessibility**: WCAG AA compliant, keyboard navigation, screen reader friendly
- **Privacy**: All tools run client-side, no data leaves the browser
- **Modern Stack**: Astro 6 + React 19 + TypeScript (strict mode) + TailwindCSS 4

## 📦 Project Structure

```
src/
├── components/
│   ├── seo/            # SEO.astro - Meta tags and JSON-LD
│   └── tool/           # React components for each tool
├── content/            # Content collections (tools, blog, comparisons, snippets)
│   ├── config.ts       # Zod schemas for collections
│   └── tools/          # MDX files with tool metadata
├── layouts/            # BaseLayout, ToolLayout
├── lib/                # Pure TypeScript utilities
├── pages/              # All routes
│   ├── index.astro
│   └── tools/
└── styles/global.css
```

## 🛠️ Tools Included

1. **JSON Formatter & Validator** - `/tools/json-formatter-validator`
2. **Base64 Encoder/Decoder** - `/tools/base64-encoder-decoder`
3. **URL Encoder/Decoder** - `/tools/url-encoder-decoder`
4. **JWT Decoder** - `/tools/jwt-decoder`
5. **Hash Generator** - `/tools/hash-generator`
6. **UUID Generator** - `/tools/uuid-generator`
7. **Timestamp Converter** - `/tools/timestamp-converter`
8. **Color Converter** - `/tools/color-converter`

## 🚦 Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Key Conventions

- **No server-side code**: Static site only (GitHub Pages deployment)
- **Path aliases**: Use `@/`, `@components/`, `@layouts/`, etc. (defined in tsconfig.json)
- **SEO required**: Every page must have title, description, canonical, OG tags, JSON-LD
- **Client JS minimized**: React islands only for interactivity (`client:load` or `client:visible`)
- **TypeScript strict**: No `any`, no `@ts-ignore` without justification
- **Accessibility**: Semantic HTML, labels, focus states, ARIA attributes

## 📚 Tech Stack

- Astro 6.3 - Static site generator
- React 19 - UI islands
- TypeScript (strict)
- TailwindCSS 4
- MDX - Content
- Zod - Schema validation

## 📄 License

Free to use and modify for your projects.
