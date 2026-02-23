# IPO Anchor Analytics — Next.js

Full-stack Next.js app. No separate backend needed — MongoDB is queried directly from Next.js API routes.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **MongoDB** native driver (motor replaced with `mongodb` package)
- **React** hooks for all state — no Redux, no Zustand

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── dashboard/route.ts          ← POST  /api/dashboard
│   │   └── filters/
│   │       ├── lead-managers/route.ts  ← GET   /api/filters/lead-managers
│   │       ├── companies/route.ts      ← GET   /api/filters/companies
│   │       ├── funds/route.ts          ← GET   /api/filters/funds
│   │       └── years/route.ts          ← GET   /api/filters/years
│   ├── dashboard/page.tsx              ← Main dashboard UI
│   ├── layout.tsx
│   ├── page.tsx                        ← Redirects → /dashboard
│   └── globals.css
├── components/
│   ├── Slicer.tsx                      ← Searchable multi-select dropdown
│   ├── FiltersPanel.tsx                ← All 5 slicers
│   ├── StatsPanel.tsx                  ← Left column stat cards
│   ├── DataTable.tsx                   ← Table with sort + pagination
│   ├── LeadManagersCell.tsx            ← Expandable BRLM pills
│   └── AnchorInvestorsCell.tsx         ← Expandable anchor rows + bars
├── hooks/
│   └── useDashboard.ts                 ← Master filter state + API calls
└── lib/
    ├── mongodb.ts                      ← Singleton MongoClient
    └── types.ts                        ← Shared TypeScript interfaces
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI

# 3. Run dev server
npm run dev
```

Open: http://localhost:3000 (redirects to /dashboard)

## Environment Variables

| Variable             | Default                   | Description               |
|----------------------|---------------------------|---------------------------|
| `MONGODB_URI`        | (required)                | MongoDB connection string  |
| `MONGODB_DB`         | `quant-replica`           | Database name              |
| `MONGODB_COLLECTION` | `anchor_book-replica`     | Collection name            |

## API Routes

All routes mirror the original FastAPI implementation exactly.

| Method | Route                         | Purpose                     |
|--------|-------------------------------|-----------------------------|
| POST   | `/api/dashboard`              | Filtered IPO query          |
| GET    | `/api/filters/lead-managers`  | All BRLM names              |
| GET    | `/api/filters/companies`      | All company names           |
| GET    | `/api/filters/funds`          | All anchor investor names   |
| GET    | `/api/filters/years`          | All years (desc)            |

### POST /api/dashboard body

```json
{
  "leadManagers": ["ICICI Securities"],
  "companies":    [],
  "funds":        ["HDFC Mutual Fund"],
  "years":        [2024],
  "ipoType":      ["mainboard"]
}
```

## Filter Logic

- **Within category** → OR  
- **Across categories** → AND

## Features

- Zero mock data — 100% server-side filtering via MongoDB
- 300ms debounce on filter changes
- Expandable lead managers (pill tags, +N more)
- Expandable anchor investors (mini bar chart + amounts, +N more)
- Sortable columns (company, type, year, anchor count, total amount)
- Smart pagination with ellipsis
- CSV export (fully expanded — all managers, all anchors, all amounts)
- Loading skeletons
- Responsive: 2-col → 1-col at 1100px
- Dark terminal aesthetic
