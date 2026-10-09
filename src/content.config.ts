import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const common = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const noteSchema = common.extend({
  area: z.string(),
  updated: z.coerce.date().optional(),
  language: z.enum(["zh-CN", "en"]),
  translationKey: z.string().optional(),
  source: z.string().url().optional(),
  order: z.number().int().nonnegative().optional(),
  series: z.string().optional(),
});

export const collections = {
  blog: defineCollection({
    loader: glob({
      base: "./src/content/blog",
      pattern: "**/*.{md,mdx}",
    }),
    schema: common.extend({ category: z.string() }),
  }),
  notes: defineCollection({
    loader: glob({
      base: "./src/content/notes",
      pattern: "**/*.{md,mdx}",
    }),
    schema: noteSchema,
  }),
};