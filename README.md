# Hardik Shah — Portfolio

Editorial-style personal portfolio for a full stack software engineer.

**Live:** https://hardik-shah-portfolio.vercel.app

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion for animation, Lenis for smooth scrolling
- Lucide icons
- Deployed on Vercel

## Structure

```
app/                 layout, page, global styles
components/          one folder per section (hero, about, experience, projects, skills, ...)
  projects/visuals/  animated "lab" visual for each project
data/portfolio.ts    all content: profile, experience, projects, skills, achievements
lib/                 small shared hooks
public/              portrait and resume PDF
```

All site content lives in `data/portfolio.ts` — edit it there, not in components.
Project order on the page follows the order of the `projects` array.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Checks

```bash
npx tsc --noEmit
npm run lint
npm run build
```
