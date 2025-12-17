# Metrics Dashboard Frontend

A modern, responsive dashboard for tracking distance and temperature metrics with automatic unit conversion.

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Ant Design**.

## Features

- 📊 **Dashboard** - Overview with stats cards and trend charts
- 📏 **Distance Tracking** - Track distances in 7 different units
- 🌡️ **Temperature Tracking** - Record temperatures in Celsius, Fahrenheit, or Kelvin
- 🔄 **Unit Conversion** - Automatic conversion between units
- 📈 **Interactive Charts** - Line and area charts with period selection
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark Mode** - Toggle between light and dark themes
- ⚡ **Real-time Updates** - React Query for efficient data fetching

## Screenshots

### Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  📊 Metrics Dashboard                              🌙 👤    │
├─────────────────────────────────────────────────────────────┤
│  Welcome to Metrics Dashboard                               │
│  Track your distance and temperature metrics                │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Total    │ │ Distance │ │ Avg Temp │ │ Days     │       │
│  │ 45       │ │ 127.5 km │ │ 23.4 °C  │ │ 30       │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                             │
│  📏 Distance Trend            🌡️ Temperature Trend          │
│  ┌─────────────────────┐     ┌─────────────────────┐       │
│  │      ___/\___       │     │    /\    /\         │       │
│  │   __/        \__    │     │   /  \__/  \        │       │
│  │ _/              \_  │     │  /          \__     │       │
│  └─────────────────────┘     └─────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Ant Design 5 | UI component library |
| @ant-design/charts | Chart components |
| TanStack Query | Data fetching & caching |
| Zustand | State management |
| Axios | HTTP client |
| Day.js | Date manipulation |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/          # Dashboard page
│   ├── metrics/            # Metrics pages
│   │   ├── page.tsx        # Metrics list
│   │   └── new/            # Add new metric
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home (redirects)
│   └── providers.tsx       # React Query + Ant Design
│
├── components/
│   ├── layout/
│   │   └── MainLayout.tsx  # App shell with sidebar
│   ├── metrics/
│   │   ├── MetricForm.tsx  # Create metric form
│   │   ├── MetricList.tsx  # Metrics table with filters
│   │   └── StatsCards.tsx  # Dashboard stats
│   └── charts/
│       └── MetricChart.tsx # Line/Area chart component
│
├── hooks/
│   └── useMetrics.ts       # React Query hooks
│
├── services/
│   └── metricsService.ts   # API client
│
├── lib/
│   └── store.ts            # Zustand store
│
├── types/
│   └── index.ts            # TypeScript types
│
└── styles/
    └── globals.css         # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Metrics API backend running on `http://localhost:3000`

### Installation

```bash
# Clone repository
git clone <repository-url>
cd metrics-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (or the port shown in terminal).

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | Backend API URL |

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |

## Pages

### Dashboard (`/dashboard`)
- Welcome banner with API status
- Stats cards showing totals and trends
- Distance and temperature trend charts
- Quick action cards

### Metrics List (`/metrics`)
- Filterable metrics table
- Filter by type, unit, date range
- Unit conversion on-the-fly
- Pagination
- Delete metrics

### Add Metric (`/metrics/new`)
- Form to create new metrics
- Type selection (distance/temperature)
- Unit selection based on type
- Date picker
- Reference cards for available units

## Components

### MetricForm
```tsx
<MetricForm onSuccess={() => router.push('/metrics')} />
```

### MetricList
```tsx
<MetricList />
// Automatically uses global filters from Zustand store
```

### MetricChart
```tsx
<MetricChart 
  type="distance" 
  title="Distance Trend" 
/>
```

### StatsCards
```tsx
<StatsCards />
// Shows 4 stat cards with totals and trends
```

## State Management

Using Zustand for global state:

```tsx
// Access store
const { userId, selectedType, setSelectedType } = useAppStore();

// Persisted state
- userId
- darkMode
- sidebarCollapsed
```

## Data Fetching

Using TanStack Query (React Query):

```tsx
// List metrics
const { data, isLoading } = useMetrics({ userId, type: 'distance' });

// Get chart data
const { data: chartData } = useChartData({ userId, type: 'distance', period: '1month' });

// Create metric
const createMetric = useCreateMetric();
await createMetric.mutateAsync(newMetric);

// Delete metric
const deleteMetric = useDeleteMetric();
await deleteMetric.mutateAsync(metricId);
```

## Styling

Combination of Tailwind CSS and Ant Design:

```tsx
// Tailwind utilities
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">

// Ant Design components
<Card className="metric-card">
  <Button type="primary" icon={<SaveOutlined />}>Save</Button>
</Card>
```

## API Integration

The frontend expects these API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/metrics` | List metrics |
| POST | `/api/metrics` | Create metric |
| GET | `/api/metrics/:id` | Get metric |
| DELETE | `/api/metrics/:id` | Delete metric |
| GET | `/api/metrics/chart` | Chart data |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
