export type MetricType = "distance" | "temperature";
export type DistanceUnit = "meter" | "centimeter" | "inch" | "feet" | "yard";
export type TemperatureUnit = "kelvin" | "celsius" | "fahrenheit";
export type ChartPeriod = "1month" | "2month";

export interface Metric {
  id: string;
  userId: string;
  type: MetricType;
  originalValue: number;
  originalUnit: string;
  value: number;
  unit: string;
  date: string;
  createdAt: string;
}

export interface CreateMetricRequest {
  userId: string;
  type: MetricType;
  value: number;
  unit: string;
  date: string;
}

export interface ListMetricsParams {
  userId: string;
  type?: MetricType;
  unit?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListMetricsResponse {
  success: boolean;
  data: Metric[];
  pagination: Pagination;
}

export interface ChartDataParams {
  userId: string;
  type: MetricType;
  period?: ChartPeriod;
  unit?: string;
}

export interface ChartDataResponse {
  success: boolean;
  type: MetricType;
  unit: string;
  period: ChartPeriod;
  startDate: string;
  endDate: string;
  dataPoints: number;
  data: { date: string; value: number; unit: string }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export interface UnitOption {
  value: string;
  label: string;
  symbol: string;
}

export const DISTANCE_UNITS: UnitOption[] = [
  { value: "meter", label: "Meter", symbol: "m" },
  { value: "centimeter", label: "Centimeter", symbol: "cm" },
  { value: "inch", label: "Inch", symbol: "in" },
  { value: "feet", label: "Feet", symbol: "ft" },
  { value: "yard", label: "Yard", symbol: "yd" },
];

export const TEMPERATURE_UNITS: UnitOption[] = [
  { value: "celsius", label: "Celsius", symbol: "°C" },
  { value: "fahrenheit", label: "Fahrenheit", symbol: "°F" },
  { value: "kelvin", label: "Kelvin", symbol: "K" },
];

export const getUnitsForType = (type: MetricType): UnitOption[] => {
  return type === "distance" ? DISTANCE_UNITS : TEMPERATURE_UNITS;
};

export const getUnitSymbol = (type: MetricType, unit: string): string => {
  const units = getUnitsForType(type);
  return units.find((u) => u.value === unit)?.symbol || unit;
};
