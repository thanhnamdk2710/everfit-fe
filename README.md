# Metrics Dashboard Frontend

A modern, responsive dashboard for tracking distance and temperature metrics with automatic unit conversion.

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Ant Design**.

## Features

- **Dashboard** - Overview with stats cards and trend charts
- **Distance Tracking** - Track distances in 7 different units
- **Temperature Tracking** - Record temperatures in Celsius, Fahrenheit, or Kelvin
- **Unit Conversion** - Automatic conversion between units
- **Interactive Charts** - Line and area charts with period selection

## Screenshots

## Tech Stack

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| Next.js 14         | React framework with App Router |
| TypeScript         | Type safety                     |
| Tailwind CSS       | Utility-first styling           |
| Ant Design 5       | UI component library            |
| @ant-design/charts | Chart components                |
| TanStack Query     | Data fetching & caching         |
| Zustand            | State management                |
| Axios              | HTTP client                     |
| Day.js             | Date manipulation               |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home
│   └── providers.tsx       # React Query + Ant Design
│
├── components/
│   ├── metrics/
│   │   ├── MetricForm.tsx  # Create metric form
│   │   └── MetricList.tsx  # Metrics table with filters
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

- Node.js 20+
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

## Available Scripts

| Script               | Description              |
| -------------------- | ------------------------ |
| `npm run dev`        | Start development server |
| `npm run build`      | Build for production     |
| `npm start`          | Start production server  |
| `npm run lint`       | Run ESLint               |
| `npm run type-check` | TypeScript type checking |

## Components

### MetricForm

```tsx
<MetricForm open={open} onClose={onClose} />
```

### MetricList

```tsx
<MetricList />
// Automatically uses global filters from Zustand store
```

### MetricChart

```tsx
<MetricChart type="distance" title="Distance Trend" />
```

## State Management

Using Zustand for global state:

```tsx
// Access store
const { userId, selectedType, setSelectedType } = useAppStore();

// Persisted state
-userId - darkMode - sidebarCollapsed;
```

## Data Fetching

Using TanStack Query (React Query):

```tsx
// List metrics
const { data, isLoading } = useMetrics({ userId, type: "distance" });

// Get chart data
const { data: chartData } = useChartData({
  userId,
  type: "distance",
  period: "1month",
});

// Create metric
const createMetric = useCreateMetric();
await createMetric.mutateAsync(newMetric);
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

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| GET    | `/health`            | Health check  |
| GET    | `/api/metrics`       | List metrics  |
| POST   | `/api/metrics`       | Create metric |
| GET    | `/api/metrics/chart` | Chart data    |
