# Checkit Movie Content Explorer

A production-style content explorer built for the Checkit Frontend Engineer take-home assessment.

Stack:
- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- TMDB API
- TanStack React Query
- Vitest + React Testing Library

## 1) Setup

1. Clone the repo
2. Install dependencies
3. Create your environment file
4. Start the development server

```bash
git clone <your-repo-url>
cd checkit-tmdb
cmd /c npm install
copy .env.example .env.local
cmd /c npm run dev
```

Open `http://localhost:3000`.

## 2) Environment Variables

Required:
- `TMDB_API_READ_ACCESS_TOKEN` (TMDB v4 read access token)

See `.env.example`.

## 3) Features Implemented

### F-1 Listing Page
- React Query-powered listing at `/` using TMDB discover/search APIs
- Displays at least 20 items per page (TMDB default page size)
- Movie cards include title, image (with graceful fallback), and multiple metadata fields
- Responsive grid:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 4 columns
- Pagination implemented (instead of infinite scroll)

Why pagination:
- Better shareable URLs
- Better performance predictability
- Easier server-rendering and caching strategy

### F-2 Detail Page
- Dynamic route at `/movies/[id]`
- Server metadata generation + React Query detail hydration for movie detail
- `generateMetadata` implemented with title, description, and `og:image`
- Breadcrumb navigation back to listing (preserving listing state via `returnTo` query param)

### F-3 Search & Filtering
- Debounced title search (`400ms`)
- Additional filters:
  - Genre
  - Release year
- URL-driven state with query params (`q`, `genre`, `year`, `page`) for shareable results

### F-4 Loading, Error, Empty States
- Route-level skeletons via `app/loading.tsx` and `app/movies/[id]/loading.tsx`
- Friendly error boundary in `app/error.tsx` with retry action
- Dedicated empty-state UI when result set is empty

### F-5 Deployment
- App is compatible with Vercel and Cloudflare Workers deployment targets.
- Cloudflare Workers is preferred for submission.

## 4) Architecture Decisions

Feature-oriented structure with clear boundaries:

- `app/`: route handlers and route-level UI state (`loading.tsx`, `error.tsx`)
- `app/api`: server route handlers that proxy TMDB for secure token usage
- `features/movies/components/`: reusable, domain UI components
- `features/movies/api`: client-side data fetchers used by React Query
- `features/movies/utils/`: query parsing/sanitization and formatting helpers
- `lib/tmdb/`: API client, config, image URL builder (fetch abstraction)
- `types/`: shared TMDB and app-level types

Key rules followed:
- Components fetch data through React Query hooks and centralized API helpers
- Shared types are centralized in `types/`
- Business/query logic extracted into utility modules

## 5) Performance Optimizations Applied

1. Optimized image delivery with `next/image`
- Explicit responsive `sizes` and controlled image dimensions/aspect ratio
- Fallback poster path handling for missing media
- `priority` on above-the-fold detail hero image

2. Route/data caching strategy with Next.js `fetch` cache controls
- Genre list: `revalidate: 86400` (very stable)
- Listing data: `revalidate: 300` (fresh enough while cache-friendly)
- Search results: `revalidate: 120` (more dynamic)
- Detail page: `revalidate: 3600` (less volatile than listing)

3. Font optimization with `next/font`
- `Manrope` and `Space Grotesk` loaded via `next/font/google`
- Avoids layout shifts associated with unoptimized external font loading

## 6) Testing

Two meaningful component test suites are included:

- `features/movies/components/__tests__/movie-card.test.tsx`
  - Card rendering, metadata visibility, link generation, poster fallback behavior

- `features/movies/components/__tests__/pagination.test.tsx`
  - Pagination controls, page link behavior, and single-page null rendering

Run:

```bash
cmd /c npm run test
```

## 7) Trade-offs and Known Limitations

- For combined `query + genre`, TMDB `search/movie` is used and genre is filtered on the returned page data. This can reduce visible items on a page and does not re-compute total result count after client-side genre filtering.
- Infinite scroll was intentionally not used to preserve deterministic URL state and easier cache behavior.
- Accessibility is addressed semantically, but a full axe/Lighthouse accessibility audit output is not yet documented.

## 8) If Given More Time

1. Implement Cloudflare-specific edge cache verification (`x-cache-status`) as bonus task.
2. Add route-level streaming boundaries around slower fetch segments with tuned Suspense fallbacks.
3. Expand test coverage to query parsing utilities and detail page rendering behavior.
