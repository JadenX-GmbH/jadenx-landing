import { defineCollection, z } from 'astro:content';

// Page collection schema
const pageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string().optional(),
    order: z.number().optional(),
  }),
});

// Case study collection schema
const caseCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    industry: z.string().optional(),
    location: z.string().optional(),
    tech: z.array(z.string()),
    cover: z.string(),
  }),
});

export const collections = {
  pages: pageCollection,
  cases: caseCollection,
};
