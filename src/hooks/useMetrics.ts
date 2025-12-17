import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { message } from "antd";

import metricsService from "../services/metricsService";
import {
  CreateMetricRequest,
  ListMetricsParams,
  ChartDataParams,
} from "../types";

// Query keys for cache management
export const queryKeys = {
  metrics: (params: ListMetricsParams) => ["metrics", params] as const,
  chartData: (params: ChartDataParams) => ["chartData", params] as const,
  health: ["health"] as const,
};

// Hook to list metrics
export function useMetrics(params: ListMetricsParams) {
  return useQuery({
    queryKey: queryKeys.metrics(params),
    queryFn: () => metricsService.listMetrics(params),
    enabled: !!params.userId,
    placeholderData: keepPreviousData,
    staleTime: 30000, // 30 seconds cache
  });
}

// Hook to delete metric (mutation)
export function useDeleteMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => metricsService.deleteMetric(id),
    onSuccess: () => {
      message.success("Metric deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      queryClient.invalidateQueries({ queryKey: ["chartData"] });
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to delete metric");
    },
  });
}

// Hook to get chart data
export function useChartData(params: ChartDataParams) {
  return useQuery({
    queryKey: queryKeys.chartData(params),
    queryFn: () => metricsService.getChartData(params),
    enabled: !!params.userId && !!params.type,
    placeholderData: keepPreviousData,
    staleTime: 60000, // 1 minute cache
  });
}

// Hook to create metric (mutation)
export function useCreateMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMetricRequest) =>
      metricsService.createMetric(data),
    onSuccess: () => {
      message.success("Metric created successfully");
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      queryClient.invalidateQueries({ queryKey: ["chartData"] });
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to create metric");
    },
  });
}
