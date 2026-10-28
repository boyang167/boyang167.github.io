import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { pathToFileURL } from 'node:url';
import { BLOG_CONTENT_ROOT } from './lib/blog-root';

const blog = defineCollection({
  loader: glob({
    base: pathToFileURL(BLOG_CONTENT_ROOT),
    pattern: '**/*.md',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    readTime: z.string().default('6 分钟'),
    icon: z.string().default('◈'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
