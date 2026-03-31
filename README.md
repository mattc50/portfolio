# Portfolio

Next.js 14 · TypeScript · Tailwind · App Router

---

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Structure

```
portfolio/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Home / hero
│   ├── globals.css             # CSS variables, base styles
│   ├── not-found.tsx           # 404
│   ├── about/
│   │   └── page.tsx            # About page
│   └── projects/
│       ├── page.tsx            # Projects index
│       └── [slug]/
│           └── page.tsx        # Project detail page
├── components/
│   ├── Nav.tsx                 # Top navigation
│   └── ProjectCard.tsx         # Project grid card
└── lib/
    ├── projects.ts             # ← ADD/EDIT projects here
    └── about.ts                # ← EDIT about content here
```

---

## Adding or editing content

### Projects
Edit `lib/projects.ts`. Each project needs:
- `slug` — URL path (e.g. `"unified-inbox"` → `/projects/unified-inbox`)
- `figmaUrl` — view-only Figma share link
- `coverImage` — optional, path under `/public` (e.g. `"/projects/unified-inbox/cover.png"`)
- Set `published: false` to hide a project without deleting it

### About
Edit `lib/about.ts` — bio paragraphs, currently list, and links.

---

## Design system

All tokens are in `tailwind.config.ts`:
- **Colors**: `canvas`, `ink`, `muted`, `border`, `accent`
- **Fonts**: `--font-display` (Instrument Serif), `--font-body` (DM Sans), `--font-mono` (DM Mono)
- Swap any font by changing the `next/font/google` import in `app/layout.tsx` and updating the variable name

To change the accent color globally, update `accent` in `tailwind.config.ts` and `--accent` in `globals.css`.

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Next.js, no config needed
3. Add your domain under **Project Settings → Domains**

### Domain migration from Webflow
In your domain registrar, point DNS to Vercel:
- Add an **A record**: `@` → `76.76.21.21`
- Add a **CNAME**: `www` → `cname.vercel-dns.com`

Or if using Vercel nameservers, delegate the domain entirely from your registrar.
Webflow → Vercel propagation is typically live within 1 hour.

---

## Cover images

Drop project covers into `/public/projects/[slug]/cover.png` (any format works).
Then set `coverImage: "/projects/[slug]/cover.png"` in `lib/projects.ts`.
Recommended aspect ratio: **16:10** for cards, **16:9** for the detail page hero.
