# TechNotes

V4 personal knowledge hub for **Boyang Wang**: AI, Data, Agent, Architecture and Bioprocess.

## Run locally

```bash
npm install
npm run dev
```

## Write content

Add Markdown or MDX to `src/content/blog/` or `src/content/notes/`. The site indexes metadata for local search and the retrieval chat automatically.

## Deploy

Push to `main`. In GitHub repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

## AI chat

The chat page performs local retrieval now. To generate an LLM answer, add a server-side proxy (Cloudflare Worker, Vercel Function, etc.) so API keys never enter browser code.