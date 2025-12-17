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

export const queryKeys = {
  metrics: (params: ListMetricsParams) => ["metrics", params] as const,
  chartData: (params: ChartDataParams) => ["chartData", params] as const,
};

export function useMetrics(params: ListMetricsParams) {
  return useQuery({
    queryKey: queryKeys.metrics(params),
    queryFn: () => metricsService.listMetrics(params),
    enabled: !!params.userId,
    placeholderData: keepPreviousData,
    staleTime: 30000, // 30 seconds cache
  });
}

export function useChartData(params: ChartDataParams) {
  return useQuery({
    queryKey: queryKeys.chartData(params),
    queryFn: () => metricsService.getChartData(params),
    enabled: !!params.userId && !!params.type,
    placeholderData: keepPreviousData,
    staleTime: 60000, // 1 minute cache
  });
}

export function useCreateMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMetricRequest) =>
      metricsService.createMetric(data),
    onSuccess: () => {
      message.success("Metric created successfully");
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      queryClient.invalidateQueries({ queryKey: ["chartData"] });
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to create metric");
    },
  });
}
