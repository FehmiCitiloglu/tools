import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const toolsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tools' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(50).max(200),
    category: z.enum(['encoding', 'formatting', 'conversion', 'generation', 'validation', 'security', 'text']),
    tags: z.array(z.string()),
    keywords: z.array(z.string()),
    icon: z.string().optional(),
    relatedTools: z.array(z.string()).default([]),
    publishedAt: z.date(),
    updatedAt: z.date(),
    featured: z.boolean().default(false),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().min(140).max(160),
    author: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    tags: z.array(z.string()),
    coverImage: z.string().optional(),
    relatedPosts: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

const comparisonsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/comparisons' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(50).max(200),
    itemA: z.string(),
    itemB: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    tags: z.array(z.string()),
  }),
});

const snippetsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/snippets' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(50).max(200),
    language: z.string(),
    tags: z.array(z.string()),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
  }),
});

export const collections = {
  tools: toolsCollection,
  blog: blogCollection,
  comparisons: comparisonsCollection,
  snippets: snippetsCollection,
};
